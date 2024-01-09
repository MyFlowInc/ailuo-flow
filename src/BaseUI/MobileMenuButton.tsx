import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../store/hooks";
import { selectCurFlowName } from "../store/workflowSlice";

const MobileMenuButtonRoot = styled.div`
	display: none;
	background-color: #f7f7f8;
	width: 100%;

	@media (max-width: 720px) {
		display: flex;
		align-items: center;
		padding-top: 24px;
	}
`;
interface MenuButtonProps {
	collapseHandle: () => void;
	expandHandle: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = props => {
	const { collapseHandle, expandHandle } = props;
	const [collapsed, setCollapsed] = useState(false);
	const name = useAppSelector(selectCurFlowName);

	const toggleCollapsed = () => {
		console.log("click ", collapsed);
		setCollapsed(!collapsed);
		if (collapsed) {
			collapseHandle();
		} else {
			expandHandle();
		}
	};

	return (
		<MobileMenuButtonRoot className="mobile-menu-button">
			<Button
				onTouchStart={toggleCollapsed}
				key="button"
				type="text"
				// onClick={toggleCollapsed}
			>
				{/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
				<MenuOutlined />
			</Button>
			<div>{name}</div>
		</MobileMenuButtonRoot>
	);
};
