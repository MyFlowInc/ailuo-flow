import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";

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
	freshFlowItem: () => void;
	editFlowItemRecord: FlowItemTableDataType | undefined;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (recordId: string) => void;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
}

const TableBody: React.FC<FlowTableProps> = ({ editFlowItemRecord, freshFlowItem, ...rest }) => {
	const [datasource, setDatasource] = useState<any>([]);
	const [dstColumns, setDstColumns] = useState<any>([]);

	const fetchUserList = async () => {};

	const init = () => {
		fetchUserList();
	};

	useEffect(() => {
		init();
	}, []);

	const [open, setOpen] = useState<boolean>(false);

	return (
		<FlowTableRoot>
			<StandardTable datasource={datasource} columns={dstColumns} setOpen={setOpen} {...rest} />
			<EditRecordModal open={open} setOpen={setOpen} editFlowItemRecord={editFlowItemRecord} freshFlowItem={freshFlowItem} />
		</FlowTableRoot>
	);
};

export default TableBody;
