import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Form, Input, Button } from "antd";

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

const ApproveSetting: React.FC<any> = ({
	approveModalVisible,
	setApproveModalVisible
}) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleRenameMenu = () => {
		setLoading(true);
		form.validateFields().then(async () => {
			const data = form.getFieldsValue(["dstName"]);
			const { dstName } = data;
			try {
				setApproveModalVisible(false);
			} catch (error) {
				console.log("error", error);
			} finally {
				setLoading(false);
			}
		});
	};

	const initForm = () => {
		form.setFieldValue("dstName", "");
	};

	useEffect(() => {
		if (approveModalVisible && form) {
			initForm();
		}
	}, [approveModalVisible]);

	return (
		<Modal
			title="审批设置"
			open={approveModalVisible}
			footer={null}
			onCancel={() => {
				setApproveModalVisible(false);
			}}
			maskClosable={true}
			focusTriggerAfterClose={false}
			destroyOnClose={true}
		>
			<FormRoot>
				<Form
					layout={"horizontal"}
					form={form}
					style={{ width: "100%" }}
					preserve={false}
				>
					<Form.Item
						label="名称"
						name="dstName"
						rules={[{ required: true, message: "请输入工作流名字" }]}
						style={{ marginBottom: "24px" }}
					>
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
								onClick={setApproveModalVisible}
							>
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
								disabled={loading}
							>
								更新
							</Button>
						</div>
					</Form.Item>
				</Form>
			</FormRoot>
		</Modal>
	);
};

export default ApproveSetting;
