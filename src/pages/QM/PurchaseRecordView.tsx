import React, { useEffect, useState } from "react";
import { Form, Tag, Tooltip, message } from "antd";
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
	purRequisition,
	savePurRequisition,
	updatePurRequisition,
} from "../../api/ailuo/pms";
import { PurchaseStatusEnum, PurchaseTypeMap } from "../../api/ailuo/dict";
import _ from "lodash";
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
		dataIndex: "projectName",
		key: "projectName",
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
					{value ? (
						value
					) : (
						<span className="text-gray-400">系统自动生成</span>
					)}
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
					disabled={true}
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
					disabled={true}
				/>
			);
		},
	},
];

interface PurchaseRecordViewProps {
	record: any;
	open: boolean;
}

const PurchaseRecordView: React.FC<PurchaseRecordViewProps> = ({ record,open }) => {
	const params = {
		purId: _.get(record, "relatedRequisition"),
	};
	const history = useHistory();
	const [inputForm] = Form.useForm();

	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [form, setForm] = useState<any>({});
	const [disabled, setDisabled] = useState(false);

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

	const fetchData = async () => {
		setForm({});
		inputForm.resetFields();
		if (record.relatedRequisition) {
			const res = await purRequisition({ id: record.relatedRequisition });
			let temp = res.data.record[0];
			temp = {
				...temp,
				type: temp.type?.split(",") || [],
			};
			console.log(temp);
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
			return {
				...item,
				disabled,
			};
		});
		setShowDstColumns(newCol);
	};

	useEffect(() => {
		if (form.status === PurchaseStatusEnum.InProcurement) {
			setAllDisabled(true);
			setDisabled(true);
		} else {
			setAllDisabled(false);
			setDisabled(false);
		}
	}, [form.status]);

	useEffect(() => {
		fetchData();
	}, [record]);

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
		<div className="w-full">
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
	);
};

export default PurchaseRecordView;
