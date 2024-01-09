import React from "react";
import { Form, Input, Modal } from "antd";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { freshUser, selectUser } from "../../store/globalSlice";
import { userUpdate } from "../../api/user";
import CompleteButton from "./CompleteButton";

const NameSettingRoot = styled.div`
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

interface NameSettingProps {
	open: boolean;
	ok: () => void;
	cancel?: () => void;
	children?: React.ReactNode;
}

const NameSetting: React.FC<NameSettingProps> = ({ open, ok, cancel }) => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const [form] = Form.useForm();

	const renameHandler = async () => {
		await form.validateFields();
		try {
			await userUpdate({ nickname: form.getFieldValue("nickname"), id: user.id });
			dispatch(freshUser());
			ok();
		} catch (e) {
			console.error(`reset pwd error: ${e}`);
		}
	};

	return (
		<Modal open={open} width={420} closeIcon={null} footer={null} onOk={ok} onCancel={cancel}>
			<NameSettingRoot>
				<div className="title">修改昵称</div>
				<div className="content">
					<Form form={form} name="nickform" wrapperCol={{ span: 24 }} style={{ width: "100%" }}>
						<Form.Item name="nickname">
							<Input rootClassName="noborder-bg" bordered={false} placeholder="请输入新昵称" />
						</Form.Item>
					</Form>
				</div>
				<div className="bottom">
					<CompleteButton text="完成" bgcolor="#5966d6" color="#ffffff" onClick={renameHandler} />
				</div>
			</NameSettingRoot>
		</Modal>
	);
};

export default NameSetting;
