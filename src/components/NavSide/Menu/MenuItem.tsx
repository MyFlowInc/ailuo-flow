import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import data from "@emoji-mart/data";
import emojiZh from "./emoji-zh.json";
import Picker from "@emoji-mart/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectAllWorkflowList, updateCurFlowDstId, updateFlowIcon } from "../../../store/workflowSlice";
import { Popover, message } from "antd";
import _ from "lodash";
import { updateWorkFlow } from "../../../api/apitable/ds-table";

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
	setCurrentKey: (k: string) => void;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	onClick?: () => void;
}
const MenuKeys = ["notification", "update", "setting", "help"];
const MenuItem: React.FC<MenuItemProps> = ({ collapsed, menuKey, menuName, icon, extra, isSelected, isExtraShow, setCurrentKey, onClick, style }) => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const history = useHistory();
	const allFlowList = useAppSelector(selectAllWorkflowList);
	const [emojiOpen, setEmojiOpen] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const hide = () => {
		setEmojiOpen(false);
	};

	const handleOpenChange = (v: boolean) => {
		if (MenuKeys.includes(menuKey || "")) {
			return;
		}
		setEmojiOpen(v);
	};

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
				const path = "/dashboard/workflow-view/" + menuKey;
				if (path !== location.pathname) {
					history.push(path);
					setCurFlowDstId(menuKey);
				}
				setCurrentKey(menuKey);
		}
	};

	const updateIcon = async (info: { native: string; unified: string }) => {
		const flow = _.find(allFlowList, { dstId: menuKey });
		console.log("menuKey", flow);
		if (!flow) {
			return;
		}
		try {
			await updateWorkFlow({
				id: flow.id,
				icon: info.native
			});
			dispatch(
				updateFlowIcon({
					dstId: menuKey,
					icon: info.native
				})
			);
		} catch (error) {
			console.log("error", error);
			messageApi.open({
				type: "error",
				content: "网络异常",
				duration: 1
			});
		} finally {
			hide();
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
					<Popover
						open={emojiOpen}
						onOpenChange={handleOpenChange}
						placement="bottomLeft"
						trigger="click"
						content={<Picker onAddCustomEmoji={null} previewPosition={"none"} i18n={emojiZh} data={data} onEmojiSelect={updateIcon} />}
						arrow={false}>
						<div className="menuitem-icon">{icon}</div>
					</Popover>

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
