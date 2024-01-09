import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Form, Input, Button } from "antd";
import { useAppDispatch } from "../../../../store/hooks";
import { renameWorkflow } from "../../../../store/workflowSlice";
import { updateWorkFlow } from "../../../../api/apitable/ds-table";

import type { WorkFlowInfo } from "../../../../store/workflowSlice";

const FormRoot = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 24px;
	padding-left: 24px;
	width: 100%;
	.ml-16 {
		margin-left: 16px;
	}
`;

interface RenameModalProps {
	workflowInfo: WorkFlowInfo;
	isRenameModalOpen: boolean;
	closeRenameModal: () => void;
	childre?: React.ReactNode;
}

const RenameModal: React.FC<RenameModalProps> = ({ isRenameModalOpen, closeRenameModal, workflowInfo }) => {
	const dispatch = useAppDispatch();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleRenameMenu = () => {
		setLoading(true);
		form.validateFields().then(async () => {
			const data = form.getFieldsValue(["dstName"]);
			const { dstName } = data;
			try {
				await updateWorkFlow({
					id: workflowInfo.id,
					dstName
				});

				dispatch(
					renameWorkflow({
						id: workflowInfo.id,
						dstName
					})
				);
				closeRenameModal();
			} catch (error) {
				console.log("error", error);
			} finally {
				setLoading(false);
			}
		});
	};

	const initForm = () => {
		form.setFieldValue("dstName", (workflowInfo && workflowInfo.dstName) || "");
	};

	useEffect(() => {
		if (isRenameModalOpen && workflowInfo && form) {
			initForm();
		}
	}, [isRenameModalOpen]);

	return (
		<Modal title="重命名" open={isRenameModalOpen} footer={null} onCancel={closeRenameModal} maskClosable={true} focusTriggerAfterClose={false} destroyOnClose={true}>
			<FormRoot>
				<Form layout={"horizontal"} form={form} style={{ width: "100%" }} preserve={false}>
					<Form.Item label="名称" name="dstName" rules={[{ required: true, message: "请输入工作流名字" }]} style={{ marginBottom: "24px" }}>
						<Input />
					</Form.Item>
					<Form.Item>
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<Button
								className="ml-16"
								style={{
									background: "#2845D4",
									marginLeft: "24px"
								}}
								type="primary"
								onClick={closeRenameModal}>
								取消
							</Button>
							<Button
								className="ml-16 tw-text-white"
								style={{
									background: "#2845D4",
									color: "#fff !important"
								}}
								type="primary"
								onClick={handleRenameMenu}
								loading={loading}
								disabled={loading}>
								更新
							</Button>
						</div>
					</Form.Item>
				</Form>
			</FormRoot>
		</Modal>
	);
};

export default RenameModal;
