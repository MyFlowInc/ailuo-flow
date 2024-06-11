import React, { useEffect } from "react";
import { Modal } from "antd";
import PurchaseItemCustomModal from "./PurchaseItemCustomModal";

interface PurchaseItemRecordModalProps {
	open: boolean;
	disabled: boolean;
	setOpen: (a: boolean) => void;
	formItem: any;
	modalType: "add" | "edit";
	fetchData: () => void;
	purchaseForm: any;
}

export const PurchaseItemRecordModal: React.FC<PurchaseItemRecordModalProps> = (
	props,
) => {
	const { formItem, open, setOpen, modalType, fetchData, disabled, purchaseForm } =
		props;

	const params = {
		title: modalType == "add" ? "新增采购项" : "编辑采购项",
		open,
		setOpen,
		modalType,
		formItem,
		fetchData,
		disabled,
		purchaseForm,
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
