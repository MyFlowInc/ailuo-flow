import { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import styled from "styled-components";
import UpdateModal from "./UpdateModal";
import { userUpdate } from "../../api/user";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";

const UIROOT = styled.div`
	display: flex;
	width: fit-content;
	align-items: flex-end;
	background-color: #fff;
	border-radius: 4px;
	overflow: hidden;
	.container {
		width: 596px;
		height: 68px;
		border-radius: 4px;
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
	}

	.img-container {
		position: relative;
	}
	.left {
		display: flex;
		.word {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.title {
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
			letter-spacing: 0px;
			color: #000000;
		}
		.content {
			font-size: 14px;
			font-weight: normal;
			line-height: 20px;
			letter-spacing: 0px;
			color: #666666;
		}
	}
`;
const PhoneSetting = (props: any) => {
	const { className } = props;
	const user = useAppSelector(selectUser);

	const [open, setOpen] = useState(false);

	const prefixSelector = (
		<Form.Item name="prefix" noStyle>
			<Select style={{ width: 70 }} defaultValue="86">
				<Select.Option key="86" value="86">
					+86
				</Select.Option>
			</Select>
		</Form.Item>
	);
	const phoneItem = () => (
		<Form.Item
			name="phone"
			label="手机号"
			rules={[
				{ required: true, message: "请输入手机号!" },
				{
					pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
					message: "请输入正确的手机号"
				}
			]}>
			<Input addonBefore={prefixSelector} style={{ width: "100%" }} />
		</Form.Item>
	);
	const phoneUpdate = async (data: any) => {
		await userUpdate({ phone: data.phone, id: user.id });
	};
	return (
		<UIROOT className={className}>
			<div className="container">
				<div className="left">
					<div className="word">
						<div className="title">关联手机</div>
						<div className="content">{user.phone ? user.phone : "暂未绑定，绑定手机后，可以通过邮箱登录，并接收HIflow活动推荐"}</div>
					</div>
				</div>
				<Button
					type="default"
					onClick={() => {
						setOpen(true);
					}}>
					绑定手机
				</Button>
			</div>
			<UpdateModal {...{ open, setOpen }} updateKey="phone" renderItem={phoneItem} updateApi={phoneUpdate} />
		</UIROOT>
	);
};

export default PhoneSetting;
