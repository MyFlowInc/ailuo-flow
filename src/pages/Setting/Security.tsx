import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { ConfigProvider, Button } from "antd";
import { redButtonTheme } from "../../theme/theme";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import { logout } from "../../api/user";
import MailSetting from "../../components/Setting/MailSetting";
import PwdSetting from "../../components/Setting/PwdSetting";

const SecurityRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	.security-box {
		margin: 56px;
		width: 620px;
	}

	.security-container {
		display: grid;
		grid-template-columns: auto 200px 100px;
		place-items: center start;
		margin: 56px;
		width: 620px;
	}

	.security-title {
		grid-column: 1 / 4;
		margin-bottom: 32px;
	}

	.security-hr {
		grid-column: 1 / 4;
		width: 100%;
	}

	.security-item-button {
		place-self: center end;
	}

	.security-footer {
		grid-column: 1 / 4;
		margin-top: 32px;
		place-self: center center;
	}

	.security-exit-button {
		display: flex;
		align-items: center;
		color: #ffffff;
		background-color: #ff0000;
	}

	hr {
		border-style: solid;
		border-width: 1px 1px 0px 0px;
		border-color: #e5e6eb;
		border-radius: 20px;
		margin: 10px 0;
	}
`;

interface SecurityProps {
	children?: React.ReactNode;
}

const Security: React.FC<SecurityProps> = () => {
	const history = useHistory();
	const user = useAppSelector(selectUser);
	const [isMailSettingOpen, setIsMailSettingOpen] = useState<boolean>(false);
	const [isPwdSettingOpen, setIsPwdSettingOpen] = useState<boolean>(false);

	const logoutHandler = async () => {
		await logout();
		history.push("/login");
	};

	return (
		<SecurityRoot>
			<div className="security-container">
				<div className="security-title">
					<span style={{ fontSize: 20 }}>账号安全</span>
				</div>
				<div>
					<div style={{ margin: "16px 0px" }}>
						<span>绑定邮箱</span>
					</div>
					<div style={{ color: "#666666" }}>绑定邮箱后可以通过邮箱登录账户和找回密码</div>
				</div>
				<div>
					<span>{user.email}</span>
				</div>
				<div className="security-item-button">
					<Button onClick={() => setIsMailSettingOpen(true)}>修改邮箱</Button>
				</div>
				<div className="security-hr">
					<hr />
				</div>
				<div>
					<div style={{ margin: "16px 0px" }}>
						<span>登录密码</span>
					</div>
					<div style={{ color: "#666666" }}>建议您经常修改密码，以保证账户更加安全</div>
				</div>
				<div>已设置</div>
				<div className="security-item-button">
					<Button onClick={() => setIsPwdSettingOpen(true)}>修改密码</Button>
				</div>
				<div className="security-hr">
					<hr />
				</div>
				<div className="security-footer">
					<ConfigProvider theme={redButtonTheme}>
						<Button type="primary" onClick={logoutHandler}>
							退出登录
						</Button>
					</ConfigProvider>
				</div>
			</div>
			<MailSetting open={isMailSettingOpen} ok={() => setIsMailSettingOpen(false)} cancel={() => setIsMailSettingOpen(false)} />
			<PwdSetting open={isPwdSettingOpen} ok={() => setIsPwdSettingOpen(false)} cancel={() => setIsPwdSettingOpen(false)} />
		</SecurityRoot>
	);
};

export default Security;
