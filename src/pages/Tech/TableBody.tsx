import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import { FlowStatus } from "../../api/ailuo/dict";
import _ from "lodash";

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
	tableDataSource: any[]; // 数据源
	fetchTechFeedbackList: () => void; // 获取技术反馈列表
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
			return <span>{record.name}</span>;
		}
	},
	{
		title: "状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			const { status } = record;
			let item = _.find(FlowStatus, { value: status });
			if (!item) {
				item = FlowStatus[0];
			}
			return (
				<Tag color={item.color} style={{ color: "#000" }}>
					{item.label}
				</Tag>
			);
		}
	},
	{
		title: "分析结果",
		dataIndex: "result",
		key: "result",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					{record.company || ""}
				</Tag>
			);
		}
	},
	{ title: "选型分析", dataIndex: "status", key: "status", type: "sale_status" },
	{ title: "生产分析", dataIndex: "status", key: "status", type: "sale_status" },
	{ title: "附件", dataIndex: "status", key: "status", type: "sale_status" }
];
const TableBody: React.FC<FlowTableProps> = ({ editFlowItemRecord, ...rest }) => {
	const { tableDataSource, fetchTechFeedbackList } = rest;
	const [dstColumns] = useState<any>(columns);
	const [open, setOpen] = useState<boolean>(false);
	return (
		<FlowTableRoot>
			<StandardTable datasource={tableDataSource} columns={dstColumns} setOpen={setOpen} {...rest} />
			<EditRecordModal fetchTechFeedbackList={fetchTechFeedbackList} open={open} setOpen={setOpen} editFlowItemRecord={editFlowItemRecord} />
		</FlowTableRoot>
	);
};

export default TableBody;
