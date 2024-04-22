import React from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";

interface AddRecordModalProps {
	open: boolean;
	editFlowItemRecord?: any | undefined;
	setOpen: (a: boolean) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (
	props: AddRecordModalProps,
) => {
	const { open, setOpen } = props;

	const statusList: any = [];

	const params = {
		title: props.editFlowItemRecord?.id ? "新建子级资料" : "新建父级资料",
		open,
		setOpen,
		statusList,
		modalType: "add",
		parent: props.editFlowItemRecord?.id,
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={500}
			wrapClassName="overflow-hidden"
			style={{ height: "auto", overflow: "hidden" }}
		></Modal>
	);
};

interface EditRecordModalProps {
	open: boolean;

	setOpen: (a: boolean) => void;
	editFlowItemRecord: any | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = (props) => {
	const { editFlowItemRecord, open, setOpen } = props;

	const statusList: any = [];

	const params = {
		title: "编辑资料",
		open,
		setOpen,
		statusList,
		modalType: "edit",
		editFlowItemRecord,
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={500}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};
