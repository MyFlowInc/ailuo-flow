import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Radio, Space } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme, dashboardTheme } from "../../../theme/theme";

import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import { ITechStatus } from "../../../api/ailuo/dict";
import {
	changeStatus,
	techProjectEdit,
	techProjectList,
} from "../../../api/ailuo/tech";
import _ from "lodash";
import { DashboardRouterOutletContext } from "../../../context";

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
	height: 80vh;
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
const columns: any = (
	mode: "1" | "2",
	setMode: any,
	setShowDstColumns: any,
) => {
	const defaultColumns = [
		{
			title: "项目名称",
			width: 200,
			dataIndex: "name",
			key: "name",
			fixed: "left",
			type: NumFieldType.SingleText,
		},
		{
			title: "分析结果",
			width: 200,
			dataIndex: "result",
			key: "result",
			type: NumFieldType.SingleText,
			render: (column: any, key: string, form: any, setForm: any) => {
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
								value={form.result || "1"}
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
	if (mode === "1") {
		return defaultColumns;
	}
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
	}
	return defaultColumns;
};

const CustomModalTechView: React.FC<CustomModalProps> = ({
	title,
	open,
	setOpen,
}) => {
	const [showDstColumns, setShowDstColumns] = useState<any>([]);
	const [mode, setMode] = useState<"1" | "2">("1");
	const { techId } = useContext(DashboardRouterOutletContext);

	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any>({});

	useEffect(() => {
		console.log(2222, mode);
		setShowDstColumns(columns(mode, setMode, setShowDstColumns));
	}, [mode]);

	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});

	// 根据saleid 获取值
	useEffect(() => {
		if (techId) {
			const fetchEditFlowItemRecord = async () => {
				try {
					const res = await techProjectList({
						id: techId,
						pageNum: 1,
						pageSize: 10,
					});
					const form = _.get(res, "data.record.0");
					setEditFlowItemRecord(form);
					const result = _.get(form, "result");
					if (result) {
						setMode(result);
					}
					console.log(111, form, result);
				} catch (error) {}
			};
			fetchEditFlowItemRecord();
		}
	}, [techId]);
	const setAllDisabled = (disabled: boolean) => {
		const newCol = showDstColumns.map((item: any) => {
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
	};
	// 控制 只读和编辑
	useEffect(() => {
		if (_.isEmpty(showDstColumns)) {
			return;
		}
		setAllDisabled(true);
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
		if (editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			setForm(temp);
			if (temp.result) {
				setMode(temp.result);
			}
			inputForm.setFieldsValue(temp);
		}
	}, [open, editFlowItemRecord]);

	// 更新记录
	const updateRecord = async () => {
		const { recordId, id, ...rest } = form;
		inputForm.setFieldsValue(rest);
		const params = {
			id,
			...rest,
		};
		try {
			await inputForm.validateFields();
			await techProjectEdit(excludeNull(params));
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);
		updateRecord();
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
					{/* <div className="flex cursor-pointer">
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
					</div> */}
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
	return (
		<ConfigProvider theme={dashboardTheme}>
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
						{/* <ConfigProvider theme={blueButtonTheme}>
							<Button type="primary" onClick={handleSaveRecord}>
								{"保存"}
							</Button>
						</ConfigProvider> */}
					</div>
				</div>
				{StatusView()}

				<div className="content">
					<Form
						form={inputForm}
						name="recordViewForm"
						key="recordViewForm"
						colon={false}
						wrapperCol={{ flex: 1 }}
						preserve={false}
					>
						{showDstColumns.length > 0 ? (
							<CellEditorContext
								form={form}
								setForm={setForm}
								dstColumns={showDstColumns}
								modalType={"edit"}
							/>
						) : (
							<NoFieldData />
						)}
					</Form>
				</div>
				<div className="footer"></div>
			</CustomModalRoot>
		</ConfigProvider>
	);
};

export default CustomModalTechView;
