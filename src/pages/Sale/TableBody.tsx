import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import { SaleStatus } from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";
import TurnView from "./TurnView";

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
		title: "项目名称",
		width: 200,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.name}</span>
					<TurnView turnTime={record.turnTime} />
				</div>
			);
		},
	},
	{
		title: "状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			const { status } = record;
			let item = _.find(SaleStatus, { value: status });
			if (!item) {
				item = SaleStatus[0];
			}
			return (
				<Tag color={item.color} style={{ color: "#000" }}>
					{item.label}
				</Tag>
			);
		},
	},
	{
		title: "单位名称",
		dataIndex: "company",
		key: "company",
		type: "company",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					{record.company || ""}
				</Tag>
			);
		},
	},
	{
		title: "销售经理",
		dataIndex: "salesManager",
		key: "salesManager",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#F3F7FF"} style={{ color: "#000" }}>
					{record.salesManager || ""}
				</Tag>
			);
		},
	},
	{
		title: "报价开始日期",
		dataIndex: "quotationBegin",
		key: "quotationBegin",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.quotationBegin
				? dayjs(record.quotationBegin).format("YYYY-MM-DD")
				: "";
			return <div>{format}</div>;
		},
	},
	{
		title: "产品规格书",
		dataIndex: "specificationDetail",
		key: "specificationDetail",
		type: NumFieldType.Attachment,
	},
	{
		title: "阀门参数",
		dataIndex: "valveDetail",
		key: "valveDetail",
		type: NumFieldType.Attachment,
	},
	{
		title: "初步选型型号",
		dataIndex: "typeSelection",
		key: "typeSelection",
		render: (text: string, record: any) => {
			const { typeSelection } = record;
			let len = 0;
			try {
				len = JSON.parse(typeSelection).length;
			} catch (error) { }
			return (
				<Tag color={"#E8F2FF"} style={{ color: "#2D88FD" }}>
					{`共${len}个型号`}
				</Tag>
			);
		},
	},
	{
		title: "交期",
		dataIndex: "quotationEnd",
		key: "quotationEnd",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.quotationEnd
				? dayjs(record.quotationEnd).format("YYYY-MM-DD")
				: "";
			return <div>{format}</div>;
		},
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
