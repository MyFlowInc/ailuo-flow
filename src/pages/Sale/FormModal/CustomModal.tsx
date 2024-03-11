import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import {
	ConfigProvider,
	Form,
	Button,
	Tag,
	Popover,
	Input,
	Popconfirm,
	Avatar,
	Badge,
} from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import {
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import {
	changeStatus,
	fetchTurnTime,
	saleProjectAdd,
	saleProjectEdit,
} from "../../../api/ailuo/sale";
import ModeSelectTable from "../ModeSelectTable";
import { MainStatus } from "../../../api/ailuo/dict";
import warnSvg from "../assets/warning.svg";
import ProjectName from "../ProjectName";
import { SaleManageContext } from "../SaleManage";
import {
	approveInfo,
	finalApproveEdit,
	finalInfoPage,
} from "../../../api/ailuo/approve";
import _ from "lodash";
import { noticeAdd } from "../../../api/ailuo/notice";
import {
	User,
	selectAllUser,
	selectIsManager,
	selectUser,
	setCurSaleForm,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ExportProject from "../ExportProject";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
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
	modalType: string;
	editFlowItemRecord?: any | undefined;
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
		type: NumFieldType.MultiSelect,
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
// 通过二次确认
const ApproveConfirm: (p: any) => any = ({ approveModal, setApproveModal }) => {
	const { user, setOpen, finalInfoList, fetchSaleList } = useContext(
		CustomModalContext,
	)! as any;
	const clickHandle = async () => {
		setApproveModal(false);
		if (_.isEmpty(user) || _.isEmpty(finalInfoList)) {
			return;
		}
		const { id } = user;
		const info = _.find(finalInfoList, { relationUserId: id });
		try {
			await finalApproveEdit({
				id: info.id,
				status: "approve", // 通过
			});
			await fetchSaleList();
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
		}
	};
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
							clickHandle();
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
	const { user, setOpen, finalInfoList, fetchSaleList } = useContext(
		CustomModalContext,
	)! as any;
	const [rejectReason, setRejectReason] = useState("");
	const rejectHandle = async () => {
		setRejectModal(false);
		if (_.isEmpty(user) || _.isEmpty(finalInfoList)) {
			return;
		}
		const { id } = user;
		const info = _.find(finalInfoList, { relationUserId: id });
		try {
			await finalApproveEdit({
				id: info.id,
				status: "reject", // 通过
				remark: rejectReason,
			});
			await fetchSaleList();
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
		}
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
				<TextArea
					rows={4}
					value={rejectReason}
					onChange={(e) => setRejectReason(e.target.value)}
				/>
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
							rejectHandle();
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
	const { user, finalInfoList, hasApprovePermission } = useContext(
		CustomModalContext,
	)! as any;

	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);

	if (_.isEmpty(user || _.isEmpty(finalInfoList))) {
		return null;
	}
	const { id } = user;
	const info = _.find(finalInfoList, { relationUserId: id });

	if (!_.isEmpty(info) && _.get(info, "status") !== "todo") {
		return (
			<div className="w-full flex justify-center">
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					您已审批完成
				</Tag>
			</div>
		);
	}
	if (!hasApprovePermission) {
		return null;
	}

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
	modalType,
	open,
	setOpen,
	editFlowItemRecord,
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const allUser = useAppSelector(selectAllUser);

	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const { fetchSaleList, hasApprovePermission } = useContext(SaleManageContext);

	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const setAllDisabled = (disabled: boolean) => {
		disabled = isManager ? false : disabled;

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
		if (open && form.status === MainStatus.NotStarted) {
			// 未启动
			setAllDisabled(true);
		} else if (open && form.status === MainStatus.TechnicalReview) {
			// 技术审核中
			setAllDisabled(true);
		} else if (open && form.status === MainStatus.QuotationReview) {
			// 报价终审中
			setAllDisabled(true);
		} else if (open && form.status === MainStatus.Approved) {
			// 通过
			setAllDisabled(true);
		} else if (open && form.status === MainStatus.ReviewFailed) {
			// 驳回
			setAllDisabled(true);
		} else {
			if (_.get(showDstColumns, "[0].disabled") !== false) {
				setAllDisabled(false);
			}
		}
	}, [form.status, open]);
	// 终审情况
	const [finalInfoList, setFinalInfoList] = useState<any[]>([]);
	// 确定终审情况
	useEffect(() => {
		const fetchFinalInfoList = async () => {
			const res = await finalInfoPage(form.id + "");
			const record = _.get(res, "data.record");
			setFinalInfoList(record);
		};
		if (open && form.status === MainStatus.QuotationReview) {
			fetchFinalInfoList();
		}
	}, [form.status, open]);
	// 初始化form数据
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
				currency: "人民币",
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
			} catch (error) {}
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
			} catch (error) {}
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
			// hack
			form.status = status;
			await handleSaveRecord();
			// await setOpen(false);
			// await fetchSaleList();
		} catch (error) {
			console.log(error);
		} finally {
			if (status === MainStatus.QuotationReview) {
				window.dispatchEvent(new Event("fersh-total-info"));
			}
		}
	};
	// 新一轮报价处理
	const newSaleHandle = async (form: any, type: "need" | "noNeed") => {
		try {
			let status = "";
			if (type == "need") {
				//
				status = MainStatus.Processing;
			}
			if (type == "noNeed") {
				// 下一步提交终审吧
				status = MainStatus.TechnicalOver;
			}
			console.log("newSaleHandle", form);
			const { id, createTime, deleted, updateTime, ...params } = form;
			// await notifyHandler(form, status); 	// 通知给后端做了
			try {
				params.typeSelection = JSON.stringify(params.typeSelection);
				params.modeTrade = JSON.stringify(params.modeTrade);
				params.payType = JSON.stringify(params.payType);
			} catch (error) {}
			try {
				const res = await fetchTurnTime(form.name);
				const time = _.get(res, "data.turn_time");
				params.turnTime = time;
			} catch (error) {
				params.turnTime = +form.turnTime + 1;
			}
			params.status = status;
			params.relationReview = form.id;
			await saleProjectAdd(excludeNull(params));
			await fetchSaleList();
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
		}
	};
	const StatusView = () => {
		if (!form) {
			return;
		}
		const { id, status } = form;
		const history = useHistory();
		const dispatch = useAppDispatch();

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
			// 特殊处理报价终审中
			const ids = finalInfoList.map((i) => i.relationUserId);
			const users = allUser.filter((i) => ids.includes(i.id));
			return (
				<div className="status-operate flex items-center">
					<div className="flex">
						<div className="mr-2">状态: </div>
						<Tag
							color={"#FFEEE3"}
							style={{ color: "#000", height: "fit-content" }}
						>
							{"报价终审中"}
						</Tag>
					</div>
					<div className="flex cursor-pointer">
						{users.map((user: User) => {
							const approveInfo = finalInfoList.find(
								(i) => i.relationUserId === user.id,
							);
							// TODO 状态不统一会有bug
							if (approveInfo.status === "approve") {
								return (
									<Badge
										key={"Badge" + user.id}
										count={<CheckCircleOutlined style={{ color: "green" }} />}
									>
										<Avatar
											className="mx-2"
											src={
												<img
													src={user.avatar}
													alt="avatar"
													title={user.nickname}
												/>
											}
										/>
									</Badge>
								);
							}
							return (
								<Avatar
									key={"avatar" + user.id}
									className="mx-2"
									src={
										<img src={user.avatar} alt="avatar" title={user.nickname} />
									}
								/>
							);
						})}
					</div>
				</div>
			);
		}
		// 审批通过
		if (id && status === MainStatus.Approved) {
			return (
				<>
					<div className="status-operate flex">
						<div className="flex">
							<div className="mr-2">状态: </div>
							<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
								{"终审通过"}
							</Tag>
						</div>
						<div className="flex cursor-pointer">
							<div className="mr-2">操作: </div>
							<Popconfirm
								title="确认发起合同流程?"
								onConfirm={() => {
									console.log("form=", form);
									dispatch(setCurSaleForm(form));
									history.push("/dashboard/contract-manage?from=sale");
								}}
								okText="确认"
								cancelText="取消"
							>
								<Tag
									color={"#D4F3F2"}
									style={{ color: "#000" }}
									onClick={() => {}}
								>
									{"发起合同流程"}
								</Tag>
							</Popconfirm>
						</div>
					</div>
					<div className="flex cursor-pointer mb-4">
						<Popconfirm
							title="是否发起新一轮报价?"
							onConfirm={() => {
								newSaleHandle(form, "need");
							}}
							okText="确认"
							cancelText="取消"
						>
							<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
								{"新一轮报价（需技术审批）"}
							</Tag>
						</Popconfirm>
						<Popconfirm
							title="是否发起新一轮报价?"
							onConfirm={() => {
								newSaleHandle(form, "noNeed");
							}}
							okText="确认"
							cancelText="取消"
						>
							<Tag
								className="ml-2"
								color={"#D4F3F2"}
								style={{ color: "#000" }}
								onClick={() => {}}
							>
								{"新一轮报价（无需技术审批）"}
							</Tag>
						</Popconfirm>
					</div>
				</>
			);
		}
		// 审批驳回
		if (id && [MainStatus.ReviewFailed, MainStatus.Approved].includes(status)) {
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
						<Popconfirm
							title="是否发起新一轮报价?"
							onConfirm={() => {
								newSaleHandle(form, "need");
							}}
							okText="确认"
							cancelText="取消"
						>
							<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
								{"新一轮报价（需技术审批）"}
							</Tag>
						</Popconfirm>
						<Popconfirm
							title="是否发起新一轮报价?"
							onConfirm={() => {
								newSaleHandle(form, "noNeed");
							}}
							okText="确认"
							cancelText="取消"
						>
							<Tag
								className="ml-2"
								color={"#D4F3F2"}
								style={{ color: "#000" }}
								onClick={() => {}}
							>
								{"新一轮报价（无需技术审批）"}
							</Tag>
						</Popconfirm>
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
	const SaveButton = () => {
		if (modalType === "add") {
			return (
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" onClick={handleSaveRecord}>
						创建
					</Button>
				</ConfigProvider>
			);
		}
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
			<div className="footer">
				<CustomModalContext.Provider
					value={{
						user,
						finalInfoList,
						form,
						setForm,
						setOpen,
						changeProcess,
						fetchSaleList,
						hasApprovePermission,
					}}
				>
					<FootView />
				</CustomModalContext.Provider>
			</div>
		</CustomModalRoot>
	);
};

export default CustomModal;
