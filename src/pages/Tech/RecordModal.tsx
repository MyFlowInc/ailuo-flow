import React from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";

interface AddRecordModalProps {
	open: boolean;
	fetchTechFeedbackList: () => void; // 获取技术反馈列表
	setOpen: (a: boolean) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (props: AddRecordModalProps) => {
	const { open, setOpen, fetchTechFeedbackList } = props;

	const statusList: any = [];

	const params = {
		title: "新建报价",
		open,
		setOpen,
		statusList,
		fetchTechFeedbackList,
		modalType: "add"
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};

interface EditRecordModalProps {
	open: boolean;
	fetchTechFeedbackList: () => void; // 获取技术反馈列表
	setOpen: (a: boolean) => void;
	editFlowItemRecord: any | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = props => {
	const { editFlowItemRecord, open, setOpen, fetchTechFeedbackList } = props;

	const statusList: any = [];

	const params = {
		title: "报价技术反馈",
		open,
		setOpen,
		statusList,
		fetchTechFeedbackList,
		modalType: "edit",
		editFlowItemRecord
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};
