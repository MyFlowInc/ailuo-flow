import styled from "styled-components";
import { LogoUI } from "./Logo";
import React from "react";
const TopBarUIRoot = styled.div`
	display: flex;
	height: 60px;
	width: 100%;
	background: #ffffff;
	flex-shrink: 0;
	border-bottom: 1px solid #dddddd;
`;
export const TopBarUI: React.FC = props => {
	return (
		<TopBarUIRoot>
			<LogoUI />
		</TopBarUIRoot>
	);
};
