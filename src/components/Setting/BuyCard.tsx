import { Button } from "antd";
import styled from "styled-components";
import Svg1 from "./assets/buy.svg";

const UIROOT = styled.div`
	display: flex;
	width: fit-content;
	align-items: flex-end;
	height: 88px;
	background-color: #fff;
	border-radius: 4px;
	overflow: hidden;
	.container {
		/* 矩形 59 */
		width: 596px;
		height: 67px;
		border-radius: 4px;
		background: #f0f6ff;
		display: flex;
		position: relative;
	}

	.img-container {
		position: relative;
		margin-left: 28px;
		.image {
			position: absolute;
			bottom: 0px;
		}
	}
	.lave {
		flex: 1;
		display: flex;
		margin-left: 134px;
		align-items: center;
		justify-content: space-between;
	}
	.left {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.title {
			font-size: 16px;
			font-weight: bold;
			line-height: 24px;
			letter-spacing: 0em;

			color: #2845d4;
		}
		.content {
			font-size: 12px;
			font-weight: normal;
			line-height: 24px;
			letter-spacing: 0em;
			color: #666666;
		}
	}
`;
const BuyCard = (props: any) => {
	const { className } = props;

	const { isModalOpen, setIsModalOpen } = props;
	const openModalHandler = () => {
		setIsModalOpen(true);
	};
	return (
		<UIROOT className={className}>
			<div className="container">
				<div className="img-container">
					<img src={Svg1} className="image" />
				</div>
				<div className="lave">
					<div className="left">
						<div className="title">购买PRO版</div>
						<div className="content">解锁更多高级功能，帮助你快速实现目标</div>
					</div>
					<Button style={{ background: "#2845D4", marginRight: "20px" }} type="primary" onClick={openModalHandler}>
						立即购买
					</Button>
				</div>
			</div>
		</UIROOT>
	);
};

export default BuyCard;
