import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCollapsed, selectIsArchive, setIsOpenDrawer } from "../../../store/globalSlice";
import { fetchOwerWorkflowList } from "../../../controller/dsTable";
import MenuItem from "./MenuItem";
import BellFilled from "../../../assets/icons/BellFilled";
import AtFilled from "../../../assets/icons/AtFilled";
import { selectCurFlowDstId } from "../../../store/workflowSlice";
import MenuGroupContext from "./MenuGroupContext";
import MenuGroup from "./MenuGroup";

import type { WorkFlowInfo } from "../../../store/workflowSlice";

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
	const curDstId = useAppSelector(selectCurFlowDstId);
	const collapsed = useAppSelector(selectCollapsed);
	const isArchive = useAppSelector(selectIsArchive); // 是否归档

	const [owerFlowList, setOwerFlowList] = useState<WorkFlowInfo[]>([]);

	const [curMenuKey, setCurMenuKey] = useState<string>(curDstId as string);

	const showDrawer = () => {
		dispatch(setIsOpenDrawer(true));
	};
	// TODO 菜单列表
	const refetchFlowList = async () => {
		try {
			const owerFlowList = await fetchOwerWorkflowList(isArchive);
			setOwerFlowList(owerFlowList);
		} catch (error) {
			console.log("error", error);
		}
	};

	useEffect(() => {
		setCurMenuKey(curDstId as string);
	}, [curDstId]);

	useEffect(() => {
		refetchFlowList();
	}, [isArchive]);

	return (
		<MenuRoot collapsed={collapsed}>
			<div className="menu-content">
				<MenuGroupContext
					workflowList={owerFlowList}
					setWorkflowList={setOwerFlowList}
					curMenuKey={curMenuKey}
					setCurMenuKey={setCurMenuKey}
					refetch={refetchFlowList}
					type="personal"
					title="你的项目"
					groupStyle={{ paddingBottom: "18px" }}
				/>

				{/* <MenuGroupContext
					workflowList={teamFlowList}
					setWorkflowList={setTeamFlowList}
					curMenuKey={curMenuKey}
					setCurMenuKey={setCurMenuKey}
					refetch={refetchFlowList}
					type="teamwork"
					title="团队项目"
				/> */}
			</div>
			<div className="menu-extra">
				<MenuGroup>
					<MenuItem
						setCurrentKey={setCurMenuKey}
						collapsed={collapsed}
						menuKey="notification"
						menuName="通知"
						onClick={showDrawer}
						isSelected={false}
						icon={<BellFilled style={{ color: "#707683", fontSize: `${collapsed ? "16px" : "14px"}` }} />}
						style={{ marginBottom: "10px" }}
					/>
					<MenuItem
						setCurrentKey={setCurMenuKey}
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
