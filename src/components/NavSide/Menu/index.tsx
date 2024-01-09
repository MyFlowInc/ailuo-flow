import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCollapsed, selectIsArchive, selectIsMember, setIsOpenDrawer } from "../../../store/globalSlice";
import { fetchOwerWorkflowList, fetchTeamWorkflowList } from "../../../controller/dsTable";
import MenuItem from "./MenuItem";
import BellFilled from "../../../assets/icons/BellFilled";
import AtFilled from "../../../assets/icons/AtFilled";
import CheckCircleFilled from "../../../assets/icons/CheckCircleFilled";
import { selectAllWorkflowList, selectCurFlowDstId } from "../../../store/workflowSlice";
import UpdateAndPlan from "./UpdateAndPlan";
import MenuGroupContext from "./MenuGroupContext";
import MenuGroup from "./MenuGroup";

import type { WorkFlowInfo } from "../../../store/workflowSlice";

const MenuRoot = styled.div<{ collapsed: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 100%;
	height: calc(100% - 102px);

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
	const isArchive = useAppSelector(selectIsArchive);
	const allFlowList = useAppSelector(selectAllWorkflowList);

	const [owerFlowList, setOwerFlowList] = useState<WorkFlowInfo[]>([]);
	const [teamFlowList, setTeamFlowList] = useState<WorkFlowInfo[]>([]);

	const [curMenuKey, setCurMenuKey] = useState<string>(curDstId as string);
	const [updateOpen, setUpdateOpen] = useState<boolean>(false);

	const showDrawer = () => {
		dispatch(setIsOpenDrawer(true));
	};

	const refetchFlowList = async () => {
		try {
			const owerFlowList = await fetchOwerWorkflowList(isArchive);
			const teamFlowList = await fetchTeamWorkflowList(isArchive);
			setOwerFlowList(owerFlowList.filter(item => !teamFlowList.some(team => team.dstId === item.dstId)));
			setTeamFlowList(teamFlowList);
		} catch (error) {
			console.log("error", error);
		}
	};

	const showUpdateModal = () => {
		setUpdateOpen(true);
	};

	useEffect(() => {
		setCurMenuKey(curDstId as string);
	}, [curDstId]);

	useEffect(() => {
		refetchFlowList();
	}, [isArchive, allFlowList]);

	const isMember = useAppSelector(selectIsMember);
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

				<MenuGroupContext
					workflowList={teamFlowList}
					setWorkflowList={setTeamFlowList}
					curMenuKey={curMenuKey}
					setCurMenuKey={setCurMenuKey}
					refetch={refetchFlowList}
					type="teamwork"
					title="团队项目"
				/>
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
					{isMember ? null : (
						<MenuItem
							setCurrentKey={setCurMenuKey}
							collapsed={collapsed}
							menuName="升级计划"
							menuKey="update"
							onClick={showUpdateModal}
							icon={<CheckCircleFilled style={{ color: "#707683", fontSize: `${collapsed ? "16px" : "14px"}` }} />}
							isExtraShow={false}
							isSelected={false}
							extra={
								<Button type="link">
									<span style={{ fontSize: 12, fontFamily: `"Harmony_Regular", sans-serif`, color: "#1D5BD7" }}>了解更多</span>
								</Button>
							}
						/>
					)}
				</MenuGroup>
			</div>
			<UpdateAndPlan {...{ open: updateOpen, setOpen: setUpdateOpen }} />
		</MenuRoot>
	);
};

export default Menu;
