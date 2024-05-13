import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Radio, Space, message } from "antd";
import { NoFieldData } from "./NoFieldData";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme } from "../../../theme/theme";

import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import { ITechStatus } from "../../../api/ailuo/dict";
import { changeStatus, techProjectEdit } from "../../../api/ailuo/tech";
import _, { result } from "lodash";
import { selectIsManager } from "../../../store/globalSlice";

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
	fetchTechFeedbackList: () => void; // 获取技术反馈列表
	setOpen: (value: boolean) => void;
	modalType: string;
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
			title: "项目名称",
			width: 200,
			dataIndex: "name",
			key: "name",
			fixed: "left",
			type: NumFieldType.RelationSaleView,
		},
		{
			title: "分析结果",
			width: 200,
			dataIndex: "result",
			key: "result",
			type: NumFieldType.SingleText,
			render: (column: any, key: string, form: any, setForm: any) => {
				const { result } = form;
				const onChange = (e: any) => {
					setMode(e.target.value);
					setForm({ ...form, result: e.target.value });
				};
				const [disabled, setDisabled] = useState(false);
				useEffect(() => {
					if (_.get(column, "disabled")) {
						setDisabled(true);
					} else {
						setDisabled(false);
					}
				}, [column]);

				return (
					<div className="w-full" key={"result_" + key}>
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>分析结果</div>
							<Radio.Group
								disabled={disabled}
								onChange={onChange}
								value={result}
							>
								<Space direction="vertical">
									<Radio value={"1"}>常规产品，无特殊改动</Radio>
									<Radio value={"2"}>非常规产品，填写分析意见</Radio>
								</Space>
							</Radio.Group>
						</div>
					</div>
				);
			},
		},
		{
			title: "关联报价",
			dataIndex: "relateQuote",
			key: "relateQuote",
			type: NumFieldType.RelationSaleView,
		},
	];

	if (mode === "2") {
		const idx = _.findIndex(defaultColumns, { title: "分析结果" });
		const extraColumns: any = [
			{
				title: "选型分析",
				dataIndex: "selectionAnalysis",
				key: "selectionAnalysis",
				type: NumFieldType.Text,
			},
			{
				title: "生产分析",
				dataIndex: "productionAnalysis",
				key: "productionAnalysis",
				type: NumFieldType.Text,
			},
			{
				title: "附件",
				dataIndex: "attach",
				key: "attach",
				type: NumFieldType.Attachment,
			},
		];

		defaultColumns.splice(idx + 1, 0, ...extraColumns);
		return defaultColumns;
	} else {
		return defaultColumns;
	}
};

const CustomModal: React.FC<CustomModalProps> = ({
	title,

	modalType,
	open,
	setOpen,
	editFlowItemRecord,
	fetchTechFeedbackList,
}) => {
	const [mode, setMode] = useState<"" | "1" | "2">(""); // 未选择  常规  非常规
	const [showDstColumns, setShowDstColumns] = useState<any>([]);

	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const isManager = useAppSelector(selectIsManager);

	const setAllDisabled = (disabled: boolean) => {
		// disabled = isManager ? false : disabled;	// 经理例外

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
		if (open && form.status === ITechStatus.Todo) {
			// 未启动
			setAllDisabled(true);
		} else if (open && form.status === ITechStatus.Over) {
			// 已完成
			setAllDisabled(true);
		} else {
			if (_.get(showDstColumns, "[0].disabled") !== false) {
				setAllDisabled(false);
			}
		}
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
			setForm(temp);
			console.log(11, "rest", temp.result);
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
		const { recordId, id, ...rest } = form;
		inputForm.setFieldsValue(rest);
		const params = {
			id,
			...rest,
		};
		delete params.createTime;
		delete params.deleted;
		delete params.updateTime;

		try {
			await inputForm.validateFields();
			await techProjectEdit(excludeNull(params));
			await fetchTechFeedbackList();
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
	const changeProcess = async (
		form: any,
		status: ITechStatus[keyof ITechStatus],
	) => {
		try {
			const { id } = form;
			await changeStatus({ id, status });
			//TODO:  hack
			form.status = status;
			await handleSaveRecord();
			// setOpen(false);
			// await fetchTechFeedbackList();
		} catch (error) {
			console.log(error);
		}
	};
	const StatusView = () => {
		if (!form) {
			return;
		}
		const { id, status } = form;
		if (id && (status === ITechStatus.Todo || !status)) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
							{"未启动"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								changeProcess(form, ITechStatus.Processing);
							}}
						>
							{"开始审阅"}
						</Tag>
					</div>
				</div>
			);
		}
		if (id && status === ITechStatus.Processing) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
							{"进行中"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								if (!form.result) {
									message.warning("您尚未选择分析结果，无法完成审核");
									return;
								}
								changeProcess(form, ITechStatus.Over);
							}}
						>
							{"完成审核"}
						</Tag>
					</div>
				</div>
			);
		}
		if (id && status === ITechStatus.Over) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"已完成"}
						</Tag>
					</div>
					<div className="flex cursor-pointer"></div>
				</div>
			);
		}
		return (
			<div className="status-operate flex">
				<div className="flex">
					<div className="mr-2">状态: </div>
					<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
						{"未启动"}
					</Tag>
				</div>
				<div className="hidden">
					<div className="mr-2">操作: </div>
					<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
						{"开始处理"}
					</Tag>
				</div>
			</div>
		);
	};
	const SaveButton = () => {
		if (saveButtonDisabled) {
			return null;
		}
		return (
			<ConfigProvider theme={blueButtonTheme}>
				<Button type="primary" onClick={handleSaveRecord}>
					{"保存"}
				</Button>
			</ConfigProvider>
		);
	};

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
			{StatusView()}

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
							modalType={modalType}
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
