import React from "react";
import styled from "styled-components";
import emptyListPng from "./assets/empty/empty-list.png";
import buttonPng from "./assets/empty/button.png";
import { useDispatch } from "react-redux";
const EmptyListRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.top {
		position: relative;
		width: 216px;
		height: 185px;
		.back {
			position: absolute;
			/* width: 216px;
			height: 185px; */
		}
		.add {
			position: absolute;
			bottom: 0px;
			left: 50%;
			transform: translate(-50%, -35px);
		}
	}
	.title {
		.a {
			font-family: HarmonyOS Sans;
			font-size: 18px;
			font-weight: normal;
			text-align: center;
			line-height: 23.78px;
		}
		.b {
			margin-top: 12px;
			color: #707683;
			font-family: HarmonyOS Sans;
			font-size: 12px;
			font-weight: normal;
			line-height: 23.78px;
			text-align: center;
		}
	}
`;

interface EmptyListProps {
	rootStyle?: React.CSSProperties;
	type: "list-data" | "table-data";
}

const EmptyList: React.FC<EmptyListProps> = (props) => {
	const { type, rootStyle = {} } = props;
	const dispatch = useDispatch();
	const title = type === "list-data" ? "项目" : "工单";

	return (
		<EmptyListRoot style={rootStyle}>
			<div className="top">
				<img className="back" src={emptyListPng} />
				<img className="add" src={buttonPng} />
			</div>
			<div className="title">
				<div className="a">暂无数据</div>
				<div className="b">去新建一个{title}吧</div>
			</div>
		</EmptyListRoot>
	);
};
export default EmptyList;
