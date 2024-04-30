import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Popover,
	Table,
	Typography,
	message,
} from "antd";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";
import {
	TableTheme,
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import styled from "styled-components";
import SPLModeSelect from "./SPLModeSelect";
import SplDatabase from "../../SPL/SplDatabase";
import { splPreProjectEdit } from "../../../api/ailuo/spl-pre-product";
import { PreProductionContext } from "../PreProductionManage";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import warnSvg from "../../Sale/assets/warning.svg";
import TextArea from "antd/es/input/TextArea";

const DataConfigWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const DataConfig: React.FC<any> = (props: any) => {
	const { step } = props;
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);
	const { curProject, setIsShowApproveModal, freshData } = useContext(
		PreProductionContext,
	) as any;

	const handleSaveRecord = () => {
		// 未实现
		message.warning("未实现");
	};
	//
	const handleSubmit = async () => {
		try {
			await splPreProjectEdit({
				id: curProject.id,
				status: SPLProductStatusMap.MaterialsRev,
			});
			await freshData();
		} catch (error) {
			console.log(error);
		} finally {
		}
	};
	const ApproveConfirm: (p: any) => any = ({
		approveModal,
		setApproveModal,
	}) => {
		const clickHandle = async () => {
			setApproveModal(false);

			try {
				await splPreProjectEdit({
					id: curProject.id,
					status: SPLProductStatusMap.SubWorkshop,
				});
				await freshData();
			} catch (error) {
				console.log(error);
			} finally {
			}
		};
		return (
			<div className="flex flex-col items-center" style={{ width: "300px" }}>
				<div className="flex mb-4 mt-4">
					<img src={warnSvg} />
					<div>审批通过后，本项目将进入下一阶段</div>;
				</div>
				<div className="flex mb-4">
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							style={{ width: "80px" }}
							type="primary"
							className="mr-8"
							onClick={() => {
								setApproveModal(false);
							}}
						>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							style={{ width: "80px" }}
							type="primary"
							onClick={() => {
								clickHandle();
							}}
						>
							通过
						</Button>
					</ConfigProvider>
				</div>
			</div>
		);
	};

	const RejectConfirm: (p: any) => any = ({ rejectModal, setRejectModal }) => {
		const [rejectReason, setRejectReason] = useState("");
		const rejectHandle = async () => {
			setRejectModal(false);

			try {
				console.log("驳回", curProject);
				await splPreProjectEdit({
					id: curProject.id,
					status: SPLProductStatusMap.Materials,
				});
				await freshData();
			} catch (error) {
				console.log(error);
			} finally {
			}
		};
		return (
			<div className="flex flex-col" style={{ width: "300px" }}>
				<div
					className="mb-4 mt-4"
					style={{
						fontFamily: "HarmonyOS Sans",
						fontSize: "14px",
					}}
				>
					填写驳回理由
				</div>
				<div>
					<TextArea
						rows={4}
						value={rejectReason}
						onChange={(e: any) => setRejectReason(e.target.value)}
					/>
				</div>
				<div className="flex justify-center mb-4 mt-4">
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							style={{ width: "80px" }}
							type="primary"
							className="mr-8"
							onClick={() => {
								setRejectModal(false);
							}}
						>
							取消
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={redButtonTheme}>
						<Button
							style={{ width: "80px" }}
							type="primary"
							onClick={() => {
								rejectHandle();
							}}
						>
							驳回
						</Button>
					</ConfigProvider>
				</div>
			</div>
		);
	};
	const renderFooter = () => {
		const [approveModal, setApproveModal] = useState(false);
		const [rejectModal, setRejectModal] = useState(false);
		if (step === SPLProductStatusMap.Materials) {
			return (
				<>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							type="primary"
							onClick={handleSaveRecord}
							style={{ width: "100px" }}
							// style={{ padding: "0 40px" }}
						>
							保存
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							className="ml-8"
							type="primary"
							style={{ width: "100px" }}
							onClick={handleSubmit}
							// style={{ padding: "0 40px" }}
						>
							提交审核
						</Button>
					</ConfigProvider>
				</>
			);
		}
		if (step === SPLProductStatusMap.MaterialsRev) {
			return (
				<>
					<ConfigProvider theme={redButtonTheme}>
						<Popover
							open={rejectModal}
							onOpenChange={(newOpen: boolean) => {
								setRejectModal(newOpen);
							}}
							content={() => {
								return RejectConfirm({ rejectModal, setRejectModal });
							}}
							trigger="click"
						>
							<Button
								style={{ width: "80px" }}
								type="primary"
								className="mr-8"
								onClick={() => {
									setRejectModal(true);
								}}
							>
								驳回
							</Button>
						</Popover>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Popover
							open={approveModal}
							onOpenChange={(newOpen: boolean) => {
								setApproveModal(newOpen);
							}}
							content={() => {
								return ApproveConfirm({ approveModal, setApproveModal });
							}}
							trigger="click"
						>
							<Button
								style={{ width: "80px" }}
								type="primary"
								onClick={() => {
									setApproveModal(true);
								}}
							>
								通过
							</Button>
						</Popover>
					</ConfigProvider>
				</>
			);
		}
		if (step === SPLProductStatusMap.SubWorkshop) {
			return (
				<>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							type="primary"
							onClick={handleSaveRecord}
							style={{ width: "100px" }}
							// style={{ padding: "0 40px" }}
						>
							修改项目基本信息
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							type="primary"
							onClick={handleSaveRecord}
							style={{ width: "100px" }}
							// style={{ padding: "0 40px" }}
						>
							修改生产资料配置
						</Button>
					</ConfigProvider>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							className="ml-8"
							type="primary"
							style={{ width: "100px" }}
							onClick={handleSubmit}
							// style={{ padding: "0 40px" }}
						>
							提交车间
						</Button>
					</ConfigProvider>
				</>
			);
		}
	};
	return (
		<DataConfigWrapper className="w-full">
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect
					key={"ModelTable" + props.key}
					{...{
						column,
						form,
						setForm,
					}}
				/>
				<div
					className="flex w-full justify-center items-center"
					style={{ paddingRight: "200px" }}
				>
					{renderFooter()}
				</div>
			</ConfigProvider>
		</DataConfigWrapper>
	);
};

export default DataConfig;
