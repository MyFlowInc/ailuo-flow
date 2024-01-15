import React from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";

interface AddRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	freshFlowItem: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (props: AddRecordModalProps) => {
	const { open, setOpen, freshFlowItem } = props;

	const statusList: any = [];

	const params = {
		title: "新建报价",
		open,
		setOpen,
		statusList,
		freshFlowItem,
		modalType: "add"
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	freshFlowItem: () => void;
	editFlowItemRecord: any | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = props => {
	const { editFlowItemRecord, open, setOpen, freshFlowItem } = props;

	const statusList: any = [];

	const params = {
		title: "编辑报价",
		open,
		setOpen,
		statusList,
		freshFlowItem,
		modalType: "edit",
		editFlowItemRecord
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};
