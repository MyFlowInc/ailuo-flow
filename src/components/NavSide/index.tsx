import React from "react";
import styled from "styled-components";
import { ConfigProvider } from "antd";
import NavHead from "./NavHeader";
import Menu from "./Menu/index";
import { navsideTheme } from "../../theme/theme";

const NavSideRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	font-size: 12px;
	font-family: "Harmony_Regular", sans-serif;
	width: 100%;
	height: 100%;
	margin-bottom: 8px;
`;

interface NavSideProps {
	path?: string;
	children?: React.ReactNode;
}

const NavSide: React.FC<NavSideProps> = () => {
	return (
		<ConfigProvider theme={navsideTheme}>
			<NavSideRoot>
				<NavHead />
				<Menu />
			</NavSideRoot>
		</ConfigProvider>
	);
};

export default NavSide;
