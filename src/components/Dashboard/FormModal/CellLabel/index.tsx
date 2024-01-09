import React, { useState } from "react";
import styled from "styled-components";
import { Popover } from "antd";
import { HolderOutlined, MoreOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { freshCurMetaData, selectCurFlowDstId } from "../../../../store/workflowSlice";
import { updateDSMeta } from "../../../../api/apitable/ds-meta";
import type { UpdateDSMetaParams } from "../../../../api/apitable/ds-meta";
import CellLabelActionContent from "./CellLabelActionContent";
import CellLabelEditor from "./CellLabelEditor";
import CellLabelActionTypeContent from "./CellLabelActionTypeContent";

import type { TableColumnItem } from "../../../../store/workflowSlice";

const CellLabelRoot = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	.cell-label-title {
		display: flex;

		.cell-drag-icon {
			display: flex;
			align-items: center;
			opacity: 0;
			margin: 0 4px;

			:hover {
				cursor: move;
			}
		}

		.cell-drag-text {
			width: 100px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.cell-label-action {
		display: flex;
		align-items: center;
		margin-right: 8px;
	}

	:hover .cell-drag-icon {
		opacity: 1;
	}
`;

interface CellLabelProps {
	cell: TableColumnItem;
	children?: React.ReactNode;
}

const CellLabel: React.FC<CellLabelProps> = ({ cell }) => {
	const dispatch = useAppDispatch();
	const curDstId = useAppSelector(selectCurFlowDstId) || "";

	const [type, setType] = useState<"view" | "edit">("view");
	const [open, setOpen] = useState<boolean>(false);

	const handleEditType = () => {
		setType("edit");
	};

	const handleViewType = () => {
		setType("view");
	};

	const handleUpdateField = async (name: string, type: string) => {
		try {
			const param: UpdateDSMetaParams = {
				dstId: cell.dstId,
				fieldId: cell.fieldId,
				name,
				type
			};

			await updateDSMeta(param);
			if (!curDstId) {
				return;
			}

			await dispatch(freshCurMetaData(curDstId));
			setType("view");
		} catch (error) {
			console.log("updateFieldHandler error", error);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const typeContent = <CellLabelActionTypeContent updateField={handleUpdateField} cell={cell} onOpenChange={handleOpenChange} />;

	return (
		<CellLabelRoot>
			<div className="cell-label-title">
				<div className="cell-drag-icon">
					<HolderOutlined />
				</div>
				<div className="cell-drag-text">
					{type === "view" ? <div onDoubleClick={handleEditType}>{cell.name}</div> : <CellLabelEditor onRead={handleViewType} cell={cell} updateField={handleUpdateField} />}
				</div>
			</div>
			<div className="cell-label-action">
				<Popover
					content={<CellLabelActionContent onEdit={handleEditType} fieldId={cell.fieldId} typeContent={typeContent} open={open} onOpenChange={handleOpenChange} />}
					zIndex={1001}
					placement="bottomLeft"
					trigger="hover"
					arrow={false}
					overlayInnerStyle={{ padding: "4px" }}>
					<MoreOutlined style={{ color: "#707683", fontSize: "14px" }} />
				</Popover>
			</div>
		</CellLabelRoot>
	);
};

export default CellLabel;
