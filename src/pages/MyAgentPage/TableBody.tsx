import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import _ from "lodash";
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
	fetchAgentList: () => void; // 获取技术反馈列表
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
		},
	},
	{
		title: "创建时间",
		dataIndex: "createTime",
		width: 200,
		key: "createTime",
		render: (text: string, record: any) => {
			return <span>{record.createTime}</span>;
		},
	},
	{
		title: "节点名称",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			if (record.status === 'pro_reviewing') {
				return <span className="status-start">立项审核中</span>;
			} else if (record.status === 'materials_rev') {
				return <span className="status-start">生产资料审核中</span>;
			} else if (record.status === 'change_review') {
				return <span className="status-start">预生产变更审核中</span>;
			}
			else {
				return null;
			}
		},
	}
];
const TableBody: React.FC<FlowTableProps> = ({
	editFlowItemRecord,
	...rest
}) => {
	const { tableDataSource, fetchAgentList } = rest;
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
				fetchAgentList={fetchAgentList}
				open={open}
				setOpen={setOpen}
				editFlowItemRecord={editFlowItemRecord}
			/>
		</FlowTableRoot>
	);
};

export default TableBody;
