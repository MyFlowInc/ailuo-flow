import React from "react";
import { Button, Divider, Modal } from "antd";
import styled from "styled-components";
import Svg1 from "./assets/avatar.svg";
import { myFlowUpload } from "../../api/upload";
import { userUpdate } from "../../api/user";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { freshUser, selectUser } from "../../store/globalSlice";
import CompleteButton from "./CompleteButton";

const AvatarSettingROOT = styled.div`
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
		width: 200px;
		border-radius: 4px;
		margin: 32px;

		.left {
			display: flex;
			flex-direction: column;
			align-items: center;
			white-space: nowrap;
		}
		.middle {
			height: 100%;
			padding: 0px 32px;
		}
	}
	.avator-image {
		width: 24px;
		height: 24px;
		border-radius: 100px;
	}
	.bottom {
		padding: 32px;
	}
`;

interface AvatarSettingProps {
	open: boolean;
	ok?: () => void;
	cancel?: () => void;
	children?: React.ReactNode;
}

const AvatarSetting: React.FC<AvatarSettingProps> = ({ open, ok, cancel }) => {
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	const uploadAvatar = async () => {
		const inputTag = document.createElement("input");
		inputTag.type = "file";
		inputTag.accept = "image/*";
		inputTag.click();
		inputTag.onchange = async () => {
			let res;
			try {
				if (inputTag.files && inputTag.files[0]) {
					console.log(inputTag.files);
					const formData = new FormData();
					formData.append("file", inputTag.files[0]);
					const res = await myFlowUpload(formData);
					console.log(res.data.url);
					const avatar = res.data.url;
					if (avatar) {
						await userUpdate({ avatar, id: user.id });
						dispatch(freshUser());
					}
				}
			} catch (e) {
				console.log(e, res);
			}
		};
	};

	return (
		<Modal open={open} width={420} closeIcon={null} footer={null} onOk={ok} onCancel={cancel}>
			<AvatarSettingROOT>
				<div className="title">修改头像</div>
				<div className="content">
					<div className="left">
						<div className="img-container">
							<img src={user.avatar || Svg1} className="avator-image" />
						</div>
						<div>当前图像</div>
					</div>
					<div className="middle">
						<Divider type="vertical" />
					</div>
					<div className="right">
						<Button type="default" onClick={uploadAvatar}>
							上传图片
						</Button>
					</div>
				</div>
				<div>请选择图片上传：支持JPG、PNG等格式，图片需小于2M</div>
				<div className="bottom">
					<CompleteButton text="完成" bgcolor="#5966d6" color="#ffffff" onClick={ok} />
				</div>
			</AvatarSettingROOT>
		</Modal>
	);
};

export default AvatarSetting;
