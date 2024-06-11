import React from "react";
import { ConfigProvider, Button } from "antd";
import styled from "styled-components";
import { blueButtonTheme } from "../../../theme/theme";
import EditFilled from "../../../assets/icons/EditFilled";
import HeaderToolBar from "./HeaderToolBar";

import { useHistory, useLocation } from "react-router";

interface DefaultHeaderRootProps {
	isShow: boolean;
}

const DefaultHeaderRoot = styled.div<DefaultHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: space-between;
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
	children?: React.ReactNode;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ hasSelected }) => {
	const location = useLocation();
	const history = useHistory();
	const { pathname } = location;
	return (
		<DefaultHeaderRoot isShow={hasSelected}>
			<div className="default-header-right">
				<HeaderToolBar />
			</div>
		</DefaultHeaderRoot>
	);
};

export default DefaultHeader;
