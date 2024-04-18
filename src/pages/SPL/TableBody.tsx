import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import { SaleStatus } from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";
import { PlusCircleFilled } from "@ant-design/icons";

const FlowTableRoot = styled.div`
	width: 100%;
	height: calc(100% - 52px);
	overflow: hidden;
`;

export interface FlowItemTableDataType {
	key: string;
	flowItemId: number;
	statusId: string;
	[propName: string]: any;
}
interface FlowTableProps {
	tableDataSource: any[]; // 数据源

	curPage: React.MutableRefObject<{
		pageNum: number;
		pageSize: number;
		total: number;
	}>;
	editFlowItemRecord: FlowItemTableDataType | undefined;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (id: number) => void;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
}

const columns: any = [
	{
		title: "标准件名称",
		dataIndex: "name",
		key: "name",
		type: "name",
		width: 200,
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.name}</span>
					<PlusCircleFilled style={{ color: "#707683", fontSize: "12px" }} />
				</div>
			);
		},
	},
	{
		title: "配料单",
		dataIndex: "ingredientsList",
		key: "ingredientsList",
		type: NumFieldType.Attachment,
	},
	{
		title: "BOM",
		dataIndex: "bom",
		key: "bom",
		type: NumFieldType.Attachment,
	},

	{
		title: "加工图纸包",
		dataIndex: "specificationDetail",
		key: "specificationDetail",
		type: NumFieldType.Attachment,
	},
	{
		title: "装配图纸包",
		dataIndex: "processPkg",
		key: "processPkg",
		type: NumFieldType.Attachment,
	},
	{
		title: "作业指导书",
		dataIndex: "operationInstruction",
		key: "operationInstruction",
		type: NumFieldType.Attachment,
	},
];
const TableBody: React.FC<FlowTableProps> = ({
	editFlowItemRecord,
	...rest
}) => {
	const { tableDataSource } = rest;
	const [dstColumns] = useState<any>(columns);
	const [open, setOpen] = useState<boolean>(false);
	return (
		<FlowTableRoot>
			<StandardTable
				datasource={tableDataSource}
				columns={dstColumns}
				setOpen={setOpen}
				{...rest}
			/>
			<EditRecordModal
				open={open}
				setOpen={setOpen}
				editFlowItemRecord={editFlowItemRecord}
			/>
		</FlowTableRoot>
	);
};

export default TableBody;
