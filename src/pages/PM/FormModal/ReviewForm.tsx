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
import { SaleManageContext } from "../PreProductionManage";
import { contractAdd, contractEdit } from "../../../api/ailuo/contract";
import CellEditorContext from "../../Sale/FormModal/CellEditorContext";
import { NoFieldData } from "../../Sale/FormModal/NoFieldData";
import ExportProject from "../../Sale/ExportProject";
const { TextArea } = Input;
const CustomModalRoot = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24px auto;
	border-radius: 8px;
	background-color: #ffffff;
	pointer-events: auto;
	max-height: 100%;
	height: 100%;
	overflow: hidden;
	.header {
		width: 600px;
		height: 18px;
		display: flex;
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
		width: 600px;
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
	// {
	// 	title: "执行机构形式",
	// 	dataIndex: "mechanismForm",
	// 	key: "mechanismForm",
	// 	type: NumFieldType.SingleText,
	// },
	// {
	// 	title: "货币",
	// 	dataIndex: "currency",
	// 	key: "currency",
	// 	type: NumFieldType.SingleFixSelect,
	// 	dictCode: "currency",
	// },

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
			} catch (error) {}

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
	// {
	// 	title: "总价",
	// 	dataIndex: "totalPrice",
	// 	key: "totalPrice",
	// 	render: (
	// 		column: any,
	// 		key: string,
	// 		form: any,
	// 		setForm: (value: any) => void,
	// 	) => {
	// 		let totalPrice = 0;
	// 		try {
	// 			const list = form.typeSelection;
	// 			list.forEach((item: any) => {
	// 				totalPrice += +item.num * +item.price;
	// 			});
	// 		} catch (error) { }
	// 		const { currency } = form;
	// 		let sign = "";
	// 		if (currency === "人民币") {
	// 			sign = "¥";
	// 		}
	// 		if (currency === "美元") {
	// 			sign = "$";
	// 		}
	// 		if (currency === "欧元") {
	// 			sign = "€";
	// 		}
	// 		return (
	// 			<div key={"name_" + key} className="w-full">
	// 				<div className="w-full">
	// 					<div className="flex mb-4">
	// 						<div style={{ width: "100px" }}>总价</div>
	// 						<div className="flex-1 flex items-center">
	// 							{/* <span key={"totalPrice" + key}>{`${sign} ${totalPrice}`}</span> */}
	// 							<Input
	// 								disabled
	// 								key={"totalPrice" + key}
	// 								value={`${sign} ${totalPrice}`}
	// 							/>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		);
	// 	},
	// },
	{
		title: "交期",
		dataIndex: "quotationEnd",
		key: "quotationEnd",
		type: NumFieldType.DateTime,
	},
	// {
	// 	title: "质保",
	// 	dataIndex: "qualityTime",
	// 	key: "qualityTime",
	// 	type: NumFieldType.SingleText,
	// },
	// {
	// 	title: "出口项目",
	// 	dataIndex: "exportItem", // 'show' | 'hide'
	// 	key: "exportItem",
	// 	render: (
	// 		column: any,
	// 		key: string,
	// 		form: any,
	// 		setForm: (value: any) => void,
	// 	) => {
	// 		return (
	// 			<div key={"exportItem_" + key} className="w-full">
	// 				<ExportProject
	// 					key={"exportItem" + key}
	// 					{...{ column, form, setForm }}
	// 				/>
	// 			</div>
	// 		);
	// 	},
	// },
	// {
	// 	title: "贸易方式",
	// 	dataIndex: "modeTrade",
	// 	key: "modeTrade",
	// 	type: NumFieldType.MultiSelect,
	// 	dictCode: "tarde_mode",
	// 	showCtrlKey: "exportItem",
	// },
	// {
	// 	title: "付款方式",
	// 	dataIndex: "payType",
	// 	key: "payType",
	// 	type: NumFieldType.MultiSelect,
	// 	dictCode: "pay",
	// },
	{
		title: "技术规格表",
		dataIndex: "technicalSheet",
		key: "technicalSheet",
		type: NumFieldType.Attachment,
	},
	{
		title: "关联合同",
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

const CustomModalContext = React.createContext({});

const ReviewForm: React.FC<CustomModalProps> = ({ editFlowItemRecord }) => {
	const modalType = "edit" as any;
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const allUser = useAppSelector(selectAllUser);
	const dispatch = useAppDispatch();

	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const isFinance = useAppSelector(selectIsFinance);
	const curSaleForm = useAppSelector((state) => state.global.curSaleForm);

	const { fetchContractList, hasApprovePermission } = useContext(
		SaleManageContext,
	) as any;

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
		if (form.status === ContractStatusMap.NotStarted) {
			// 未启动
			setAllDisabled(true);
		} else if (form.status === ContractStatusMap.Reviewing) {
			// 审批中
			setAllDisabled(true);
		} else if (form.status === ContractStatusMap.Approved) {
			// 通过
			setAllDisabled(true);
		} else if (form.status === ContractStatusMap.ReviewFailed) {
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
		if (form.status === ContractStatusMap.Reviewing) {
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
			} catch (error) {}
			await contractAdd(excludeNull(form));
			await fetchContractList();
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
			} catch (error) {}
			await contractEdit(excludeNull(params));
			await fetchContractList();
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
						changeProcess,
						hasApprovePermission,
					}}
				></CustomModalContext.Provider>
			</div>
		</CustomModalRoot>
	);
};

export default ReviewForm;
