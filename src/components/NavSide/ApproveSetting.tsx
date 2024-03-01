import type { CollapseProps } from "antd";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
	Modal,
	Form,
	Tag,
	Input,
	Collapse,
	theme,
	Checkbox,
	Button,
	ConfigProvider,
	message,
	Popconfirm,
	Divider,
	Radio,
} from "antd";
import { accountList } from "../../api/user";
import _ from "lodash";
import { CaretRightOutlined, DeleteFilled } from "@ant-design/icons";
import SearchFilled from "../../assets/icons/SearchFilled";
import type { CSSProperties } from "react";
import {
	approveInfo,
	approvePersonAdd,
	approvePersonRemove,
	approveSaveBath,
} from "../../api/ailuo/approve";
import { blueButtonTheme, greyButtonTheme } from "../../theme/theme";

const FormRoot = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0px 24px;
	.avatar-list {
		max-height: 100px;
		overflow: auto;
	}
	.operate-content {
		height: 240px;
		overflow: auto;
		border-radius: 10px;
		border: 1px solid #e5e6eb;
	}
`;

const ApproveSetting: React.FC<any> = ({
	approveModalVisible,
	setApproveModalVisible,
	curMenu,
}) => {
	const [accessUserList, setAccessUserList] = useState([]);
	const [manageList, setManageList] = useState([]);
	const [financeList, setFinanceList] = useState([]);
	const [curSelectedIds, setCurSelectedIds] = useState<string[]>([]); // user id
	const [filterValue, setFilterValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [belong, setBelong] = useState("");
	const [type, setType] = useState("and");

	useEffect(() => {
		let belong = "";
		const path = _.get(curMenu, "path") || "";
		if (path.includes("quote")) {
			belong = "sale";
		}
		if (path.includes("contract")) {
			belong = "contract";
		}
		setBelong(belong);
	});
	// 获取账号列表
	useEffect(() => {
		approveModalVisible && belong && fetchUserList();
	}, [approveModalVisible, belong]);
	// 刷新列表
	const fetchUserList = async () => {
		try {
			const res = await accountList();
			const res2 = await approveInfo({ belong }); // 审批信息
			let allUserList = _.get(res, "data.record", []);
			const mList = allUserList.filter((item: any) => item.code === "manage");
			const fList = allUserList.filter((item: any) => item.code === "finance");
			let hasAccessUserList = _.get(res2, "data.record", []);
			let hasAccessList = hasAccessUserList.map((item: any) => {
				const user = allUserList.find(
					(item2: any) => item2.id === item.relationUserId,
				);
				return {
					...item,
					userInfo: user,
				};
			});
			setAccessUserList(hasAccessList); // 有权限的人
			if (!_.isEmpty(hasAccessList)) {
				const item0 = hasAccessList[0];
				const type = _.get(item0, "type");
				type && setType(type);
			}
			const ids = hasAccessList.map((item: any) => item.userInfo.id);
			setCurSelectedIds(ids);

			setManageList(mList);
			setFinanceList(fList);
		} catch (error) {
			console.log(error);
		}
	};

	const ListItem = (item: any) => {
		const { id, userInfo } = item;
		let { avatar, nickname, postName } = userInfo;
		return (
			<div
				className="flex justify-between items-center mt-4"
				key={"item_user_" + userInfo.id}
			>
				<div className="flex items-center">
					<img
						style={{ width: "30px", height: "30px", borderRadius: "100px" }}
						src={avatar}
					/>
					<span style={{ fontSize: "14px" }} className="ml-4">
						{nickname}
					</span>
					<div className="ml-4 ">
						<Tag color={"#E8F2FF"} style={{ color: "#5966D6" }}>
							{postName}
						</Tag>
					</div>
				</div>

				<div className="options">
					<Popconfirm
						title="确认移除?"
						onConfirm={() => {
							deleteHandle(id);
						}}
						okText="确认"
						cancelText="取消"
					>
						<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />
					</Popconfirm>
				</div>
			</div>
		);
	};

	const onChange = (e: any, id: string) => {
		console.log(e, id);
		const { checked } = e.target;
		if (checked) {
			const isHas = curSelectedIds.includes(id);
			if (!isHas) {
				setCurSelectedIds([...curSelectedIds, id]);
			}
		} else {
			const isHas = curSelectedIds.includes(id);
			if (isHas) {
				setCurSelectedIds(curSelectedIds.filter((item) => item !== id));
			}
		}
	};

	const getAccountList = (accountList: any) => {
		const hasAccessIds = accessUserList.map((item: any) => item.userInfo.id);

		return (
			<div className="flex flex-col pd-4">
				{accountList.map((user: any) => {
					// 根据用户信息渲染
					const { nickname, id } = user;
					if (filterValue) {
						if (!nickname.includes(filterValue)) {
							return null;
						}
					}
					const isHasAccess = hasAccessIds.includes(id);
					const checked = curSelectedIds.includes(id);
					return (
						<div
							key={"account_" + id}
							className={"  flex items-center justify-between mb-2"}
						>
							<Checkbox
								checked={checked}
								disabled={isHasAccess}
								onChange={(e) => onChange(e, id)}
							>
								{nickname}
							</Checkbox>
							<div
								style={{ color: "#707683" }}
								className={isHasAccess ? "" : "hidden"}
							>
								已有审批权限
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
		panelStyle,
	) => [
			{
				key: "1",
				label: <div style={{ fontSize: "16px" }}>总经理</div>,
				children: getAccountList(manageList),
				style: panelStyle,
			},
			{
				key: "2",
				label: <div style={{ fontSize: "16px" }}>财务部</div>,
				children: getAccountList(financeList),
				style: panelStyle,
			},
		];

	const { token } = theme.useToken();
	const panelStyle: React.CSSProperties = {
		background: "#FFFFFF",
		borderRadius: token.borderRadiusLG,
		border: "none",
		padding: 0,
	};
	const filterValueChange = (e: any) => {
		const value = e.target.value;
		setFilterValue(value);
	};
	// 新增
	const handleSave = async () => {
		setLoading(true);
		const p1 = curSelectedIds;
		const p2 = accessUserList.map((item: any) => {
			return item.userInfo.id;
		});
		const diffIds = _.difference(p1, p2);
		console.log(p1, p2, diffIds, accessUserList);
		try {
			const params = curSelectedIds.map((id) => {
				const relationUser = _.find(accessUserList, {
					relationUserId: id,
				}) as any;
				if (!_.isEmpty(relationUser)) {
					return {
						carbonUserId: id,
						relationUserId: id,
						belong,
						type,
						id: relationUser.id,
					};
				}
				return {
					carbonUserId: id,
					relationUserId: id,
					belong,
					type,
				};
			});

			await approveSaveBath(params);
			await fetchUserList();
			setTimeout(() => {
				setLoading(false);
			}, 1000);
			message.success("保存成功");
		} catch (error) {
			console.log(error);
		}
	};
	// 删除
	const deleteHandle = async (approveId: number) => {
		setLoading(true);
		try {
			await approvePersonRemove(approveId);
			await fetchUserList();
			message.success("移除成功");
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};
	const radioOnChange = (e: any) => {
		console.log("radio checked", e.target.value);
		setType(e.target.value);
	};

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
			styles={{
				header: {
					marginLeft: "24px",
				},
			}}
		>
			<FormRoot>
				<div className="mb-4" style={{ color: "#3D3D3D" }}>
					审批方式
				</div>
				<Radio.Group onChange={radioOnChange} value={type}>
					<Radio value={"and"}>会签</Radio>
					<Radio value={"or"}>或签</Radio>
				</Radio.Group>
				<Divider style={{ margin: "12px 0" }} />
				<div style={{ color: "#3D3D3D" }}>当前审批人员</div>
				<div className="avatar-list">
					{accessUserList.map((item: any) => {
						return ListItem(item);
					})}
					{accessUserList.length === 0 && (
						<div className="mt-8 flex justify-center">暂未设置</div>
					)}
				</div>
				<div style={{ color: "#3D3D3D" }} className="mt-4 mb-4">
					添加审核人员
				</div>
				<Input
					value={filterValue}
					onChange={filterValueChange}
					placeholder="搜索人员、部门"
					suffix={
						<SearchFilled style={{ fontSize: "16px", color: "#707683" }} />
					}
					style={{ width: "100%", height: "32px" }}
				/>

				<div className="operate-content mt-4 flex">
					<Collapse
						bordered={false}
						defaultActiveKey={["1", "2"]}
						expandIcon={({ isActive }) => (
							<CaretRightOutlined rotate={isActive ? 90 : 0} />
						)}
						style={{ background: token.colorBgContainer, width: "308px" }}
						className="mb-4"
						items={getItems(panelStyle)}
					/>
					<div
						className="flex-1 flex flex-col"
						style={{ borderLeft: "1px solid #E5E6EB" }}
					>
						<div className="mt-4 ml-2">
							<span>已选:</span>
							<span>{curSelectedIds.length}个</span>
						</div>
						<div className="mt-4 ml-2">
							<span>人员:</span>
							<span>{accessUserList.length}个</span>
						</div>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							loading={loading}
							type="primary"
							onClick={() => {
								setApproveModalVisible(false);
							}}
						>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							loading={loading}
							className="ml-8"
							type="primary"
							onClick={() => {
								handleSave();
							}}
						>
							保存
						</Button>
					</ConfigProvider>
				</div>
			</FormRoot>
		</Modal>
	);
};

export default ApproveSetting;
