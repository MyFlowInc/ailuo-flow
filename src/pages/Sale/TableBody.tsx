import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { TableColumnsType } from "antd";

const FlowTableRoot = styled.div`
	position: relative;
	width: 100%;
`;

export interface FlowItemTableDataType {
	key: string;
	flowItemId: number;
	statusId: string;
	[propName: string]: any;
}

interface FlowTableProps {
	tableDataSource: any[];
	freshFlowItem: () => void;
	editFlowItemRecord: FlowItemTableDataType | undefined;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (recordId: string) => void;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
}
interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
}
const columns: TableColumnsType<DataType> = [
	{
		title: "项目名称",
		width: 200,
		dataIndex: "name",
		key: "name",
		fixed: "left"
	},
	{ title: "状态", dataIndex: "status", key: "status" },
	{ title: "单位名称", dataIndex: "company", key: "company" },
	{ title: "销售经理", dataIndex: "salesManager", key: "salesManager" },
	{ title: "报价开始日期", dataIndex: "quotationBegin", key: "quotationBegin" },
	{ title: "产品规格书", dataIndex: "specificationDetail", key: "specificationDetail" },
	{ title: "阀门参数", dataIndex: "valveDetail", key: "valveDetail" },
	{ title: "初步选型型号", dataIndex: "typeSelection", key: "typeSelection" },
	{ title: "交期", dataIndex: "quotationEnd", key: "quotationEnd" }
];
const TableBody: React.FC<FlowTableProps> = ({ editFlowItemRecord, freshFlowItem, ...rest }) => {
	const { tableDataSource } = rest;
	const [dstColumns, setDstColumns] = useState<any>(columns);

	const [open, setOpen] = useState<boolean>(false);

	return (
		<FlowTableRoot>
			<StandardTable datasource={tableDataSource} columns={dstColumns} setOpen={setOpen} {...rest} />
			<EditRecordModal open={open} setOpen={setOpen} editFlowItemRecord={editFlowItemRecord} freshFlowItem={freshFlowItem} />
		</FlowTableRoot>
	);
};

export default TableBody;
