import { useParams } from "react-router";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import FlowTableCore, { FlowItemTableDataType } from "./FlowTable/core";
import FlowTable from "./FlowTable";
import {
	freshCurMetaData,
	freshCurTableRows,
	selectCurFlowDstId,
	selectCurShowMode,
	selectCurStatusFieldId,
	selectCurTableRows,
	selectCurTableStatusList
} from "../../store/workflowSlice";
import { NoStatusData } from "./NoStatus";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { delay } from "../../util/delay";
import { deleteDSCells } from "../../api/apitable/ds-record";
import { setIsArchiveView, setIsStatusSettingModalOpen } from "../../store/globalSlice";
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
	.gpt-icon {
		position: absolute;
		bottom: 0px;
		right: 0px;
	}
`;

const DashboardContainer: React.FC<ContainerProps> = ({ reader, writer, manager }) => {
	const curShowMode = useAppSelector(selectCurShowMode);
	const statusList = useAppSelector(selectCurTableStatusList) || [];

	const curDstId = useAppSelector(selectCurFlowDstId);
	const curStatusFieldId = useAppSelector(selectCurStatusFieldId) || "";
	const tableData = useAppSelector(selectCurTableRows);

	const [editFlowItemRecord, setEditFlowItemRecord] = useState<FlowItemTableDataType | undefined>(undefined);
	const [selectedRows, setSelectedRows] = useState<FlowItemTableDataType[]>([]);

	const { dstId } = useParams<{ dstId: string }>();
	const [loading, setLoading] = useState(true);

	// for modal
	const [open, setOpen] = useState(false);
	const [modalType, setModalType] = useState("add");

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
		setModalType("add");
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

	const jumpToAdd = (id: string) => {
		if (id) {
			dispatch(setIsStatusSettingModalOpen(true));
		}
	};

	const StatusView = () => {
		return (
			<>
				{statusList.length > 0 ? (
					statusList.map(item => {
						return (
							<div key={"FlowTable_" + item.id} className="table-item">
								<h3 className="mt-2">{item.name}</h3>
								<FlowTableCore
									className="mb-2 card-table"
									title={item.name}
									dstId={dstId}
									statusId={item.id}
									statusFieldId={curStatusFieldId}
									deleteFlowItem={deleteFlowItemHandler}
									modalType={modalType}
									setModalType={setModalType}
									setOpen={setOpen}
									setEditFlowItemRecord={setEditFlowItemRecord}
									reader={reader}
									writer={writer}
									manager={manager}
								/>
							</div>
						);
					})
				) : (
					<NoStatusData dstId={dstId} clickHandler={jumpToAdd} />
				)}
			</>
		);
	};
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

			{curShowMode === "list" && (
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
			)}
			{curShowMode === "status" && <StatusView />}
		</DashboardRoot>
	);
};

export default DashboardContainer;
