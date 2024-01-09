import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import _ from "lodash";
import { ReverSedNumFieldType } from "../../TableColumnRender";
import { FieldTypeList } from "../TypeEditor";
import { useAppSelector } from "../../../../store/hooks";
import { selectAllWorkflowList, selectCurFlowDstId } from "../../../../store/workflowSlice";

import type { TableColumnItem } from "../../../../store/workflowSlice";

const CellEditorTypeRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: "8px";

	.btn-content {
		display: flex;
		align-items: center;
		justify-content: start;
		height: 24px;
		border-radius: 3px;
		padding: 12px 8px;
		font-size: 12px;
		font-family: "Harmony_Regular", sans-serif;
	}
`;

interface CellLabelActionTypeContentProps {
	cell: TableColumnItem;
	onOpenChange: (v: boolean) => void;
	updateField: (m: string, n: string) => void;
	children?: React.ReactNode;
}

const CellLabelActionTypeContent: React.FC<CellLabelActionTypeContentProps> = ({ cell, updateField, onOpenChange }) => {
	const flowList = useAppSelector(selectAllWorkflowList);
	const curDstId = useAppSelector(selectCurFlowDstId);

	const isPersonalProject = _.get(
		flowList.filter(item => item.dstId === curDstId),
		"0.isCreator",
		false
	);

	const handleChangeFieldType = (typeItem: any) => {
		const k = ReverSedNumFieldType[typeItem.type as unknown as keyof typeof ReverSedNumFieldType] || "NotSupport";
		updateField(cell.name, k);
		onOpenChange(false);
	};

	return (
		<CellEditorTypeRoot>
			{FieldTypeList.map(item => {
				if (isPersonalProject && item.key === "Member") return <></>;

				return (
					<Button key={item.key} type="text" block icon={item.icon} rootClassName="btn-content" onClick={e => handleChangeFieldType(item)}>
						{item.label}
					</Button>
				);
			})}
		</CellEditorTypeRoot>
	);
};

export default CellLabelActionTypeContent;
