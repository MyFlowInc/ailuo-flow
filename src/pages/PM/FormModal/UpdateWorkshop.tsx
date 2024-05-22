import React, { useState, useEffect, FC, useContext, ReactNode } from "react";
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
	message,
} from "antd";
import {
	TableTheme,
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import { Attachment, NumFieldType } from "../../../components/Dashboard/TableColumnRender";

import _ from "lodash";
import {
	selectAllUser,
	selectIsFinance,
	selectIsManager,
	selectUser,
	setCurSaleForm,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { PreProductionContext } from "../PreProductionManage";
import CellEditorContext from "../../Sale/FormModal/CellEditorContext";
import { NoFieldData } from "../../Sale/FormModal/NoFieldData";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import {
	splFolderFileCreate,
	splPreProjectEdit,
	splProjectList,
} from "../../../api/ailuo/spl-pre-product";
import TextArea from "antd/es/input/TextArea";
import warnSvg from "../../Sale/assets/warning.svg";
import { useHistory, useLocation } from "react-router";
import SPLModeSelect from "./SPLModeSelect";
import { DataType } from "./DataConfig";
import { finalApproveEdit, flowApproveInfo } from "../../../api/ailuo/approve";
import ModeSelectTable from "../ModeSelectTable";

const CustomModalRoot = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	.header {
		width: 100%;
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
		width: 75%;
		height: calc(100% - 100px);
		overflow: overlay;
	}

	.footer {
		display: flex;
		align-items: flex-end;
		margin-bottom: 16px;
		flex: 1;
		justify-content: space-between;
	}
`;

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
		title: "执行机构型号",
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
	{
		title: "交期",
		dataIndex: "quotationEnd",
		key: "quotationEnd",
		type: NumFieldType.DateTime,
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
		dataIndex: "relationReview",
		key: "relationReview",
		// type: NumFieldType.RelationTechView,
		type: NumFieldType.SingleText,
	},
	{
		title: "关联报价",
		dataIndex: "relationSale",
		key: "relationSale",
		// type: NumFieldType.RelationSaleView,
		type: NumFieldType.SingleText,
	},
];

const UpdateWorkshop: React.FC<any> = (props: any) => {
	const { editFlowItemRecord, step, modalType } = props;
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const location = useLocation();
	const history = useHistory();

	const allUser = useAppSelector(selectAllUser);
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isManager = useAppSelector(selectIsManager);
	const isFinance = useAppSelector(selectIsFinance);
	const { curProject, setIsShowApproveModal3, freshData } = useContext(
		PreProductionContext,
	) as any;

	const setAllDisabled = (disabled: boolean) => {
		// disabled = isManager ? false : disabled;
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

	const getDataSource = async () => {
		const res = await splProjectList({
			id: curProject.id,
			pageNum: 1,
			pageSize: 10,
		});
		setDataSource(
			JSON.parse(_.get(res, "data.record[0].mechanismForm") || "[]"),
		);
	};

	useEffect(() => {
		getDataSource();
	}, []);

	useEffect(() => {
		if (_.isEmpty(curProject)) {
			return;
		}
		if (location.pathname.includes("addfromcontract")) {
			console.log("router from addfromcontract");
			const {
				id, // 合同id
				name,
				company,
				phone,
				salesManager,
				uuid, // 合同编号
				contractTime,
				typeSelection,
				mechanismForm,
				quotationEnd,
				relateTechProcess,
				relationSale,
				relationReview,
				otherFile,
			} = curProject;
			setForm((v: any) => {
				return {
					...v,
					name,
					company,
					phone,
					salesManager,
					uuid, // 合同编号
					contractTime,
					typeSelection,
					mechanismForm,
					quotationEnd,
					otherFile,
					relationContract: id, // 合同id
					relationReview: relationSale, //关联技术评审
					relationSale: relationReview, //关联报价
				};
			});
		} else if (location.pathname.includes("add")) {
			setForm({});
		} else if (!_.isEmpty(curProject)) {
			const temp = curProject;
			if (typeof temp.typeSelection === "string") {
				try {
					// 处理初步选型型号
					temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
				} catch (error) {
					temp.typeSelection = [];
				}
			}
			setForm(temp);
		}
		if (curProject.status === SPLProductStatusMap.ChangeReview) {
			setAllDisabled(true);
		} else {
			setAllDisabled(false);
		}
	}, [curProject]);

	// 初始化form数据
	useEffect(() => {
		if (!open) {
			setForm({});
			return;
		}
		if (modalType === "edit" && editFlowItemRecord) {
			const { key, ...temp } = editFlowItemRecord;
			try {
				// 处理执行机构型号
				temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
			} catch (error) {
				temp.typeSelection = [];
			}

			setForm(temp);
			inputForm.setFieldsValue(temp);
		}
		if (modalType === "add") {
			setForm((v: any) => {
				return {
					...v,
				};
			});
		}
	}, [open]);

	// 控制 只读和编辑
	useEffect(() => {
		if (_.isEmpty(showDstColumns)) {
			return;
		}
	}, [form.status, open]);
	// 终审情况

	// 新增记录
	const createRecord = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();
			if (!form.name) {
				message.warning("请填写名称");
				return;
			}
			// 创建
			form.status = SPLProductStatusMap.ProReviewing;
			if (form.typeSelection) {
				form.typeSelection = JSON.stringify(form.typeSelection);
			}
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
			if (!form.name) {
				message.warning("请填写名称");
				return;
			}
			try {
				// form.status = SPLProductStatusMap.ProReviewing;
				if (form.typeSelection) {
					form.typeSelection = JSON.stringify(form.typeSelection);
				}
				delete params.updateTime;
				delete params.createTime;
				await splPreProjectEdit({
					...form,
					mechanismForm: JSON.stringify(dataSource),
					identiFication: 1,
				});
				await freshData();
			} catch (error) {
				console.log(error);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveRecord = () => {
		inputForm.setFieldsValue(form);

		const id = form.id;
		if (!id) {
			createRecord();
		} else {
			updateRecord();
		}
		setIsShowApproveModal3(true);
	};

	const ApproveConfirm: (p: {
		setApproveModal: any;
		curProject: any;
		freshData: any;
		user: any;
		accessList: any;
	}) => ReactNode = ({
		setApproveModal,
		curProject,
		freshData,
		user,
		accessList,
	}) => {
		const clickHandle = async () => {
			setApproveModal(false);

			const { id } = user;
			const item = _.find(accessList, { relationUserId: id });
			if (!item) {
				return;
			}
			const approveId = item.id;
			try {
				await finalApproveEdit({
					projectSaleId: curProject.id,
					status: "approve", // 通过
					audittype: SPLProductStatusMap.ChangeReview,
				});
				//  获取项目信息
				const res1 = await splProjectList({
					id: curProject.id,
					pageNum: 1,
					pageSize: 10,
				});
				const project = _.get(res1, "data.record[0]");
				if (!project) {
					return;
				}
				freshData();
				// if (project.status === "materials") {
				// 	freshData(); // 刷新项目信息
				// 	return;
				// }
			} catch (error) {
				console.log(error);
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

	const RejectConfirm: (p: any) => any = ({
		setRejectModal,
		curProject,
		freshData,
	}) => {
		const [rejectReason, setRejectReason] = useState("");
		const rejectHandle = async () => {
			setRejectModal(false);

			try {
				console.log("驳回", curProject);
				await finalApproveEdit({
					projectSaleId: curProject.id,
					status: "reject", // 驳回
					remark: rejectReason,
					audittype: SPLProductStatusMap.ChangeReview,
				});
				await freshData();
			} catch (error) {
				console.log(error);
			} finally {
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
						onChange={(e: any) => setRejectReason(e.target.value)}
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

	const renderFooter = () => {
		const [approveModal, setApproveModal] = useState(false);
		const [rejectModal, setRejectModal] = useState(false);
		const [accessList, setAccessList] = useState<any[]>([]);

		const getAclList = async () => {
			try {
				let params: any = {
					pageNum: 1,
					pageSize: 10,
					projectSaleId: curProject.id,
					audittype: "materials_rev",
				};
				const res = await flowApproveInfo(params);
				setAccessList(_.get(res, "data.record") || []);
			} catch (error) {
				console.log(error);
			}
		};

		const handleCancel = async () => {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.Ended,
			});
			await freshData();
		};

		useEffect(() => {
			getAclList();
		}, []);

		if (curProject.status === SPLProductStatusMap.ProChange) {
			return (
				<>
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary" onClick={handleCancel}>
							取消变更
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button className="ml-8" type="primary" onClick={handleSaveRecord}>
							提交审核
						</Button>
					</ConfigProvider>
				</>
			);
		}
		if (curProject.status === SPLProductStatusMap.ChangeReview) {
			return (
				<>
					<ConfigProvider theme={redButtonTheme}>
						<Popover
							open={rejectModal}
							onOpenChange={(newOpen: boolean) => {
								setRejectModal(newOpen);
							}}
							content={() => {
								return RejectConfirm({
									setRejectModal,
									curProject,
									freshData,
								});
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
								驳回变更
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
								return ApproveConfirm({
									setApproveModal,
									curProject,
									freshData,
									user,
									accessList,
								});
							}}
							trigger="click"
						>
							<Button
								className="ml-8"
								type="primary"
								onClick={() => {
									setApproveModal(true);
								}}
							>
								通过变更并提交车间
							</Button>
						</Popover>
					</ConfigProvider>
				</>
			);
		}
	};
	return (
		<CustomModalRoot>
			{step == 0 && (
				<div className="header mt-4">
					<div className="title ">{"新建项目"}</div>
				</div>
			)}
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
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect
					key={"ModelTable" + props.key}
					{...{
						dataSource,
						setDataSource,
						step: curProject.status,
						rootStyle: { width: "75%" },
					}}
				/>
			</ConfigProvider>
			<div className="footer">{renderFooter()}</div>
		</CustomModalRoot>
	);
};

export default UpdateWorkshop;
