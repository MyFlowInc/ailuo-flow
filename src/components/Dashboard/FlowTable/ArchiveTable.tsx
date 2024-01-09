import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../../store/hooks";
import { freshCurTableRows } from "../../../store/workflowSlice";
import { cancelArchiveRecord } from "../../../api/apitable/ds-record";
import TableColumnRender from "../TableColumnRender";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import CancelFilled from "../../../assets/icons/CancelFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableColumnItem } from "../../../store/workflowSlice";
import type { DeveloperUser } from "../../../store/globalSlice";
import type { FlowItemTableDataType } from "./index";

const ArchiveTableRoot = styled.div<{ open: boolean }>`
	position: absolute;
	opacity: ${({ open }) => (open ? 1 : 0)};
	width: ${({ open }) => (open ? "100%" : 0)};
	height: ${({ open }) => (open ? "100%" : 0)};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface ArchiveTableActionProps {
	text: string;
	record: FlowItemTableDataType;
	dstId: string;
	deleteFlowItem: (recordId: string) => void;
	children?: React.ReactNode;
}

const ArchiveTableAction: React.FC<ArchiveTableActionProps> = ({ text, record, dstId, deleteFlowItem }) => {
	const dispatch = useAppDispatch();

	const handleDeleteRecord = async (text: string, record: FlowItemTableDataType) => {
		Modal.confirm({
			title: "是否确认删除已归档工单?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				deleteFlowItem(record.recordId);
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	const handleCancelArchive = async (text: string, record: FlowItemTableDataType) => {
		Modal.confirm({
			title: "是否取消归档?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				await cancelArchiveRecord({ id: record.id });
				dispatch(freshCurTableRows(dstId));
			},
			onCancel: () => {
				console.log("Cancel");
			}
		});
	};

	return (
		<Space>
			<Button type="text" icon={<CancelFilled style={{ fontSize: "12px", color: "#707683" }} />} onClick={() => handleCancelArchive(text, record)} />
			<Button type="text" icon={<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />} onClick={() => handleDeleteRecord(text, record)} />
		</Space>
	);
};

interface ArchiveTableProps {
	dstId: string;
	deleteFlowItem: (recordId: string) => void;
	columns: TableColumnItem[];
	datasource: any;
	users: DeveloperUser[];
	isArchiveView: boolean;
	changeSelected?: (v: boolean) => void;
	reader?: boolean;
	writer?: boolean;
	manager?: boolean;
	children?: React.ReactNode;
}

const ArchiveTable: React.FC<ArchiveTableProps> = ({ columns, datasource, reader, writer, manager, users, isArchiveView, changeSelected, ...rest }) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<FlowItemTableDataType>>([]);

	const getTableColumns = () => {
		const tColumns = [
			...columns.map((item: TableColumnItem, cIndex: number) => {
				const params = { column: item, cIndex, reader, writer, manager, users, view: "archive" };
				return {
					...item,
					ellipsis: true,
					onCell: (record: any, rIndex: number) => ({ rIndex, record, ...params })
				};
			}),
			{
				title: "操作",
				dataIndex: "actions",
				render: (text: string, record: FlowItemTableDataType) => <ArchiveTableAction text={text} record={record} {...rest} />
			}
		];

		tColumns.forEach((item: any, index: number) => {
			switch (index) {
				case 0:
					item.fixed = "left";
					return;
				case tColumns.length - 1:
					item.width = 80;
					item.fixed = "right";
					item.align = "center";
					return;
				default:
					item.width = 200;
			}
		});

		setTableColumns(tColumns as any);
	};

	useEffect(() => {
		getTableColumns();
	}, [columns, reader, writer, manager, users]);

	return (
		<ArchiveTableRoot open={isArchiveView}>
			<Table
				size="small"
				pagination={false}
				components={{
					body: {
						cell: TableColumnRender
					}
				}}
				columns={tableColumns}
				dataSource={datasource}
				scroll={{ x: true, y: `calc(100vh - 170px)` }}
			/>
		</ArchiveTableRoot>
	);
};

export default ArchiveTable;
