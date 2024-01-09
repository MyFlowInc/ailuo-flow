import styled from "styled-components";
import { deleteInviteRecord, readMessage, respondInvite } from "../../api/apitable/ds-share";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import { Button, Checkbox, Popconfirm, Typography, message } from "antd";
import delPng from "../../components/Notify/assets/del.svg";
const { Paragraph } = Typography;

const NotifyItemRoot = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	padding: 6px 6px 6px 0px;

	:hover {
		background: #f3f5f7;
		cursor: pointer;
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.type {
			align-items: center;
			display: flex;
			.check {
				margin-left: 12px;
			}
			.text {
				margin-left: 14px;
				color: #707683;
			}
		}
	}
	.middle {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
		.text {
			margin-left: 44px;
			font-family: HarmonyOS Sans;
			font-size: 12px;
			line-height: 18px;
			letter-spacing: 0px;
			text-indent: 1em;
		}
	}
	.buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 18px;
		.reject {
			margin-left: 8px;
		}
	}
	.time {
		display: flex;
		justify-content: flex-end;
		margin-top: 18px;
		.text {
			font-family: HarmonyOS Sans;
			font-size: 10px;
			font-weight: normal;
			line-height: 15px;
			letter-spacing: 0px;
			color: #707683;
		}
	}
`;

interface NotifyItemProps {
	freshInviteList: () => void;
	info: {
		id: string;
		content: string;
		createTime: string;
		dstId: string;
		enable: 0 | 1 | 2; // enable:1 同意 enabe:2拒绝 enable:0 未处理 ignore:0 1未读/已读
		type: 1 | 2; // 1系统 2邀请
		ignoreMsg: 0 | 1; // 0 未读 1 已读
	};
}

const NotifyItem = (props: NotifyItemProps) => {
	const { info, freshInviteList } = props;
	console.log("info", info);
	const ignoreMsg = info.ignoreMsg;
	const infoType = info.type;
	const curUser = useAppSelector(selectUser);
	const agreeHandle = async () => {
		try {
			await respondInvite({
				userId: curUser.id,
				dstId: info.dstId,
				enable: 1
			});
			await freshInviteList();
		} catch (error) {
			console.log(error);
		}
	};
	const rejectHandle = async () => {
		try {
			await respondInvite({
				userId: curUser.id,
				dstId: info.dstId,
				enable: 2
			});
			await freshInviteList();
		} catch (error) {
			console.log(error);
		}
	};
	const deleteHandle = async () => {
		try {
			await deleteInviteRecord({
				id: info.id
			});
			await freshInviteList();
			message.success("删除成功");
		} catch (error) {
			console.log(error);
		}
	};
	// 已读设置
	const readHandle = async () => {
		try {
			console.log("readHandle", info);
			await readMessage({
				id: info.id,
				ignoreMsg: 1
			});
			await freshInviteList();
		} catch (error) {
			console.log(error);
		}
	};
	const renderButtons = () => {
		if (1) {
			return;
		}
		return (
			<div className="buttons">
				{info.enable === 1 && (
					<div>
						<Button style={{ background: "#5966D6" }} type="primary">
							已接受
						</Button>
					</div>
				)}
				{info.enable === 2 && (
					<div>
						<Button style={{ background: "#FF0000" }} className="reject" type="primary">
							已拒绝
						</Button>
					</div>
				)}
				{!info.enable && (
					<div>
						<Button style={{ background: "#5966D6" }} type="primary" onClick={agreeHandle}>
							接受
						</Button>
						<Button style={{ background: "#FF0000" }} className="reject" type="primary" onClick={rejectHandle}>
							拒绝
						</Button>
					</div>
				)}
			</div>
		);
	};
	return (
		<NotifyItemRoot>
			<div className="title">
				<div className="type">
					<Checkbox className="check"></Checkbox>
					<div className="text">{infoType === 1 ? "系统通知" : "协作消息"}</div>
				</div>
				<Popconfirm title="是否删除这条通知？" onConfirm={deleteHandle} okText="确认" cancelText="取消">
					<img src={delPng} />
				</Popconfirm>
			</div>
			<div className="middle">
				<div
					className="text"
					onClick={() => {
						readHandle();
					}}
					style={{ fontWeight: ignoreMsg === 0 ? "bold" : "400" }}>
					{/* {info.content.replace("系统通知：", "")} */}
					<Paragraph
						ellipsis={{
							rows: 2,
							expandable: true
						}}>
						{info.content.replace("系统通知：", "")}
					</Paragraph>
				</div>
			</div>
			{renderButtons()}
			<div className="time">
				<div className="text">{info.createTime}</div>
			</div>
		</NotifyItemRoot>
	);
};
export default NotifyItem;
