import React, {
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button, ConfigProvider, Popover, message } from "antd";
import _ from "lodash";
import {
	TableTheme,
	blueButtonTheme,
	greyButtonTheme,
	redButtonTheme,
} from "../../../theme/theme";
import styled from "styled-components";
import SPLModeSelect from "./SPLModeSelect";
import {
	splPreProjectEdit,
	splProjectList,
} from "../../../api/ailuo/spl-pre-product";
import { PreProductionContext } from "../PreProductionManage";
import { SPLProductStatusMap } from "../../../api/ailuo/dict";
import warnSvg from "../../Sale/assets/warning.svg";
import TextArea from "antd/es/input/TextArea";
import { finalApproveEdit, flowApproveInfo } from "../../../api/ailuo/approve";
import { useAppSelector } from "../../../store/hooks";
import {
	selectIsFinance,
	selectIsManager,
	selectIsProduct,
	selectUser,
} from "../../../store/globalSlice";
import { isJsonStr } from "../../../util";

export interface DataType {
	key: React.Key;
	name: string;
	serialNumber: string;
	ingredientsList: string;
	bom: string;
	processPkg: string;
	fitOutPkg: string;
	operationInstruction: string;
}

const ApproveConfirm: (p: {
	setApproveModal: any;
	curProject: any;
	freshData: any;
	user: any;
	accessList: any;
	setIsReviewing: any;
}) => ReactNode = ({
	setApproveModal,
	curProject,
	freshData,
	user,
	accessList,
	setIsReviewing,
}) => {
	const clickHandle = async () => {
		setApproveModal(false);

		const { id } = user;
		const item = _.find(accessList, { relationUserId: id });
		if (!item) {
			return;
		}
		const approveId = item.id;
		try {
			await finalApproveEdit({
				projectSaleId: curProject.id,
				status: "approve", // 通过
				audittype: SPLProductStatusMap.MaterialsRev,
			});
			//  获取项目信息
			const res1 = await splProjectList({
				id: curProject.id,
				pageNum: 1,
				pageSize: 10,
			});
			const project = _.get(res1, "data.record[0]");
			if (!project) {
				return;
			}
			if (project.status !== "sub_workshop") {
				// 没进入下一步都是待审核
				setIsReviewing(true);
			} else {
				setIsReviewing(false);
			}
			freshData();
			// if (project.status === "materials") {
			// 	freshData(); // 刷新项目信息
			// 	return;
			// }
		} catch (error) {
			console.log(error);
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
const RejectConfirm: (p: any) => any = ({
	setRejectModal,
	curProject,
	freshData,
}) => {
	const [rejectReason, setRejectReason] = useState("");
	const rejectHandle = async () => {
		setRejectModal(false);

		try {
			console.log("驳回", curProject);
			await finalApproveEdit({
				projectSaleId: curProject.id,
				status: "reject", // 驳回
				remark: rejectReason,
				audittype: SPLProductStatusMap.MaterialsRev,
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
const renderFooter = (props: any) => {
	const {
		step,
		handleSaveRecord,
		handleSubmit,
		curProject,
		freshData,
		splId,
		user,
		setDataSource,
	} = props;

	const isFinance = useAppSelector(selectIsFinance);
	const isProduct = useAppSelector(selectIsProduct);
	const isManage = useAppSelector(selectIsManager);

	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [accessList, setAccessList] = useState<any[]>([]);
	const [isReviewing, setIsReviewing] = useState(false);

	const getAclList = async () => {
		try {
			let params: any = {
				pageNum: 1,
				pageSize: 10,
				projectSaleId: splId,
				audittype: "materials_rev",
			};
			const res = await flowApproveInfo(params);
			setAccessList(_.get(res, "data.record") || []);
		} catch (error) {
			console.log(error);
		}
	};

	const getDataSource = async () => {
		const res = await splProjectList({
			id: curProject.id,
			pageNum: 1,
			pageSize: 10,
		});
		setDataSource(
			JSON.parse(_.get(res, "data.record[0].mechanismForm") || "[]"),
		);
	};

	useEffect(() => {
		getDataSource();
	}, []);

	useEffect(() => {
		if (splId) {
			getAclList();
		}
	}, [splId]);

	// 判断是否是 审核中
	useEffect(() => {
		setIsReviewing(false);
		if (!_.isEmpty(accessList)) {
			const item = _.find(accessList, { relationUserId: user.id });
			if (!item) {
				return;
			}
			if (item.status !== "product_start") {
				// 是否是审核中判断
				setIsReviewing(true);
			} else {
				setIsReviewing(false);
			}
		}
	}, [curProject, accessList]);

	if (
		!_.find(accessList, { relationUserId: user.id }) &&
		!isProduct &&
		!isManage
	) {
		return null;
	}

	// console.log(111, isReviewing);
	if (isReviewing) {
		return (
			<ConfigProvider theme={redButtonTheme}>
				<Button type="primary">审核中...</Button>
			</ConfigProvider>
		);
	}

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
	if (
		step === SPLProductStatusMap.MaterialsRev &&
		_.find(accessList, { relationUserId: user.id })
	) {
		return (
			<>
				<ConfigProvider theme={redButtonTheme}>
					<Popover
						open={rejectModal}
						onOpenChange={(newOpen: boolean) => {
							setRejectModal(newOpen);
						}}
						content={() => {
							return RejectConfirm({
								setRejectModal,
								curProject,
								freshData,
							});
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
							return ApproveConfirm({
								setApproveModal,
								curProject,
								freshData,
								user,
								accessList,
								setIsReviewing,
							});
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

const DataConfigWrapper = styled.div`
	padding: 0 0 0 144px;
	margin-top: 24px;
`;

const DataConfig: React.FC<any> = (props: any) => {
	const { step, splId } = props;
	const [form, setForm] = useState<any>({});
	const [column, setColumn] = useState<any>([]);
	const user = useAppSelector(selectUser);
	const [dataSource, setDataSource] = useState<DataType[]>([]);

	const { curProject, setIsShowApproveModal2, freshData } = useContext(
		PreProductionContext,
	) as any;

	// 初始化form数据
	useEffect(() => {
		if (_.isEmpty(curProject)) {
			return;
		}
		const temp = curProject;
		if (typeof temp.typeSelection === "string") {
			try {
				// 处理初步选型型号
				temp.typeSelection = JSON.parse(temp.typeSelection || "[]");
			} catch (error) {
				temp.typeSelection = [];
			}
		}
		setForm(temp);
	}, [curProject]);
	// 保存
	const handleSaveRecord = async () => {
		// 未实现
		const { recordId, id, ...rest } = form;
		const params = {
			id,
			...rest,
		};
		try {
			if (!form.name) {
				message.warning("请填写名称");
				return;
			}
			try {
				if (form.typeSelection && !isJsonStr(form.typeSelection)) {
					form.typeSelection = JSON.stringify(form.typeSelection);
				}
				delete params.updateTime;
				delete params.createTime;
			} catch (error) {
				console.log(error);
			}
			await splPreProjectEdit({
				...form,
				mechanismForm: JSON.stringify(dataSource),
				// status: SPLProductStatusMap.ProReviewing,
			});
		} catch (error) {
			console.log(error);
		}
	};
	//
	const handleSubmit = async () => {
		await splPreProjectEdit({
			id: form.id,
			mechanismForm: JSON.stringify(dataSource),
		});
		setIsShowApproveModal2(true);
	};

	return (
		<DataConfigWrapper className="w-full">
			<ConfigProvider theme={TableTheme}>
				<SPLModeSelect
					key={"ModelTable" + props.key}
					{...{
						dataSource,
						setDataSource,
						step,
					}}
				/>
				<div
					className="flex w-full justify-center items-center"
					style={{ paddingRight: "200px" }}
				>
					{renderFooter({
						user,
						step,
						handleSaveRecord,
						handleSubmit,
						curProject,
						freshData,
						splId,
						setDataSource,
					})}
				</div>
			</ConfigProvider>
		</DataConfigWrapper>
	);
};

export default DataConfig;
