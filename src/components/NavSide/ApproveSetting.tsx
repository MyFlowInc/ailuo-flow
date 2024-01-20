import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Form, Tag } from "antd";
import { accountList } from "../../api/user";
import _ from "lodash";

const FormRoot = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
 
`;

const ApproveSetting: React.FC<any> = ({
	approveModalVisible,
	setApproveModalVisible
}) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [userList, setUserList] = useState([]);

	useEffect(() => {
		fetchUserList()
	}, [])
	const fetchUserList = async () => {
		try {
			const res = await accountList()
			let record = _.get(res, "data.record", [])
			record = record.filter((item: any) => item.code === "manage")
			console.log(record)
			setUserList(record)
		} catch (error) {
			console.log(error)
		}

	}
	const handleRenameMenu = () => {
		setLoading(true);
		form.validateFields().then(async () => {
			const data = form.getFieldsValue(["dstName"]);
			const { dstName } = data;
			try {
				setApproveModalVisible(false);
			} catch (error) {
				console.log("error", error);
			} finally {
				setLoading(false);
			}
		});
	};

	const initForm = () => {
		form.setFieldValue("dstName", "");
	};

	useEffect(() => {
		if (approveModalVisible && form) {
			initForm();
		}
	}, [approveModalVisible]);
	const ListItem = (item: any) => {
		let { avatar, nickname, deptName } = item
		return <div className="flex  " key={'item_' + item.id}>
			<div className="flex items-center">
				<img style={{ width: '30px', height: '30px', borderRadius: '100px' }} src={avatar} />
				<span style={{ fontSize: '14px' }} className="ml-4">
					{nickname}
				</span>
				<div className="ml-4">
					<Tag color={"#E8F2FF"} style={{ color: "#5966D6" }}>
						{deptName}
					</Tag>
				</div>
			</div>

			<div className="options">
				<img src="" />
			</div>
		</div>
	}
	return (
		<Modal
			title="审批设置"
			open={approveModalVisible}
			footer={null}
			onCancel={() => {
				setApproveModalVisible(false);
			}}
			maskClosable={true}
			focusTriggerAfterClose={false}
			destroyOnClose={true}
		>
			<FormRoot>
				<div>
					当前审批人员
				</div>
				<div className="avatar-list">
					{userList.map((item: any) => {
						return ListItem(item)
					})}
				</div>
				<div>添加审核人员</div>
			</FormRoot>
		</Modal>
	);
};

export default ApproveSetting;
