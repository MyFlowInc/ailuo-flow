import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Checkbox, Form, Input, message, ConfigProvider } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useHistory } from "react-router";
import { userLogin, userProfile } from "../../api/user";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/globalSlice";
import logoSvg from "../../assets/logo.png";
import _ from "lodash";
import AiluoLogo from "../../BaseUI/Logo/AiluoLogo";
import pkgJSON from "../../../package.json";
console.log("last update time ", pkgJSON.updateTime);

const LoginRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 500px;
	background-image: url("/assets/background.svg");
	background-position: center center;
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-size: cover;
	height: 100%;
	.container {
		width: 380px;
		padding: 0px 40px 38px 40px;
		border-radius: 10px;
		background-color: #ffffff;

		.form-content {
			display: flex;
			flex-direction: column;
			/* justify-content: space-between; */
			width: 100%;
			height: 100%;
			font-size: 12px;
			font-family: "Harmony_Regular", sans-serif;

			.title {
				height: 22px;
				line-height: 22px;
				display: flex;
				align-items: center;
				justify-content: start;

				.logo {
					.logo-image {
						width: 22px;
						height: 22px;
					}
				}

				.text {
					margin: 0px 8px;
					font-size: 18px;
				}
			}

			.subject {
				height: 16px;
				color: #86909c;
				margin: 16px 0px -4px 0px;
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

			.register-button {
				margin-top: 11px;
				color: #5966d6;
			}

			.forget-password .ant-form-item-control-input-content {
				display: flex;
				justify-content: space-between;
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

const Login: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [buttonLoading, setButtonLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	useEffect(() => {
		const username = localStorage.getItem("username");
		if (form && username) {
			form.setFieldValue("username", username || "");
		}

		const password = localStorage.getItem("danger");
		if (form && password) {
			form.setFieldValue("password", password || "");
		}
		const remember = localStorage.getItem("remember");
		if (form && remember) {
			form.setFieldValue("remember", !!remember || !!"");
		}
	}, [form]);

	const checkLoginHandler = () => {
		setButtonLoading(true);
		form
			.validateFields()
			.then(async () => {
				const data = form.getFieldsValue(["username", "password"]);
				try {
					const response = (await userLogin(data)) as any;
					if (response.code !== 200) {
						throw new Error(response.msg);
					}
					const { token, tokenKey } = response;
					if (token && tokenKey) {
						localStorage.setItem("Authorization", token);
						localStorage.setItem("Authorization-key", tokenKey);

						const { remember } = form.getFieldsValue(["remember"]);
						if (remember) {
							localStorage.setItem("username", data.username);
							localStorage.setItem("danger", data.password);
							localStorage.setItem("remember", "1");
						} else {
							localStorage.setItem("username", data.username);
							localStorage.setItem("danger", "");
							localStorage.setItem("remember", "");
						}

						const res = await userProfile();
						dispatch(loginSuccess(res.data));

						messageApi
							.open({
								type: "success",
								content: "登录成功!",
								duration: 1,
							})
							.then(() => {
								history.push("/dashboard");
							});
					}
				} catch (e: any) {
					console.log(e);
					messageApi.open({
						type: "error",
						content: "登录失败," + e.message,
						duration: 1,
					});
				} finally {
					setTimeout(() => {
						setButtonLoading(false);
					}, 1000);
				}
			})
			.catch(() => {
				return;
			});
	};
	const checkLogin = _.debounce(checkLoginHandler, 300);

	const onFinish = (values: any) => {};
	const onFinishFailed = () => {
		console.error("Submit failed!");
		setTimeout(() => {
			setButtonLoading(false);
		}, 1000);
	};

	return (
		<ConfigProvider
			theme={{
				token: { fontSize: 11, fontFamily: `"Harmony_Regular", sans-serif` },
				components: {
					Form: { controlHeight: 28, itemMarginBottom: 0 },
					Input: { borderRadius: 0 },
					Checkbox: { colorPrimary: "#5966d6" },
				} as any,
			}}
		>
			<LoginRoot>
				{contextHolder}
				<div className="container">
					<div className="form-content">
						<div
							className="flex justify-center items-center"
							style={{ marginTop: 22 }}
						>
							<AiluoLogo />
						</div>
						<div className="title" style={{ marginTop: 16 }}>
							<div className="logo">
								<img src={logoSvg} className="logo-image" />
							</div>
							<div className="text">登录到艾罗执行器MyFlow系统</div>
						</div>
						<div className="subject">使用账户密码登陆</div>
						<Form
							form={form}
							name="normal_login"
							className="login-form"
							initialValues={{}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
							<Form.Item
								name="username"
								style={{ margin: "20px 0px" }}
								rules={[{ required: true, message: "用户名不能为空!" }]}
							>
								<Input
									variant="borderless"
									rootClassName="noborder-bg"
									placeholder="请输入用户名"
								/>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: "20px" }}
								name="password"
								rules={[{ required: true, message: "密码不能为空!" }]}
							>
								<Input.Password
									rootClassName="noborder-bg"
									variant="borderless"
									placeholder="请输入密码"
									iconRender={(visible) =>
										visible ? <EyeFilled /> : <EyeInvisibleFilled />
									}
								/>
							</Form.Item>
							<Form.Item
								style={{ marginBottom: "20px" }}
								className="forget-password"
							>
								<Form.Item name="remember" valuePropName="checked" noStyle>
									<Checkbox>自动登录</Checkbox>
								</Form.Item>
								<Form.Item noStyle>
									{/* <Link to="/reset" rel="noreferrer">
										<span style={{ color: "#5966d6" }}>忘记密码?</span>
									</Link> */}
								</Form.Item>
							</Form.Item>
							<div>
								<Button
									onClick={checkLogin}
									loading={buttonLoading}
									type="primary"
									htmlType="submit"
									className="active-button"
									block
								>
									登录
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</LoginRoot>
		</ConfigProvider>
	);
};

export default Login;
