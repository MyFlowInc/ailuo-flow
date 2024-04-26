import React, { useEffect, useState } from "react";
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
import SubmitWorkshop from "./FormModal/SubmitWorkshop";
import { useHistory, useLocation, useParams } from "react-router";
import { splProjectList } from "../../api/ailuo/spl-pre-product";
import { getStore } from "../../store";
import { SPLProductStatusMap } from "../../api/ailuo/dict";
import ApproveModal from "./FormModal/ApproveModal";
const DashboardRoot = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.ant-modal {
		height: 100vh;
	}
	.step-header {
		background: #ffffff;
		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
		padding-right: 200px;
	}
`;

const InfoCarrdContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 0 0 0 144px;
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
	const { project } = props
	const { name, company, phone, salesManager, uuid, contractTime, typeSelection, quotationEnd } = project || {}

	const getTotalNum = () => {
		let totalNum = 0;
		try {
			const list = JSON.parse(typeSelection);;
			list.forEach((item: any) => {
				totalNum += +item.num;
			});
		} catch (error) { }
		return totalNum
	}
	const getTotalPrice = () => {
		let totalPrice = 0;
		try {
			const list = JSON.parse(typeSelection);
			list.forEach((item: any) => {
				totalPrice += +item.num * +item.price;
			});
		} catch (error) { }
		console.log(222, typeSelection, totalPrice)

		return totalPrice
	}
	const [showMore, setShowMore] = useState(false);
	return (
		<div className="w-full">
			<div
				className="flex justify-between items-center mt-4"
				style={{ padding: "0 0 0 120px" }}
			>
				<div
					style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "24px" }}
				>
					{project.name}
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
							<div className="content">{name}</div>
						</div>
						<div className="item-col">
							<div>单位名称</div>
							<div className="content">{company}</div>
						</div>
						<div className="item-col">
							<div>单位联系方式</div>
							<div className="content">{phone}</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="item-col">
							<div>销售经理</div>
							<div className="content"> {salesManager}</div>
						</div>
						<div className="item-col">
							<div>合同编号</div>
							<div className="content"> {uuid}</div>
						</div>
						<div className="item-col">
							<div>合同日期</div>
							<div className="content"> {contractTime}</div>
						</div>
					</div>
					<div className="flex  flex-col">
						<div className="item-col">
							<div>总价</div>
							<div className="content"> {getTotalPrice()}</div>
						</div>
						<div className="item-col">
							<div>总数量</div>
							<div className="content"> {getTotalNum()}</div>
						</div>
						<div className="item-col">
							<div>交期</div>
							<div className="content">	{quotationEnd}</div>
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
	const [isShowApproveModal, setIsShowApproveModal] = useState(false);
	const [approveType, setApproveType] = useState("");	// pre_product
	const [currentStep, setCurrentStep] = useState(0);
	const [curProject, setCurProject] = useState<any>({});
	const params = useParams() as any;
	const fetchData = async () => {
		try {
			const splId = params.splId;
			if (!splId) {
				// 错误情况
				return;
			} else if (splId === "addfromcontract") {
				setCurrentStep(0);
				// 从合同创建
				const curContractForm = { ...getStore("global.curContractForm") };
				if (!_.isEmpty(curContractForm)) {
					const { id, // 合同id
						name,
						company,
						phone,
						salesManager,
						uuid,	// 合同编号
						contractTime,
						typeSelection,
						quotationEnd,
						relateTechProcess,
						relationSale,
						relationReview } = curContractForm

					const form = {
						id, // 合同id
						name,
						company,
						phone,
						salesManager,
						uuid,	// 合同编号
						contractTime,
						typeSelection,
						quotationEnd,
						relateTechProcess,
						relationSale,
						relationReview,
						status: SPLProductStatusMap.ProStart
					}
					setCurProject(form)
				}
			} else if (splId === "add") {
				setCurrentStep(0);
				setCurProject({
					status: SPLProductStatusMap.ProStart
				})
				// 直接新建
			} else {
				// 打开已有的项目
				const res = await splProjectList({
					id: splId,
					pageNum: 1,
					pageSize: 10,
				});
				const item = _.get(res, "data.record.0");
				if (item) {
					const { status } = item
					setCurProject(item);
					console.log('setCurProject', item.status, item)
					if (status === SPLProductStatusMap.ProStart) {
						setCurrentStep(0);
					}
					if (status === SPLProductStatusMap.ProReviewing) {
						setCurrentStep(1);
					}
					if (status === SPLProductStatusMap.Materials) {
						setCurrentStep(2);
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	// 根据路由信息获取项目
	useEffect(() => {
		fetchData();
	}, [params.splId,]);
	const freshData = async () => {
		await fetchData()
	}
	const PreSteps = () => {
		const onChange = (value: number) => {
			// return 
			setCurrentStep(value);
		};
		return (
			<Steps
				className="mt-4"
				current={currentStep}
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
		let res = null;
		if (currentStep === 0) {	// 立项
			res = (
				<div style={{ width: "600px" }}>
					<PrepareForm step={SPLProductStatusMap.ProStart} modalType="add" />
				</div>
			);
		}
		if (currentStep === 1) { // 审核
			res = (
				<div style={{ width: "600px" }}>
					<ReviewForm step={SPLProductStatusMap.ProReviewing} modalType="edit" />
				</div>
			);
		}

		if (currentStep === 2) {  // 生产资料配置
			res = <DataConfig step={SPLProductStatusMap.Materials} />;
		}
		if (currentStep === 3) { // 生产资料审核
			res = <DataConfig step={SPLProductStatusMap.MaterialsRev} />;
		}
		if (currentStep === 4) {	// 提交车间
			res = <SubmitWorkshop step={SPLProductStatusMap.SubWorkshop} />;
		}
		return (
			<div
				className="w-full flex-1 flex justify-center overflow-hidden mt-4"
			// style={{ height: "calc(100% - 200px)" }}
			>
				{res}
			</div>
		);
	};
	const renderInfoCard = () => {
		if ([2, 3, 4].includes(currentStep)) {
			return (
				<div>
					<InfoCard project={curProject} />
				</div>
			);
		}
		return null;
	};
	return (
		<ConfigProvider theme={dashboardTheme}>
			<PreProductionContext.Provider value={{
				curProject,
				setIsShowApproveModal,
				freshData
			}}>
				<DashboardRoot>
					<div
						className="w-full step-header"
						style={{ boxShadow: [0, 1].includes(currentStep) ? "unset" : "" }}
					>
						<div className="w-full flex items-center ">
							<SpecialHeader menu={{ name: "预生产管理" }} />
							<PreSteps />
						</div>
						{renderInfoCard()}
					</div>
					{CurForm()}
					<ApproveModal approveModalVisible={isShowApproveModal} setApproveModalVisible={setIsShowApproveModal} />
				</DashboardRoot>
			</PreProductionContext.Provider>
		</ConfigProvider>
	);
};

export default PreProductionManage;
