import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAppSelector } from "../../../store/hooks";
import { selectCollapsed } from "../../../store/globalSlice";
import { resetSortWorkFlow } from "../../../api/apitable/ds-table";
import MenuItem from "./MenuItem";
import MenuExtraAction from "./MenuExtraAction";
import MenuGroup from "./MenuGroup";

import type { WorkFlowInfo } from "../../../store/workflowSlice";

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
	workflowList: WorkFlowInfo[];
	curMenuKey: string;
	setCurMenuKey: (k: string) => void;
	setWorkflowList: (v: WorkFlowInfo[]) => void;
	refetch: () => void;
	type: "personal" | "teamwork";
	groupStyle?: React.CSSProperties;
	children?: React.ReactNode;
}

const MenuGroupContext: React.FC<MenuGroupContextProps> = ({ title, workflowList, curMenuKey, setCurMenuKey, setWorkflowList, refetch, type, groupStyle }) => {
	const collapsed = useAppSelector(selectCollapsed);

	const reorder = async (list: WorkFlowInfo[], startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const handleDragEnd = async (result: any) => {
		if (!result.destination) {
			return;
		}

		const workflows = await reorder(workflowList, result.source.index, result.destination.index);
		setWorkflowList(workflows);

		await resetSortWorkFlow({
			sortType: type,
			dstIds: workflows.map(item => item.dstId as string)
		});
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			{workflowList && workflowList.length > 0 && (
				<MenuGroup title={title} collapsed={collapsed} count={workflowList.length} style={groupStyle}>
					<Droppable droppableId={`droppable_${type}`} direction="vertical">
						{(provided, snapshot) => {
							return (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									{workflowList.map((item, index) => {
										const isSelected = curMenuKey === item.dstId || false;
										return (
											<Draggable key={`item_${item.id}`} draggableId={item.id} index={index} isDragDisabled>
												{(provided, snapshot) => (
													<MenuItemWrap collapsed={collapsed} {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
														<div className="menu-drag-icon">{/* <HolderOutlined /> */}</div>
														<MenuItem
															setCurrentKey={setCurMenuKey}
															collapsed={collapsed}
															menuKey={`${item.dstId}`}
															menuName={item.dstName!}
															icon={<div> {item.icon ? item.icon : `🤔`} </div>}
															isExtraShow
															isSelected={isSelected}
															extra={<MenuExtraAction workflowInfo={item} refresh={refetch} groupType={type} />}
														/>
													</MenuItemWrap>
												)}
											</Draggable>
										);
									})}
									{provided.placeholder}
								</div>
							);
						}}
					</Droppable>
				</MenuGroup>
			)}
		</DragDropContext>
	);
};

export default MenuGroupContext;
