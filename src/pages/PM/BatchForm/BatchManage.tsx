import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { BatchStatus, DeliverStatusActionsMap, DeliverType } from "../types";
import { Button, ConfigProvider, Form, Tag, message } from "antd";
import {
	selectIsDeliver,
	selectIsManager,
	setCurDelivery,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
	getLabel,
	getTagColorByStatus,
	updateStatusByStage,
} from "../DeliverManage";
import { LeftOutlined } from "@ant-design/icons";
import {
	TableTheme,
	blueButtonTheme,
	dashboardTheme,
	greyButtonTheme,
} from "../../../theme/theme";
import ProjectForm from "./ProjectForm";
import CellEditorContext from "../FormModal/CellEditorContext";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";
import MilestoneTable from "../WorkshopStatus/Milestone/MilestoneTable";
import BatchModelTable from "./BatchModelTable";
import BatchDeliveryInfo from "./BatchDeliveryInfo";
import {
	editBatchInfo,
	getBatchInfo,
	getDeliverManage,
} from "../../../api/ailuo/deliver";
import _ from "lodash";

const getDeliverNextActionsByTypeAndStatus = (status: BatchStatus) => {
	return DeliverStatusActionsMap.batch[status];
};

const StatusView = (props: {
	id: string;
	status: BatchStatus;
	relatedProjectId: string;
	fetchBatchInfo: () => void;
}) => {
	const stage: DeliverType = "batch";
	const isManager = useAppSelector(selectIsManager);
	const isDeliver = useAppSelector(selectIsDeliver);
	const action = getDeliverNextActionsByTypeAndStatus(
		props.status,
	)?.[0] as BatchStatus;
	return (
		<div className="flex items-center">
			<div className="flex items-center">
				<div className="mr-2 text-[#848484]">状态: </div>
				<Tag
					color={getTagColorByStatus(props.status)}
					style={{ color: "#000" }}
				>
					{getLabel(stage, props.status, "statusLabel")}
				</Tag>
			</div>
			{action && (
				<div className="flex items-center ml-4">
					<div className="mr-2 text-[#848484]">操作: </div>
					<Tag
						className="cursor-pointer"
						color={"#D4F3F2"}
						style={{ color: "#000" }}
						onClick={() => {
							updateStatusByStage(
								props.id,
								stage,
								action,
								isManager || isDeliver,
								props.fetchBatchInfo,
								props.relatedProjectId,
							);
						}}
					>
						{getLabel(stage, action, "actionLabel")}
					</Tag>
				</div>
			)}
		</div>
	);
};

const BatchManage: React.FC = () => {
	const parms = useParams<{ deliverId: any; batchId: any }>();
	const delivery = useSelector((state) => (state as any).global.curDelivery);
	const isManager = useAppSelector(selectIsManager);
	const isDeliver = useAppSelector(selectIsDeliver);
	const history = useHistory();
	const dispatch = useAppDispatch();
	const [batchForm, setBatchForm] = useState<any>({});

	const batchColumn = [
		{
			title: "设备资料包",
			dataIndex: "dataPackage",
			key: "dataPackage",
			type: NumFieldType.Attachment,
			disabled: batchForm.status !== "tobe_tested",
		},
	];
	const fetchBatchInfo = async () => {
		let resp = await getBatchInfo({
			id: parms.batchId,
			relationProject: delivery.relationProject,
		});
		if (resp.success) {
			setBatchForm(resp.data.record?.[0]);
		}
	};

	const fetchDeliver = async () => {
		const res = await getDeliverManage({ id: parms.deliverId });
		if (res.code == 200) {
			dispatch(setCurDelivery(res.data.record?.[0]));
		} else {
			message.error(res.msg);
		}
	};

	const handleSave = async () => {
		let resp = await editBatchInfo({
			id: parms.batchId,
			dataPackage: batchForm.dataPackage,
		});
		if (!resp.success) {
			message.error(resp.msg);
		} else {
			message.success("保存成功");
			fetchBatchInfo();
		}
	};

	useEffect(() => {
		fetchBatchInfo();
		if (_.isEmpty(delivery)) {
			fetchDeliver();
		}
	}, [parms.batchId]);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
				<div className="flex items-center mb-2">
					<div className="font-bold text-lg">批次管理</div>
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							className="ml-4 text-[#5966D6]"
							type="primary"
							icon={<LeftOutlined />}
							onClick={() => history.goBack()}
						>
							返回交付管理
						</Button>
					</ConfigProvider>
				</div>
				<div className="flex items-center justify-between mt-4">
					<div className="text-lg">{batchForm.name}</div>
					<ConfigProvider theme={blueButtonTheme}>
						<Button
							disabled={batchForm.status !== "tobe_tested"}
							type="primary"
							onClick={() => handleSave()}
						>
							保存
						</Button>
					</ConfigProvider>
				</div>
				<div className="flex mt-4">
					<StatusView
						id={batchForm.id}
						status={batchForm.status}
						fetchBatchInfo={fetchBatchInfo}
						relatedProjectId={delivery.relationProject}
					/>
				</div>
				<div style={{ height: "88vh", overflowY: "auto" }}>
					<div className="flex mt-4">
						<ProjectForm projectId={delivery.relationProject} />
					</div>

					<div>
						<Form
							name="batchForm"
							colon={false}
							wrapperCol={{ flex: 1 }}
							preserve={false}
						>
							<CellEditorContext
								form={batchForm}
								setForm={setBatchForm}
								dstColumns={batchColumn}
								modalType={"edit"}
							/>
						</Form>
					</div>
					<ConfigProvider theme={TableTheme}>
						<div>
							<BatchModelTable
								dataSource={batchForm.equipmentinformationchildren}
								fetchBatchInfo={fetchBatchInfo}
								canAddModel={
									batchForm.status === "tobe_tested" && (isManager || isDeliver)
								}
							></BatchModelTable>
						</div>
						<div>
							<BatchDeliveryInfo
								canAddDeliverInfo={
									batchForm.status !== "not_start" &&
									batchForm.status !== "over" &&
									(isManager || isDeliver)
								}
							></BatchDeliveryInfo>
						</div>
						<div>
							<MilestoneTable
								workshopType="batch"
								status={batchForm.status}
								workshopId={batchForm.id}
							></MilestoneTable>
						</div>
					</ConfigProvider>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default BatchManage;
