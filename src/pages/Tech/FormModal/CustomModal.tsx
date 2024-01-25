import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Radio, Space } from "antd";
import { NoFieldData } from "./NoFieldData";
import { useAppDispatch } from "../../../store/hooks";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme } from "../../../theme/theme";

import type { WorkFlowStatusInfo } from "../../../store/workflowSlice";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import { ITechStatus } from "../../../api/ailuo/dict";
import { changeStatus, techProjectEdit } from "../../../api/ailuo/tech";
import _ from "lodash";

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
	fetchTechFeedbackList: () => void; // 获取技术反馈列表
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
const columns: any = (mode: '1' | '2', setMode: any, setShowDstColumns: any) => {

	const defaultColumns = [
		{
			title: "项目名称",
			width: 200,
			dataIndex: "name",
			key: "name",
			fixed: "left",
			type: NumFieldType.SingleText
		},
		{
			title: "分析结果",
			width: 200,
			dataIndex: "result",
			key: "result",
			type: NumFieldType.SingleText,
			render: (column: any, key: string, form: any, setForm: any) => {
				const onChange = (e: any) => {
					setMode(e.target.value)
					setForm({ ...form, result: e.target.value })
				}
				return (
					<div className="w-full" key={'result_' + key}>
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>分析结果</div>
							<Radio.Group onChange={onChange} value={mode}>
								<Space direction="vertical">
									<Radio value={'1'}>常规产品，无特殊改动</Radio>
									<Radio value={'2'}>非常规产品，填写分析意见</Radio>
								</Space>
							</Radio.Group>
						</div>
					</div>
				)
			}
		},
		{
			title: "关联报价", dataIndex: "relateQuote", key: "relateQuote",
			type: NumFieldType.SingleText,
			render: (column: any, key: string, form: any, setForm: any) => {
				return (
					<div className="w-full" key={key}>
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>关联报价</div>
							<Tag color="blue">关联报价</Tag>
						</div>
					</div>
				)
			}
		},
	]
	if (mode === '1') {
		return defaultColumns
	}
	if (mode === '2') {
		const idx = _.findIndex(defaultColumns, { title: '分析结果' })
		const extraColumns: any = [
			{
				title: "选型分析",
				dataIndex: "selectionAnalysis",
				key: "selectionAnalysis",
				type: NumFieldType.Text
			},
			{
				title: "生产分析",
				dataIndex: "productionAnalysis",
				key: "productionAnalysis",
				type: NumFieldType.Text
			},
			{
				title: "附件",
				dataIndex: "attach",
				key: "attach",
				type: NumFieldType.Attachment
			},
		]

		defaultColumns.splice(idx + 1, 0, ...extraColumns)
		return defaultColumns
	}
	return defaultColumns
};


const CustomModal: React.FC<CustomModalProps> = ({ title, statusList, modalType, open, setOpen, editFlowItemRecord, fetchTechFeedbackList }) => {
	const dispatch = useAppDispatch();
	const [showDstColumns, setShowDstColumns] = useState<any>([]);
	const [mode, setMode] = useState<'1' | '2'>('1');

	useEffect(() => {
		setShowDstColumns(columns(mode, setMode, setShowDstColumns))
	}, [mode])

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
	// 初始化form
	useEffect(() => {
		if (!open) {
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			setForm(temp);
			if (temp.result) {
				setMode(temp.result)
			}
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
			return
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
	const changeProcess = async (form: any, status: ITechStatus[keyof ITechStatus]) => {
		try {
			const { id } = form;
			await changeStatus({ id, status });
			setOpen(false);
			await fetchTechFeedbackList();
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
							}}>
							{"开始审阅"}
						</Tag>
					</div>
				</div>
			);
		}
		if (id && (status === ITechStatus.Processing)) {
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
							}}>
							{"完成审核"}
						</Tag>
					</div>
				</div>
			);
		}
		if (id && (status === ITechStatus.Over)) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"已完成"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
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
							{"保存"}
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
