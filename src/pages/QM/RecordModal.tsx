import React from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	editFlowItemRecord: any | undefined;
	modalType: "add" | "edit" | "view";
	defaultStatus?: "approve" | "reject";
}

export const EditRecordModal: React.FC<EditRecordModalProps> = (props) => {
	const { editFlowItemRecord, open, setOpen, modalType, defaultStatus } = props;
	const params = {
		title: "检验单",
		open,
		setOpen,
		modalType,
		editFlowItemRecord,
		defaultStatus,
	};
	console.log("modalType", modalType);
	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={modalType == "view" ? "80%" : 528}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};
