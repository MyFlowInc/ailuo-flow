import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal, Pagination } from "antd";
import { ExclamationCircleFilled, PlusCircleTwoTone } from "@ant-design/icons";
import DeleteFilled from "../../assets/icons/DeleteFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import EditFilled from "../../assets/icons/EditFilled";
import TableColumnRender from "../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import { SplDatabaseContext } from "./SplDatabase";
import { selectIsFinance } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import ArrowRightSvg from "./assets/arrow-right.svg";
import ArrowDownSvg from "./assets/arrow-down.svg";
import { FlowItemTableDataType } from "./TableBody";
import { SplDatabaseImportTypeEnum } from "../../enums/commonEnum";

const StandardTableRoot = styled.div`
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
	setImportFlowItemRecord?: (v: FlowItemTableDataType) => void;
	isImport?: boolean;
	importType?: SplDatabaseImportTypeEnum;
	children?: React.ReactNode;
}

const StandardTableAction: React.FC<StandardTableActionProps> = ({
	text,
	record,
	setOpen,
	deleteFlowItem,
	setEditFlowItemRecord,
	isImport,
	importType,
	setImportFlowItemRecord,
}) => {
	const isFinance = useAppSelector(selectIsFinance);

	const handleDeleteRecord = async (text: string, record: any) => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				deleteFlowItem(record.id);
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	};

	const handleEditRecord = async (text: string, record: any) => {
		setEditFlowItemRecord(record);
		setOpen(true);
	};

	return (
		<Space>
			{!isImport ? (
				<>
					<Button
						type="text"
						icon={
							<EditFilled
								style={{
									fontSize: "12px",
									color: `${!true ? "#d9d9d9" : "#707683"}`,
								}}
							/>
						}
						onClick={() => handleEditRecord(text, record)}
					/>
					<Button
						type="text"
						icon={
							<DeleteFilled
								style={{
									fontSize: "12px",
									color: `${isFinance ? "#d9d9d9" : "#707683"}`,
								}}
							/>
						}
						disabled={isFinance}
						onClick={() => handleDeleteRecord(text, record)}
					/>
				</>
			) : (
				!record.children?.length && (
					<Button
						type="text"
						className="text-blue-500"
						onClick={() => {
							setImportFlowItemRecord?.(record);
						}}
					>
						导入
					</Button>
				)
			)}
		</Space>
	);
};

interface StandardTableProps {
	tableDataSource: any[];

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
	importType?: SplDatabaseImportTypeEnum;
	children?: React.ReactNode;
}

const StandardTable: React.FC<StandardTableProps> = ({
	columns,
	datasource,
	setSelectedRows,
	curPage,
	...rest
}) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const { fetchList } = useContext(SplDatabaseContext);
	const isFinance = useAppSelector(selectIsFinance);

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
				hidden: rest.importType == SplDatabaseImportTypeEnum.多型号导入,
				render: (text: string, record: any) => (
					<StandardTableAction text={text} record={record} {...rest} />
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
	}, [columns, rest.importType]);

	useEffect(() => {
		setSelectedRowKeys([]);
	}, [datasource.length]);

	const pageNumChange = (page: number, pageSize: number) => {
		curPage.current.pageNum = page;
		setTimeout(() => {
			fetchList();
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
				rowSelection={
					isFinance ||
					rest.importType == SplDatabaseImportTypeEnum.单字段导入 ||
					rest.importType == SplDatabaseImportTypeEnum.同型号导入
						? undefined
						: rowSelection
				}
				columns={tableColumns}
				dataSource={datasource}
				scroll={{ x: true, y: `calc(100vh - 240px)` }}
				expandable={{
					expandIcon: ({ expanded, onExpand, record }) =>
						expanded ? (
							<img
								className="cursor-pointer mr-2 pb-[2px]"
								src={ArrowDownSvg}
								onClick={(e) => onExpand(record, e)}
							/>
						) : record.children?.length ? (
							<img
								className="cursor-pointer mr-2 pb-[2px]"
								src={ArrowRightSvg}
								onClick={(e) => onExpand(record, e)}
							/>
						) : (
							<span className="mr-3"></span>
						),
				}}
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
