import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import {
	PurchaseStatusEnum,
	PurchaseTypeMap,
	PurchaseTypeMapDict,
	SaleStatus,
} from "../../api/ailuo/dict";
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
		title: "请购类型",
		width: 200,
		dataIndex: "type",
		key: "type",
		render: (text: string, record: any) => {
			const typeList = record.type?.split(",") || [];
			return (
				<div>
					{typeList.map((item: PurchaseTypeMap, index: number) => {
						return (
							<Tag color="#f4f7fe" style={{ color: "#000" }} key={index}>
								{PurchaseTypeMapDict[item] || ""}
							</Tag>
						);
					})}
				</div>
			);
		},
	},
	{
		title: "状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			if (record.status === PurchaseStatusEnum.NotStart) {
				return (
					<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
						{"未启动"}
					</Tag>
				);
			} else if (record.status === PurchaseStatusEnum.Start) {
				return (
					<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
						{"采购项添加中"}
					</Tag>
				);
			} else if (record.status === PurchaseStatusEnum.InProcurement) {
				return (
					<Tag color={"#FFEEE3"} style={{ color: "#000" }}>
						{"采购中"}
					</Tag>
				);
			} else if (record.status === PurchaseStatusEnum.Over) {
				return (
					<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
						{"测试通过"}
					</Tag>
				);
			}
		},
	},
	{
		title: "关联项目名称",
		dataIndex: "projectName",
		key: "projectName",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					{record.projectName || ""}
				</Tag>
			);
		},
	},
	{
		title: "请购人",
		dataIndex: "requestor",
		key: "requestor",
		render: (text: string, record: any) => {
			return <div>{record.requestor}</div>;
		},
	},
	{
		title: "创建时间",
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
		title: "预计交期",
		dataIndex: "expectedDeliverytime",
		key: "expectedDeliverytime",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			const format = record.expectedDeliverytime
				? dayjs(record.expectedDeliverytime).format("YYYY年M月D日")
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
