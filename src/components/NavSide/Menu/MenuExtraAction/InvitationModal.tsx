import React, { useEffect, useState } from "react";
import { ConfigProvider, Modal, Form, Input, Button, Avatar } from "antd";
import styled from "styled-components";
import _ from "lodash";
import { blueButtonTheme } from "../../../../theme/theme";
import { useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/globalSlice";
import { userInvite, inviteUserList } from "../../../../api/apitable/ds-share";
import SearchFilled from "../../../../assets/icons/SearchFilled";
import CloseFilled from "../../../../assets/icons/CloseFilled";

import type { User } from "../../../../store/globalSlice";
import type { WorkFlowInfo } from "../../../../store/workflowSlice";

const InvitationModalRoot = styled.div`
	display: flex;
	flex-direction: column;

	.invitation-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;

		.invitation-header-title {
			font-size: 18px;
		}
	}
`;

const FormItemWrap = styled.div`
	display: flex;
	align-items: center;
	justify-content: start;
	margin: 8px 0;

	div:first-child {
		width: 100%;
		margin-right: 8px;
	}
`;

export const UserListWrap = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 5px;
	padding: 4px 8px;
	:hover {
		background-color: rgba(245, 245, 245, 0.88);
	}

	.user-info {
		display: flex;
		margin: 8px 0;

		.user-info-text {
			margin-left: 16px;

			div {
				height: 12px;
				line-height: 12px;
			}
		}
	}
`;

const InvitationSelectRoot = styled.div`
	display: flex;
	flex-direction: column;

	.invitation-list {
		display: flex;
		flex-direction: column;
		margin: 8px 0px;
		min-height: 160px;
		max-height: 360px;
		overflow: hidden auto;
	}
`;

interface InvitationSelectProps {
	dstId: string | null;
	workflowInfo: WorkFlowInfo;
	children?: React.ReactNode;
}

export const InvitationSelect: React.FC<InvitationSelectProps> = ({ dstId, workflowInfo }) => {
	const user = useAppSelector(selectUser);

	const [form] = Form.useForm();
	const [userList, set] = useState<User[]>([]);
	const [searchText, setSearchText] = useState<string | undefined>(undefined);

	const fetchUserList = async () => {
		if (!dstId) return;

		const res = await inviteUserList({ dstId: dstId });

		if (_.get(res, "data")) {
			const temp = res.data.filter((item: any) => {
				return item.id !== user.id && item.id !== workflowInfo.createBy;
			});
			set(temp);
		}
	};

	const init = () => {
		fetchUserList();
		setSearchText(undefined);
	};

	useEffect(() => {
		init();
	}, []);

	const handleSearchInvitor = () => {
		form.validateFields();
		setSearchText(form.getFieldValue("search"));
	};

	const handleInviteation = async (user: User) => {
		if (!dstId) return;

		const temp = { dstId: dstId, userId: `${user.id}` };
		try {
			await userInvite(temp);
			await fetchUserList();
		} catch (error) {
			console.log("clickHandler", error);
		}
		return;
	};

	return (
		<InvitationSelectRoot>
			<Form form={form} name="searchForm">
				<Form.Item name="search">
					<FormItemWrap>
						<div>
							<Input placeholder="搜索邮箱添加邀请人" />
						</div>
						<Button type="text" icon={<SearchFilled style={{ color: "#707683", fontSize: "14px" }} />} onClick={handleSearchInvitor}></Button>
					</FormItemWrap>
				</Form.Item>
			</Form>
			<div className="invitation-list">
				{searchText &&
					userList
						.filter(item => item.email.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
						.map((user, index) => {
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
										<ConfigProvider theme={blueButtonTheme}>
											<Button type="primary" onClick={() => handleInviteation(user)} disabled={user.isInvite !== 0}>
												{user.isInvite === 0 ? "发送邀请" : "已经邀请"}
											</Button>
										</ConfigProvider>
									</div>
								</UserListWrap>
							);
						})}
			</div>
		</InvitationSelectRoot>
	);
};

interface InvitationModalProps {
	dstId: string | null;
	workflowInfo: WorkFlowInfo;
	isInviteModalOpen: boolean;
	closeInvitationModal: () => void;
	children?: React.ReactNode;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ isInviteModalOpen, closeInvitationModal, dstId, workflowInfo }) => {
	return (
		<Modal open={isInviteModalOpen} maskClosable={true} destroyOnClose={true} footer={null} closeIcon={null} width={420}>
			<InvitationModalRoot>
				<div className="invitation-header">
					<div className="invitation-header-title">发起协作</div>
					<Button type="text" icon={<CloseFilled style={{ color: "#707683", fontSize: "12px" }} />} onClick={closeInvitationModal}></Button>
				</div>
				<InvitationSelect dstId={dstId} workflowInfo={workflowInfo} />
			</InvitationModalRoot>
		</Modal>
	);
};

export default InvitationModal;
