import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import styled from "styled-components";
import {
	ConfigProvider,
	Form,
	Button,
	Tag,
	Radio,
	Space,
	message,
	Input,
} from "antd";
import { NoFieldData } from "./NoFieldData";
import { useAppSelector } from "../../../store/hooks";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme } from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import { selectIsManager } from "../../../store/globalSlice";
import PurchaseRecordView from "../PurchaseRecordView";
import { QualityMapDict, QualityStatusMapDict } from "../../../api/ailuo/dict";
import RightPng from "../assets/RIGHT.png";
import WrongPng from "../assets/WRONG.png";
import { QualityControlContext } from "../QualityControl";
import { updatePurQualitycontrol } from "../../../api/ailuo/qm";
import { render } from "@testing-library/react";
const { TextArea } = Input;

const CustomModalRoot = styled.div`
	position: relative;
	padding: 24px 36px 24px 36px;
	border-radius: 8px;
	background-color: #ffffff;
	box-shadow:
		0 6px 16px 0 rgb(0 0 0 / 8%),
		0 3px 6px -4px rgb(0 0 0 / 12%),
		0 9px 28px 8px rgb(0 0 0 / 5%);
	pointer-events: auto;
	max-height: 80%;
	overflow: hidden;
	.header {
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.title {
			font-size: 18px;
			font-family: "Harmony_Sans_Medium", sans-serif;
		}
	}
	.status-operate {
		margin-top: 8px;
		margin-bottom: 16px;
	}
	.content {
		height: 600px;
		max-width: 600px;
		overflow: auto;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 24px;
	}
`;

interface CustomModalProps {
	title: string;
	open: boolean;
	setOpen: (value: boolean) => void;
	modalType: string;
	defaultStatus?: "approve" | "reject";
	editFlowItemRecord?: any | undefined;
	children?: React.ReactNode;
}
const excludeNull = (obj: any) => {
	const result: any = {};
	Object.keys(obj).forEach((key) => {
		if (obj[key] === undefined || obj[key] === null) {
			return;
		}
		result[key] = obj[key];
	});
	return result;
};
const columns: any = (mode: "1" | "2", setMode: any) => {
	const defaultColumns = [
		{
			title: "节点名称",
			width: 200,
			dataIndex: "nodeName",
			key: "nodeName",
			type: NumFieldType.SingleText,
			disabled: true,
		},
		{
			title: "检验项名称",
			width: 200,
			dataIndex: "name",
			key: "name",
			type: NumFieldType.SingleText,
			disabled: true,
		},
		{
			title: "发起请检时间",
			dataIndex: "createTime",
			key: "createTime",
			type: NumFieldType.SingleText,
			disabled: true,
		},
		{
			title: "请检类型",
			dataIndex: "type",
			key: "type",
			disabled: true,
			render: (
				column: any,
				key: string,
				form: any,
				setForm: (value: any) => void,
			) => {
				return (
					<div key={"name_" + key} className="w-full mb-3">
						<div className="flex">
							<div style={{ width: "120px", flexShrink: 0 }}>请检类型</div>
							{/* @ts-ignore */}
							<Input value={QualityMapDict[form.type]} disabled></Input>
						</div>
					</div>
				);
			},
		},
		{
			title: "检验结果",
			dataIndex: "status",
			key: "status",
			render: (
				column: any,
				key: string,
				form: any,
				setForm: (value: any) => void,
			) => {
				let { status } = form;
				const onChange = (e: any) => {
					setForm({
						...form,
						[column.dataIndex]: e.target.value,
					});
				};
				const onChangeContent = (event: SyntheticEvent) => {
					const target = event.target as HTMLInputElement;
					const value = target.value;
					setForm({
						...form,
						remark: value,
					});
				};
				return (
					<div key={"name_" + key} className="w-full">
						<div className="flex">
							<div style={{ width: "120px" }}>检验结果</div>
							<Radio.Group
								className="flex-1"
								onChange={onChange}
								value={status}
							>
								<Radio value={"approve"}>
									<img src={RightPng} className="w-[15px] h-[15px]" />
								</Radio>
								<Radio value={"reject"}>
									<img src={WrongPng} className="w-[15px] h-[15px]" />
								</Radio>
							</Radio.Group>
						</div>
						{status === "reject" && (
							<div className="flex mt-4">
								<div style={{ width: "120px", flexShrink: 0 }}>检验意见</div>
								<TextArea
									defaultValue={form.remark}
									onChange={onChangeContent}
									rows={4}
								/>
							</div>
						)}
					</div>
				);
			},
		},
		{
			title: "完成请检时间",
			dataIndex: "updateTime",
			key: "updateTime",
			disabled: true,
			type: NumFieldType.SingleText,
		},
	];

	return defaultColumns;
};

const CustomModal: React.FC<CustomModalProps> = ({
	title,
	modalType,
	open,
	setOpen,
	editFlowItemRecord,
	defaultStatus,
}) => {
	const [mode, setMode] = useState<"" | "1" | "2">(""); // 未选择  常规  非常规
	const [showDstColumns, setShowDstColumns] = useState<any>([]);

	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

	const { fetchPurchaseList } = useContext(QualityControlContext);

	const setAllDisabled = (disabled: boolean) => {
		const newCol = showDstColumns.map((item: any) => {
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
		setSaveButtonDisabled(disabled);
	};
	// 控制 只读和编辑
	useEffect(() => {
		if (_.isEmpty(showDstColumns)) {
			return;
		}
		// if (modalType === "edit") {
		// 	setAllDisabled(false);
		// 	return;
		// }
		// setAllDisabled(true);
	}, [form.status, open]);
	// esc handler
	useEffect(() => {
		if (!open) {
			return;
		}
		const keydownHandler = (e: KeyboardEvent) => {
			if (e.code === "Escape") {
				setOpen(false);
			}
		};
		document.addEventListener("keydown", keydownHandler, true);
		return () => {
			document.removeEventListener("keydown", keydownHandler, true);
		};
	}, [open]);
	// 初始化form
	useEffect(() => {
		if (!open) {
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			setForm({ ...temp, status: defaultStatus ? defaultStatus : temp.status });
			setMode(temp.result || "");
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {
			setForm({});
		}
	}, [open]);
	useEffect(() => {
		if (!open) {
			return;
		}
		setShowDstColumns(columns(mode, setMode));
	}, [open, mode]);

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			return;
		} catch (error) {
			console.log(error);
		}
	};
	// 更新记录
	const updateRecord = async () => {
		const { recordId, id, status, ...rest } = form;
		inputForm.setFieldsValue(rest);
		const params = {
			id,
			status,
			...rest,
		};
		delete params.createTime;
		delete params.deleted;
		delete params.updateTime;
		if (!status) {
			return;
		}
		try {
			await inputForm.validateFields();
			await updatePurQualitycontrol(excludeNull(params));
			await fetchPurchaseList();
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);
		if (modalType === "add") {
			createRecord();
		} else {
			updateRecord();
		}
	};

	const SaveButton = () => {
		if (saveButtonDisabled) {
			return null;
		}
		if (modalType === "view") {
			return;
		}
		return (
			<ConfigProvider theme={blueButtonTheme}>
				<Button type="primary" onClick={handleSaveRecord}>
					{"保存"}
				</Button>
			</ConfigProvider>
		);
	};
	if (modalType === "view") {
		return (
			<CustomModalRoot>
				<div className="header">
					<div className="title">{title}</div>
					<div>
						<Button
							style={{
								fontSize: "12px",
								background: "#F2F3F5",
								marginRight: "18px",
							}}
							onClick={() => setOpen(false)}
						>
							取消
						</Button>
						{SaveButton()}
					</div>
				</div>
				<div
					style={{ height: "800px", marginTop: "24px" }}
					className="overflow-auto"
				>
					<PurchaseRecordView record={editFlowItemRecord} open={open} />
				</div>
			</CustomModalRoot>
		);
	}
	return (
		<CustomModalRoot>
			<div className="header">
				<div className="title">{title}</div>
				<div>
					<Button
						style={{
							fontSize: "12px",
							background: "#F2F3F5",
							marginRight: "18px",
						}}
						onClick={() => setOpen(false)}
					>
						取消
					</Button>
					{SaveButton()}
				</div>
			</div>

			<div className="content">
				<Form
					form={inputForm}
					name="recordForm"
					colon={false}
					wrapperCol={{ flex: 1 }}
					preserve={false}
				>
					{showDstColumns.length > 0 ? (
						<CellEditorContext
							form={form}
							setForm={setForm}
							dstColumns={showDstColumns}
						/>
					) : (
						<NoFieldData />
					)}
				</Form>
			</div>
			<div className="footer"></div>
		</CustomModalRoot>
	);
};

export default CustomModal;
