import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { updateCurFlowDstId } from "../../../store/workflowSlice";

interface MenutItemRootProps {
	selected: boolean;
	collapsed: boolean;
}

const MenutItemRoot = styled.div<MenutItemRootProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 100%;
	height: 27px;
	line-height: 27px;
	border-radius: 5px;
	white-space: nowrap;
	cursor: pointer;
	background-color: ${({ selected }) => (selected ? "#ffffff" : "#e8ecf1")};

	:hover {
		background-color: #ffffff;
	}

	.menuitem-icon {
		display: flex;
		align-items: center;
		margin: 0px 8px;
		white-space: nowrap;
	}

	.menuitem-text {
		align-self: center;
		flex-grow: 1;
		white-space: nowrap;
	}

	.menuitem-extra {
		display: flex;
		align-items: center;
	}

	.menuitem-action-collapse {
		position: absolute;
		right: -14px;
	}
	.popcard {
		margin: 0;
		padding: 0;
	}
`;

interface MenuItemProps {
	collapsed: boolean;
	menuKey: string;
	menuName: string;
	icon: React.ReactNode;
	extra?: React.ReactNode;
	isSelected: boolean;
	isExtraShow?: boolean;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	onClick?: () => void;
}
const MenuKeys = ["notification", "update", "setting", "help"];
const MenuItem: React.FC<MenuItemProps> = ({ collapsed, menuKey, menuName, icon, extra, isSelected, isExtraShow, onClick, style }) => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const history = useHistory();

	const setCurFlowDstId = (value: string | null) => {
		dispatch(updateCurFlowDstId(value));
	};

	// menu router jump
	const routerJumpHandler = () => {
		console.log("menuKey", menuKey);

		switch (menuKey) {
			case "notification":
				onClick && onClick();
				return;
			case "help":
				window.open("https://w0be5cxszhi.feishu.cn/share/base/form/shrcnfIiATacA2QL1NdBlMFALaf");
				return;
			case "update":
				onClick && onClick();
				return;
			default:
				if (!menuKey) return;
				const path = "/dashboard" + menuKey;
				if (path !== location.pathname) {
					history.push(path);
					setCurFlowDstId(menuKey);
				}
				console.log("setCurrentKey", menuKey);
		}
	};

	return (
		<MenutItemRoot collapsed={collapsed} selected={isSelected} style={style}>
			{collapsed ? (
				<>
					<div onClick={routerJumpHandler}>{icon}</div>
					{extra && isExtraShow && (
						<div className="menuitem-extra menuitem-action-collapse" onClick={routerJumpHandler}>
							{extra}
						</div>
					)}
				</>
			) : (
				<>
					<div className="menuitem-icon">{icon}</div>
					<div className="menuitem-text" onClick={routerJumpHandler}>
						{menuName}
					</div>
					<div className="menuitem-extra">{extra}</div>
				</>
			)}
		</MenutItemRoot>
	);
};

export default MenuItem;
