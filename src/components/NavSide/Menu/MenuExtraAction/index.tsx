import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { Popover, Button, Modal, message, ConfigProvider } from "antd";
import { MoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { deleteWorkFlow } from "../../../../api/apitable/ds-table";
import { fetchAllWorkflowList } from "../../../../controller/dsTable";
import { removeWorkflowList, selectCurFlowDstId, selectWorkflowList, updateCurFlowDstId, setWorkflowList } from "../../../../store/workflowSlice";
import InvitationModal from "./InvitationModal";
import CooperationModal from "./CooperationModal";

import type { WorkFlowInfo } from "../../../../store/workflowSlice";
import { selectIsMember } from "../../../../store/globalSlice";
import warningSvg from "../assets/warning.svg";
import { blueButtonTheme } from "../../../../theme/theme";

const ExtraActionDiv = styled.div`
	display: flex;
	flex-direction: column;

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

interface MenuExtraActionProps {
	groupType: "personal" | "teamwork";
	workflowInfo: WorkFlowInfo;
	children?: React.ReactNode;
}

const MenuExtraAction: React.FC<MenuExtraActionProps> = ({ workflowInfo }) => {
	const dispatch = useAppDispatch();
	const history = useHistory();
	const flowList = useAppSelector(selectWorkflowList);
	const curFlowDstId = useAppSelector(selectCurFlowDstId);
	const isMember = useAppSelector(selectIsMember);

	const [messageApi] = message.useMessage();

	const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
	const [isStatusSettingModalOpen, setIsStatusSettingModalOpen] = useState<boolean>(false);

	const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
	const [isCooperationModalOpen, setIsCooperationModalOpen] = React.useState(false);
	const [dstId, setDstId] = React.useState<string | null>(null);

	// 非会员 点击协作 触发 modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	const editHandler = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
		e.stopPropagation();
		openStatusSettingModal();
		return;
	};

	const delConfirm = () => {
		Modal.confirm({
			title: "是否确认删除?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				deleteHandler(workflowInfo.id);
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	// delete work flow
	const deleteHandler = async (id: string) => {
		try {
			await deleteWorkFlow(id);
			dispatch(removeWorkflowList(id));
			// update flow list
			const list = await freshWorkFlowList();
			const curFlowId = _.find(flowList, { dstId: curFlowDstId })?.id;

			if (list.length > 0) {
				if (curFlowId === id) {
					const item0 = list[0];
					history.push(item0.url);
					dispatch(updateCurFlowDstId(item0.dstId));
				}
			}
			messageApi.open({
				type: "success",
				content: "删除成功!",
				duration: 1
			});
		} catch (error) {
			console.log("error", error);
		}
	};

	// rename work flow
	const openRenameModal = () => {
		if (!workflowInfo) {
			return;
		}
		setIsRenameModalOpen(true);
	};

	const openStatusSettingModal = () => {
		if (!workflowInfo) {
			return;
		}
		setIsStatusSettingModalOpen(true);
	};

	const freshWorkFlowList = async () => {
		const list = await fetchAllWorkflowList(true);

		dispatch(setWorkflowList(list));
		return list;
	};

	const closeCooperationModal = () => {
		setIsCooperationModalOpen(false);
	};

	const openInvitationModal = () => {
		if (!workflowInfo) {
			return;
		}
		setIsInviteModalOpen(true);
		setDstId(workflowInfo.dstId);
	};

	const closeInvitationModal = () => {
		setIsInviteModalOpen(false);
	};

	const content = (
		<ExtraActionDiv>
			<Button block type="text" rootClassName="btn-content" onClick={delConfirm}>
				审批设置
			</Button>
		</ExtraActionDiv>
	);

	return (
		<React.Fragment>
			<Popover
				content={content}
				zIndex={999}
				placement="bottomLeft"
				trigger="hover"
				arrow={false}
				overlayStyle={{ padding: "5px" }}
				overlayInnerStyle={{ padding: "8px 4px" }}>
				<MoreOutlined style={{ marginRight: "8px", fontSize: "14px", fontWeight: 800 }} />
			</Popover>
			{/* 发起协作 */}
			<InvitationModal {...{ isInviteModalOpen, closeInvitationModal, workflowInfo, dstId }} />

			{/* 协作及权限管理 */}
			<CooperationModal {...{ isCooperationModalOpen, closeCooperationModal, workflowInfo, dstId }} />
		</React.Fragment>
	);
};
const UpgradeModal = (props: any) => {
	const { isModalOpen, setIsModalOpen } = props;
	const history = useHistory();

	const handleOk = () => {
		setIsModalOpen(false);
	};
	const jumpRoute = () => {
		history.push("/setting/upgrade");
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	return (
		<Modal open={isModalOpen} footer={null} width={348} onOk={handleOk} onCancel={handleCancel}>
			<div className="flex items-center">
				<img src={warningSvg} />
				<div>当前版本不支持发起协作，请升级您的计划！</div>
			</div>
			<div style={{ marginTop: "18px" }} className="flex justify-center">
				<Button onClick={handleCancel} style={{ marginRight: "36px" }}>
					取消
				</Button>
				<ConfigProvider theme={blueButtonTheme}>
					<Button type="primary" onClick={jumpRoute}>
						升级
					</Button>
				</ConfigProvider>
			</div>
		</Modal>
	);
};
export default MenuExtraAction;
