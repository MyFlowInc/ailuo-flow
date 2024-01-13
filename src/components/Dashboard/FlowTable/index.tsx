import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useAppSelector } from "../../../store/hooks";
import { selectCurTableRows, selectCurTableColumn } from "../../../store/workflowSlice";
import { selectIsArchiveView } from "../../../store/globalSlice";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "../FormModal/RecordModal";
import { apitableDeveloperUserList } from "../../../api/apitable/ds-share";
import type { DeveloperUser } from "../../../store/globalSlice";

const FlowTableRoot = styled.div`
	position: relative;
	width: 100%;
`;

export interface FlowItemTableDataType {
	key: string;
	flowItemId: number;
	statusId: string;
	[propName: string]: any;
}

interface FlowTableProps {
	dstId: string;
	statusId?: string; // 当前渲染的状态id
	statusFieldId?: string; // 从record中获取 statusId
	freshFlowItem: () => void;
	editFlowItemRecord: FlowItemTableDataType | undefined;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (recordId: string) => void;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
	reader: boolean;
	writer: boolean;
	manager: boolean;
}

const FlowTable: React.FC<FlowTableProps> = ({ dstId, editFlowItemRecord, freshFlowItem, ...rest }) => {
	const { statusId, statusFieldId } = rest;
	const dstColumns = useAppSelector(selectCurTableColumn);
	const datasource = useAppSelector(selectCurTableRows);
	// const users = useAppSelector(selectMembers);
	const isArchiveView = useAppSelector(selectIsArchiveView);

	const [users, set] = useState<DeveloperUser[]>([]);

	const fetchUserList = async () => {
		if (!dstId) return;

		const res = await apitableDeveloperUserList(dstId);
		if (_.get(res, "data.record")) {
			set(res.data.record);
		}
	};

	const init = () => {
		fetchUserList();
	};

	useEffect(() => {
		init();
	}, [dstId]);

	const [open, setOpen] = useState<boolean>(false);

	const flowDataSource = datasource.filter(item => {
		if (!statusId) {
			return true;
		}
		if (!statusFieldId) {
			return true;
		}
		return item[statusFieldId] === statusId;
	});
	console.log("flowDataSource", flowDataSource);
	// 废弃
	// const archiveDataSource = datasource.filter(item => item.archive);

	return (
		<FlowTableRoot>
			<StandardTable datasource={flowDataSource} isArchiveView={isArchiveView} users={users} columns={dstColumns} setOpen={setOpen} {...rest} />
			{/* <ArchiveTable dstId={dstId} datasource={archiveDataSource} isArchiveView={isArchiveView} users={users} columns={dstColumns} {...rest} /> */}
			<EditRecordModal open={open} setOpen={setOpen} editFlowItemRecord={editFlowItemRecord} freshFlowItem={freshFlowItem} />
		</FlowTableRoot>
	);
};

export default FlowTable;
