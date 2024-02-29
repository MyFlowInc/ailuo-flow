import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import { ContractStatusList } from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";
import TurnView from "../Sale/TurnView";

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
			let item = _.find(ContractStatusList, { value: status });
			if (!item) {
				item = ContractStatusList[0];
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
		title: "合同编号",
		width: 200,
		dataIndex: "uuid",
		key: "uuid",
		render: (text: string, record: any) => {
			return <span>{record.name}</span>;
		},
	},
	{
		title: "合同日期",
		dataIndex: "contractTime",
		key: "contractTime",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.quotationBegin
				? dayjs(record.quotationBegin).format("YYYY-MM-DD")
				: "";
			return <div>{format}</div>;
		},
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
			} catch (error) {}
			return (
				<Tag color={"#E8F2FF"} style={{ color: "#2D88FD" }}>
					{`共${len}个型号`}
				</Tag>
			);
		},
	},
	{
		title: "总数量",
		width: 200,
		dataIndex: "totalNum",
		key: "totalNum",
		render: (text: string, record: any) => {
			const { typeSelection } = record;
			let num = 0;
			try {
				const list = JSON.parse(typeSelection);
				list.forEach((item: any) => {
					num += +item.num;
				});
			} catch (error) {}
			return <span>{num}</span>;
		},
	},
	{
		title: "总价",
		width: 200,
		dataIndex: "totalPrice",
		key: "totalPrice",
		render: (text: string, record: any) => {
			let totalPrice = 0;
			try {
				const list = JSON.parse(record.typeSelection);
				list.forEach((item: any) => {
					// totalPrice += +item.price;
					totalPrice += +item.num * +item.price;
				});
			} catch (error) {}
			const { currency } = record;
			let sign = "";
			if (currency === "人民币") {
				sign = "¥";
			}
			if (currency === "美元") {
				sign = "$";
			}
			if (currency === "欧元") {
				sign = "€";
			}
			return <span>{`${sign} ${totalPrice}`}</span>;
		},
	},
	{
		title: "合同附件",
		dataIndex: "otherFile",
		key: "otherFile",
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
