import React from "react";
import styled from "styled-components";
import { Modal, Form, Input } from "antd";
import CompleteButton from "./CompleteButton";

const MailBindingRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rbga(255, 255, 255, 0.5);
	border-radius: 5px;
	overflow: hidden;

	.title {
		padding-top: 16px;
		font-size: 20px;
		font-family: "Harmony_Regular", sans-serif;
	}

	.content {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 32px 16px 16px 16px;
	}

	.noborder-bg {
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
		background-color: #f7f8fa;
	}

	.bottom {
		padding-bottom: 32px;
	}
`;

interface MailBindingProps {
	open: boolean;
	ok?: () => void;
	cancel?: () => void;
	children?: React.ReactNode;
}

const MailBinding: React.FC<MailBindingProps> = ({ open, ok, cancel }) => {
	const [form] = Form.useForm();

	return (
		<Modal open={open} width={420} closeIcon={null} footer={null} onOk={ok} onCancel={cancel}>
			<MailBindingRoot>
				<div className="title">绑定邮箱</div>
				<div className="content">
					<Form form={form} name="mailform" wrapperCol={{ span: 24 }} style={{ width: "100%" }}>
						<Form.Item name="nickname">
							<Input rootClassName="noborder-bg" bordered={false} placeholder="请输入绑定关联邮箱" />
						</Form.Item>
					</Form>
				</div>
				<div className="bottom">
					<CompleteButton text="完成" bgcolor="#5966d6" color="#ffffff" onClick={ok} />
				</div>
			</MailBindingRoot>
		</Modal>
	);
};

export default MailBinding;
