import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import {
	PurchaseTypeMap,
	PurchaseTypeMapDict,
	SaleStatus,
} from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";

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
		title: "节点名称",
		width: 200,
		dataIndex: "nodeName",
		key: "nodeName",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.nodeName}</span>
				</div>
			);
		},
	},
	{
		title: "检验项名称",
		dataIndex: "name",
		key: "name",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.name}</span>
				</div>
			);
		},
	},
	{
		title: "发起请检时间",
		dataIndex: "createTime",
		key: "createTime",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.createTime
				? dayjs(record.createTime).format("YYYY年M月D日 HH:mm")
				: "";
			return <div>{format}</div>;
		},
	},
	{
		title: "请检类型",
		dataIndex: "type",
		key: "type",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.type}</span>
				</div>
			);
		},
	},
	{
		title: "检验结果",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.status}</span>
				</div>
			);
		},
	},
	{
		title: "完成请检时间",
		dataIndex: "updateTime",
		key: "updateTime",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.updateTime
				? dayjs(record.updateTime).format("YYYY年M月D日 HH:mm")
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
		</FlowTableRoot>
	);
};

export default TableBody;
