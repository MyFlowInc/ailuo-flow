import React, { useState } from "react";
import styled from "styled-components";
import { Button, Form, Input, message, ConfigProvider } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useHistory } from "react-router";
import { resetPwd, sendCaptcha } from "../../api/user";
import { BeiAnUI } from "../../components/TabBar/BeiAn";
import LinePng from "../../assets/line.png";

const ResetPwdRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 500px;

	// background-image: repeating-radial-gradient(farthest-corner, rgb(10, 30, 57), rgb(50, 35, 105));
	background-image: url("/assets/background.svg");
	background-position: center center;
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-size: cover;
	height: 100%;

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 384px;
		height: 380px;
		border-radius: 10px;
		background-color: #ffffff;

		.form-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 300px;
			height: 300px;
			font-size: 12px;
			font-family: "Harmony_Regular", sans-serif;

			.title {
				height: 22px;
				line-height: 22px;
				display: flex;
				align-items: center;
				justify-content: center;

				.text {
					margin: 0px 8px;
					font-size: 18px;
				}
			}

			.subject {
				height: 11px;
				color: #86909c;
				line-height: 11px;
				padding: 28px 0px 20px 0px;
			}

			.noborder-bg {
				height: 28px;
				line-height: 12px;
				font-size: 12px;
				font-family: "Harmony_Regular", sans-serif;
				background-color: #f7f8fa;
			}

			.active-button {
				background-color: #5966d6;
			}
		}
	}

	a {
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
		color: #5966d6;
	}

	input::placeholder {
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
		color: #86909c;
	}
`;

interface CaptchaCodeTextProps {
	text: string;
}

const CaptchaCodeText = styled(({ text, ...rest }) => (
	<div {...rest}>
		<div>
			<img src={LinePng} style={{ width: "14px", height: "14px" }} />
		</div>
		<div>{text}</div>
	</div>
))<CaptchaCodeTextProps>`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ResetPwd: React.FC = () => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const history = useHistory();
	const [isShowCode, setIsShowCode] = useState<boolean>(false);
	const [time, setTime] = useState(60);

	// 发送邮箱验证码
	const sendEmail = async () => {
		const fileds = await form.validateFields(["account", "email"]);
		console.log("validateFields", fileds);
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
		console.log(1111, res);
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

	const resetPassward = async () => {
		try {
			const data = await form.validateFields(["email", "emailCode", "password"]);
			const { password, email, emailCode } = data;
			const temp = {
				email,
				code: emailCode,
				password: password
			};
			const res = (await resetPwd(temp)) as any;
			console.log("res", res);
			if (res.code === 500) {
				messageApi.open({
					type: "error",
					content: res.msg,
					duration: 1
				});
				return;
			}
			if (res.code === 200) {
				messageApi
					.open({
						type: "success",
						content: "重置成功,请登录!",
						duration: 1
					})
					.then(() => {
						history.push("/login");
					});
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
		<ConfigProvider
			theme={{
				token: { fontSize: 11, fontFamily: `"Harmony_Regular", sans-serif` },
				components: {
					Form: { itemMarginBottom: 0, controlHeight: 28 },
					Input: { borderRadius: 0 }
				} as any
			}}>
			<ResetPwdRoot>
				{contextHolder}
				<div className="container">
					<div className="form-content">
						<div className="title">
							<div className="text">忘记密码</div>
						</div>
						<div className="subject">输入注册 MyFlow 使用的邮箱</div>
						<Form form={form} name="normal_register" className="register-form" initialValues={{ remember: true, prefix: "86" }}>
							<Form.Item
								style={{ marginBottom: "20px" }}
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
								<Input rootClassName="noborder-bg" bordered={false} placeholder="请输入邮箱地址" />
							</Form.Item>
							<Form.Item style={{ marginBottom: "20px" }} name="emailCode" rules={[{ required: true, message: "请输入邮箱验证码！" }]}>
								<Input
									rootClassName="noborder-bg"
									bordered={false}
									placeholder="请输入验证码"
									maxLength={6}
									suffix={<a onClick={() => sendEmail()}>{isShowCode ? <CaptchaCodeText text={`${time}秒后重新发送`} /> : <CaptchaCodeText text="获取验证码" />}</a>}
								/>
							</Form.Item>

							<Form.Item style={{ marginBottom: "20px" }} name="password" rules={[{ required: true, message: "请输入新密码!" }]}>
								<Input.Password
									rootClassName="noborder-bg"
									bordered={false}
									placeholder="请输入新密码"
									iconRender={visible => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
								/>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: "28px" }}
								name="confirm"
								dependencies={["password"]}
								hasFeedback
								rules={[
									{
										required: true,
										message: "请二次输入新密码!"
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error("两次密码不一致!"));
										}
									})
								]}>
								<Input.Password
									rootClassName="noborder-bg"
									bordered={false}
									placeholder="请再次输入新密码"
									iconRender={visible => (visible ? <EyeFilled /> : <EyeInvisibleFilled />)}
								/>
							</Form.Item>
							<div>
								<Button block onClick={resetPassward} type="primary" htmlType="submit" className="active-button">
									完成
								</Button>
							</div>
						</Form>
					</div>
				</div>
				<BeiAnUI />
			</ResetPwdRoot>
		</ConfigProvider>
	);
};

export default ResetPwd;
