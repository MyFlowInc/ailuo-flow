import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { saveDSMeta } from "../../../api/apitable/ds-meta";
import { selectCurFlowDstId, selectCurMetaId, setCurTableColumn, selectCurMetaData } from "../../../store/workflowSlice";
import CellEditor from "./CellEditor";
import CellLabel from "./CellLabel";

import type { WorkFlowFieldInfo } from "../../../store/workflowSlice";
import type { TableColumnItem } from "../../../store/workflowSlice";

const CellEditorWrap = styled.div<{ cell: TableColumnItem }>`
	display: flex;
	align-items: center;
	height: ${({ cell }) => (cell.type === 27 ? "400px" : "12px")};
	line-height: 12px;
	margin: 12px 0 24px 8px;
	padding: 0;
`;

interface CellEditorContextProps {
	dstColumns: WorkFlowFieldInfo[]; // 筛选 移除type=26
	form: { [id: string]: string };
	setForm: (value: any) => void;
	modalType: string;
}

const CellEditorContext: React.FC<CellEditorContextProps> = ({ dstColumns, form, setForm, modalType }) => {
	const dispatch = useAppDispatch();
	const metaId = useAppSelector(selectCurMetaId);
	const curDstId = useAppSelector(selectCurFlowDstId);
	const curMetaData = useAppSelector(selectCurMetaData);

	const [columns, setColumns] = useState<WorkFlowFieldInfo[]>(dstColumns);

	useEffect(() => {
		setColumns(dstColumns);
	}, [dstColumns]);

	const reorder = async (list: WorkFlowFieldInfo[], startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	// 更新
	const updateDsMeta = async (newDstColumns: WorkFlowFieldInfo[]) => {
		const meta_data = _.cloneDeep(curMetaData);
		const temp = _.get(meta_data, "views.0") as any;
		if (temp && meta_data) {
			temp.columns = newDstColumns.map((item: any) => {
				return {
					fieldId: item.fieldId
				};
			});
		}

		await saveDSMeta({
			id: metaId!,
			dstId: curDstId!,
			metaData: JSON.stringify(meta_data),
			revision: 0,
			deleted: false,
			sort: null,
			tenantId: null
		});
		// 同步状态
		dispatch(setCurTableColumn(newDstColumns));
	};

	const handleDragEnd = async (result: any) => {
		if (!result.destination) {
			return;
		}

		const resort = await reorder(columns, result.source.index, result.destination.index);
		setColumns(resort);
		await updateDsMeta(resort);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="droppable" type="common">
				{(provided, snapshot) => {
					return (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{columns.map((item, index) => {
								return (
									<Draggable key={"field_" + item.fieldId} draggableId={"field_" + item.fieldId} index={index} isDragDisabled={length === 1}>
										{(provided, snapshot) => {
											return (
												<CellEditorWrap cell={item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
													<CellLabel cell={item} />
													<CellEditor cell={item} form={form} setForm={setForm} modalType={modalType} />
												</CellEditorWrap>
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
	);
};

export default CellEditorContext;
