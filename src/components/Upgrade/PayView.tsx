import styled from "styled-components";
import pay from "./assets/pay.png";
import { useEffect, useState } from "react";
import { generateOrder, orderDetail, toPayAsPC } from "../../api/shop";
import _ from "lodash";
import { Space, Spin, Result } from "antd";
import { freshUser } from "../../store/globalSlice";
import { useAppDispatch } from "../../store/hooks";

const PaySuccessView = (props: any) => {
	return (
		<Result
			status="success"
			title="购买成功，恭喜加入会员!"
			subTitle=""
			extra={
				[
					// <Button type="primary" key="console">
					// 	去控制台
					// </Button>,
					// <Button key="buy">查看订单</Button>
				]
			}
		/>
	);
};

const UIROOT = styled.div`
	display: flex;
	flex-direction: column;
	width: 600px;
	background-color: #fff;
	border-radius: 4px;
	overflow: hidden;
	height: auto;
	.pay-img {
		width: 596px;
	}
	.content {
		display: flex;
		justify-content: center;
		margin-top: 42px;
		margin-bottom: 72px;
		align-items: center;
		.qrcode {
			margin-right: 34px;
		}
		.right {
			margin-left: 34px;
			.money {
				align-items: center;
				display: flex;
				.money-1 {
					font-size: 12px;
					font-weight: normal;
					line-height: 17px;
					letter-spacing: 0em;
					color: #3d3d3d;
				}
				.money-2 {
					margin-left: 8px;
					font-size: 24px;
					font-weight: bold;
					line-height: 17px;
					letter-spacing: 0em;
					color: #3d3d3d;
				}
			}
			.rule {
				margin-top: 18px;
				display: flex;
				align-items: center;
				.rule-1 {
					font-size: 12px;
					font-weight: normal;
					line-height: 17px;
					letter-spacing: 0em;
				}
				.rule-2 {
					color: #2845d4;
				}
			}
		}
	}
`;
const PayView = (props: any) => {
	const { className, gradeId, modalState, ids } = props;
	const dispatch = useAppDispatch();
	const [payState, setPayState] = useState<"wait" | "done" | "fail">("wait"); // 定时器

	useEffect(() => {
		if (!modalState) {
			setPayState("wait");
		}
		console.log("modalState", modalState);
		ids.forEach((timer: number) => {
			clearInterval(timer);
		});
	}, [modalState]);

	const fresh = async () => {
		dispatch(freshUser());
		console.log("freshUser");
	};

	useEffect(() => {
		let timer: number;
		const initPayment = async () => {
			const res = await generateOrder({ gradeId });
			const orderSn = _.get(res, "data.orderSn");

			const temp = await toPayAsPC({
				orderSn,
				payType: 1 // 1 支付宝支付 2 微信支付
			});

			if (temp.data) {
				window.open(temp.data);
			}

			timer = setInterval(async () => {
				const res = await orderDetail({ orderSn });
				const status = _.get(res, "data.record.0.status");
				console.log("oder detail", status);
				console.log("clear timer=", timer, modalState, ids);

				if (status === 3) {
					clearInterval(timer);
					console.log("clear timer=", timer);
					setPayState("done");
					await fresh();
				}
			}, 3000);
			ids.push(timer);
		};
		if (gradeId && payState !== "done") {
			initPayment();
		}
		return () => {
			clearInterval(timer);
			console.log("destory");
		};
	}, [gradeId, payState]);

	return (
		<UIROOT className={className}>
			<img src={pay} className="pay-img" />

			{payState === "wait" && (
				<Space direction="vertical" style={{ width: "100%" }}>
					<Spin tip="订单支付中" size="large">
						<div className="content" />
					</Spin>
				</Space>
			)}
			{payState === "done" && <PaySuccessView />}
		</UIROOT>
	);
};

export default PayView;
