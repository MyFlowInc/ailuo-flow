import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ConfigProvider, Form, Button } from "antd";
import { NoFieldData } from "./NoFieldData";
import CellEditorContext from "./CellEditorContext";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import ApproveButton from "../../../BaseUI/Button/Approve";
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
	formItem?: any | undefined;
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
		title: "序号",
		dataIndex: "number",
		key: "number",
		type: NumFieldType.Number,
	},
	{
		title: "物料名称",
		dataIndex: "name",
		key: "name",
		type: NumFieldType.SingleText,
	},
	{
		title: "规格",
		dataIndex: "specifications",
		key: "specifications",
		type: NumFieldType.SingleText,
	},
	{
		title: "材质/品牌",
		dataIndex: "brand",
		key: "brand",
		type: NumFieldType.SingleText,
	},
	{
		title: "单位",
		dataIndex: "unit",
		key: "unit",
		type: NumFieldType.SingleText,
	},
	{
		title: "采购数量",
		dataIndex: "quantity",
		key: "quantity",
		type: NumFieldType.Number,
	},
	{
		title: "订单/使用部门",
		dataIndex: "order",
		key: "order",
		type: NumFieldType.SingleText,
	},
	{
		title: "用途",
		dataIndex: "purpose",
		key: "purpose",
		type: NumFieldType.SingleText,
	},
	{
		title: "备注",
		dataIndex: "remarks",
		key: "remarks",
		type: NumFieldType.SingleText,
	},
	{
		title: "来料检",
		dataIndex: "来料检",
		key: "来料检",
		type: NumFieldType.SingleText,
		renderContent: (value: any, form: any, setForm: any) => {
			return (
				<div>
					<ConfigProvider theme={greyButtonTheme}>
						<Button type="primary">请检</Button>
					</ConfigProvider>
				</div>
			);
		},
	},
	{
		title: "入库",
		dataIndex: "入库",
		key: "入库",
		renderContent: (value: any, form: any, setForm: any) => {
			return (
				<div>
					<ApproveButton />
				</div>
			);
		},
	},
	{
		title: "来料检完成时间",
		dataIndex: "incomingCompletiontime",
		key: "incomingCompletiontime",
		renderContent: (value: any, form: any, setForm: any) => {
			return <div></div>;
		},
	},
	{
		title: "入库完成时间",
		dataIndex: "warehousingCompletiontime",
		key: "warehousingCompletiontime",
		renderContent: (value: any, form: any, setForm: any) => {
			return <div></div>;
		},
	},
];

const CustomModalContext = React.createContext({});

const CustomModal: React.FC<CustomModalProps> = ({
	title,
	modalType,
	open,
	setOpen,
	formItem,
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	// 初始化form数据
	useEffect(() => {
		if (!open) {
			setForm({});
			inputForm.resetFields();
			return;
		}
	}, [open]);

	return (
		<CustomModalRoot>
			<div className="header">
				<div className="title">{title}</div>
				<div>
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							type="primary"
							className="mr-4"
							onClick={() => setOpen(false)}
						>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button type="primary">保存</Button>
					</ConfigProvider>
				</div>
			</div>
			<div className="content">
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
		</CustomModalRoot>
	);
};

export default CustomModal;
