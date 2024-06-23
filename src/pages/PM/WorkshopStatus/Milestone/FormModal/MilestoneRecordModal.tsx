import React, { useEffect } from "react";
import { Modal } from "antd";
import MilestoneCustomModal from "./MilestoneCustomModal";

interface MilestoneRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	formItem: any;
	modalType: "add" | "edit";
	fetchData: () => void;
	workshopType: string;
}

export const MilestoneRecordModal: React.FC<MilestoneRecordModalProps> = (
	props,
) => {
	const { formItem, open, setOpen, modalType, fetchData, workshopType } = props;

	const params = {
		title: modalType == "add" ? "新增重要事件" : "编辑重要事件",
		open,
		setOpen,
		modalType,
		formItem,
		fetchData,
		workshopType,
	};

	const modalRender = () => MilestoneCustomModal(params);

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
