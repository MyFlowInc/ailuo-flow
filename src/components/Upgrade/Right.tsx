import React, { useEffect, useState } from "react";
import styled from "styled-components";
import checkSvg from "./assets/check.svg";
import m1Svg from "./assets/r-1.svg";
import { useAppSelector } from "../../store/hooks";
import { selectGradeList, selectIsExpired, selectIsMember } from "../../store/globalSlice";
import { Modal } from "antd";
import PayView from "./PayView";

const UpgradeRightRoot = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 234px;
	background: rgba(250, 252, 255, 0.5);
	box-shadow: 0px 4px 10px 0px rgba(89, 102, 214, 0.5);
	padding-bottom: 26px;
	border-radius: 10px;
	.content {
		height: 320px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.t1 {
			margin-top: 26px;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			width: 100%;
			.t1-1 {
				font-family: HarmonyOS Sans;
				margin-right: 16px;
				font-size: 18px;
				height: 18px;
				color: #666666;
			}
			.t1-2 {
				font-family: HarmonyOS Sans;
				font-size: 10px;
				color: #666666;
			}
		}
		.t2 {
			margin-top: -20px;
			font-family: HarmonyOS Sans;
			width: 100%;
			font-size: 12px;
			font-weight: normal;
			line-height: 16px;
			color: #000000;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.t3 {
			font-family: HarmonyOS Sans;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			font-weight: normal;
			line-height: 22.5px;
			color: #666666;
			margin-top: 10px;
		}
		.t41 {
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
			margin-top: 16px;
			font-size: 12px;
			height: 24px;
			color: #5966d6;
			.box {
				width: 156px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 16px;
				font-size: 12px;
				height: 24px;
				border: 1px solid #5966d6;
				border-radius: 5px;
				font-family: HarmonyOS Sans;
			}
		}
		.t4 {
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
			margin-top: 16px;
			font-size: 12px;
			height: 24px;
			color: #5966d6;
			.box {
				width: 156px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 16px;
				font-size: 12px;
				height: 24px;
				border: 1px solid #5966d6;
				border-radius: 5px;
				font-family: HarmonyOS Sans;
				background: #5966d6;
				color: #ffffff;
				cursor: pointer;
			}
		}
		.t5 {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 24px;
			width: 100%;
			margin-top: 22px;
			.box {
				width: 156px;
				height: 28px;
				height: 100%;
				display: flex;
				box-sizing: border-box;
				border: 1px solid #d7ddf9;
				border-radius: 5px;
				cursor: pointer;
				.month {
					flex: 1;
					font-family: HarmonyOS Sans;
					font-size: 10px;
					font-weight: 500;
					line-height: 20px;
					border-radius: 5px 0px 0px 5px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.year {
					font-family: HarmonyOS Sans;
					font-size: 10px;
					font-weight: 500;
					line-height: 20px;
					flex: 1;
					border-radius: 0px 5px 5px 0px;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					.sm-box {
						position: absolute;
						display: flex;
						flex-direction: row;
						align-items: center;
						padding: 2px 4px;
						background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #f3aa1c;
						box-sizing: border-box;
						border-radius: 2px;
						border: 0.5px solid #ff7b00;
						right: -10px;
						top: -6px;
						font-family: HarmonyOS Sans;
						font-size: 6px;
						font-weight: normal;
						line-height: 8px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #ff7b00;
					}
				}
				.selected {
					background: rgba(89, 102, 214, 0.5);
					/* 按月 */

					color: #ffffff;
				}
			}
		}
	}
	.list {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.item {
			display: flex;
			flex-direction: column;
			.text {
				font-family: HarmonyOS Sans;
				font-size: 12px;
				font-weight: normal;
				line-height: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
				letter-spacing: 0px;
				color: #666666;
				width: 134px;

				margin-top: 16px;
				margin-bottom: 16px;
			}
			.line {
				width: 134px;
				height: 1px;
				border: 1px solid #e5e6eb;
			}
		}
	}
`;

interface UpgradeRightProps {}

const UpgradeRight: React.FC<UpgradeRightProps> = props => {
	const [type, setType] = useState<"month" | "year">("month");
	const isMember = useAppSelector(selectIsMember);
	const isExpired = useAppSelector(selectIsExpired);

	// 升级 or 续费
	const [isModalOpen, setIsModalOpen] = useState(false);

	//  会员等级id
	const [gradeId, setGradeId] = useState<string>("");
	const gradeList = useAppSelector(selectGradeList);
	const [payTitle, setPayTitle] = useState<string>("");

	const openModalHandle = () => {
		const payType = isMember ? "renew" : "upgrade"; // 看后端怎么处理

		let grade;
		if (type === "month") {
			grade = gradeList.find(item => item.name.includes("月"));
		}
		if (type === "year") {
			grade = gradeList.find(item => item.name.includes("年"));
		}
		if (grade) {
			setGradeId(grade.id);
			setPayTitle([payType === "renew" ? "续费" : "升级", type === "month" ? "月" : "年", "卡会员"].join(""));
			setIsModalOpen(true);
		} else {
			console.error("grade is null");
		}
	};
	useEffect(() => {
		if (!isModalOpen) {
			reset();
		}
	}, [isModalOpen]);
	const reset = () => {
		setGradeId("");
		setPayTitle("");
	};

	return (
		<UpgradeRightRoot>
			<div className="content">
				{type === "month" && (
					<div className="t1">
						<div className="t1-1">¥ 10</div>
						<div className="t1-2">/月</div>
					</div>
				)}
				{type === "year" && (
					<div className="t1">
						<div className="t1-1">¥ 100</div>
						<div className="t1-2">/年</div>
					</div>
				)}
				<div className="t2">
					<img src={m1Svg} />
				</div>
				<div className="t3">企业管理级的全能型协作流程管理工具</div>
				{isMember && (
					<div className="t41">
						<div className="box">当前使用类型</div>
					</div>
				)}
				<div className="t4">
					<div className="box" onClick={openModalHandle}>
						{isExpired ? "续费" : isMember ? "续费" : "升级"}
					</div>
				</div>
				<div className="t5">
					<div className="box">
						<div
							onClick={() => {
								setType("month");
							}}
							className={type === "month" ? "month selected" : "month"}>
							按月
						</div>
						<div
							onClick={() => {
								setType("year");
							}}
							className={type === "year" ? "year selected" : "year"}>
							按年
							<div className="sm-box">节省17%</div>
						</div>
					</div>
				</div>
			</div>
			<div className="list">
				<div className="item">
					<div className="text">7个</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">7个</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">5 Mb</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">1 Gb</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
				<div className="item">
					<div className="text">
						<img src={checkSvg} />
					</div>
					<div className="line"></div>
				</div>
			</div>
			<SubScription isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} gradeId={gradeId} payTitle={payTitle} />
		</UpgradeRightRoot>
	);
};

const SubScription = (props: any) => {
	const { isModalOpen, setIsModalOpen, gradeId, payTitle } = props;
	const [ids, setIds] = useState<number[]>([]);
	const [randomKey, setRandomKey] = useState(0);
	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	useEffect(() => {
		setRandomKey(randomKey + 1);
		ids.forEach((timer: number) => {
			clearInterval(timer);
		});
	}, [isModalOpen]);

	return (
		<Modal title={payTitle} open={isModalOpen} width={640} onOk={handleOk} onCancel={handleCancel} footer={null}>
			<PayView key={randomKey} modalState={isModalOpen} gradeId={gradeId} ids={ids} setIds={setIds} />
		</Modal>
	);
};

export default UpgradeRight;
