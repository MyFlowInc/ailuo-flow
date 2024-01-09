import { Button, Modal } from "antd";
import React from "react";
import styled from "styled-components";
import f1Png from "./assets/1.svg";
import f2Png from "./assets/2.svg";
import f3Png from "./assets/3.svg";
import f4Png from "./assets/4.svg";
import f5Png from "./assets/5.svg";
import monthSvg from "./assets/month.png";
import m21Svg from "./assets/21.svg";
import m22Svg from "./assets/22.svg";
import m23Svg from "./assets/23.svg";
import m24Svg from "./assets/24.svg";
import m25Svg from "./assets/25.svg";
import m26Svg from "./assets/26.svg";
import { useHistory } from "react-router";

const UiRoot = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	.title {
		font-family: HarmonyOS Sans;
		font-size: 18px;
		font-weight: 900;
		line-height: 26px;
		display: flex;
		justify-content: center;
	}
	.info {
		margin-top: 12px;
		display: flex;
		justify-content: space-between;
	}
	.free {
		/* margin-right: 18px; */
		display: flex;
		width: 180px;
		height: 246px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid #d3d3d3;
		border-radius: 10px;

		.aa {
			font-family: HarmonyOS Sans;
			font-size: 20px;
			line-height: 20px;
			font-weight: 900;
			color: #40699c;
			margin-top: 16px;
		}
		.bb {
			font-family: HarmonyOS Sans;
			font-size: 18px;
			line-height: 18px;
			font-weight: normal;
			color: #40699c;
			margin-top: 22px;
			margin-bottom: 20px;
		}
		.item {
			display: flex;
			align-items: center;
			margin-bottom: 14px;
			.icon {
				width: 15px;
				height: 15px;
			}
			.text {
				line-height: 12px;
				margin-left: 12px;
				font-family: HarmonyOS Sans;
				font-size: 12px;
				font-weight: normal;
				letter-spacing: 0px;
				color: #40699c;
			}
		}
	}
	.month {
		display: flex;
		width: 180px;
		height: 246px;
		border-radius: 10px;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		.bg-img {
			position: absolute;
			width: 180px;
			height: 100%;
		}
		.aa {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			z-index: 1;
			width: 100%;
		}
		.bb {
			font-family: HarmonyOS Sans;
			font-size: 20px;
			font-weight: normal;
			margin-top: 54px;
			color: #ffffff;
			z-index: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 14px;
		}
		.item {
			display: flex;
			align-items: center;
			color: #ffffff;
			z-index: 1;
			margin-bottom: 14px;
			justify-content: center;
			.icon {
				color: #ffffff;
				width: 15px;
				height: 15px;
			}
			.text {
				line-height: 12px;
				margin-left: 12px;
				font-family: HarmonyOS Sans;
				font-size: 12px;
				font-weight: normal;
				letter-spacing: 0px;
				color: #ffffff;
			}
		}
	}
	.more {
		margin-top: 18px;
		display: flex;
		justify-content: center;
		.more-text {
			font-family: HarmonyOS Sans;
			font-size: 10px;
			font-weight: normal;
			line-height: 16px;
			letter-spacing: 0px;
			color: #ffffff;
		}
	}
`;
interface UpdateAndPlanProps {
	open: boolean;
	setOpen: (v: boolean) => void;
}
const UpdateAndPlan: React.FC<UpdateAndPlanProps> = props => {
	const { open, setOpen } = props;
	const history = useHistory();
	const jumpRoute = () => {
		history.push("/setting/upgrade");
	};
	return (
		<Modal
			open={open}
			width={436}
			footer={null}
			styles={{
				mask: {
					background: "rgba(255, 255, 255, 0.5)"
				}
			}}
			centered={true}
			onCancel={() => {
				setOpen(false);
			}}>
			<UiRoot>
				<div className="title">升级计划</div>
				<div className="info">
					<div className="free">
						<div className="aa">MYFLOW</div>
						<div className="bb">免费</div>
						<div className="item">
							<img src={f1Png} className="icon" />
							<div className="text">有限空间</div>
						</div>
						<div className="item">
							<img src={f2Png} className="icon" />
							<div className="text">多种视图</div>
						</div>

						<div className="item">
							<img src={f3Png} className="icon" />
							<div className="text">多端使用</div>
						</div>

						<div className="item">
							<img src={f4Png} className="icon" />
							<div className="text">有限支持</div>
						</div>

						<div className="item">
							<img src={f5Png} className="icon" />
							<div className="text">高级工具</div>
						</div>
					</div>
					<div className="month">
						<img src={monthSvg} className="bg-img" />
						<div className="aa">
							<img src={m21Svg} />
						</div>
						<div className="bb">
							<span>¥ 10 </span>
							<span>/月 </span>
						</div>
						<div className="item">
							<img src={m22Svg} className="icon" />
							<div className="text">团队协作</div>
						</div>
						<div className="item">
							<img src={m23Svg} className="icon" />
							<div className="text">权限编辑</div>
						</div>

						<div className="item">
							<img src={m24Svg} className="icon" />
							<div className="text">更大空间</div>
						</div>

						<div className="item">
							<img src={m25Svg} className="icon" />
							<div className="text">优先支持</div>
						</div>

						<div className="item">
							<img src={m26Svg} className="icon" />
							<div className="text">功能尝鲜</div>
						</div>
					</div>
				</div>
				<div className="more">
					<Button onClick={jumpRoute} style={{ background: "#5966D6" }} type="primary" className="more-text">
						了解更多
					</Button>
				</div>
			</UiRoot>
		</Modal>
	);
};

export default UpdateAndPlan;
