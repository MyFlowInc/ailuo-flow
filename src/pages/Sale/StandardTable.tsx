import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import DeleteFilled from "../../assets/icons/DeleteFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import EditFilled from "../../assets/icons/EditFilled";
import TableColumnRender from "../../components/Dashboard/TableColumnRender";

const StandardTableRoot = styled.div`
	position: absolute;
	opacity: 1;
	width: "100%";
	height: "100%";
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface StandardTableActionProps {
	text: string;
	record: any;
	setOpen: (v: boolean) => void;
	deleteFlowItem: (recordId: string) => void;
	setEditFlowItemRecord: (v: any) => void;
	reader?: boolean;
	writer?: boolean;
	manager?: boolean;
	children?: React.ReactNode;
}

const StandardTableAction: React.FC<StandardTableActionProps> = ({ text, record, reader, writer, manager, setOpen, deleteFlowItem, setEditFlowItemRecord }) => {
	const handleDeleteRecord = async (text: string, record: any) => {
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

	const handleEditRecord = async (text: string, record: any) => {
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
	tableDataSource: any[];
	setOpen: (v: boolean) => void;
	setEditFlowItemRecord: (v: any) => void;
	deleteFlowItem: (recordId: string) => void;
	columns: any[];
	datasource: any[];
	setSelectedRows: (v: any[]) => void;
	children?: React.ReactNode;
}

const StandardTable: React.FC<StandardTableProps> = ({ columns, datasource, setSelectedRows, ...rest }) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const getTableColumns = () => {
		const tColumns: any = [
			...columns.map((item: any, cIndex: number) => {
				const params = { column: item, cIndex, view: "standard" };
				return {
					...item,
					ellipsis: true,
					onCell: (record: any, rIndex: number) => ({ rIndex, record, ...params })
				};
			}),
			{
				title: "操作",
				dataIndex: "actions",
				render: (text: string, record: any) => <StandardTableAction reader={true} writer={true} manager={true} text={text} record={record} {...rest} />
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
	}, [columns]);

	useEffect(() => {
		setSelectedRowKeys([]);
	}, [datasource.length]);

	const rowSelection: TableRowSelection<any> = {
		hideSelectAll: true,
		type: "checkbox",
		selectedRowKeys,
		preserveSelectedRowKeys: false,
		onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
			setSelectedRows(selectedRows);
			setSelectedRowKeys(selectedRowKeys);
		},
		getCheckboxProps: (record: any) => ({
			disabled: record.name === "Disabled User",
			name: record.name
		})
	};
	return (
		<StandardTableRoot>
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
				dataSource={[datasource[0]]}
				scroll={{ x: true, y: `calc(100vh - 170px)` }}
			/>
		</StandardTableRoot>
	);
};

export default StandardTable;
