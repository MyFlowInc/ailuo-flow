import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button, Tag, Modal, Popover, Input } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import {
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import type { WorkFlowStatusInfo } from "../../../store/workflowSlice";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import {
	changeStatus,
	saleProjectAdd,
	saleProjectEdit,
} from "../../../api/ailuo/sale";
import ModeSelectTable from "../ModeSelectTable";
import { MainStatus } from "../../../api/ailuo/dict";
import { useLocation } from "react-router";
import warnSvg from "../assets/warning.svg";
import ProjectName from "../ProjectName";
import { SaleManageContext } from "../SaleManage";
import { approveInfo } from "../../../api/ailuo/approve";
import _ from "lodash";
import { noticeAdd } from "../../../api/ailuo/notice";
const { TextArea } = Input;
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
	height: 100%;
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
		height: calc(100% - 80px);
		max-width: 600px;
		overflow: overlay;
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
	statusList: WorkFlowStatusInfo[];
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
const columns: any = [
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
				<div key={'name_' + key} className="w-full" >
					<ProjectName
						key={"ProjectName" + key}
						{...{ column, form, setForm }}
					/>
				</div >
			);
		},
	},
	{
		title: "单位名称",
		dataIndex: "company",
		key: "company",
		type: NumFieldType.SingleSelect,
		dictCode: "company",
	},
	{
		title: "销售经理",
		dataIndex: "salesManager",
		key: "salesManager",
		type: NumFieldType.SingleSelect,
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
				<div key={'ModeSelectTable_' + key} className="w-full">
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
		dataIndex: "exportItem",
		key: "exportItem",
		type: NumFieldType.SingleText,
	},
	{
		title: "贸易方式",
		dataIndex: "modeTrade",
		key: "modeTrade",
		type: NumFieldType.MultiSelect,
		dictCode: "tarde_mode",
	},
	{
		title: "付款方式",
		dataIndex: "payType",
		key: "payType",
		type: NumFieldType.MultiSelect,
		dictCode: "pay",
	},
	{
		title: "关联技术评审",
		dataIndex: "relateTechProcess",
		key: "relateTechProcess",
		type: NumFieldType.SingleText,
	},
	{
		title: "关联报价",
		dataIndex: "relateQuote",
		key: "relateQuote",
		type: NumFieldType.RelationView,
	},
];
const ApproveConfirm: (p: any) => any = ({ approveModal, setApproveModal }) => {
	const { form, changeProcess } = useContext(CustomModalContext)! as any;

	return (
		<div className="flex flex-col items-center" style={{ width: "300px" }}>
			<div className="flex mb-4 mt-4">
				<img src={warnSvg} />
				<div>审批通过后，本项目将进入下一阶段</div>;
			</div>
			<div className="flex mb-4">
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						style={{ width: "80px" }}
						type="primary"
						className="mr-8"
						onClick={() => {
							setApproveModal(false);
						}}
					>
						取消
					</Button>
				</ConfigProvider>
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						style={{ width: "80px" }}
						type="primary"
						onClick={() => {
							setApproveModal(false);
							changeProcess(form, MainStatus.Approved);
						}}
					>
						通过
					</Button>
				</ConfigProvider>
			</div>
		</div>
	);
};
const RejectConfirm: (p: any) => any = ({ rejectModal, setRejectModal }) => {
	const { form, setForm, changeProcess } = useContext(CustomModalContext)! as any;
	const [rejectReason, setRejectReason] = useState("");
	const rejectHandle = () => {
		setForm(
			{
				...form,
				remark: rejectReason,
			},
		)
		setRejectModal(false);
		changeProcess({
			...form,
			remark: rejectReason,
		}, MainStatus.ReviewFailed);
	};
	return (
		<div className="flex flex-col" style={{ width: "300px" }}>
			<div
				className="mb-4 mt-4"
				style={{
					fontFamily: "HarmonyOS Sans",
					fontSize: "14px",
				}}
			>
				填写驳回理由
			</div>
			<div>
				<TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
			</div>
			<div className="flex justify-center mb-4 mt-4">
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						style={{ width: "80px" }}
						type="primary"
						className="mr-8"
						onClick={() => {
							setRejectModal(false);
						}}
					>
						取消
					</Button>
				</ConfigProvider>
				<ConfigProvider theme={redButtonTheme}>
					<Button
						style={{ width: "80px" }}
						type="primary"
						onClick={() => {
							rejectHandle()
						}}
					>
						驳回
					</Button>
				</ConfigProvider>
			</div>
		</div>
	);
};
const FootView = (props: any) => {
	if (location.pathname !== "/dashboard/my-quote-process") {
		return <div></div>;
	}
	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);

	return (
		<div className="w-full flex justify-center">
			<ConfigProvider theme={redButtonTheme}>
				<Popover
					open={rejectModal}
					onOpenChange={(newOpen: boolean) => {
						setRejectModal(newOpen);
					}}
					content={() => {
						return RejectConfirm({ rejectModal, setRejectModal });
					}}
					trigger="click"
				>
					<Button
						style={{ width: "80px" }}
						type="primary"
						className="mr-8"
						onClick={() => {
							setRejectModal(true);
						}}
					>
						驳回
					</Button>
				</Popover>
			</ConfigProvider>
			<ConfigProvider theme={blueButtonTheme}>
				<Popover
					open={approveModal}
					onOpenChange={(newOpen: boolean) => {
						setApproveModal(newOpen);
					}}
					content={() => {
						return ApproveConfirm({ approveModal, setApproveModal });
					}}
					trigger="click"
				>
					<Button
						style={{ width: "80px" }}
						type="primary"
						onClick={() => {
							setApproveModal(true);
						}}
					>
						通过
					</Button>
				</Popover>
			</ConfigProvider>
		</div>
	);
};

const CustomModalContext = React.createContext({});

const CustomModal: React.FC<CustomModalProps> = ({
	title,
	statusList,
	modalType,
	open,
	setOpen,
	editFlowItemRecord,
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});

	const { fetchSaleList } = useContext(SaleManageContext);

	// // esc handler
	// useEffect(() => {
	// 	if (!open) {
	// 		return;
	// 	}
	// 	const keydownHandler = (e: KeyboardEvent) => {
	// 		if (e.code === "Escape") {
	// 			setOpen(false);
	// 		}
	// 	};
	// 	document.addEventListener("keydown", keydownHandler, true);
	// 	return () => {
	// 		document.removeEventListener("keydown", keydownHandler, true);
	// 	};
	// }, [open]);
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
			if (!temp.currency) {
				temp.currency = "人民币";
			}
			setForm(temp);
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {

			setForm({
				currency: "人民币"
			});
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
			...rest,
		};
		try {
			await inputForm.validateFields();
			try {
				params.typeSelection = JSON.stringify(params.typeSelection);
				params.modeTrade = JSON.stringify(params.modeTrade);
				params.payType = JSON.stringify(params.payType);
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

	// 通知模块
	const notifyHandler = async (
		form: any,
		status: MainStatus[keyof MainStatus],
	) => {
		try {
			// 通知 终审人员
			if (status === MainStatus.QuotationReview) {
				const res = await approveInfo(); // 审批信息
				let list = _.get(res, "data.record", []);
				const allP = list.map((item: any) => {
					const params: any = {
						recipientId: item.relationUserId,
						content: {
							status: status,
							msg: `您的工单: <${form.name}> 需要审批`,
							saleId: form.id,
						},
					};
					console.log(11, params);
					params.content = JSON.stringify(params.content);
					return noticeAdd(params);
				});
				await Promise.all(allP);
			}
			// 同意后 通知报价单创建人
			if (status === MainStatus.Approved) {
				const { createBy } = form // 创建人id
				if (!createBy) return
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
				const { createBy } = form // 创建人id
				if (!createBy) return
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
			await setOpen(false);
			await fetchSaleList();
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
		// 处理中 --》 提交技术审核
		if (id && status === "processing") {
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
							}}
						>
							{"提交技术审核"}
						</Tag>
					</div>
				</div>
			);
		}
		// 技术审核中
		if (id && status === MainStatus.TechnicalReview) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"技术审核中"}
						</Tag>
					</div>
					<div className="flex cursor-pointer"></div>
				</div>
			);
		}
		// 技术审核完成  提价提交终审
		if (id && status === MainStatus.TechnicalOver) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"技术审核已完成"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								changeProcess(form, MainStatus.QuotationReview);
							}}
						>
							{"提交终审"}
						</Tag>
					</div>
				</div>
			);
		}
		// 报价终审中
		if (id && status === MainStatus.QuotationReview) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"报价终审中"}
						</Tag>
					</div>
					<div className="flex cursor-pointer"></div>
				</div>
			);
		}
		// 审批通过
		if (id && status === MainStatus.Approved) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
							{"终审通过"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag color={"#D4F3F2"} style={{ color: "#000" }} onClick={() => { }}>
							{"发起合同流程"}
						</Tag>
					</div>
				</div>
			);
		}
		// 审批驳回
		if (id && status === MainStatus.ReviewFailed) {
			return (
				<div className="status-operate flex">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag color={"#FF9F9F"} style={{ color: "#000" }}>
							{"审批驳回"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
							{"新一轮报价（需技术审批）"}
						</Tag>
						<Tag className="ml-2" color={"#D4F3F2"} style={{ color: "#000" }}>
							{"新一轮报价（无需技术审批）"}
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
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary" onClick={handleSaveRecord}>
							{modalType === "add" ? "创建" : "保存"}
						</Button>
					</ConfigProvider>
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
			<div className="footer">
				<CustomModalContext.Provider value={{ form, setForm, changeProcess }}>
					<FootView />
				</CustomModalContext.Provider>
			</div>
		</CustomModalRoot>
	);
};

export default CustomModal;
