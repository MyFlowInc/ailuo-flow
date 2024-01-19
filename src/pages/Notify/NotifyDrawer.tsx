import { useState, useEffect } from "react";
import styled from "styled-components";
import { getInviteList } from "../../api/apitable/ds-share";
import _ from "lodash";
import { Drawer, Empty } from "antd";
import notifyPng from "../../components/Notify/assets/notify.png";
import NotifyItem from "./NotifyItem";
const UIROOT = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background-color: #fff;
	padding: 12px 18px 0px 18px;
	.header {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.img {
				width: 12px;
				height: 14px;
				margin-left: 12px;
			}
			.text {
				margin-left: 12px;
				font-family: HarmonyOS Sans;
				font-size: 18px;
				font-weight: 900;
				line-height: normal;
				color: #000000;
			}
		}
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-top: 32px;
	}
`;
interface NotifyDrawerProps {
	isOpenDrawer: boolean;
	onDrawerClose: () => void;
}
const NotifyDrawer = (props: NotifyDrawerProps) => {
	const { isOpenDrawer, onDrawerClose } = props;
	const [inviteList, setInviteList] = useState<any[]>([]);

	const fetchInviteList = async () => {
		const res1 = await getInviteList({});
		const list1 = _.get(res1, "data.record") || [];
		const res2 = await getInviteList({ ignoreMsg: 1 });
		const list2 = _.get(res2, "data.record") || [];
		setInviteList([...list1, ...list2]);
	};

	const freshInviteList = async () => {
		await fetchInviteList();
	};

	useEffect(() => {
		if (!isOpenDrawer) {
			return;
		}
		fetchInviteList();
	}, [isOpenDrawer]);

	return (
		<Drawer placement="left" classNames={{ body: "drawer-body" }} closable={false} onClose={onDrawerClose} open={isOpenDrawer} getContainer={false}>
			<UIROOT className="notify">
				<div className="header">
					<div className="left">
						<img className="img" src={notifyPng} />
						<div className="text">通知</div>
					</div>
					{/* <Button style={{ background: "#5966D6" }} type="primary">
						全部已读
					</Button> */}
				</div>
				<div className="content">
					{inviteList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
					{inviteList.length > 0 &&
						inviteList.map((item, index) => {
							return <NotifyItem key={"invite_list_" + index} info={item} freshInviteList={freshInviteList} />;
						})}
				</div>
			</UIROOT>
		</Drawer>
	);
};

export default NotifyDrawer;
