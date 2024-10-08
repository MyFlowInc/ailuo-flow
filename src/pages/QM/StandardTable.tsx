import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Table, Space, Button, Modal, Pagination, message } from "antd";
import {
	ExclamationCircleFilled,
	EyeFilled,
	EyeOutlined,
} from "@ant-design/icons";
import DeleteFilled from "../../assets/icons/DeleteFilled";

import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import EditFilled from "../../assets/icons/EditFilled";
import TableColumnRender from "../../components/Dashboard/TableColumnRender";
import _ from "lodash";
import { QualityControlContext } from "./QualityControl";
import {
	selectIsFinance,
	selectIsPurchase,
	selectIsWorkshop,
} from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import { useHistory } from "react-router";
import { PurchaseItemStatusEnum, QualityMapDict } from "../../api/ailuo/dict";

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
	setModalType: (v: "view" | "edit" | "add") => void;
	deleteFlowItem: (id: number) => void;
	setEditFlowItemRecord: (v: any) => void;

	children?: React.ReactNode;
}

const StandardTableAction: React.FC<StandardTableActionProps> = ({
	text,
	record,
	setOpen,
	setModalType,
	setEditFlowItemRecord,
}) => {
	const isPurchase = useAppSelector(selectIsPurchase);
	const isWorkshop = useAppSelector(selectIsWorkshop);
	const history = useHistory();

	const handleViewRecord = async (text: string, record: any) => {
		if (record.type === "incoming") {
			setEditFlowItemRecord(record);
			setModalType("view");
			setOpen(true);
		} else {
			history.push(
				`/dashboard/work-shop-manage/${record.relatedRequisition}/${record.relatedItem}/${record.type}`,
			);
		}
	};

	const handleEditRecord = async (text: string, record: any) => {
		if (isWorkshop) {
			message.warning("车间人员无法编辑!");
			return;
		}
		if (record.status !== PurchaseItemStatusEnum.TobeTested) {
			// @ts-ignore
			message.warning(`该${QualityMapDict[record.type]}已被检验`);
			return;
		}
		setModalType("edit");
		setEditFlowItemRecord(record);
		setOpen(true);
	};

	return (
		<Space>
			<Button
				type="text"
				icon={
					<EditFilled
						style={{
							fontSize: "12px",
							color: `${isPurchase ? "#d9d9d9" : "#707683"}`,
						}}
					/>
				}
				disabled={isPurchase}
				onClick={() => handleEditRecord(text, record)}
			/>
			<Button
				type="text"
				icon={
					<EyeFilled
						style={{
							fontSize: "12px",
						}}
					/>
				}
				onClick={() => handleViewRecord(text, record)}
			/>
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
	setModalType: (v: "view" | "edit" | "add") => void;
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
	setSelectedRows,
	curPage,
	...rest
}) => {
	const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const { fetchPurchaseList } = useContext(QualityControlContext);
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
	}, [columns]);

	useEffect(() => {
		setSelectedRowKeys([]);
	}, [datasource.length]);

	const pageNumChange = (page: number, pageSize: number) => {
		curPage.current.pageNum = page;
		setTimeout(() => {
			fetchPurchaseList();
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
				rowSelection={isFinance ? undefined : rowSelection}
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
