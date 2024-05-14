import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal, Pagination } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import DeleteFilled from "../../assets/icons/DeleteFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import EditFilled from "../../assets/icons/EditFilled";
import TableColumnRender from "../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import { Link } from "react-router-dom";

const StandardTableRoot = styled.div`
	position: absolute;
	opacity: 1;
	width: 100%;
	height: 100%;
	overflow: hidden;
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface StandardTableActionProps {
	text: string;
	record: any;
	setOpen: (v: boolean) => void;
	deleteFlowItem: (id: number) => void;
	setEditFlowItemRecord: (v: any) => void;
	reader?: boolean;
	writer?: boolean;
	manager?: boolean;
	children?: React.ReactNode;
}

const StandardTableAction: React.FC<StandardTableActionProps> = ({
	text,
	record,
	reader,
	writer,
	manager,
	setEditFlowItemRecord,
}) => {
	const handleDeleteRecord = async (text: string, record: any) => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onCancel() {
				console.log("Cancel");
			},
		});
	};

	return (
		<Space>
			<Link to={`/dashboard/pre-product-manage/${record.projectSaleId}`}>查看</Link>
			{/* <Link to={`/dashboard/pre-product-manage/${record.projectSaleId}`}>查看</Link> */}

		</Space >
	);
};

interface StandardTableProps {
	tableDataSource: any[];
	fetchAgentList: () => void; // 获取技术反馈列表
	curPage: React.MutableRefObject<{
		pageNum: number;
		pageSize: number;
		total: number;
	}>;
	setOpen: (v: boolean) => void;
	setEditFlowItemRecord: (v: any) => void;
	deleteFlowItem: (id: number) => void;
	columns: any[];
	datasource: any[];
	setSelectedRows: (v: any[]) => void;
	children?: React.ReactNode;
}

const StandardTable: React.FC<StandardTableProps> = ({
	columns,
	datasource,
	fetchAgentList,
	setSelectedRows,
	curPage,
	...rest
}) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const getTableColumns = () => {
		const tColumns: any = [
			...columns.map((item: any, cIndex: number) => {
				const params = { column: item, cIndex, view: "standard" };
				const res = {
					...item,
					ellipsis: true,
					onCell: (record: any, rIndex: number) => ({
						rIndex,
						record,
						...params,
					}),
				};
				if (item.render) {
					res.render = item.render;
				}
				return res;
			}),
			{
				title: "操作",
				dataIndex: "actions",
				render: (text: string, record: any) => (
					<StandardTableAction
						reader={true}
						writer={true}
						manager={true}
						text={text}
						record={record}
						{...rest}
					/>
				),
			},
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

	const pageNumChange = (page: number, pageSize: number) => {
		curPage.current.pageNum = page;
		setTimeout(() => {
			fetchAgentList();
		});
	};

	const rowSelection: TableRowSelection<any> = {
		hideSelectAll: true,
		type: "checkbox",
		selectedRowKeys,
		preserveSelectedRowKeys: false,
		onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
			setSelectedRows(selectedRows);
			setSelectedRowKeys(selectedRowKeys);
		},
		getCheckboxProps: (record: any = {}) => ({
			disabled: record.name === "Disabled User",
			name: record.name,
		}),
	};
	// if (_.isEmpty(datasource)) return <></>;
	return (
		<StandardTableRoot>
			<Table
				size="small"
				pagination={false}
				components={{
					body: {
						cell: TableColumnRender,
					},
				}}
				rowSelection={rowSelection}
				columns={tableColumns}
				dataSource={datasource}
				scroll={{ x: true, y: `calc(100vh - 240px)` }}
			/>
			<div className="flex items-center justify-end mt-4">
				<Pagination
					current={curPage.current.pageNum}
					total={curPage.current.total}
					pageSize={curPage.current.pageSize}
					showTotal={(total) => `共 ${total} 条`}
					onChange={pageNumChange}
				/>
			</div>
		</StandardTableRoot>
	);
};

export default StandardTable;
