import { ConfigProvider, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import ModeSelectTable from "../ModeSelectTable";
import CellEditorContext from "./CellEditorContext";
import { NoFieldData } from "./NoFieldData";
import { TableTheme } from "../../../theme/theme";
import SPLModeSelect from "./SPLModeSelect";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";

interface DataType {
	key: React.Key;
	name: string;
	serialNumber: string;
	ingredientsList: string;
	bom: string;
	processPkg: string;
	fitOutPkg: string;
	operationInstruction: string;
}

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
		dataIndex: "relationFileData",
		key: "relationFileData",
		type: NumFieldType.SingleText,
	},
	{
		title: "合同日期",
		dataIndex: "quotationBegin",
		key: "quotationBegin",
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
		dataIndex: "specificationDetail",
		key: "specificationDetail",
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

interface WorkShopFullDataModalProps {
	open: boolean;
	setOpen: (b: boolean) => void;
}

const WorkShopFullDataModal: React.FC<WorkShopFullDataModalProps> = ({
	open,
	setOpen,
}) => {
	const [showDstColumns, setShowDstColumns] = useState(columns);
	const [inputForm] = Form.useForm();
	const [form, setForm] = useState<any>({});
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	return (
		<Modal
			title="完整资料包"
			width={"90%"}
			open={open}
			onCancel={() => setOpen(false)}
			footer={null}
		>
			<div className="h-[500px] overflow-y-auto">
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
							modalType={"edit"}
						/>
					) : (
						<NoFieldData />
					)}
				</Form>
			</div>
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect
					key={"WorkShopFullDataModal"}
					{...{
						dataSource,
						setDataSource,
						step: SPLProductStatusMap.ChangeReview,
						rootStyle: { width: "100%" },
					}}
				/>
			</ConfigProvider>
		</Modal>
	);
};

export default WorkShopFullDataModal;
