import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import _ from "lodash";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { freshCurMetaData, freshCurTableRows, selectCurFlowDstId, selectCurTableColumn, setCurTableStatusList, WorkFlowStatusInfo } from "../../store/workflowSlice";
import { randomString } from "../../util";
import { UpdateDSMetaParams } from "../../api/apitable/ds-meta";
import SingleItem from "./SingleItem";
import { useEffect } from "react";
import { selectIsMember } from "../../store/globalSlice";
import { message } from "antd";

// 重新记录数组顺序
const reorder = (list: any, startIndex: number, endIndex: number) => {
	const result = Array.from(list);

	const [removed] = result.splice(startIndex, 1);

	result.splice(endIndex, 0, removed);
	return result;
};
const grid = 0;
// 设置样式
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,
	// 拖拽的时候背景变化
	// background: isDragging ? "lightgreen" : "#ffffff",
	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = () => ({
	// background: 'black',
	padding: grid,
	width: "100%"
});

const ItemSettingRoot = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	/* height: 100%; */
	overflow: auto;
	height: auto;
	min-height: 100px;
	max-height: 300px;
`;
const DnDRoot = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
`;

interface ItemSettingContainerProps {
	isLocked: boolean;
	statusList: WorkFlowStatusInfo[];
	setStatusList: (value: WorkFlowStatusInfo[]) => void;
}
const ItemSettingContainer = (props: ItemSettingContainerProps) => {
	const { isLocked, statusList, setStatusList } = props;
	const dispatch = useAppDispatch();
	const curTableColumn = useAppSelector(selectCurTableColumn);
	const curFlowDstId = useAppSelector(selectCurFlowDstId);
	const isMember = useAppSelector(selectIsMember);
	const initTable = async (dstId: string) => {
		dispatch(freshCurMetaData(dstId)).then(() => {
			dispatch(freshCurTableRows(dstId));
		});
	};

	// init table data
	const fetchDatas = async (dstId: string) => {
		await initTable(dstId);
	};

	useEffect(() => {
		curFlowDstId && fetchDatas(curFlowDstId);
	}, [curFlowDstId]);

	// 交换 状态 位置
	const onDragEnd = async (result: any) => {
		if (!result.destination) {
			return;
		}
		const res: any = reorder(statusList, result.source.index, result.destination.index);
		dispatch(setCurTableStatusList(res));
		console.log("onDragEnd", res);
		// 同步数据库
		try {
			await updateField(res);
		} catch (e) {
			console.log(e);
		}
	};
	const clickHandler = async () => {
		const options = [...statusList];
		const newItem = {
			id: "opt" + randomString(10),
			name: "新状态" + options.length,
			color: ""
		};
		options.push(newItem);
		console.log("clickHandler", options);
		// 同步数据库
		try {
			await updateField(options);
		} catch (e) {
			console.log(e);
		}
	};
	const addStatus = async (item: WorkFlowStatusInfo) => {
		const options = [...statusList];
		const length = options.length;
		// 会员 < 7
		if (isMember) {
			if (length >= 7) {
				message.warning("会员用户最多创建7个状态");

				return;
			}
		}
		if (!isMember) {
			if (length >= 4) {
				message.warning("免费用户最多创建4个状态");
				return;
			}
		}

		const newItem = {
			id: "opt" + randomString(10),
			name: "新状态" + options.length,
			color: ""
		};

		const idx = _.findIndex(options, { id: item.id });
		options.splice(idx + 1, 0, newItem);
		console.log("addStats", item, options);
		// 同步临时
		setStatusList(options);
		// 同步数据库
		// try {
		// 	await updateField(options);
		// } catch (e) {
		// 	console.log(e);
		// }
	};

	const updateStatus = async (newItem: WorkFlowStatusInfo, sync: boolean) => {
		const temp = _.cloneDeep(statusList);
		console.log("updateStatus111", newItem, temp);
		const idx = _.findIndex(temp, { id: newItem.id });
		temp.splice(idx, 1, newItem);
		// 同步临时
		setStatusList(temp);

		// 同步数据库
		// try {
		// 	await updateField(temp);
		// 	console.log("FupdateField", temp);
		// } catch (e) {
		// 	console.log(e);
		// }
	};

	// 数据库更新字段值
	const updateField = async (options: WorkFlowStatusInfo[]) => {
		const dstId = curFlowDstId;
		const optionStatusField = _.find(curTableColumn, { type: 26 });
		if (!optionStatusField || !dstId) {
			return;
		}
		const temp: UpdateDSMetaParams = {
			dstId,
			fieldId: optionStatusField.fieldId,
			name: optionStatusField.name,
			type: "OptionStatus",
			property: {
				options: options
			}
		};
		// setStatusList(temp);

		// await updateDSMeta(temp);
		// await dispatch(freshCurMetaData(dstId));
	};

	const deleteStatus = async (item: WorkFlowStatusInfo) => {
		console.log("deleteStatus", item);
		const temp = [...statusList];
		if (temp.length === 1) {
			message.warning("至少保留一个状态");
			return;
		}
		const idx = _.findIndex(temp, { id: item.id });
		temp.splice(idx, 1);
		setStatusList(temp);

		// // 同步数据库
		// try {
		// 	await updateField(temp);
		// } catch (e) {
		// 	console.log(e);
		// }
	};

	if (isLocked) {
		return (
			<ItemSettingRoot>
				<Droppable droppableId="droppable" type="common" isDropDisabled={true}>
					{(provided, snapshot) => {
						const length = statusList.length;
						return (
							<div style={getListStyle()}>
								{statusList.map((item, index) => {
									return (
										<div key={item.id}>
											<div ref={provided.innerRef} style={getItemStyle({}, {})}>
												<SingleItem
													isLocked={isLocked}
													isShowEnd={index !== length - 1}
													isShowDelete={length > 1}
													isShowMove={length > 1}
													item={item}
													addStatus={addStatus}
													updateStatus={updateStatus}
													deleteStatus={deleteStatus}
												/>
											</div>
										</div>
									);
								})}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
			</ItemSettingRoot>
		);
	}
	return (
		<ItemSettingRoot>
			<DnDRoot>
				<DragDropContext
					// onDragStart={onDragStart}
					onDragEnd={onDragEnd}
					// onDragUpdate={onDragUpdate}
				>
					<Droppable droppableId="droppable" type="common">
						{(provided, snapshot) => {
							const length = statusList.length;
							return (
								<div
									// provided.droppableProps应用的相同元素.
									{...provided.droppableProps}
									// 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
									ref={provided.innerRef}
									style={getListStyle()}>
									{statusList.map((item, index) => {
										return (
											<Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={length === 1}>
												{(provided, snapshot) => {
													return (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
															<SingleItem
																isLocked={isLocked}
																isShowEnd={index !== length - 1}
																isShowDelete={length > 1}
																isShowMove={length > 1}
																item={item}
																addStatus={addStatus}
																updateStatus={updateStatus}
																deleteStatus={deleteStatus}
															/>
														</div>
													);
												}}
											</Draggable>
										);
									})}
									{provided.placeholder}
								</div>
							);
						}}
					</Droppable>
				</DragDropContext>
			</DnDRoot>
		</ItemSettingRoot>
	);
};

export default ItemSettingContainer;
