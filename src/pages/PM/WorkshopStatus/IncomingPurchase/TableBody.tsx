import React, { useState } from "react";
import styled from "styled-components";
import {
	PurchaseStatusEnum,
	PurchaseTypeMap,
	PurchaseTypeMapDict,
} from "../../../../api/ailuo/dict";
import { Tag } from "antd";
import { NumFieldType } from "../../../../components/Dashboard/TableColumnRender";
import dayjs from "dayjs";
import StandardTable from "./StandardTable";

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
		dataIndex: "requisitionType",
		key: "requisitionType",
		render: (text: string, record: any) => {
			// const typeList = record.requisitionType?.split(",") || [];
			return (
				<Tag color="#f4f7fe" style={{ color: "#000" }} key={""}>
					{PurchaseTypeMapDict[record.requisitionType as PurchaseTypeMap] || ""}
				</Tag>
			);
		},
	},
	{
		title: "审核状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			if (record.status === PurchaseStatusEnum.NotStart) {
				return (
					<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
						{"未启动"}
					</Tag>
				);
			} else if (
				record.status === PurchaseStatusEnum.Start ||
				record.status === PurchaseStatusEnum.Erp_Start
			) {
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
			} else if (
				record.status === PurchaseStatusEnum.Over ||
				record.status === PurchaseStatusEnum.Erp_Over
			) {
				return (
					<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
						{"审核通过"}
					</Tag>
				);
			} else if (record.status === PurchaseStatusEnum.Received) {
				return (
					<Tag color={"#E8FFEA"} style={{ color: "#000" }}>
						{"已入库"}
					</Tag>
				);
			}
		},
	},
	{
		title: "开启状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
					{record.open === 0 ? "开启中" : "已关闭"}
				</Tag>
			);
		},
	},
	{
		title: "请购编号",
		dataIndex: "requisitionCode",
		key: "requisitionCode",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					{record.requisitionCode || ""}
				</Tag>
			);
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
		dataIndex: "createrName",
		key: "createrName",
		render: (text: string, record: any) => {
			return <div>{record.createrName}</div>;
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
	// {
	// 	title: "预计交期",
	// 	dataIndex: "expectedDeliverytime",
	// 	key: "expectedDeliverytime",
	// 	type: NumFieldType.DateTime,
	// 	render: (text: string, record: any) => {
	// 		const format = record.expectedDeliverytime
	// 			? dayjs(record.expectedDeliverytime).format("YYYY年M月D日")
	// 			: "";
	// 		return <div>{format}</div>;
	// 	},
	// },
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
