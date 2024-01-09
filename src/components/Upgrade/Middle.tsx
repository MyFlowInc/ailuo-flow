import React from "react";
import styled from "styled-components";
import checkSvg from "./assets/check.svg";
import closeSvg from "./assets/close.svg";
import m1Svg from "./assets/m-1.svg";
import { useAppSelector } from "../../store/hooks";
import { selectIsMember } from "../../store/globalSlice";

const UpgradeMiddleRoot = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding-bottom: 26px;
	width: 212px;
	.content {
		height: 320px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		.t1 {
			margin-top: 26px;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			width: 100%;
			.t1-1 {
				font-family: HarmonyOS Sans;
				font-size: 18px;
				height: 18px;
				margin-right: 16px;
				color: #666666;
			}
			.t1-2 {
				font-family: HarmonyOS Sans;
				font-size: 10px;
				color: #666666;
			}
		}
		.t2 {
			margin-top: -20px;
			font-family: HarmonyOS Sans;
			width: 100%;
			font-size: 12px;
			font-weight: normal;
			line-height: 16px;
			color: #000000;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.t3 {
			font-family: HarmonyOS Sans;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			font-weight: normal;
			line-height: 22.5px;
			color: #666666;
			margin-top: 10px;
		}
		.t4 {
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
			margin-top: 16px;
			font-size: 12px;
			height: 24px;
			color: #5966d6;
			.box {
				width: 156px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 16px;
				font-size: 12px;
				height: 24px;
				border: 1px solid #5966d6;
				border-radius: 5px;
				font-family: HarmonyOS Sans;
			}
		}
	}
	.list {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.item {
			display: flex;
			flex-direction: column;
			.text {
				font-family: HarmonyOS Sans;
				font-size: 12px;
				font-weight: normal;
				line-height: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
				letter-spacing: 0px;
				color: #666666;
				width: 134px;

				margin-top: 16px;
				margin-bottom: 16px;
			}
			.line {
				width: 134px;
				height: 1px;
				border: 1px solid #e5e6eb;
			}
		}
	}
`;

interface UpgradeMiddleProps {}

const UpgradeMiddle: React.FC<UpgradeMiddleProps> = props => {
	const isMember = useAppSelector(selectIsMember);

	return (
		<UpgradeMiddleRoot>
			<div className="content">
				<div className="t1">
					<span className="t1-1">免费</span>
					<span className="t1-2">/月</span>
				</div>
				<div className="t2">
					<img src={m1Svg} />
				</div>
				<div className="t3">适合中小型及个人企业的管理工具</div>
				{!isMember && (
					<div className="t4">
						<div className="box">当前使用类型</div>
					</div>
				)}
			</div>
			<div className="list">
				<div className="item">
					<div className="text">3个</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">4个</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">1 Mb</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">100 Mb</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={closeSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={closeSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={closeSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={closeSvg} />
					</div>
					<div className="line"></div>
				</div>
			</div>
		</UpgradeMiddleRoot>
	);
};

export default UpgradeMiddle;
