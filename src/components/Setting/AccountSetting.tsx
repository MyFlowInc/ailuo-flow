import { Button } from "antd";
import styled from "styled-components";
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
			display: flex;
			align-items: center;
		}
		.free {
			width: fit-content;
			height: 24px;
			padding: 0 8px;
			border-radius: 100px;
			opacity: 1;
			background: #0ab071;
			display: flex;
			justify-content: center;
			align-items: center;
			span {
				font-size: 14px;
				letter-spacing: 0em;
				color: #ffffff;
			}
		}
		.content-word {
			margin-left: 8px;
			font-size: 14px;
			font-weight: normal;
			line-height: 20px;
			letter-spacing: 0px;
			color: #666666;
		}
	}
`;
const AccountSetting = (props: any) => {
	const { className } = props;
	const { isModalOpen, setIsModalOpen } = props;
	const user = useAppSelector(selectUser);
	const getGradeName = () => {
		const gradeName = user.gradeName;
		if (gradeName) {
			const key = gradeName.split("/")[1];
			return key + "卡会员";
		} else {
			return "免费版";
		}
	};
	return (
		<UIROOT className={className}>
			<div className="container">
				<div className="left">
					<div className="word">
						<div className="title">帐户类型</div>
						<div className="content">
							<div className="free">
								<span>{getGradeName()}</span>
							</div>
							<div className="content-word">{user.endTime ? "有效期至:" + user.endTime : "会员已过期"}</div>
						</div>
					</div>
				</div>

				<Button type="default" onClick={() => setIsModalOpen(true)}>
					立即升级
				</Button>
			</div>
		</UIROOT>
	);
};

export default AccountSetting;
