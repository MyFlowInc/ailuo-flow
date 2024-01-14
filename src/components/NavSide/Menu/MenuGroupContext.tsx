import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import { selectCollapsed } from "../../../store/globalSlice";
import MenuItem from "./MenuItem";
import MenuExtraAction from "./MenuExtraAction";
import { useLocation } from "react-router";

interface MenuItemWrapProps {
	collapsed: boolean;
	children?: React.ReactNode;
}

const MenuItemWrap = styled.div<MenuItemWrapProps>`
	display: flex;
	align-items: center;
	margin-bottom: 10px;

	.menu-drag-icon {
		position: relative;
		z-index: 2;
		opacity: 0;
		left: ${({ collapsed }) => (collapsed ? "2px" : "0px")};
		width: ${({ collapsed }) => (collapsed ? "8px" : "16px")};

		:hover {
			cursor: move;
		}
	}

	:hover .menu-drag-icon {
		opacity: 1;
	}
`;

interface MenuGroupContextProps {
	title: string;
	menuList: any[];
	groupStyle?: React.CSSProperties;
	children?: React.ReactNode;
}

const MenuGroupContext: React.FC<MenuGroupContextProps> = ({ title, menuList, groupStyle }) => {
	const collapsed = useAppSelector(selectCollapsed);

	const location = useLocation();
	console.log(location, "location");
	return (
		<div>
			{menuList.map((item, index) => {
				const isSelected = true;
				return (
					<MenuItemWrap collapsed={collapsed} key={"MenuItemWrap_" + index}>
						<div className="menu-drag-icon">{/* <HolderOutlined /> */}</div>
						<MenuItem
							collapsed={collapsed}
							menuKey={`${item.path}`}
							menuName={item.title}
							icon={<div> {item.icon ? item.icon : `🤔`} </div>}
							isExtraShow
							isSelected={isSelected}
							extra={<MenuExtraAction workflowInfo={item} />}
						/>
					</MenuItemWrap>
				);
			})}
		</div>
	);
};

export default MenuGroupContext;
