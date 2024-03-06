import styled from "styled-components";
import { Popconfirm, Typography, message } from "antd";
import delPng from "../../components/Notify/assets/del.svg";
import { noticeEdit, noticeRemove } from "../../api/ailuo/notice";
import { useContext, useEffect, useState } from "react";
import { ContractStatusMap, MainStatus } from "../../api/ailuo/dict";
import { DashboardRouterOutletContext } from "../../routes/DashboardRouterOutlet";
const { Paragraph } = Typography;

const NotifyItemRoot = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	padding: 6px 6px 6px 0px;

	:hover {
		background: #f3f5f7;
		cursor: pointer;
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.type {
			align-items: center;
			display: flex;
			.check {
				margin-left: 12px;
			}
			.text {
				margin-left: 14px;
				color: #707683;
			}
		}
	}
	.middle {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
		.text {
			margin-left: 44px;
			font-family: HarmonyOS Sans;
			font-size: 12px;
			line-height: 18px;
			letter-spacing: 0px;
			/* text-indent: 1em; */
		}
	}
	.buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 18px;
		.reject {
			margin-left: 8px;
		}
	}
	.time {
		display: flex;
		justify-content: flex-end;
		margin-top: 18px;
		.text {
			font-family: HarmonyOS Sans;
			font-size: 10px;
			font-weight: normal;
			line-height: 15px;
			letter-spacing: 0px;
			color: #707683;
		}
	}
`;

interface NotifyItemProps {
	freshList: () => void;
	info: {
		id: string;
		content: string;
		createTime: string;
		isRead: any;
	};
}

const NotifyItem = (props: NotifyItemProps) => {
	const { info, freshList } = props;
	const [content, setContent] = useState<any>({});
	const {
		setSaleId,
		setIsSaleModalViewOpen,
		setContractId,
		setIsContractModalViewOpen,
	} = useContext(DashboardRouterOutletContext);
	useEffect(() => {
		try {
			let c = JSON.parse(info.content);
			setContent(c);
		} catch (error) {}
	}, [info]);

	const deleteHandle = async () => {
		try {
			await noticeRemove(info.id);
			await freshList();
			message.success("删除成功");
		} catch (error) {
			console.log(error);
		}
	};
	// 已读消息
	const readHandle = async (id: string) => {
		try {
			await noticeEdit({
				id,
				isRead: 1,
			});
			await freshList();
		} catch (error) {
			console.log(error);
		}
	};
	const { status, msg, saleId, contractId } = content;
	const TitleView = () => {
		if (content.status === MainStatus.QuotationReview) {
			return <div className="text">审批提醒</div>;
		}
		if (content.status === MainStatus.Approved) {
			return <div className="text">审批提醒</div>;
		}
		if (content.status === MainStatus.ReviewFailed) {
			return <div className="text">审批驳回</div>;
		}
		// 合同相关
		if (content.status === ContractStatusMap.Reviewing) {
			return <div className="text">审批提醒</div>;
		}
		if (content.status === ContractStatusMap.ReviewFailed) {
			return <div className="text">审批驳回</div>;
		}
		return <div className="text">系统消息</div>;
	};
	const clickSaleHandle = (info: any) => {
		try {
			let { saleId, contractId } = JSON.parse(info.content);
			if (saleId) {
				setSaleId(saleId || "");
				setIsSaleModalViewOpen(true);
			}
			if (contractId) {
				setContractId(contractId || "");
				setIsContractModalViewOpen(true);
			}
		} catch (error) {}
		console.log(111, info);
	};

	return (
		<NotifyItemRoot>
			<div className="title">
				<div className="type">
					{/* <Checkbox className="check"></Checkbox> */}
					{TitleView()}
				</div>
				<Popconfirm
					title="是否删除这条通知？"
					onConfirm={deleteHandle}
					okText="确认"
					cancelText="取消"
				>
					<img src={delPng} />
				</Popconfirm>
			</div>
			<div className="middle mt-4">
				<div
					className="text"
					onClick={() => {
						if (!info.isRead) {
							readHandle(info.id);
						}
					}}
					style={{ fontWeight: !info.isRead ? "bold" : "400" }}
				>
					<Paragraph
						style={{
							whiteSpace: "pre-line",
						}}
						ellipsis={{
							rows: 4,
							expandable: true,
						}}
					>
						{content.msg}
					</Paragraph>
					<div className="flex justify-center">
						<div
							style={{
								background: "#F3F7FF",
								color: "#5966D6",
								padding: "4px 8px",
								borderRadius: "5px",
							}}
							className="flex justify-center"
						>
							<span
								onClick={() => {
									clickSaleHandle(info);
								}}
							>
								显示工单
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="time">
				<div className="text">{info.createTime}</div>
			</div>
		</NotifyItemRoot>
	);
};
export default NotifyItem;
