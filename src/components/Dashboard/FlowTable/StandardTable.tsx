import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TableColumnRender from "../TableColumnRender";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import EditFilled from "../../../assets/icons/EditFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import type { TableColumnItem } from "../../../store/workflowSlice";
import type { DeveloperUser } from "../../../store/globalSlice";
import type { FlowItemTableDataType } from "./index";

const StandardTableRoot = styled.div<{ open: boolean }>`
	position: absolute;
	opacity: ${({ open }) => (open ? 0 : 1)};
	width: ${({ open }) => (open ? 0 : "100%")};
	height: ${({ open }) => (open ? 0 : "100%")};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface StandardTableActionProps {
	text: string;
	record: FlowItemTableDataType;
	setOpen: (v: boolean) => void;
	deleteFlowItem: (recordId: string) => void;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	reader?: boolean;
	writer?: boolean;
	manager?: boolean;
	children?: React.ReactNode;
}

const StandardTableAction: React.FC<StandardTableActionProps> = ({ text, record, reader, writer, manager, setOpen, deleteFlowItem, setEditFlowItemRecord }) => {
	const handleDeleteRecord = async (text: string, record: FlowItemTableDataType) => {
		Modal.confirm({
			title: "是否确认删除?",
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

	const handleEditRecord = async (text: string, record: FlowItemTableDataType) => {
		setEditFlowItemRecord(record);
		setOpen(true);
	};

	return (
		<Space>
			<Button
				type="text"
				icon={<EditFilled style={{ fontSize: "12px", color: `${!manager && !writer ? "#d9d9d9" : "#707683"}` }} />}
				disabled={!manager && !writer}
				onClick={() => handleEditRecord(text, record)}
			/>
			<Button
				type="text"
				icon={<DeleteFilled style={{ fontSize: "12px", color: `${!manager ? "#d9d9d9" : "#707683"}` }} />}
				disabled={!manager}
				onClick={() => handleDeleteRecord(text, record)}
			/>
		</Space>
	);
};

interface StandardTableProps {
	setOpen: (v: boolean) => void;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (recordId: string) => void;
	columns: TableColumnItem[];
	datasource: any;
	users: DeveloperUser[];
	isArchiveView: boolean;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
	reader?: boolean;
	writer?: boolean;
	manager?: boolean;
	children?: React.ReactNode;
}

const StandardTable: React.FC<StandardTableProps> = ({ columns, datasource, reader, writer, manager, users, isArchiveView, setSelectedRows, ...rest }) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<FlowItemTableDataType>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const getTableColumns = () => {
		const tColumns: any = [
			...columns.map((item: TableColumnItem, cIndex: number) => {
				const params = { column: item, cIndex, reader, writer, manager, users, view: "standard" };
				return {
					...item,
					ellipsis: true,
					onCell: (record: any, rIndex: number) => ({ rIndex, record, ...params })
				};
			}),
			{
				title: "操作",
				dataIndex: "actions",
				render: (text: string, record: FlowItemTableDataType) => (
					<StandardTableAction reader={reader} writer={writer} manager={manager} text={text} record={record} {...rest} />
				)
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

	useEffect(() => {
		setSelectedRowKeys([]);
	}, [datasource.length]);

	const rowSelection: TableRowSelection<FlowItemTableDataType> = {
		hideSelectAll: true,
		type: "checkbox",
		selectedRowKeys,
		preserveSelectedRowKeys: false,
		onChange: (selectedRowKeys: React.Key[], selectedRows: FlowItemTableDataType[]) => {
			setSelectedRows(selectedRows);
			setSelectedRowKeys(selectedRowKeys);
		},
		getCheckboxProps: (record: FlowItemTableDataType) => ({
			disabled: record.name === "Disabled User",
			name: record.name
		})
	};

	return (
		<StandardTableRoot open={isArchiveView}>
			<Table
				size="small"
				pagination={false}
				components={{
					body: {
						cell: TableColumnRender
					}
				}}
				rowSelection={rowSelection}
				columns={tableColumns}
				dataSource={datasource}
				scroll={{ x: true, y: `calc(100vh - 170px)` }}
			/>
		</StandardTableRoot>
	);
};

export default StandardTable;
