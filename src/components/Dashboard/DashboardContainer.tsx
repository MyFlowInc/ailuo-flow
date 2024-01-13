import { useParams } from "react-router";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { FlowItemTableDataType } from "./FlowTable/core";
import FlowTable from "./FlowTable";
import { freshCurMetaData, freshCurTableRows, selectCurFlowDstId, selectCurTableRows } from "../../store/workflowSlice";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delay } from "../../util/delay";
import { deleteDSCells } from "../../api/apitable/ds-record";
import { setIsArchiveView } from "../../store/globalSlice";
import Header from "./Header";
import EmptyList from "./EmptyList";

interface ContainerProps {
	reader: boolean;
	writer: boolean;
	manager: boolean;
	children?: React.ReactNode;
}

const DashboardRoot = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	overflow: auto;
`;

const DashboardContainer: React.FC<ContainerProps> = ({ reader, writer, manager }) => {
	const curDstId = useAppSelector(selectCurFlowDstId);
	const tableData = useAppSelector(selectCurTableRows);

	const [editFlowItemRecord, setEditFlowItemRecord] = useState<FlowItemTableDataType | undefined>(undefined);
	const [selectedRows, setSelectedRows] = useState<FlowItemTableDataType[]>([]);

	const { dstId } = useParams<{ dstId: string }>();
	const [loading, setLoading] = useState(true);

	const dispatch = useAppDispatch();

	const deleteFlowItemHandler = async (recordId: string) => {
		const params = {
			dstId,
			recordIds: [recordId]
		};
		await deleteDSCells(params);
		dispatch(freshCurTableRows(dstId!));
	};

	const freshFlowItem = async () => {
		setLoading(true);
		await delay();
		setLoading(false);
	};

	const initTable = async (dstId: string) => {
		dispatch(freshCurMetaData(dstId)).then(() => {
			dispatch(freshCurTableRows(dstId));
		});
	};

	// init table data
	const fetchDatas = async (dstId: string) => {
		await initTable(dstId);
		setSelectedRows([]);
		dispatch(setIsArchiveView(false));
		setLoading(false);
	};

	useEffect(() => {
		dstId && fetchDatas(dstId);
	}, [dstId]);

	// 无数据状态
	if (!curDstId) return <EmptyList type="list-data" rootStyle={{ height: "100%" }} />;

	if (tableData.length === 0) {
		return (
			<DashboardRoot>
				<Header selectedRows={selectedRows} dstId={dstId} freshFlowItem={freshFlowItem} setSelectedRows={setSelectedRows} />
				<EmptyList type="table-data" rootStyle={{ marginTop: "110px" }} />
			</DashboardRoot>
		);
	}

	return (
		<DashboardRoot>
			<Header selectedRows={selectedRows} dstId={dstId} freshFlowItem={freshFlowItem} setSelectedRows={setSelectedRows} />
			{loading && <BaseLoading />}
			{/* 表格主体 */}
			<FlowTable
				dstId={dstId}
				reader={reader}
				writer={writer}
				manager={manager}
				freshFlowItem={freshFlowItem}
				editFlowItemRecord={editFlowItemRecord}
				deleteFlowItem={deleteFlowItemHandler}
				setEditFlowItemRecord={setEditFlowItemRecord}
				setSelectedRows={setSelectedRows}
			/>
		</DashboardRoot>
	);
};

export default DashboardContainer;
