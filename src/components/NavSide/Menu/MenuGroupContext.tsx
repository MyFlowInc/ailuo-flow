import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import { selectCollapsed } from "../../../store/globalSlice";
import MenuItem from "./MenuItem";
import MenuExtraAction from "./MenuExtraAction";
import { useLocation } from "react-router";
import { IMenu } from "../../../api/ailuo/menu";
import { getImgByName } from "./MenuIconMap";

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
	menuList: IMenu[];
	groupStyle?: React.CSSProperties;
	children?: React.ReactNode;
}

const MenuGroupContext: React.FC<MenuGroupContextProps> = ({ menuList }) => {
	const collapsed = useAppSelector(selectCollapsed);
	const location = useLocation();
	console.log(location, "location");

	const getIcon = (menu: IMenu) => {
		const { component } = menu;
		const imgPath = getImgByName(component);
		return <img src={imgPath} />;
	};
	return (
		<div>
			{menuList.map((item, index) => {
				const isSelected = "/dashboard" + item.path === location.pathname;
				return (
					<MenuItemWrap collapsed={collapsed} key={"MenuItemWrap_" + index}>
						<div className="menu-drag-icon">{/* <HolderOutlined /> */}</div>
						<MenuItem
							collapsed={collapsed}
							menuKey={`${item.path}`}
							menuName={item.title}
							icon={<div> {getIcon(item)} </div>}
							isExtraShow
							isSelected={isSelected}
							extra={<MenuExtraAction menu={item} />}
						/>
					</MenuItemWrap>
				);
			})}
		</div>
	);
};

export default MenuGroupContext;
