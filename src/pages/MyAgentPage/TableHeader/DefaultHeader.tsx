import React from "react";
import styled from "styled-components";
import HeaderToolBar from "./HeaderToolBar";

interface DefaultHeaderRootProps {
	isShow: boolean;
}

const DefaultHeaderRoot = styled.div<DefaultHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 0 : 1)};
	width: ${({ isShow }) => (isShow ? 0 : "100%")};
	height: ${({ isShow }) => (isShow ? 0 : "100%")};
	transition-property: height, opacity;
	transition-duration: 1s;

	.default-header-right {
		/* flex: 1; */
		display: flex;
		justify-content: space-between;
		margin-left: 12px;
	}
`;

interface DefaultHeaderProps {
	hasSelected: boolean;
	fetchAgentList: () => void; // 获取技术反馈列表
	children?: React.ReactNode;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ hasSelected }) => {
	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			<div className="default-header-right">
				<HeaderToolBar />
			</div>
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
