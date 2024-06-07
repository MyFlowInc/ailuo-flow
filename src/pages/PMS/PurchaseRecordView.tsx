import React, { useState } from "react";
import CartSvg from "./assets/cart.svg";
import { Button, ConfigProvider, Form, Tag, Tooltip } from "antd";
import {
	LeftOutlined,
	WarningFilled,
	WarningOutlined,
} from "@ant-design/icons";
import { greyButtonTheme } from "../../theme/theme";
import { useHistory } from "react-router";
import CellEditorContext from "./FormModal/CellEditorContext";
import { NoFieldData } from "./FormModal/NoFieldData";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import PurchaseRequistionTable from "./PurchaseRequistionTable";
import PurchaseMilestone from "./PurchaseMilestone";

const columns = [
	{
		title: "请购类型",
		dataIndex: "type",
		key: "type",
		type: NumFieldType.MultiFixSelect,
		dictCode: "procurement",
	},
	{
		title: "关联项目名称",
		dataIndex: "relationProject",
		key: "relationProject",
		type: NumFieldType.SingleFixSelect,
		dictCode: "procurement",
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
		title: "申请日期",
		dataIndex: "createTime",
		key: "createTime",
		type: NumFieldType.DateTime,
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
	},
	{
		title: "来料检完成时间",
		dataIndex: "checkCompletiontime",
		key: "checkCompletiontime",
		type: NumFieldType.DateTime,
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
			return <PurchaseRequistionTable key={"pur-requisition" + key} />;
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
			return <PurchaseMilestone key={"pur-milestone" + key} />;
		},
	},
];

interface PurchaseRecordViewProps {}

const PurchaseRecordView: React.FC<PurchaseRecordViewProps> = () => {
	const history = useHistory();
	const [inputForm] = Form.useForm();
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [form, setForm] = useState<any>({});

	const StatusView = () => {
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
						onClick={() => {}}
					>
						{"添加采购项"}
					</Tag>
				</div>
			</div>
		);
	};

	return (
    <div>
			<div className="flex items-center">
				<img src={CartSvg} alt="" />
				<div className="font-bold text-lg ml-3">请购管理</div>
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						className="ml-4"
						type="primary"
						icon={<LeftOutlined />}
						onClick={() => history.goBack()}
					>
						返回
					</Button>
				</ConfigProvider>
			</div>
			<div className="pl-3 mt-4">
				<div className="text-lg">新建请购单</div>
				{StatusView()}
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
						/>
					) : (
						<NoFieldData />
					)}
				</Form>
			</div>
		</div>
	);
};

export default PurchaseRecordView;
