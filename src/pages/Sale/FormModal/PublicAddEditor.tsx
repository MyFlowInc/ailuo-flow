import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Modal, Popover, Input } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import {
	changeStatus,
	saleProjectAdd,
	saleProjectPublishAdd,
} from "../../../api/ailuo/sale";
import { MainStatus } from "../../../api/ailuo/dict";
import { approveInfo } from "../../../api/ailuo/approve";
import _ from "lodash";
import { noticeAdd } from "../../../api/ailuo/notice";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import ModeSelectTable from "../ModeSelectTable";
import ProjectName from "../ProjectName";
import PublishAddSuccess from "./PublishAddSuccess";
import ExportProject from "../ExportProject";

const PublicAddEditorRoot = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;

	.warp {
		width: 600px;
		height: 100%;
		padding: 24px 36px 24px 36px;
		overflow: hidden;
		background-image: url("/assets/bg.svg");
		background-position: center center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
	}
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
		height: calc(100% - 80px);
		max-width: 600px;
		overflow: overlay;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

interface CustomModalProps {}
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

const CustomModalContext = React.createContext({});
export const columns: any = [
	{
		title: "项目名称",
		dataIndex: "name",
		key: "name",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			return (
				<div key={"name_" + key} className="w-full">
					<ProjectName
						key={"ProjectName" + key}
						{...{ column, form, setForm }}
					/>
				</div>
			);
		},
	},
	{
		title: "单位名称",
		dataIndex: "company",
		key: "company",
		type: NumFieldType.SingleFixSelect,
		dictCode: "company",
	},
	{
		title: "销售经理",
		dataIndex: "salesManager",
		key: "salesManager",
		type: NumFieldType.SingleFixSelect,
		dictCode: "salesManager",
	},
	{
		title: "报价开始日期",
		dataIndex: "quotationBegin",
		key: "quotationBegin",
		type: NumFieldType.DateTime,
	},
	{
		title: "产品规格书",
		dataIndex: "specificationDetail",
		key: "specificationDetail",
		type: NumFieldType.Attachment,
	},
	{
		title: "阀门参数",
		dataIndex: "valveDetail",
		key: "valveDetail",
		type: NumFieldType.Attachment,
	},
	{
		title: "其他技术文件",
		dataIndex: "otherFile",
		key: "otherFile",
		type: NumFieldType.Attachment,
	},
	{
		title: "扭矩/推力",
		dataIndex: "torqueThrust",
		key: "torquehrust",
		type: NumFieldType.SingleText,
	},
	{
		title: "其他技术要求",
		dataIndex: "otherTechnicalRequirements",
		key: "otherTechnicalRequirements",
		type: NumFieldType.Text,
	},
	{
		title: "执行机构形式",
		dataIndex: "mechanismForm",
		key: "mechanismForm",
		type: NumFieldType.SingleText,
	},
	{
		title: "货币",
		dataIndex: "currency",
		key: "currency",
		type: NumFieldType.SingleFixSelect,
		dictCode: "currency",
	},
	{
		title: "初步选型型号",
		dataIndex: "typeSelection",
		key: "typeSelection",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			return (
				<div key={"ModeSelectTable_" + key} className="w-full">
					<ModeSelectTable
						key={"ModeSelectTable" + key}
						{...{ column, form, setForm }}
					/>
				</div>
			);
		},
	},
	{
		title: "交期",
		dataIndex: "quotationEnd",
		key: "quotationEnd",
		type: NumFieldType.DateTime,
	},
	{
		title: "质保",
		dataIndex: "qualityTime",
		key: "qualityTime",
		type: NumFieldType.SingleText,
	},
	{
		title: "出口项目",
		dataIndex: "exportItem", // 'show' | 'hide'
		key: "exportItem",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			return (
				<div key={"exportItem_" + key} className="w-full">
					<ExportProject
						key={"exportItem" + key}
						{...{ column, form, setForm }}
					/>
				</div>
			);
		},
	},
	{
		title: "贸易方式",
		dataIndex: "modeTrade",
		key: "modeTrade",
		type: NumFieldType.MultiSelect,
		dictCode: "tarde_mode",
		showCtrlKey: "exportItem",
	},
	{
		title: "付款方式",
		dataIndex: "payType",
		key: "payType",
		type: NumFieldType.MultiFixSelect,
		dictCode: "pay",
	},
	{
		title: "关联技术评审",
		dataIndex: "relateTechProcess",
		key: "relateTechProcess",
		type: NumFieldType.RelationTechView,
	},
	{
		title: "关联报价",
		dataIndex: "relateQuote",
		key: "relateQuote",
		type: NumFieldType.RelationSaleView,
	},
];

const PublicAddEditor: React.FC<CustomModalProps> = ({}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const [step, setStep] = useState<1 | 2>(1);

	useEffect(() => {
		if (!open) {
			return;
		}
		setForm({
			currency: "人民币",
		});
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
			} catch (error) {}
			await saleProjectPublishAdd(excludeNull(form));
			setStep(2);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);
		createRecord();
	};

	// 通知模块
	const notifyHandler = async (
		form: any,
		status: MainStatus[keyof MainStatus],
	) => {
		try {
			// 通知 终审人员
			if (status === MainStatus.QuotationReview) {
				const res = await approveInfo({ belong: "sale" }); // 审批信息
				let list = _.get(res, "data.record", []);
				const allP = list.map((item: any) => {
					const params: any = {
						recipientId: item.relationUserId,
						content: {
							status: status,
							msg: `您的报价单: <${form.name}> 需要审批`,
							saleId: form.id,
						},
					};
					params.content = JSON.stringify(params.content);
					return noticeAdd(params);
				});
				await Promise.all(allP);
			}
			// 同意后 通知报价单创建人
			if (status === MainStatus.Approved) {
				const { createBy } = form; // 创建人id
				if (!createBy) return;
				const params: any = {
					recipientId: createBy,
					content: {
						status: status,
						msg: `您的工单: <${form.name}> 审批通过`,
						saleId: form.id,
					},
				};
				params.content = JSON.stringify(params.content);
				await noticeAdd(params);
			}
			// 审批拒绝 通知报价单创建人
			if (status === MainStatus.ReviewFailed) {
				const { createBy } = form; // 创建人id
				if (!createBy) return;
				const params: any = {
					recipientId: createBy,
					content: {
						status: status,
						msg: `您的工单: <${form.name}> 已被驳回
							    驳回理由: ${form.remark}`,
						saleId: form.id,
					},
				};
				params.content = JSON.stringify(params.content);
				await noticeAdd(params);
			}
		} catch (error) {
			console.log(error);
		}
	};
	// 修改审批状态
	const changeProcess = async (
		form: any,
		status: MainStatus[keyof MainStatus],
	) => {
		try {
			const { id } = form;
			if (status === MainStatus.ReviewFailed) {
				await changeStatus({ id, status, remark: form.remark } as any);
			} else {
				await changeStatus({ id, status });
			}
			await notifyHandler(form, status);
		} catch (error) {
			console.log(error);
		}
	};
	const StatusView = () => {
		if (!form) {
			return;
		}
		const { id, status } = form;
		// 未启动 开始处理
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
							}}
						>
							{"开始处理"}
						</Tag>
					</div>
				</div>
			);
		}
		// 未启动
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
	const AddView = () => {
		if (step === 1) {
			return (
				<div className="warp">
					<div
						style={{
							background: "#fff",
							padding: "24px 48px",
							borderRadius: "10px",
						}}
						className="h-full overflow-hidden"
					>
						<div className="header">
							<div className="title">{"新建报价"}</div>
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
										modalType={"add"}
									/>
								) : (
									<NoFieldData />
								)}
							</Form>
						</div>
						<div className="footer">
							<ConfigProvider theme={greyButtonTheme}>
								<Button
									type="primary"
									className="mr-8"
									onClick={handleSaveRecord}
								>
									取消
								</Button>
							</ConfigProvider>
							<ConfigProvider theme={blueButtonTheme}>
								<Button type="primary" onClick={handleSaveRecord}>
									创建
								</Button>
							</ConfigProvider>
						</div>
					</div>
				</div>
			);
		}
		return null;
	};
	const SuccessView = () => {
		if (step === 2) {
			return (
				<div className="warp">
					<div
						style={{
							background: "#fff",
							padding: "24px 48px",
							borderRadius: "10px",
						}}
						className="h-full overflow-hidden"
					>
						<PublishAddSuccess />
					</div>
				</div>
			);
		}
		return null;
	};
	return (
		<PublicAddEditorRoot>
			{AddView()}
			{SuccessView()}
		</PublicAddEditorRoot>
	);
};

export default PublicAddEditor;
