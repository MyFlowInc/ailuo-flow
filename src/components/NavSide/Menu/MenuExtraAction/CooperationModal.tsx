import React, { useState, useEffect } from "react";
import { ConfigProvider, Segmented, Modal, Button, Avatar, Dropdown } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/globalSlice";
import { greyButtonTheme, redButtonTheme } from "../../../../theme/theme";
import { InvitationSelect, UserListWrap } from "./InvitationModal";
import { apitableDeveloperUserList, dropDeveloper, editInviteUser } from "../../../../api/apitable/ds-share";
import CloseFilled from "../../../../assets/icons/CloseFilled";

import type { MenuProps } from "antd";
import type { DeveloperUser } from "../../../../store/globalSlice";
import type { WorkFlowInfo } from "../../../../store/workflowSlice";

const CooperationModalRoot = styled.div`
	display: flex;
	flex-direction: column;

	.cooperation-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;

		.cooperation-header-title {
			font-size: 18px;
		}
	}

	.cooperation-body {
		margin-top: 8px;
	}
`;

const CooperationListRoot = styled.div`
	display: flex;
	flex-direction: column;
	margin: 8px 0px;
	min-height: 160px;
	max-height: 360px;
	overflow: hidden auto;

	.cooperation-list-header {
		font-size: 12px;
		font-family: "Harmony_Sans_Medium", sans-serif;
		marign-bottom: 8px;
	}

	.cooperation-list-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}
`;

interface CooperationPowerContentProps {
	user: DeveloperUser;
	refresh: () => void;
	children?: React.ReactNode;
}

const CooperationPowerContent: React.FC<CooperationPowerContentProps> = ({ user, refresh }) => {
	const onClick: MenuProps["onClick"] = async ({ key }) => {
		const param =
			key === "manager"
				? { allowManage: 1 }
				: key === "editor"
				? { allowManage: 0, allowEdit: 1 }
				: key === "reader"
				? { allowManage: 0, allowEdit: 0, allowWatch: 1 }
				: { allowManage: 0, allowEdit: 0, allowWatch: 0 };

		await editInviteUser({
			id: user.id,
			...param
		});
		refresh();
	};

	const items: MenuProps["items"] = [
		{
			key: "manager",
			label: "管理员"
		},
		{
			key: "editor",
			label: "可编辑"
		},
		{
			key: "reader",
			label: "仅查看"
		}
	];

	return (
		<ConfigProvider theme={greyButtonTheme}>
			<Dropdown menu={{ items, onClick }} placement="bottom">
				<Button type="primary">{user.allowManage ? "管理员" : user.allowEdit ? "可编辑" : user.allowWatch ? "仅查看" : "无权限"}</Button>
			</Dropdown>
		</ConfigProvider>
	);
};

interface CooperationListProps {
	dstId: string | null;
	workflowInfo: WorkFlowInfo;
	close: () => void;
	children?: React.ReactNode;
}

const CooperationList: React.FC<CooperationListProps> = ({ dstId, workflowInfo, close }) => {
	const loginUser = useAppSelector(selectUser);
	const [userList, set] = useState<DeveloperUser[]>([]);

	const isOwner = loginUser.id === workflowInfo.createBy;
	const managerPower = _.get(
		userList.filter(user => user.userId === loginUser.id),
		"[0].allowManage"
	);

	const fetchUserList = async () => {
		if (!dstId) return;

		const res = await apitableDeveloperUserList(dstId);
		if (_.get(res, "data.record")) {
			set(res.data.record);
		}
	};

	const init = () => {
		fetchUserList();
	};

	useEffect(() => {
		init();
	}, []);

	const handleCancelCooperation = () => {
		if (!dstId) return;

		Modal.confirm({
			title: "是否终止协作?",
			icon: <ExclamationCircleFilled />,
			okText: "确认",
			okType: "danger",
			cancelText: "取消",
			onOk: async () => {
				await dropDeveloper({ dstId });
				close();
			},
			onCancel: () => {
				console.log("Cancel");
			}
		});
	};

	return (
		<CooperationListRoot>
			<div className="cooperation-list-header">已有{userList.length}人加入协作</div>
			{userList.map((item, index) => {
				const user = item.userInfo;
				const isCreator = item.userId === workflowInfo.createBy;
				const isOperator = item.userId === loginUser.id;
				return (
					<UserListWrap key={index}>
						<div className="user-info">
							<Avatar src={user.avatar} size={28} />
							<div className="user-info-text">
								<div>{user.username}</div>
								<div style={{ paddingTop: "5px", color: "rgba(102, 102, 102, 0.6)" }}>{user.email}</div>
							</div>
						</div>
						<div>
							{!isCreator && !isOperator && managerPower ? (
								<CooperationPowerContent user={item} refresh={fetchUserList} />
							) : (
								<ConfigProvider theme={greyButtonTheme}>
									<Button type="primary" disabled={true}>
										{item.allowManage ? "管理员" : item.allowEdit ? "可编辑" : item.allowWatch ? "仅查看" : "无权限"}
									</Button>
								</ConfigProvider>
							)}
						</div>
					</UserListWrap>
				);
			})}
			{isOwner && (
				<div className="cooperation-list-footer">
					<ConfigProvider theme={redButtonTheme}>
						<Button type="primary" onClick={handleCancelCooperation}>
							终止协作
						</Button>
					</ConfigProvider>
				</div>
			)}
		</CooperationListRoot>
	);
};

interface CooperationModalProps {
	dstId: string | null;
	workflowInfo: WorkFlowInfo;
	isCooperationModalOpen: boolean;
	closeCooperationModal: () => void;
	children?: React.ReactNode;
}

const CooperationModal: React.FC<CooperationModalProps> = ({ isCooperationModalOpen, closeCooperationModal, dstId, workflowInfo }) => {
	const [value, setValue] = useState<string | number>("权限管理");

	const handleChangeTag = (value: string | number) => {
		setValue(value);
	};

	useEffect(() => {
		isCooperationModalOpen && setValue("权限管理");
	}, [isCooperationModalOpen]);

	return (
		<Modal open={isCooperationModalOpen} footer={null} maskClosable={true} closeIcon={null} width={420} destroyOnClose={true}>
			<CooperationModalRoot>
				<div className="cooperation-header">
					<div className="cooperation-header-title">协作及权限管理</div>
					<Button type="text" icon={<CloseFilled style={{ color: "#707683", fontSize: "12px" }} />} onClick={closeCooperationModal}></Button>
				</div>
				<Segmented options={["权限管理", "邀请协作"]} defaultValue={value} block onChange={handleChangeTag} />
				<div className="cooperation-body">
					{value === "权限管理" ? (
						<CooperationList workflowInfo={workflowInfo} dstId={dstId} close={closeCooperationModal} />
					) : (
						<InvitationSelect dstId={dstId} workflowInfo={workflowInfo} />
					)}
				</div>
			</CooperationModalRoot>
		</Modal>
	);
};

export default CooperationModal;
