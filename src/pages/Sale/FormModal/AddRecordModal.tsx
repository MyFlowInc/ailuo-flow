import React from "react";
import { Modal } from "antd";
import { useAppSelector } from "../../../store/hooks";
import { selectCurTableColumn, selectCurTableStatusList } from "../../../store/workflowSlice";
import CustomModal from "./CustomModal";

interface AddRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	freshFlowItem: () => void;
	modalType: string;
	setModalType: (v: string) => void;
	editFlowItemRecord: any | undefined;
}

const AddRecordModal: React.FC<AddRecordModalProps> = (props: AddRecordModalProps) => {
	const { modalType, setModalType, editFlowItemRecord, open, setOpen, freshFlowItem } = props;

	const statusList = useAppSelector(selectCurTableStatusList) || [];
	const dstColumns = useAppSelector(selectCurTableColumn) || [];

	const title = modalType === "add" ? "新建工单" : "编辑工单";
	const params = {
		title,
		open,
		setOpen,
		statusList,
		dstColumns,
		freshFlowItem,
		modalType,
		setModalType,
		editFlowItemRecord
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={820} style={{ borderRadius: "8px" }}></Modal>;
};

export default AddRecordModal;
