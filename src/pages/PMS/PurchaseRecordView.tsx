import React, { useEffect, useState } from "react";
import CartSvg from "./assets/cart.svg";
import {
	Affix,
	Button,
	ConfigProvider,
	Form,
	Select,
	Tag,
	Tooltip,
	message,
} from "antd";
import {
	LeftOutlined,
	WarningFilled,
	WarningOutlined,
} from "@ant-design/icons";
import { blueButtonTheme, greyButtonTheme } from "../../theme/theme";
import { useHistory, useParams } from "react-router";
import CellEditorContext from "./FormModal/CellEditorContext";
import { NoFieldData } from "./FormModal/NoFieldData";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import PurchaseItemTable from "./PurchaseItemTable";
import PurchaseMilestone from "./PurchaseMilestone";
import {
	getRelationProject,
	purRequisition,
	savePurRequisition,
	updatePurRequisition,
} from "../../api/ailuo/pms";
import {
	PurchaseStatusEnum,
	PurchaseTypeMap,
	PurchaseTypeMapDict,
} from "../../api/ailuo/dict";
import { useAppSelector } from "../../store/hooks";
import { selectIsQuality, selectUser } from "../../store/globalSlice";

export const PurchaseRecordViewContext = React.createContext<any>({});

const columns = [
	{
		title: "请购类型",
		dataIndex: "type",
		key: "type",
		type: NumFieldType.MultiSelectForLabel,
		dictCode: "procurement",
		rules: [{ required: true, message: "请选择请购类型" }],
	},
	{
		title: "关联项目名称",
		dataIndex: "relationProject",
		key: "relationProject",
		type: NumFieldType.RelationProject,
		renderTitle: () => {
			return (
				<div>
					<span className="mr-1">关联项目名称</span>
					<Tooltip title="若没有关联项目，请勿填写此项，以免影响项目管理">
						<WarningFilled style={{ color: "#FF0000" }} />
					</Tooltip>
				</div>
			);
		},
	},
	{
		title: "请购人",
		dataIndex: "requestor",
		key: "requestor",
		type: NumFieldType.SingleText,
		defaultDisabled: true,
	},
	{
		title: "申请日期",
		dataIndex: "applicationDate",
		key: "applicationDate",
		type: NumFieldType.DateTime,
	},
	{
		title: "创建日期",
		dataIndex: "createTime",
		key: "createTime",
		renderContent: (value: any, form: any, setForm: any) => {
			return (
				<div>
					{value ? (
						value
					) : (
						<span className="text-gray-400">根据新建时间自动生成</span>
					)}
				</div>
			);
		},
	},
	{
		title: "规格",
		dataIndex: "specifications",
		key: "specifications",
		type: NumFieldType.Attachment,
	},
	{
		title: "编号",
		dataIndex: "code",
		key: "code",
		type: NumFieldType.SingleText,
		rules: [{ required: true, message: "请输入编号" }],
	},
	{
		title: "来料检完成时间",
		dataIndex: "checkCompletiontime",
		key: "checkCompletiontime",
		renderContent: (value: any, form: any, setForm: any) => {
			return (
				<div>
					{value ? value : <span className="text-gray-400">系统自动生成</span>}
				</div>
			);
		},
	},
	{
		title: "预计交期",
		dataIndex: "expectedDeliverytime",
		key: "expectedDeliverytime",
		type: NumFieldType.DateTime,
	},
	{
		title: "采购清单",
		dataIndex: "采购清单",
		key: "采购清单",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			return (
				<PurchaseItemTable
					key={"pur-requisition" + key}
					form={form}
					setForm={setForm}
					disabled={column.disabled}
				/>
			);
		},
	},
	{
		title: "重要事件",
		dataIndex: "milestone",
		key: "milestone",
		render: (
			column: any,
			key: string,
			form: any,
			setForm: (value: any) => void,
		) => {
			return (
				<PurchaseMilestone
					key={"pur-milestone" + key}
					form={form}
					setForm={setForm}
				/>
			);
		},
	},
];

interface PurchaseRecordViewProps {}

const PurchaseRecordView: React.FC<PurchaseRecordViewProps> = () => {
	const history = useHistory();
	const params = useParams() as any;
	const user = useAppSelector(selectUser);
	const isQuality = useAppSelector(selectIsQuality);

	const [inputForm] = Form.useForm();

	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [form, setForm] = useState<any>({});
	const [disabled, setDisabled] = useState(false);
	const [updateMilestoneCount, setUpdateMilestoneCount] = useState(0);

	const addUpdateMilestoneCount = () => {
		setUpdateMilestoneCount(updateMilestoneCount + 1);
	};

	const saveValidate = () => {
		if (!form.type) {
			message.warning("请选择请购类型!");
			return false;
		}
		if (!form.code) {
			message.warning("请输入编号!");
			return false;
		}
		if (form.type.includes(PurchaseTypeMap.Order) && !form.relationProject) {
			message.warning("请选择关联项目名称!");
			return false;
		}
		return true;
	};

	const handleSave = async () => {
		inputForm.setFieldsValue(form);
		try {
			await inputForm.validateFields();

			if (!saveValidate()) {
				return;
			}
			let res: any = {};

			if (params.purId == "new") {
				res = await savePurRequisition({
					...form,
					type: form.type.join(","),
				});
			} else {
				res = await updatePurRequisition({
					...form,
					type: form.type.join(","),
				});
			}

			console.log(res);
			if (res.code == 200) {
				message.success("保存成功!");
				history.push("/dashboard/pms/pur-manage");
			} else {
				message.error(res.msg);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const fetchData = async () => {
		setForm({ requestor: user.username });
		inputForm.resetFields();
		if (params.purId !== "new") {
			const res = await purRequisition({ id: params.purId });
			let temp = res.data.record[0];
			temp = {
				...temp,
				type: temp.type?.split(",") || [],
			};
			setForm(temp);
			inputForm.setFieldsValue(temp);
		}
	};

	const handlePurchaseStart = async () => {
		const res = await updatePurRequisition({
			status: PurchaseStatusEnum.InProcurement,
			id: params.purId,
		});
		if (res.code == 200) {
			await fetchData();
		}
	};

	const setAllDisabled = (disabled: boolean) => {
		const newCol = showDstColumns.map((item: any) => {
			if (item.defaultDisabled) {
				return {
					...item,
					disabled: true,
				};
			}
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
	};

	useEffect(() => {
		if (form.status != PurchaseStatusEnum.Start && form.status) {
			setAllDisabled(true);
			setDisabled(true);
		} else {
			setAllDisabled(false);
			setDisabled(false);
		}

		if (isQuality) {
			setAllDisabled(true);
			setDisabled(true);
		}
	}, [form.status]);

	useEffect(() => {
		fetchData();
	}, [params.purId]);

	const StatusView = () => {
		if (form.status === PurchaseStatusEnum.Start) {
			return (
				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<div className="mr-2 text-[#848484]">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"采购项添加中"}
						</Tag>
					</div>
					<div className="flex  items-center ml-4">
						<div className="mr-2 text-[#848484]">操作: </div>
						<Tag
							className="cursor-pointer"
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={handlePurchaseStart}
						>
							{"开始采购"}
						</Tag>
					</div>
				</div>
			);
		} else if (form.status === PurchaseStatusEnum.InProcurement) {
			return (
				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<div className="mr-2 text-[#848484]">状态: </div>
						<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
							{"采购中"}
						</Tag>
					</div>
				</div>
			);
		} else if (form.status === PurchaseStatusEnum.Over) {
			return (
				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<div className="mr-2 text-[#848484]">状态: </div>
						<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
							{"测试通过"}
						</Tag>
					</div>
				</div>
			);
		} else if (form.status === PurchaseStatusEnum.Received) {
			return (
				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<div className="mr-2 text-[#848484]">状态: </div>
						<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
							{"已入库"}
						</Tag>
					</div>
				</div>
			);
		} else {
			return (
				<div className="flex items-center mt-2">
					<div className="flex items-center">
						<div className="mr-2 text-[#848484]">状态: </div>
						<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
							{"未启动"}
						</Tag>
					</div>
					<div className="flex  items-center ml-4">
						<div className="mr-2 text-[#848484]">操作: </div>
						<Tag
							className="cursor-pointer"
							color={"#D4F3F2"}
							style={{ color: "#000" }}
							onClick={async () => {
								try {
									if (saveValidate()) {
										const params = {
											...form,
											type: form.type.join(","),
										};
										const res = await savePurRequisition(params);
										if (res.code == 200) {
											history.push(`/dashboard/pms/pur-manage/${res.data}`);
										} else {
											message.error(res.msg);
										}
									}
								} catch (error) {}
							}}
						>
							{"添加采购项"}
						</Tag>
					</div>
				</div>
			);
		}
	};

	return (
		<PurchaseRecordViewContext.Provider
			value={{
				fetchPurchaseRecordViewData: fetchData,
				addUpdateMilestoneCount,
				updateMilestoneCount,
			}}
		>
			<div className="w-full">
				<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
					<div className="flex items-center mb-2">
						<img src={CartSvg} alt="" />
						<div className="font-bold text-lg ml-3">请购管理</div>
						<ConfigProvider theme={greyButtonTheme}>
							<Button
								className="ml-4"
								type="primary"
								icon={<LeftOutlined />}
								onClick={() => history.push("/dashboard/pms/pur-manage")}
							>
								返回
							</Button>
						</ConfigProvider>
					</div>
					<div className="flex items-center justify-between pl-3">
						<div>
							<div className="text-lg">
								{params.purId === "new" ? "新建请购单" : "编辑请购单"}
							</div>
							{StatusView()}
						</div>
						<div>
							<ConfigProvider theme={greyButtonTheme}>
								<Button
									type="primary"
									onClick={() => history.push("/dashboard/pms/pur-manage")}
								>
									取消
								</Button>
							</ConfigProvider>
							<ConfigProvider theme={blueButtonTheme}>
								<Button type="primary" className="ml-4" onClick={handleSave}>
									保存
								</Button>
							</ConfigProvider>
						</div>
					</div>
				</div>
				<div className="pl-3 mt-4 pt-14">
					<Form
						form={inputForm}
						colon={false}
						wrapperCol={{ flex: 1 }}
						preserve={false}
					>
						{showDstColumns.length > 0 ? (
							<CellEditorContext
								form={form}
								setForm={setForm}
								dstColumns={showDstColumns}
							/>
						) : (
							<NoFieldData />
						)}
					</Form>
				</div>
			</div>
		</PurchaseRecordViewContext.Provider>
	);
};

export default PurchaseRecordView;
