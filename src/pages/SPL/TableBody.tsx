import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { AddRecordModal, EditRecordModal } from "./RecordModal";
import { Button, Popover, Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import { PlusOutlined } from "@ant-design/icons";

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

const TableBody: React.FC<FlowTableProps> = ({
	editFlowItemRecord,
	...rest
}) => {
	const columns: any = [
		{
			title: "标准件名称",
			dataIndex: "name",
			key: "name",
			width: 200,
			isTree: true,
			render: (text: string, record: any) => {
				return (
					<div className="inline-block">
						<div
							className="flex justify-between pr-2"
							style={{ width: "160px" }}
						>
							<span className="truncate flex-1 w-0" title={record.name}>
								{record.name}
							</span>
							{!record.parent && (
								<Popover
									overlayInnerStyle={{ padding: 0 }}
									content={() => {
										return (
											<div className="p-1">
												<Button
													type="link"
													onClick={() => {
														rest.setEditFlowItemRecord(record);
														setIsShowAddModal(true);
													}}
												>
													新建子级资料
												</Button>
											</div>
										);
									}}
								>
									<PlusOutlined
										style={{ color: "#707683", fontSize: "12px" }}
									/>
								</Popover>
							)}
						</div>
					</div>
				);
			},
		},
		{
			title: "配料单",
			dataIndex: "ingredientsList",
			key: "ingredientsList",
			type: NumFieldType.Attachment,
		},
		{
			title: "BOM",
			dataIndex: "bom",
			key: "bom",
			type: NumFieldType.Attachment,
		},

		{
			title: "加工图纸包",
			dataIndex: "processPkg",
			key: "processPkg",
			type: NumFieldType.Attachment,
		},
		{
			title: "装配图纸包",
			dataIndex: "fitOutPkg",
			key: "fitOutPkg",
			type: NumFieldType.Attachment,
		},
		{
			title: "作业指导书",
			dataIndex: "operationInstruction",
			key: "operationInstruction",
			type: NumFieldType.Attachment,
		},
	];

	const { tableDataSource } = rest;
	const [dstColumns] = useState<any>(columns);
	const [open, setOpen] = useState<boolean>(false);
	const [isShowAddModal, setIsShowAddModal] = useState(false);
	return (
		<FlowTableRoot>
			<StandardTable
				datasource={tableDataSource}
				columns={dstColumns}
				setOpen={setOpen}
				{...rest}
			/>
			<EditRecordModal
				key={"edit-modal"}
				open={open}
				setOpen={setOpen}
				editFlowItemRecord={editFlowItemRecord}
			/>
			<AddRecordModal
				key={"child-add-modal"}
				open={isShowAddModal}
				setOpen={setIsShowAddModal}
				editFlowItemRecord={editFlowItemRecord}
			></AddRecordModal>
		</FlowTableRoot>
	);
};

export default TableBody;
