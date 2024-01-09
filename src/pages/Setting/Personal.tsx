import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, Button } from "antd";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import AvatarSetting from "../../components/Setting/AvatarSetting";
import NameSetting from "../../components/Setting/NameSetting";
import MailBinding from "../../components/Setting/MailBinding";

const PersonalRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	.personal-box {
		margin: 56px;
		width: 620px;
	}

	hr {
		border-style: solid;
		border-width: 1px 1px 0px 0px;
		border-color: #e5e6eb;
		border-radius: 20px;
		margin: 20px 0;
	}
`;

const PersonalItemDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 48px;

	:first-child {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.setting-avatar {
		display: flex;

		.avatar-info {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin: 0px 8px;
		}
	}
`;

interface PersonalProps {
	children?: React.ReactNode;
}

const Personal: React.FC<PersonalProps> = () => {
	const user = useAppSelector(selectUser);
	const [isAvatarSettingOpen, setIsAvatarSettingOpen] = useState<boolean>(false);
	const [isNameSettingOpen, setIsNameSettingOpen] = useState<boolean>(false);
	const [isMailBindingOpen, setIsMailBindingOpen] = useState<boolean>(false);

	return (
		<PersonalRoot>
			<div className="personal-box">
				<div style={{ marginBottom: "32px" }}>
					<span style={{ fontSize: 20 }}>管理您的个人信息</span>
				</div>

				<PersonalItemDiv>
					<div style={{ margin: "24px 0px" }}>
						<div className="setting-avatar">
							<Avatar size={40} src={user.avatar} />
							<div className="avatar-info">
								<div>头像</div>
								<div style={{ color: "#666666" }}>支持2M以内的JPG和PNG图片</div>
							</div>
						</div>
					</div>
					<div>
						<Button onClick={() => setIsAvatarSettingOpen(true)}>修改头像</Button>
					</div>
				</PersonalItemDiv>
				<hr />
				<PersonalItemDiv>
					<div>
						<div style={{ margin: "24px 0px" }}>
							<span>昵称</span> <span style={{ color: "#666666", margin: "0px 16px" }}>设定您的工作名称</span>
						</div>
						<div style={{ color: "#666666", marginTop: "8px" }}>{user.nickname}</div>
					</div>
					<div>
						<Button onClick={() => setIsNameSettingOpen(true)}>修改昵称</Button>
					</div>
				</PersonalItemDiv>
				<hr />
				<PersonalItemDiv>
					<div>
						<div style={{ margin: "24px 0px" }}>
							<span>关联邮箱</span>
							<span style={{ color: "#666666", margin: "0px 16px" }}>绑定邮箱后，可以通过邮箱登录，并接收MyFlow活动推荐</span>
						</div>
						<div style={{ color: "#666666", marginTop: "8px" }}>{user.email}</div>
					</div>
					<div style={{ marginRight: "24px" }}>已绑定</div>
				</PersonalItemDiv>
				<hr />
			</div>
			<AvatarSetting open={isAvatarSettingOpen} ok={() => setIsAvatarSettingOpen(false)} cancel={() => setIsAvatarSettingOpen(false)} />
			<NameSetting open={isNameSettingOpen} ok={() => setIsNameSettingOpen(false)} cancel={() => setIsNameSettingOpen(false)} />
			<MailBinding open={isMailBindingOpen} ok={() => setIsMailBindingOpen(false)} cancel={() => setIsMailBindingOpen(false)} />
		</PersonalRoot>
	);
};

export default Personal;
