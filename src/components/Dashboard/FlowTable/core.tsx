import React, { useEffect, useState } from "react";
import { Modal, Table, Space, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAppSelector } from "../../../store/hooks";
import { selectCurTableColumn, selectCurTableRows, selectMembers, TableColumnItem } from "../../../store/workflowSlice";
import { ColumnsType } from "antd/es/table";
import TableColumnRender from "../TableColumnRender";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import EditFilled from "../../../assets/icons/EditFilled";

import type { TableRowSelection } from "antd/es/table/interface";

export interface FlowItemTableDataType {
	key: string;
	flowItemId: number;
	statusId: string;
	[propName: string]: any;
}

interface FlowTableProps {
	className?: string;
	showMode?: "list" | "status";
	title?: string;
	dstId: string;
	statusId?: string;
	statusFieldId?: string;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (recordId: string) => void;
	modalType: string;
	setModalType?: (v: string) => void;
	setOpen?: (v: boolean) => void;
	changeSelected: (v: boolean) => void;
	reader: boolean;
	writer: boolean;
	manager: boolean;
}

export const FlowTable: React.FC<Partial<FlowTableProps>> = props => {
	const { className, deleteFlowItem, setModalType, setOpen, setEditFlowItemRecord, statusId, statusFieldId, reader, writer, manager, changeSelected } = props;

	const { confirm } = Modal;
	const tableData = useAppSelector(selectCurTableRows);
	const dstColumns = useAppSelector(selectCurTableColumn);
	const userList = useAppSelector(selectMembers);

	const [tableColumn, setTableColumn] = useState<ColumnsType<FlowItemTableDataType>>([]);

	const delHandle = async (text: string, record: FlowItemTableDataType) => {
		console.log("delHandle", record);
		confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				console.log(222, record);
				// TODO change name
				deleteFlowItem?.(record.recordId);
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};
	const editHandle = async (text: string, record: FlowItemTableDataType) => {
		console.log("editHandle", record);
		setEditFlowItemRecord?.(record);
		setModalType?.("edit");
		setOpen?.(true);
	};

	useEffect(() => {
		const temp = dstColumns
			.filter(item => {
				return item.type !== 26;
			})
			.map((item: TableColumnItem, cIndex: number) => {
				return {
					...item,
					ellipsis: true,
					onCell: (record: any, rIndex: number) => ({
						rIndex,
						cIndex,
						record,
						column: item,
						reader,
						writer,
						manager,
						userList
					})
				};
			});
		const columns = [
			...temp,
			{
				title: "操作",
				dataIndex: "actions",
				render: (text: string, record: FlowItemTableDataType) => (
					<Space>
						<Button
							type="text"
							icon={<EditFilled style={{ fontSize: "12px", color: "#707683" }} />}
							onClick={() => {
								editHandle(text, record);
							}}
						/>
						<Button
							type="text"
							icon={<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />}
							onClick={() => {
								delHandle(text, record);
							}}
						/>
					</Space>
				)
			}
		];
		columns.forEach((item: any, index: number) => {
			switch (index) {
				case 0:
					item.fixed = "left";
					return;
				case columns.length - 1:
					item.width = 80;
					item.fixed = "right";
					item.align = "center";
					return;
				default:
					item.width = 200;
			}
		});
		setTableColumn(columns as any);
	}, [dstColumns, reader, writer, manager, userList]);

	const filterTableData = (records: any[]) => {
		if (!statusId) {
			return records;
		}
		if (!statusFieldId) {
			return [];
		}
		return records.filter(item => {
			return item[statusFieldId] === statusId;
		});
	};

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection: TableRowSelection<FlowItemTableDataType> = {
		hideSelectAll: true,
		type: "checkbox",
		onChange: (selectedRowKeys: React.Key[], selectedRows: FlowItemTableDataType[]) => {
			changeSelected?.(selectedRows.length > 0);

			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
		},
		getCheckboxProps: (record: FlowItemTableDataType) => ({
			disabled: record.name === "Disabled User", // Column configuration not to be checked
			name: record.name
		})
	};

	return (
		<Table
			size="small"
			components={{
				body: {
					cell: TableColumnRender
				}
			}}
			// rowSelection={tableData.length > 0 ? { ...rowSelection } : undefined}
			rowSelection={rowSelection}
			pagination={false}
			columns={tableColumn}
			scroll={{ x: true, y: `calc(100vh - 170px)` }}
			dataSource={filterTableData(tableData)}
		/>

		// </FlowTableContainer>
	);
};

export default FlowTable;
