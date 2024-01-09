import React from "react";
import { Layout } from "antd";
// import { Emoji } from "emoji-picker-react";
import { useAppSelector } from "../../store/hooks";
import { selectCurFlowName, selectCurWorkflow, selectCurFlowDstId } from "../../store/workflowSlice";
import styled from "styled-components";

interface AppHeaderProps {}

const { Header } = Layout;

const UIContent = styled.div`
	display: flex;
	align-items: center;
	width: 50%;
	height: 24px;
	.title {
		display: flex;
		align-items: center;
		height: 34px;
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 0em;
		font-family: "Harmony_Sans_Bold";
		color: #000000;

		& > div:nth-child(1) {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-right: 10px;
		}
	}
`;

const AppHeader: React.FC<AppHeaderProps> = props => {
	const name = useAppSelector(selectCurFlowName);
	const curDstId = useAppSelector(selectCurFlowDstId);
	const curTable = useAppSelector(selectCurWorkflow);
	const emoji = curTable?.icon || "";

	if (!curDstId) return <></>;

	return (
		<Header style={{ height: "34px", lineHeight: "24px", padding: "5px 16px", background: "#ffffff" }}>
			<UIContent>
				<div className="title">
					<div>{emoji || "🤔"}</div>
					<div>{name}</div>
				</div>
			</UIContent>
		</Header>
	);
};

export default AppHeader;
