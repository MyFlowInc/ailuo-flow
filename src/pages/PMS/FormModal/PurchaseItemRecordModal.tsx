import React from "react";
import { Modal } from "antd";
import PurchaseItemCustomModal from "./PurchaseItemCustomModal";

interface PurchaseItemRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	formItem: any;
	modalType: "add" | "edit";
}

export const PurchaseItemRecordModal: React.FC<PurchaseItemRecordModalProps> = (props) => {
	const { formItem, open, setOpen, modalType } = props;

	const params = {
		title: modalType == "add" ? "新增采购项" : "编辑采购项",
		open,
		setOpen,
		modalType,
		formItem,
	};

	const modalRender = () => PurchaseItemCustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={600}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};
