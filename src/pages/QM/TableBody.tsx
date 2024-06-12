import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import { QualityMapDict } from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";

import rightPng from "./assets/RIGHT.png";
import wrongPng from "./assets/WRONG.png";
import { EditRecordModal } from "./RecordModal";

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
			const res = _.get(QualityMapDict, record.type) || record.type;
			return (
				<div>
					<span>{res}</span>
				</div>
			);
		},
	},
	{
		title: "检验结果",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			if (record.status === "tobe_tested") {
				return (
					<div>
						<span>{"待检验"}</span>
					</div>
				);
			}
			if (record.status === "reject") {
				return (
					<div>
						<img src={wrongPng} alt="" />
					</div>
				);
			}
			if (record.status === "approve") {
				return (
					<div>
						<img src={rightPng} alt="" />
					</div>
				);
			}
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

	const [modalType, setModalType] = useState<"add" | "edit" | "view">("view");
	return (
		<FlowTableRoot>
			<StandardTable
				datasource={tableDataSource}
				columns={dstColumns}
				setOpen={setOpen}
				setModalType={setModalType}
				{...rest}
			/>
			<EditRecordModal
				modalType={modalType}
				open={open}
				setOpen={setOpen}
				editFlowItemRecord={editFlowItemRecord}
			/>
		</FlowTableRoot>
	);
};

export default TableBody;
