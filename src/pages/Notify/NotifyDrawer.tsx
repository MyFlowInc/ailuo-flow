import { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Drawer, Empty, Modal } from "antd";
import notifyPng from "../../components/Notify/assets/notify.png";
import NotifyItem from "./NotifyItem";
import { noticeListFetch } from "../../api/ailuo/notice";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import React from "react";
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
	const [noticeList, setNoticeList] = useState([]); // 通知列表
	const user = useAppSelector(selectUser);



	const fetchNoticeList = async () => {
		if (!user) {
			return;
		}
		try {
			const res = await noticeListFetch(user.id);
			const record = _.get(res, "data.record");
			setNoticeList(record || []);
		} catch (error) {
			console.log(error);
		}
	};

	const freshList = async () => {
		await fetchNoticeList();
	};

	useEffect(() => {
		if (!isOpenDrawer) {
			return;
		}
		fetchNoticeList();
	}, [isOpenDrawer]);

	return (
		<Drawer
			placement="left"
			classNames={{ body: "drawer-body" }}
			closable={false}
			onClose={onDrawerClose}
			open={isOpenDrawer}
			getContainer={false}
		>
			<UIROOT className="notify">
				<div className="header">
					<div className="left">
						<img className="img" src={notifyPng} />
						<div className="text">通知</div>
					</div>
				</div>
				<div className="content">
					{noticeList.length === 0 && (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					)}
					{noticeList.length > 0 &&
						noticeList.map((item, index) => {
							return (
								<NotifyItem
									key={"invite_list_" + index}
									info={item}
									freshList={freshList}
								/>
							);
						})}
				</div>
			</UIROOT>
		</Drawer>

	);
};

export default NotifyDrawer;
