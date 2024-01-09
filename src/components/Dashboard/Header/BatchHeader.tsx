import React from "react";
import { ConfigProvider, Button, Space, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import { useAppDispatch } from "../../../store/hooks";
import { freshCurTableRows } from "../../../store/workflowSlice";
import { deleteDSCells, archiveRecords } from "../../../api/apitable/ds-record";
import FolderFilled from "../../../assets/icons/FolderFilled";
import DeleteFilled from "../../../assets/icons/DeleteFilled";
import type { FlowItemTableDataType } from "../FlowTable/core";

interface BatchHeaderRootProps {
	isShow: boolean;
}

const BatchHeaderRoot = styled.div<BatchHeaderRootProps>`
	display: flex;
	align-items: center;
	justify-content: end;
	overflow: hidden;
	opacity: ${({ isShow }) => (isShow ? 1 : 0)};
	width: ${({ isShow }) => (isShow ? "100%" : 0)};
	height: ${({ isShow }) => (isShow ? "100%" : 0)};
	transition-property: height, opacity;
	transition-duration: 1s;
`;

interface BatchHeaderProps {
	dstId: string;
	hasSelected: boolean;
	selectedRows: FlowItemTableDataType[];
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
	children?: React.ReactNode;
}

const BatchHeader: React.FC<BatchHeaderProps> = ({ dstId, hasSelected, selectedRows, setSelectedRows }) => {
	const dispatch = useAppDispatch();

	const handleBatchDelete = () => {
		Modal.confirm({
			title: "是否确认批量删除选中条目?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				const recordIds = selectedRows.map(item => item.recordId);
				await deleteDSCells({ dstId, recordIds });
				dispatch(freshCurTableRows(dstId));
				setSelectedRows([]);
			},
			onCancel: () => {
				console.log("Cancel");
			}
		});
	};

	const handleBatchArchive = () => {
		Modal.confirm({
			title: "是否确认归档?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				const ids = selectedRows.map(item => item.id);
				await archiveRecords({ ids });
				dispatch(freshCurTableRows(dstId));
				setSelectedRows([]);
			},
			onCancel: () => {
				console.log("Cancel");
			}
		});
	};

	return (
		<BatchHeaderRoot isShow={hasSelected}>
			<Space size={13}>
				<ConfigProvider theme={greyButtonTheme}>
					<Button type="primary" icon={<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />} onClick={handleBatchDelete}>
						删除
					</Button>
				</ConfigProvider>
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" icon={<FolderFilled style={{ fontSize: "12px", color: "#ffffff" }} />} onClick={handleBatchArchive}>
						归档
					</Button>
				</ConfigProvider>
			</Space>
		</BatchHeaderRoot>
	);
};

export default BatchHeader;
