import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Form, Input, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { freshUser, selectUser } from "../../store/globalSlice";
import { sendCaptcha, resetMail } from "../../api/user";
import CompleteButton from "./CompleteButton";

const MailSettingRoot = styled.div`
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

	input::placeholder {
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
		color: #86909c;
	}
`;

interface MailSettingProps {
	open: boolean;
	ok: () => void;
	cancel?: () => void;
	children?: React.ReactNode;
}

const MailSetting: React.FC<MailSettingProps> = ({ open, ok, cancel }) => {
	const dispatch = useAppDispatch();
	const [form] = Form.useForm();
	const user = useAppSelector(selectUser);
	const [messageApi, contextHolder] = message.useMessage();
	const [isShowCode, setIsShowCode] = useState<boolean>(false);
	const [time, setTime] = useState(60);

	// 发送邮箱验证码
	const sendEmail = async () => {
		const fileds = await form.validateFields(["email"]);
		const { email } = fileds;
		if (!email) {
			return;
		}

		if (isShowCode) {
			// 倒计时未结束,不能重复点击
			return;
		}
		setIsShowCode(true);
		// 倒计时
		const active = setInterval(() => {
			setTime(preSecond => {
				if (preSecond <= 1) {
					setIsShowCode(false);
					clearInterval(active);
					// 重置秒数
					return 60;
				}
				return preSecond - 1;
			});
		}, 1000);
		const res = (await sendCaptcha({ email })) as any;

		if (res.code === 200) {
			messageApi.open({
				type: "success",
				content: "发送成功,请填写收到的验证码",
				duration: 1
			});
		}
		if (res.code === 3001) {
			messageApi.open({
				type: "error",
				content: res.smg,
				duration: 1
			});
		}
	};

	useEffect(() => {
		form.resetFields();
	}, [open]);

	const handleResetMail = async () => {
		try {
			const data = await form.validateFields(["email", "emailCode"]);
			const { email, emailCode } = data;
			const temp = {
				email,
				code: emailCode,
				userId: user.id
			};
			const res = (await resetMail(temp)) as any;
			if (res.code !== 200) {
				message.error(res.msg);
			} else {
				dispatch(freshUser());
				ok();
			}
		} catch (e) {
			messageApi.open({
				type: "error",
				content: "输入错误!",
				duration: 1
			});
		}
	};

	return (
		<Modal open={open} width={420} closeIcon={null} footer={null} onOk={ok} onCancel={cancel}>
			{contextHolder}

			<MailSettingRoot>
				<div className="title">修改邮箱</div>
				<div className="content">
					<Form form={form} name="mailform" style={{ width: "100%" }}>
						<Form.Item
							name="email"
							rules={[
								{
									type: "email",
									message: "邮箱格式不正确!"
								},
								{
									required: true,
									message: "请输入邮箱验证码！"
								}
							]}>
							<Input allowClear rootClassName="noborder-bg" bordered={false} placeholder="请输入新的邮箱地址" />
						</Form.Item>
						<Form.Item name="emailCode">
							<Input
								allowClear
								rootClassName="noborder-bg"
								bordered={false}
								placeholder="请输入验证码"
								maxLength={6}
								suffix={<a onClick={() => sendEmail()}>{isShowCode ? `${time}秒后重新发送` : "获取验证码"}</a>}
							/>
						</Form.Item>
					</Form>
				</div>
				<div className="bottom">
					<CompleteButton text="完成" bgcolor="#5966d6" color="#ffffff" onClick={handleResetMail} />
				</div>
			</MailSettingRoot>
		</Modal>
	);
};

export default MailSetting;
