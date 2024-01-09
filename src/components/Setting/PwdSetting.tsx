import React, { useEffect } from "react";
import { Form, Input, Modal, message } from "antd";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import CompleteButton from "./CompleteButton";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { pwdUpdate } from "../../api/user";

const PwdSettingROOT = styled.div`
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

interface PwdSettingProps {
	open: boolean;
	ok: () => void;
	cancel?: () => void;
	children?: React.ReactNode;
}

const PwdSetting: React.FC<PwdSettingProps> = ({ open, ok, cancel }) => {
	const [form] = Form.useForm();
	const user = useAppSelector(selectUser);

	const resetPwdHandler = async () => {
		await form.validateFields();
		const oldPassword = form.getFieldValue("oldPassword");
		const newPassword = form.getFieldValue("newPassword");
		if (oldPassword && newPassword) {
			try {
				const response = await pwdUpdate({ oldPassword, newPassword, userId: user.id });

				if (response.code !== 200) {
					message.error(response.msg);
				} else {
					ok();
				}
			} catch (e) {
				console.error(`reset pwd error: ${e}`);
			}
		} else {
			ok();
		}
	};

	useEffect(() => {
		form.resetFields();
	}, [open]);

	return (
		<Modal open={open} width={420} closeIcon={null} footer={null} onOk={ok} onCancel={cancel}>
			<PwdSettingROOT>
				<div className="title">修改密码</div>
				<div className="content">
					<Form form={form} name="mailform" wrapperCol={{ span: 24 }} style={{ width: "100%" }}>
						<Form.Item name="oldPassword">
							<Input rootClassName="noborder-bg" allowClear bordered={false} placeholder="请输入原密码" />
						</Form.Item>
						<Form.Item name="newPassword" rules={[{ message: "请输入新密码!" }]}>
							<Input.Password
								allowClear
								rootClassName="noborder-bg"
								bordered={false}
								placeholder="请输入新密码"
								iconRender={visible => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
							/>
						</Form.Item>
						<Form.Item
							name="confirm"
							rules={[
								{
									message: "请二次输入新密码!"
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue("newPassword") === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error("两次密码不一致!"));
									}
								})
							]}>
							<Input.Password
								allowClear
								rootClassName="noborder-bg"
								bordered={false}
								placeholder="请再次输入新密码"
								iconRender={visible => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
							/>
						</Form.Item>
					</Form>
				</div>
				<div className="bottom">
					<CompleteButton text="完成" bgcolor="#5966d6" color="#ffffff" onClick={resetPwdHandler} />
				</div>
			</PwdSettingROOT>
		</Modal>
	);
};

export default PwdSetting;
