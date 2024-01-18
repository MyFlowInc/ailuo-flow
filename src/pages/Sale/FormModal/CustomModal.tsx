import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag } from "antd";
import { NoFieldData } from "./NoFieldData";
import { useAppDispatch } from "../../../store/hooks";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme } from "../../../theme/theme";

import type { WorkFlowStatusInfo } from "../../../store/workflowSlice";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import { changeStatus, saleProjectAdd, saleProjectEdit } from "../../../api/ailuo/sale";
import ModeSelectTable from "../ModeSelectTable";
import { MainStatus } from "../../../api/ailuo/dict";

const CustomModalRoot = styled.div`
	position: relative;
	padding: 24px 40px 24px 40px;
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
	fetchSaleList: () => void; // 获取销售列表
	setOpen: (value: boolean) => void;
	statusList: WorkFlowStatusInfo[];
	modalType: string;
	editFlowItemRecord?: any | undefined;
	children?: React.ReactNode;
}
const excludeNull = (obj: any) => {
	const result: any = {};
	Object.keys(obj).forEach(key => {
		if (obj[key] === undefined || obj[key] === null) {
			return;
		}
		result[key] = obj[key];
	});
	return result;
};
const columns: any = [
	{
		title: "项目名称",
		width: 200,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		type: NumFieldType.SingleText
	},
	{ title: "单位名称", dataIndex: "company", key: "company", type: NumFieldType.SingleSelect, dictCode: "company" },
	{ title: "销售经理", dataIndex: "salesManager", key: "salesManager", type: NumFieldType.SingleSelect, dictCode: "salesManager" },
	{ title: "报价开始日期", dataIndex: "quotationBegin", key: "quotationBegin", type: NumFieldType.DateTime },
	{ title: "产品规格书", dataIndex: "specificationDetail", key: "specificationDetail", type: NumFieldType.Attachment },
	{ title: "阀门参数", dataIndex: "valveDetail", key: "valveDetail", type: NumFieldType.Attachment },
	{ title: "其他技术文件", dataIndex: "otherFile", key: "otherFile", type: NumFieldType.Attachment },
	{ title: "扭矩/推力", dataIndex: "torqueThrust", key: "torquehrust", type: NumFieldType.SingleText },
	{ title: "其他技术要求", dataIndex: "otherTechnicalRequirements", key: "otherTechnicalRequirements", type: NumFieldType.Text },
	{ title: "执行机构形式", dataIndex: "mechanismForm", key: "mechanismForm", type: NumFieldType.SingleText },
	{ title: "货币", dataIndex: "currency", key: "currency", type: NumFieldType.SingleText },
	{
		title: "初步选型型号",
		dataIndex: "typeSelection",
		key: "typeSelection",
		render: (column: any, key: string, form: any, setForm: (value: any) => void) => {
			return (
				<div key={key} className="w-full">
					<ModeSelectTable key={"ModeSelectTable" + key} {...{ column, form, setForm }} />
				</div>
			);
		}
	},
	{ title: "交期", dataIndex: "quotationEnd", key: "quotationEnd", type: NumFieldType.DateTime },
	{ title: "质保", dataIndex: "qualityTime", key: "qualityTime", type: NumFieldType.SingleText },
	{ title: "出口项目", dataIndex: "exportItem", key: "exportItem", type: NumFieldType.SingleText },
	{ title: "贸易方式", dataIndex: "modeTrade", key: "modeTrade", type: NumFieldType.MultiSelect, dictCode: "tarde_mode" },
	{ title: "付款方式", dataIndex: "payType", key: "payType", type: NumFieldType.MultiSelect, dictCode: "pay" },
	{ title: "关联技术评审", dataIndex: "relateTechProcess", key: "relateTechProcess", type: NumFieldType.SingleText },
	{ title: "关联报价", dataIndex: "relateQuote", key: "relateQuote", type: NumFieldType.SingleText }
];
const CustomModal: React.FC<CustomModalProps> = ({ title, statusList, modalType, open, setOpen, editFlowItemRecord, fetchSaleList }) => {
	const dispatch = useAppDispatch();
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});

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
	//
	useEffect(() => {
		if (!open) {
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			try {
				// 处理初步选型型号
				temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
			} catch (error) {
				temp.typeSelection = [];
			}
			try {
				// 处理modeTrade
				temp.modeTrade = JSON.parse(temp.modeTrade || "[]");
			} catch (error) {
				temp.modeTrade = [];
			}
			try {
				// 处理payType
				temp.payType = JSON.parse(temp.payType || "[]");
			} catch (error) {
				temp.payType = [];
			}
			setForm(temp);
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {
			if (statusList && statusList.length > 0) {
			}
			setForm({});
		}
	}, [open]);

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();
			console.log("Received values of form: ", form);
			if (!form.status) {
				form.status = "not_started";
			}
			try {
				form.typeSelection = JSON.stringify(form.typeSelection);
				form.modeTrade = JSON.stringify(form.modeTrade);
				form.payType = JSON.stringify(form.payType);
			} catch (error) { }
			await saleProjectAdd(excludeNull(form));
			await fetchSaleList();
			setOpen(false);
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
			...rest
		};
		try {
			await inputForm.validateFields();
			try {
				params.typeSelection = JSON.stringify(params.typeSelection);
			} catch (error) { }
			await saleProjectEdit(excludeNull(params));
			await fetchSaleList();
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
	//
	const changeProcess = async (form: any, status: MainStatus[keyof MainStatus]) => {
		try {
			const { id } = form;
			await changeStatus({ id, status });
			setOpen(false);
			await fetchSaleList();
		} catch (error) {
			console.log(error);
		}
	};
	const StatusView = () => {
		if (!form) {
			return;
		}
		console.log("  form =", form.status);
		const { id, status } = form;
		if (id && (status === "not_started" || !status)) {
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
								changeProcess(form, MainStatus.Processing);
							}}>
							{"开始处理"}
						</Tag>
					</div>
				</div>
			);
		}
		if (id && (status === "processing")) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
							{"处理中"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								changeProcess(form, MainStatus.TechnicalReview);
							}}>
							{"提交技术审核"}
						</Tag>
					</div>
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
		<CustomModalRoot>
			<div className="header">
				<div className="title">{title}</div>
				<div>
					<Button style={{ fontSize: "12px", background: "#F2F3F5", marginRight: "18px" }} onClick={() => setOpen(false)}>
						取消
					</Button>
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary" onClick={handleSaveRecord}>
							{modalType === "add" ? "创建" : "修改"}
						</Button>
					</ConfigProvider>
				</div>
			</div>
			{StatusView()}
			<div className="content">
				<Form form={inputForm} name="recordForm" colon={false} wrapperCol={{ flex: 1 }} preserve={false}>
					{showDstColumns.length > 0 ? <CellEditorContext form={form} setForm={setForm} dstColumns={showDstColumns} modalType={modalType} /> : <NoFieldData />}
				</Form>
			</div>
			<div className="footer"></div>
		</CustomModalRoot>
	);
};

export default CustomModal;
