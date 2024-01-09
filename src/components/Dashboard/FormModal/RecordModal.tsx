import React from "react";
import { Modal } from "antd";
import { useAppSelector } from "../../../store/hooks";
import { selectCurTableStatusList } from "../../../store/workflowSlice";
import CustomModal from "./CustomModal";
import { FlowItemTableDataType } from "../FlowTable/core";

interface AddRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	freshFlowItem: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (props: AddRecordModalProps) => {
	const { open, setOpen, freshFlowItem } = props;

	const statusList = useAppSelector(selectCurTableStatusList) || [];

	const params = {
		title: "新建工单",
		open,
		setOpen,
		statusList,
		freshFlowItem,
		modalType: "add"
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528}></Modal>;
};

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	freshFlowItem: () => void;
	editFlowItemRecord: FlowItemTableDataType | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = props => {
	const { editFlowItemRecord, open, setOpen, freshFlowItem } = props;

	const statusList = useAppSelector(selectCurTableStatusList) || [];

	const params = {
		title: "编辑工单",
		open,
		setOpen,
		statusList,
		freshFlowItem,
		modalType: "edit",
		editFlowItemRecord
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528}></Modal>;
};
