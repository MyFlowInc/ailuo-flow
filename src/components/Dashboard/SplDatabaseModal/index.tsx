import React, { useState } from "react";
import { Modal } from "antd";
import SplDatabase from "../../../pages/SPL/SplDatabase";
import LinkSvg from "../assets/link.svg";
interface SplDatabaseModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
}
const SplDatabaseModal: React.FC<SplDatabaseModalProps> = ({
	open,
	setOpen,
}) => {
	const handleOk = () => {
		setOpen(false);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const titleRender = () => {
		return (
			<div className="flex items-center">
				<img className="w-[17px] mr-1" src={LinkSvg} alt="" />
				<span>艾罗标准件资料库</span>
			</div>
		);
	};

	return (
		<Modal
			title={titleRender()}
			width={"90%"}
			open={open}
			onOk={handleOk}
			onCancel={handleCancel}
			footer={null}
		>
			<SplDatabase isImport></SplDatabase>
		</Modal>
	);
};

export default SplDatabaseModal;
