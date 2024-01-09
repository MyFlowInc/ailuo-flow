import { Button } from "antd";
import styled from "styled-components";
import Svg1 from "./assets/ava.svg";
import { respondInvite } from "../../api/apitable/ds-share";

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
			margin-left: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.title {
			font-size: 14px;
			font-weight: 500;
			line-height: 24px;
			letter-spacing: 0em;
			color: #3d3d3d;
		}
		.content {
			font-size: 14px;
			font-weight: normal;
			line-height: 20px;
			letter-spacing: 0px;
			color: #666666;
		}
	}
	.right {
		font-size: 14px;
		font-weight: normal;
		line-height: 24px;
		letter-spacing: 0em;
		color: #666666;
	}
`;
const NotifyCard = (props: any) => {
	const { className } = props;
	const { info, curUser, freshInviteList } = props;
	const clickHandler = async () => {
		console.log("clickHandler", curUser.id, info);
		try {
			const res = await respondInvite({
				userId: curUser.id,
				dstId: info.dstId,
				enable: 1
			});
			await freshInviteList();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<UIROOT className={className}>
			<div className="container">
				<div className="left">
					<div className="img-container">
						<img src={Svg1} className="image" />
					</div>

					<div className="word">
						<div className="title flex">
							<div>邀请通知</div>
							<div className="ml-4">02月28日</div>
						</div>
						<div className="content">{info.content}</div>
					</div>
				</div>

				<div className="right">
					{info.ignoreMsg === 0 && (
						<Button style={{ background: "#2845D4" }} type="primary" onClick={clickHandler}>
							同意邀请
						</Button>
					)}
					{info.ignoreMsg === 1 && <Button type="primary">删除记录</Button>}
				</div>
			</div>
		</UIROOT>
	);
};

export default NotifyCard;
