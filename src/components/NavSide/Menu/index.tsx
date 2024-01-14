import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCollapsed, setIsOpenDrawer } from "../../../store/globalSlice";
import MenuItem from "./MenuItem";
import BellFilled from "../../../assets/icons/BellFilled";
import AtFilled from "../../../assets/icons/AtFilled";
import MenuGroup from "./MenuGroup";

import type { WorkFlowInfo } from "../../../store/workflowSlice";
import { getUserMenu } from "../../../api/ailuo/menu";
import MenuGroupContext from "./MenuGroupContext";
import { useHistory, useLocation } from "react-router";

const MenuRoot = styled.div<{ collapsed: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 100%;
	height: calc(100%);

	.menu-content {
		display: flex;
		flex-direction: column;
		overflow: hidden auto;
		scrollbar-gutter: stable;

		::-webkit-scrollbar {
			width: 0px;
		}

		::-webkit-scrollbar-thumb {
			background: rgba(207, 207, 207, 0.3);
		}
	}

	.menu-extra {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding-left: ${({ collapsed }) => (collapsed ? "8px" : "16px")};
	}
	.menu-bottom {
		font-family: HarmonyOS Sans;
		font-size: 10px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: #cdcdcd;
	}

	.menu-item {
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
	}
`;

const Menu: React.FC = () => {
	const dispatch = useAppDispatch();
	const collapsed = useAppSelector(selectCollapsed);
	const location = useLocation();
	const history = useHistory();

	const [owerFlowList, setOwerFlowList] = useState<WorkFlowInfo[]>([]);
	const [menus, setMenus] = useState<any[]>([]);
	const showDrawer = () => {
		dispatch(setIsOpenDrawer(true));
	};
	// TODO 菜单列表
	const fetchMenu = async () => {
		try {
			const res = await getUserMenu();
			const menus = res.data || [];
			menus.sort((a, b) => a.sort - b.sort);
			// 菜单列表

			setMenus(menus);
			if (menus && menus.length > 0) {
				history.push(`/dashboard` + menus[0].path);
			}
			console.log("menus", menus);
		} catch (error) {
			console.log("error", error);
		}
	};
	useEffect(() => {
		fetchMenu();
	}, []);

	return (
		<MenuRoot collapsed={collapsed}>
			<div className="menu-content">
				<MenuGroupContext menuList={menus} type="personal" title="销售部" groupStyle={{ paddingBottom: "18px" }} />
			</div>
			<div className="menu-extra">
				<MenuGroup>
					<MenuItem
						collapsed={collapsed}
						menuKey="notification"
						menuName="通知"
						onClick={showDrawer}
						isSelected={false}
						icon={<BellFilled style={{ color: "#707683", fontSize: `${collapsed ? "16px" : "14px"}` }} />}
						style={{ marginBottom: "10px" }}
					/>
					<MenuItem
						collapsed={collapsed}
						menuName="帮助与支持"
						menuKey="help"
						isSelected={false}
						icon={<AtFilled style={{ color: "#707683", fontSize: `${collapsed ? "16px" : "14px"}` }} />}
						style={{ marginBottom: "10px" }}
					/>
				</MenuGroup>
				{!collapsed && <div className="menu-bottom flex align-middle justify-center">由弗络科技技术驱动</div>}
			</div>
		</MenuRoot>
	);
};

export default Menu;
