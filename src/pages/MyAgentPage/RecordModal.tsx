import React from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";
import { AgentProjectList } from "../../api/ailuo/sale";

interface AddRecordModalProps {
	open: boolean;
	fetchAgentList: () => void; // 获取技术反馈列表
	setOpen: (a: boolean) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (props: AddRecordModalProps) => {
	const { open, setOpen, fetchAgentList } = props;

	const statusList: any = [];

	const params = {
		title: "新建报价",
		open,
		setOpen,
		statusList,
		fetchAgentList,
		modalType: "add"
	};

	const modalRender = () => CustomModal(params);

	return <Modal open={open} modalRender={modalRender} width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};

interface EditRecordModalProps {
	open: boolean;
	fetchAgentList: () => void; // 获取技术反馈列表
	setOpen: (a: boolean) => void;
	editFlowItemRecord: any | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = props => {

	const statusList: any = [];

	const params = {
		title: "报价技术反馈",
		open,
		statusList,
		fetchAgentList: "",
		modalType: "edit",
	};

	return <Modal width={528} wrapClassName="overflow-hidden" style={{ height: "100vh", overflow: "hidden" }}></Modal>;
};
