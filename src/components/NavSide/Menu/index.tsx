import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCollapsed, selectIsArchive, setIsOpenDrawer } from "../../../store/globalSlice";
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
			const owerFlowList = [
				{
					name: "报价管理",
					url: "/dashboard/workflow-view/dstlpMrFpxKLdDqkvm",
					createBy: "1667098686809821185",
					updateBy: null,
					createTime: "2023-12-12 02:52:49",
					updateTime: "2024-01-10 14:56:08",
					deleted: false,
					remark: null,
					id: "1734405916127686657",
					dstId: "dstlpMrFpxKLdDqkvm",
					nodeId: "dstlpMrFpxKLdDqkvm",
					dstName: "报价管理",
					icon: "✡️",
					spaceId: "default",
					revision: 0,
					archive: 0,
					enable: false,
					sort: 1,
					tenantId: null,
					isCreator: true,
					isDeveloper: false,
					createUserInfo: {
						createBy: null,
						updateBy: null,
						createTime: "2023-06-09 09:17:55",
						updateTime: "2023-12-14 14:31:39",
						deleted: false,
						remark: "asd",
						id: "1667098686809821185",
						username: "jiangyi",
						password: "$2a$10$8DI.wy5CWZM0D53.gLbRxuXWSYaddat7O3ah9lH3AVhg05q6zloSy",
						enable: true,
						locked: false,
						roles: null,
						authorities: null,
						nickname: "jiangyi",
						email: "cn_jiangyi@163.com",
						phone: "18362983757",
						avatar: "https://s2-cdn.oneitfarm.com/1686750357705-75ced7cb339f4a1f264392a2eb2af865.gif",
						gender: "0",
						deptId: "1676119681516285954",
						deptName: null,
						postId: "1388197937639247873",
						postName: null,
						tenantId: null,
						sign: null,
						code: null,
						fromAgent: "web",
						gradeId: "1667101456283586561",
						gradeName: null,
						startTime: "2023-12-04 16:16:26",
						endTime: "2037-02-07 02:03:20",
						isInvite: 0,
						enabled: true,
						accountNonLocked: true,
						accountNonExpired: true,
						credentialsNonExpired: true
					}
				}
			] as any;
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
					title="销售部"
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
