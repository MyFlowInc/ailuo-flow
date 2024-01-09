import React from "react";
import styled from "styled-components";
import { Popover, Button, Modal } from "antd";
import { RightOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { freshCurMetaData, selectCurFlowDstId } from "../../../../store/workflowSlice";
import { deleteDSMeta } from "../../../../api/apitable/ds-meta";

const CellLabelActionContentRoot = styled.div`
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

interface CellLabelActionContentProps {
	open: boolean;
	fieldId: string;
	typeContent: React.ReactNode;
	onEdit: () => void;
	onOpenChange: (v: boolean) => void;
	children?: React.ReactNode;
}

const CellLabelActionContent: React.FC<CellLabelActionContentProps> = ({ onEdit, fieldId, typeContent, open, onOpenChange }) => {
	const dispatch = useAppDispatch();
	const curDstId = useAppSelector(selectCurFlowDstId);

	const handleDeleteField = async () => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				console.log("OK");
				const res = await deleteDSMeta({ dstId: curDstId!, fieldIds: [fieldId] });
				if (!curDstId) {
					return;
				}
				dispatch(freshCurMetaData(curDstId));
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	return (
		<CellLabelActionContentRoot>
			<Button block type="text" rootClassName="btn-content" onClick={onEdit}>
				重命名
			</Button>
			<Button block type="text" rootClassName="btn-content" onClick={handleDeleteField}>
				删除
			</Button>
			<Popover
				content={typeContent}
				zIndex={1002}
				placement="rightTop"
				trigger="hover"
				open={open}
				onOpenChange={onOpenChange}
				arrow={false}
				overlayInnerStyle={{ padding: "4px" }}>
				<Button block type="text" rootClassName="btn-content">
					<div>
						<span>类型</span>
						<span style={{ paddingLeft: "4px" }}>
							<RightOutlined style={{ color: "#707683", fontSize: "12px" }} />
						</span>
					</div>
				</Button>
			</Popover>
		</CellLabelActionContentRoot>
	);
};

export default CellLabelActionContent;
