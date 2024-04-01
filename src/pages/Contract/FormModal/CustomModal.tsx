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
import {
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";

import { ContractStatusMap } from "../../../api/ailuo/dict";
import warnSvg from "../../Sale/assets/warning.svg";
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
	selectIsFinance,
	selectIsManager,
	selectUser,
	setCurSaleForm,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ModeSelectTable from "../../Sale/ModeSelectTable";
import { ContracContext } from "../ContractManage";
import { contractAdd, contractEdit } from "../../../api/ailuo/contract";
import CellEditorContext from "../../Sale/FormModal/CellEditorContext";
import { NoFieldData } from "../../Sale/FormModal/NoFieldData";
import ExportProject from "../../Sale/ExportProject";
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
		type: NumFieldType.SingleText,
	},
	{
		title: "单位名称",
		dataIndex: "company",
		key: "company",
		type: NumFieldType.SingleSelect,
		dictCode: "company",
	},
	{
		title: "单位联系方式",
		dataIndex: "phone",
		key: "phone",
		type: NumFieldType.SingleText,
	},

	{
		title: "销售经理",
		dataIndex: "salesManager",
		key: "salesManager",
		type: NumFieldType.SingleSelect,
		dictCode: "salesManager",
	},
	{
		title: "合同编号",
		dataIndex: "uuid",
		key: "uuid",
		type: NumFieldType.SingleText,
	},
	{
		title: "合同日期",
		dataIndex: "contractTime",
		key: "contractTime",
		type: NumFieldType.DateTime,
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
				<div key={"ModeSelect_" + key} className="w-full">
					<ModeSelectTable
						key={"ModeSelectTable" + key}
						{...{ column, form, setForm }}
					/>
				</div>
			);
		},
	},
	{
		title: "总数量",
		dataIndex: "totalNum",
		key: "totalNum",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			let totalNum = 0;

			try {
				const list = form.typeSelection;
				list.forEach((item: any) => {
					totalNum += +item.num;
				});
			} catch (error) { }

			return (
				<div key={"name_" + key} className="w-full mt-4">
					<div className="w-full">
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>总数量</div>
							<div className="flex-1 flex items-center">
								{/* <span key={"totalNum" + key}>{totalNum}</span> */}
								<Input disabled key={"totalNum" + key} value={`${totalNum}`} />
							</div>
						</div>
					</div>
				</div>
			);
		},
	},
	{
		title: "总价",
		dataIndex: "totalPrice",
		key: "totalPrice",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			let totalPrice = 0;
			try {
				const list = form.typeSelection;
				list.forEach((item: any) => {
					totalPrice += +item.num * +item.price;
				});
			} catch (error) { }
			const { currency } = form;
			let sign = "";
			if (currency === "人民币") {
				sign = "¥";
			}
			if (currency === "美元") {
				sign = "$";
			}
			if (currency === "欧元") {
				sign = "€";
			}
			return (
				<div key={"name_" + key} className="w-full">
					<div className="w-full">
						<div className="flex mb-4">
							<div style={{ width: "100px" }}>总价</div>
							<div className="flex-1 flex items-center">
								{/* <span key={"totalPrice" + key}>{`${sign} ${totalPrice}`}</span> */}
								<Input
									disabled
									key={"totalPrice" + key}
									value={`${sign} ${totalPrice}`}
								/>
							</div>
						</div>
					</div>
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
		title: "技术规格表",
		dataIndex: "technicalSheet",
		key: "technicalSheet",
		type: NumFieldType.Attachment,
	},
	{
		title: "合同附件",
		dataIndex: "otherFile",
		key: "otherFile",
		type: NumFieldType.Attachment,
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
const ApproveConfirm: (p: any) => any = ({ approveModal, setApproveModal }) => {
	const { user, setOpen, finalInfoList } = useContext(
		CustomModalContext,
	)! as any;
	const { fetchContractList } = useContext(ContracContext)! as any;
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
			await fetchContractList();
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
	const { user, setOpen, finalInfoList } = useContext(
		CustomModalContext,
	)! as any;
	const { fetchContractList } = useContext(ContracContext)! as any;

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
			await fetchContractList();
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
	if (location.pathname !== "/dashboard/my-contract-process") {
		return <div></div>;
	}
	const { user, finalInfoList, form, hasApprovePermission } = useContext(
		CustomModalContext,
	)! as any;

	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);

	if (_.isEmpty(user || _.isEmpty(finalInfoList))) {
		return null;
	}
	if (_.get(form, "status") !== ContractStatusMap.Reviewing) {
		return null;
	}

	const info = _.find(finalInfoList, { relationUserId: user.id });
	if (!_.isEmpty(info) && _.get(info, "status") !== "todo") {
		console.log("你的审批结果", info.status);
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
	const dispatch = useAppDispatch();

	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const isFinance = useAppSelector(selectIsFinance);
	const curSaleForm = useAppSelector((state) => state.global.curSaleForm);

	const { fetchContractList, hasApprovePermission } =
		useContext(ContracContext);

	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const setAllDisabled = (disabled: boolean) => {
		disabled = isManager ? false : disabled;
		if (isFinance) {
			disabled = true;
		}
		const newCol = showDstColumns.map((item: any) => {
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
		setSaveButtonDisabled(disabled);
	};

	// new feature 从 sale 跳过来创建 合同
	useEffect(() => {
		if (location.search.includes("from=sale") && !_.isEmpty(curSaleForm)) {
			console.log(2222, curSaleForm);
			const {
				id,
				name,
				company,
				salesManager,
				mechanismForm,
				currency,
				typeSelection,
				quotationEnd,
				qualityTime,
				payType,
				relationSale,
				exportItem,
				modeTrade,
			} = curSaleForm;
			setForm((v: any) => {
				return {
					...v,
					name,
					company,
					salesManager,
					mechanismForm,
					currency,
					typeSelection,
					quotationEnd,
					qualityTime,
					payType,
					exportItem,
					modeTrade,
					relationReview: id + "", // 关联技术
					relationSale: relationSale, // 关联报价
				};
			});
			dispatch(setCurSaleForm({}));
		}
	}, [curSaleForm]);
	// 初始化form数据
	useEffect(() => {
		if (!open) {
			setForm({});
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
			setForm((v: any) => {
				return {
					...v,
					currency: "人民币",
				};
			});
		}
	}, [open]);

	// 控制 只读和编辑
	useEffect(() => {
		if (_.isEmpty(showDstColumns)) {
			return;
		}
		if (open && form.status === ContractStatusMap.NotStarted) {
			// 未启动
			setAllDisabled(true);
		} else if (open && form.status === ContractStatusMap.Reviewing) {
			// 审批中
			setAllDisabled(true);
		} else if (open && form.status === ContractStatusMap.Approved) {
			// 通过
			setAllDisabled(true);
		} else if (open && form.status === ContractStatusMap.ReviewFailed) {
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
		if (open && form.status === ContractStatusMap.Reviewing) {
			fetchFinalInfoList();
		}
	}, [form.id]);

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();
			if (!form.status) {
				form.status = "not_started";
			}
			try {
				if (form.typeSelection) {
					form.typeSelection = JSON.stringify(form.typeSelection);
				}
				if (form.modeTrade) {
					form.modeTrade = JSON.stringify(form.modeTrade);
				}
				if (form.payType) {
					form.payType = JSON.stringify(form.payType);
				}
			} catch (error) { }
			await contractAdd(excludeNull(form));
			await fetchContractList();
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
				delete params.updateTime;
				delete params.createTime;
			} catch (error) { }
			await contractEdit(excludeNull(params));
			await fetchContractList();
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
		status: ContractStatusMap[keyof ContractStatusMap],
	) => {
		try {
			// 通知 终审人员
			if (status === ContractStatusMap.Reviewing) {
				const res = await approveInfo({ belong: "contract" }); // 审批信息
				let list = _.get(res, "data.record", []);
				const allP = list.map((item: any) => {
					const params: any = {
						recipientId: item.relationUserId,
						content: {
							status: status,
							msg: `您的合同: <${form.name}> 需要审批`,
							contractId: form.id,
						},
					};
					params.content = JSON.stringify(params.content);
					return noticeAdd(params);
				});
				await Promise.all(allP);
			}
			// 同意后 通知报价单创建人
			if (status === ContractStatusMap.Approved) {
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
			if (status === ContractStatusMap.ReviewFailed) {
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
	const changeStatus = async (params: any) => {
		await contractEdit(params);
	};
	// 修改审批状态
	const changeProcess = async (
		form: any,
		status: ContractStatusMap[keyof ContractStatusMap],
	) => {
		try {
			const { id } = form;
			if (status === ContractStatusMap.ReviewFailed) {
				await changeStatus({ id, status, remark: form.remark } as any);
			} else {
				await changeStatus({ id, status });
			}
			await notifyHandler(form, status);
			// hack
			form.status = status;
			await handleSaveRecord();
			// await setOpen(false);
			// await fetchContractList();
			if (status === ContractStatusMap.Reviewing) {
				window.dispatchEvent(new Event("fersh-total-info"));
			}
		} catch (error) {
			console.log(error);
		}
	};
	// 新一轮报价处理
	const newSaleHandle = async (form: any, type: "need" | "noNeed") => {
		try {
			let status = "";
			if (type == "need") {
				//
				status = ContractStatusMap.Processing;
			}
			if (type == "noNeed") {
				// 下一步提交终审吧
			}
			console.log("newSaleHandle", form);
			const { id, createTime, deleted, updateTime, ...params } = form;
			// await notifyHandler(form, status); 	// 通知给后端做了
			try {
				params.typeSelection = JSON.stringify(params.typeSelection);
				params.modeTrade = JSON.stringify(params.modeTrade);
				params.payType = JSON.stringify(params.payType);
			} catch (error) { }

			params.status = status;
			params.relationReview = form.id;
			await contractAdd(excludeNull(params));
			await fetchContractList();
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

		// 未启动 开始处理
		if (id && (status === ContractStatusMap.NotStarted || !status)) {
			if (isFinance) {
				return (
					<div className="status-operate flex">
						<div className="flex">
							<div className="mr-2">状态: </div>
							<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
								{"未启动"}
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
					<div className="flex cursor-pointer">
						<div className="mr-2">操作: </div>
						<Tag
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={() => {
								changeProcess(form, ContractStatusMap.Processing);
							}}
						>
							{"开始处理"}
						</Tag>
					</div>
				</div>
			);
		}
		// 处理中 --》 提交审批
		if (id && status === ContractStatusMap.Processing) {
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
								changeProcess(form, ContractStatusMap.Reviewing);
							}}
						>
							{"提交审批"}
						</Tag>
					</div>
				</div>
			);
		}

		// 审批中
		if (id && status === ContractStatusMap.Reviewing) {
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
							{"审批中"}
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
							if (approveInfo.status === "reject") {
								return (
									<Badge
										key={"Badge" + user.id}
										count={<CloseCircleOutlined style={{ color: "red" }} />}
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
		if (id && status === ContractStatusMap.Approved) {
			// 特殊处理财务角色
			if (isFinance) {
				return (
					<>
						<div className="status-operate flex">
							<div className="flex">
								<div className="mr-2">状态: </div>
								<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
									{"审批通过"}
								</Tag>
							</div>
						</div>
					</>
				);
			}
			return (
				<>
					<div className="status-operate flex">
						<div className="flex">
							<div className="mr-2">状态: </div>
							<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
								{"审批通过"}
							</Tag>
						</div>
						<div className="flex cursor-pointer">
							<div className="mr-2">操作: </div>
							<Popconfirm
								title="确认生成项目?"
								onConfirm={() => {
									newSaleHandle(form, "need");
								}}
								okText="确认"
								cancelText="取消"
							>
								<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
									{"生成项目"}
								</Tag>
							</Popconfirm>
							<Popconfirm
								title="确认撤回重改?"
								onConfirm={() => {
									changeProcess(form, ContractStatusMap.Processing);
								}}
								okText="确认"
								cancelText="取消"
							>
								<Tag
									className="ml-2"
									color={"#D4F3F2"}
									style={{ color: "#000" }}
									onClick={() => { }}
								>
									{"撤回重改"}
								</Tag>
							</Popconfirm>
						</div>
					</div>
					<div className="flex cursor-pointer mb-4"></div>
				</>
			);
		}
		// 审批驳回
		if (
			id &&
			[ContractStatusMap.ReviewFailed, ContractStatusMap.Approved].includes(
				status,
			)
		) {
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
							title="撤回重改?"
							onConfirm={() => {
								// newSaleHandle(form, "need");
								// TODO 有bug
								changeProcess(form, ContractStatusMap.Processing);
							}}
							okText="确认"
							cancelText="取消"
						>
							<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
								{"撤回重改"}
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
				{/* <div className="hidden">
					<div className="mr-2">操作: </div>
					<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
						{"开始处理"}
					</Tag>
				</div> */}
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
