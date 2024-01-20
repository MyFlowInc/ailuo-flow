
import type { CollapseProps, GetProp } from 'antd';
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Form, Tag, Input, Collapse, theme, Checkbox, Button, ConfigProvider, message } from "antd";
import { accountList } from "../../api/user";
import _ from "lodash";
import { CaretRightOutlined, DeleteFilled } from "@ant-design/icons";
import SearchFilled from "../../assets/icons/SearchFilled";
import type { CSSProperties } from 'react';
import { approveInfo, approvePersonAdd } from '../../api/ailuo/approve';
import { blueButtonTheme, greyButtonTheme } from '../../theme/theme';


const FormRoot = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0px 24px;
	.avatar-list{
		max-height: 100px;
		overflow: auto;
	}
	.operate-content{
		height: 240px;
		overflow: auto;
		border-radius: 10px;
		border: 1px solid #E5E6EB;
	}
`;

const ApproveSetting: React.FC<any> = ({
	approveModalVisible,
	setApproveModalVisible,
	curMenu
}) => {

	const [accessUserList, setAccessUserList] = useState([]);
	const [manageList, setManageList] = useState([]);
	const [financeList, setFinanceList] = useState([]);
	const [curSelectedIds, setCurSelectedIds] = useState<string[]>([]);
	const [filterValue, setFilterValue] = useState('');

	// 获取账号列表
	useEffect(() => {
		approveModalVisible && fetchUserList()
	}, [approveModalVisible])
	const fetchUserList = async () => {
		console.log(111, curMenu)
		try {
			const res = await accountList();
			const res2 = await approveInfo(curMenu.id); // 审批信息
			let record = _.get(res, "data.record", [])
			const mList = record.filter((item: any) => item.code === "manage")
			const fList = record.filter((item: any) => item.code === "finance")
			let record2 = _.get(res2, "data.record", [])
			setAccessUserList(record2)
			setManageList(mList)
			setFinanceList(fList)
			console.log(record, record2)
		} catch (error) {
			console.log(error)
		}
	}

	const ListItem = (item: any) => {
		let { avatar, nickname, postName } = item
		return <div className="flex justify-between items-center mt-4" key={'item_' + item.id}>
			<div className="flex items-center">
				<img style={{ width: '30px', height: '30px', borderRadius: '100px' }} src={avatar} />
				<span style={{ fontSize: '14px' }} className="ml-4">
					{nickname}
				</span>
				<div className="ml-4 ">
					<Tag color={"#E8F2FF"} style={{ color: "#5966D6" }}>
						{postName}
					</Tag>
				</div>
			</div>

			<div className="options">
				<DeleteFilled style={{ fontSize: "12px", color: "#707683" }} />
			</div>
		</div>
	}

	const onChange = (e: any, id: string) => {
		console.log(e, id)
		const { checked } = e.target
		if (checked) {
			const isHas = curSelectedIds.includes(id)
			if (!isHas) {
				setCurSelectedIds([...curSelectedIds, id])
			}
		} else {
			const isHas = curSelectedIds.includes(id)
			if (isHas) {
				setCurSelectedIds(curSelectedIds.filter((item) => item !== id))
			}
		}

	}
	useEffect(() => {
		console.log(curSelectedIds)
	}, [curSelectedIds])
	const getAccountList = (accountList: any) => {
		return <div className='flex flex-col pd-4'>
			{
				accountList.map((item: any) => {
					const { nickname, id } = item
					if (filterValue) {
						if (!nickname.includes(filterValue)) {
							return null
						}
					}
					return <div key={'account_' + item.id} className={'  flex items-center justify-between mb-2'}>
						<Checkbox onChange={(e) => onChange(e, id)}>{nickname}</Checkbox>
						<div style={{ color: '#707683' }} className='hidden'>已有审批权限</div>
					</div>

				})
			}
		</div>
	}
	const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
		{
			key: '1',
			label: <div style={{ fontSize: '16px' }}>总经理</div>,
			children: getAccountList(manageList),
			style: panelStyle,
		},
		{
			key: '2',
			label: <div style={{ fontSize: '16px' }}>财务部</div>,
			children: getAccountList(financeList),
			style: panelStyle,
		},

	];

	const { token } = theme.useToken();
	const panelStyle: React.CSSProperties = {
		background: '#FFFFFF',
		borderRadius: token.borderRadiusLG,
		border: 'none',
		padding: 0
	};
	const filterValueChange = (e: any) => {
		const value = e.target.value
		setFilterValue(value)
	}
	const handleSave = async () => {
		console.log(11, curSelectedIds)
		try {
			const allP = curSelectedIds.map((id) => {
				return approvePersonAdd({
					projectSaleId: curMenu.id,
					carbonUserId: id,
					relationUserId: id
				})
			})
			message.success("保存成功")
		} catch (error) {
			console.log(error)
		}

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
			styles={{
				header: {
					marginLeft: '24px'
				}
			}}
		>
			<FormRoot>
				<div style={{ color: '#848484' }}>
					当前审批人员
				</div>
				<div className="avatar-list">
					{accessUserList.map((item: any) => {
						return ListItem(item)
					})}
					{
						accessUserList.length === 0 && <div className='mt-8 flex justify-center'>暂未设置</div>
					}
				</div>
				<div style={{ color: '#848484' }} className="mt-4 mb-4">
					添加审核人员
				</div>
				<Input value={filterValue} onChange={filterValueChange} placeholder="搜索人员、部门" suffix={<SearchFilled style={{ fontSize: "16px", color: "#707683" }} />} style={{ width: '100%', height: "32px" }} />

				<div className='operate-content mt-4 flex'>
					<Collapse
						bordered={false}
						defaultActiveKey={['1', '2']}
						expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
						style={{ background: token.colorBgContainer, width: '308px' }}
						className='mb-4'
						items={getItems(panelStyle)}
					/>
					<div className='flex-1 flex flex-col' style={{ borderLeft: '1px solid #E5E6EB' }}>
						<div className='mt-4 ml-2'>
							<span>已选:</span>
							<span>{curSelectedIds.length}个</span>
						</div>
						<div className='mt-4 ml-2'>
							<span>人员:</span>
							<span>{accessUserList.length}个</span>
						</div>
					</div>
				</div>
				<div className='flex justify-center mt-4'>
					<ConfigProvider theme={greyButtonTheme}>
						<Button type="primary" onClick={() => { }}>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button className='ml-8' type="primary" onClick={() => { handleSave }}>
							保存
						</Button>
					</ConfigProvider>

				</div>
			</FormRoot>
		</Modal>
	);
};

export default ApproveSetting;
