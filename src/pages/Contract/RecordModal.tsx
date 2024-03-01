import React, { useContext } from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";
import { ContracContext } from "./ContractManage";

interface AddRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (
	props: AddRecordModalProps,
) => {
	const { open, setOpen } = props;
	const { fetchContractList } = useContext(ContracContext) as any;
	const statusList: any = [];

	const params = {
		title: "发起合同",
		open,
		setOpen,
		statusList,
		fetchContractList,
		modalType: "add",
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={528}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
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
	const { fetchContractList } = useContext(ContracContext) as any;

	const statusList: any = [];

	const params = {
		title: "修改合同",
		open,
		setOpen,
		statusList,
		fetchContractList,
		modalType: "edit",
		editFlowItemRecord,
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={528}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};
