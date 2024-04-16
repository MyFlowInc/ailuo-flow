import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { Steps } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { BaseLoading } from "../../BaseUI/BaseLoading";

import _ from "lodash";
import styled from "styled-components";
import PrepareForm from "./FormModal/PrepareForm";
import ReviewForm from "./FormModal/ReviewForm";
import DataConfig from "./FormModal/DataConfig";
import { SpecialHeader } from "../../components/layout/AppHeader";
const DashboardRoot = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	.ant-modal {
		height: 100vh;
	}
	.step-header {
		background: #ffffff;

		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
	}
`;

const InfoCarrdContainer = styled.div`
	display: flex;
	justify-content: space-around;
	box-shadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.1)";
	.item-col {
		display: flex;
		margin-top: 16px;
	}
	.content {
		color: #848484;
		margin-left: 8px;
	}
`;
const InfoCard = (props: any) => {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="w-full">
			<div
				className="flex justify-between items-center mt-4"
				style={{ padding: "0 10%" }}
			>
				<div
					style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "24px" }}
				>
					土耳其项目
				</div>
				<div
					style={{
						borderRadius: "5px",
						border: "1px solid #707683",
						width: "121px",
						height: "24px",
						fontSize: "12px",
						color: "#707683",
					}}
					className="flex justify-center items-center"
				>
					显示项目全部信息
				</div>
			</div>
			<div style={{ minHeight: "24px" }}>
				<InfoCarrdContainer style={{ display: showMore ? "flex" : "none" }}>
					<div className="flex flex-col mb-8">
						<div className="item-col">
							<div>项目名称</div>
							<div className="content">xxx容灾备份服务项目</div>
						</div>
						<div className="item-col">
							<div>单位名称</div>
							<div className="content">苏州xx生物科技有限公司</div>
						</div>
						<div className="item-col">
							<div>单位联系方式</div>
							<div className="content">文字</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="item-col">
							<div>销售经理</div>
							<div className="content">周时雨</div>
						</div>
						<div className="item-col">
							<div>合同编号</div>
							<div className="content">文字00</div>
						</div>
						<div className="item-col">
							<div>合同日期</div>
							<div className="content">2024年x月x日</div>
						</div>
					</div>
					<div className="flex  flex-col">
						<div className="item-col">
							<div>总价</div>
							<div className="content">文字</div>
						</div>
						<div className="item-col">
							<div>总数量</div>
							<div className="content">文字</div>
						</div>
						<div className="item-col">
							<div>交期</div>
							<div className="content">2024年x月x日</div>
						</div>
					</div>
				</InfoCarrdContainer>
				<div className="flex justify-center">
					<div
						className="w-6 h-6 flex items-center justify-center"
						style={{
							boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.3)",
							background: "#ffffff",
							transform: "translateY(10px)",
							cursor: "pointer",
						}}
						onClick={() => {
							setShowMore(!showMore);
						}}
					>
						{!showMore ? (
							<svg
								width="14"
								height="14"
								viewBox="0 0 10 10"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g transform="translate(0,2)">
									<path
										d="M1 1 L5 5 L9 1"
										stroke="currentColor"
										strokeWidth="1"
									/>
								</g>
							</svg>
						) : (
							<svg
								width="14"
								height="14"
								viewBox="0 0 10 10"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g transform="translate(0,-2)">
									<path
										d="M1 9 L5 5 L9 9"
										stroke="currentColor"
										strokeWidth="1"
									/>
								</g>
							</svg>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export const PreProductionContext = React.createContext<any>({});

const PreProductionManage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [current, setCurrent] = useState(2);

	const PreSteps = () => {
		const onChange = (value: number) => {
			console.log("onChange:", value);
			setCurrent(value);
		};
		return (
			<Steps
				className="mt-4"
				current={current}
				onChange={onChange}
				labelPlacement="vertical"
				items={[
					{
						description: "立项准备",
					},
					{
						description: "立项审核",
					},
					{
						description: "生产资料配置",
					},
					{
						description: "生产资料审核",
					},
					{
						description: "提交车间",
					},
				]}
			/>
		);
	};
	const CurForm = () => {
		if (current === 0) {
			return <PrepareForm />;
		}
		if (current === 1) {
			return <ReviewForm />;
		}

		if (current === 2) {
			return <DataConfig />;
		}
	};
	const renderInfoCard = () => {
		if (current === 2) {
			return (
				<div>
					<InfoCard />
				</div>
			);
		}
		return null;
	};
	return (
		<ConfigProvider theme={dashboardTheme}>
			<PreProductionContext.Provider value={{}}>
				<DashboardRoot>
					<div className="w-full step-header">
						<div className="w-full flex items-center ">
							<SpecialHeader menu={{ name: "预生产管理" }} />
							<PreSteps />
						</div>
						{renderInfoCard()}
					</div>
					{loading && <BaseLoading />}
					{CurForm()}
				</DashboardRoot>
			</PreProductionContext.Provider>
		</ConfigProvider>
	);
};

export default PreProductionManage;
