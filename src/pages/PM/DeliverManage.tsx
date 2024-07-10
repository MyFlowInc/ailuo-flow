import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Tag, ConfigProvider, Button, message, Table } from "antd";
import {
	selectIsManager,
	selectIsWorkshop,
	setCurDelivery,
} from "../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TableTheme, blueButtonTheme } from "../../theme/theme";
import {
	BatchStatus,
	DeliverStatus,
	DeliverStatusActionsMap,
	DeliverType,
	DeliverTypeStatusTagLabelMap,
} from "./types";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import {
	editBatchInfo,
	editDeliverManage,
	getBatchInfo,
	getDeliverManage,
	removeBatchInfo,
} from "../../api/ailuo/deliver";

const getDeliverNextActionsByTypeAndStatus = (status: DeliverStatus) => {
	return DeliverStatusActionsMap.deliver[status];
};

export const getLabel = (
	stage: DeliverType,
	status: DeliverStatus | BatchStatus,
	labelType: "statusLabel" | "actionLabel",
) => {
	return DeliverTypeStatusTagLabelMap[stage][labelType][status];
};

export const updateStatusByStage = async (
	id: string,
	stage: DeliverType,
	status: DeliverStatus | BatchStatus,
	valid = false,
	refreshBatch?: () => void,
	relatedProjectsId?: string,
) => {
	if (valid) {
		let res: any;
		//调用接口不一样。。
		if (stage === "deliver") {
			//update deliver status
			res = await editDeliverManage({ id, status });
		} else {
			res = await editBatchInfo({ id, status });
		}
		if (!res.success) {
			message.error(res.msg);
		} else if (refreshBatch) {
			refreshBatch();
		}
	} else {
		message.error("只有车间人员和经理可更改状态");
	}
};

export const getTagColorByStatus = (status: DeliverStatus | BatchStatus) => {
	switch (status) {
		case "not_start":
			return "#E8F2FF";
		case "start":
			return "#FFEEE3";
		case "over":
			return "#E8FFEA";
		//不知道啥颜色
		case "received":
		case "delivering":
		case "prepare_done":
			return "#E8FFEA";
	}
};

const StatusView = (props: {
	id: string;
	status: DeliverStatus;
	relatedProjectId: string;
	fecthDeliver: () => void;
}) => {
	const stage: DeliverType = "deliver";
	const isManager = useAppSelector(selectIsManager);
	const isWorkshop = useAppSelector(selectIsWorkshop);
	const action = getDeliverNextActionsByTypeAndStatus(
		props.status,
	)?.[0] as DeliverStatus;
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
								isWorkshop || isManager,
								props.fecthDeliver,
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

const DeliverManage: React.FC = () => {
	const delivery = useSelector((state) => (state as any).global.curDelivery);
	const params = useParams<{ deliverId: string }>();
	const history = useHistory();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const [dataSource, setDataSource] = useState<any[]>([]);

	const fetchDeliver = async () => {
		const res = await getDeliverManage({ id: params.deliverId });
		if (res.code == 200) {
			dispatch(setCurDelivery(res.data.record?.[0]));
			await fetchBatchInfo(res.data.record?.[0]?.relationProject);
		} else {
			message.error(res.msg);
		}
	};

	const fetchBatchInfo = async (relationProject: string) => {
		const res = await getBatchInfo({
			relationProject,
		});
		if (!res.success) {
			message.error(res.msg);
		} else {
			setDataSource(res.data.record);
		}
	};
	const handleDeliver = async (
		id: string,
		type: "whole_batch" | "in_batch",
	) => {
		let res = await editDeliverManage({ id, remark: type });
		if (res.code == 200) {
			fetchDeliver();
		} else {
			message.error(res.msg);
		}
	};

	const addBatch = async (id: string) => {
		let res = await editDeliverManage({
			id,
			addTo: "true",
			remark: delivery.remark,
		});
		history.push(location.pathname + "/batch-manage/" + res.data);
	};
	const handleEdit = (record: any) => {
		history.push(location.pathname + "/batch-manage/" + record.id);
	};
	const shouldDisabled = (record: any) => {
		return false;
	};
	const handleDelete = async (record: any) => {
		let res = await removeBatchInfo({ id: record.id });
		if (!res.success) {
			message.error(res.msg);
		}
		fetchBatchInfo(delivery.relationProject);
	};

	useEffect(() => {
		fetchDeliver();
	}, [params.deliverId]);

	const defaultColumns: any[] = [
		{
			title: "批次",
			dataIndex: "name",
			key: "name",
			type: NumFieldType.SingleText,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			type: NumFieldType.SingleText,
			render: (record: any) => {
				return (
					<Tag color={getTagColorByStatus(record)} style={{ color: "#000" }}>
						{getLabel("batch", record, "statusLabel")}
					</Tag>
				);
			},
		},
		{
			title: "批次型号",
			dataIndex: "equipmentinformationchildren",
			key: "equipmentinformationchildren",
			render: (record: any) => {
				return record?.map((item: any) => {
					return (
						<Tag key={item.id} color={"#F3F7FF"} style={{ color: "#000" }}>
							{item.name}
						</Tag>
					);
				});
			},
		},
		{
			width: 90,
			title: "操作",
			dataIndex: "action",
			key: "action",
			render: (text: any, record: any, index: number) => {
				return (
					<div className="flex items-center justify-around">
						<Button
							type="text"
							color="#717682"
							icon={<EditFilled />}
							className="text-[#717682]"
							onClick={() => handleEdit(record)}
						></Button>
						<Button
							type="text"
							color="#717682"
							icon={<DeleteFilled />}
							className="text-[#717682]"
							disabled={shouldDisabled(record)}
							onClick={() => handleDelete(record)}
						></Button>
					</div>
				);
			},
		},
	];

	return (
		<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
			<div className="flex items-center mb-2">
				<div className="font-bold text-lg">交付管理</div>
			</div>
			<div className="flex items-center justify-between mt-4">
				<div className="flex items-center">
					<StatusView
						id={delivery.id}
						status={delivery.status}
						fecthDeliver={fetchDeliver}
						relatedProjectId={delivery.relationProject}
					/>
					{delivery.remark && (
						<ConfigProvider theme={blueButtonTheme}>
							<Button
								className="ml-4"
								type="primary"
								onClick={() => addBatch(delivery.id)}
							>
								添加批次
							</Button>
						</ConfigProvider>
					)}
				</div>

				{delivery.status === "start" && (
					<div className="flex items-center justify-between">
						<ConfigProvider theme={blueButtonTheme}>
							{(!delivery.remark || delivery.remark === "whole_batch") && (
								<Button
									disabled={delivery.remark}
									className="ml-4"
									type="default"
									onClick={() => handleDeliver(delivery.id, "whole_batch")}
								>
									整批交付
								</Button>
							)}
							{(!delivery.remark || delivery.remark === "in_batch") && (
								<Button
									disabled={delivery.remark}
									className="ml-4"
									type="default"
									onClick={() => handleDeliver(delivery.id, "in_batch")}
								>
									分批交付
								</Button>
							)}
						</ConfigProvider>
					</div>
				)}
			</div>
			<div className="mt-8">
				<div className="font-bold text-md">查看批次</div>
			</div>
			<div className="mt-4">
				<ConfigProvider theme={TableTheme}>
					<Table
						bordered
						rowKey={"id"}
						size="small"
						pagination={false}
						dataSource={dataSource}
						columns={defaultColumns}
						scroll={{ y: "70vh" }}
					/>
				</ConfigProvider>
			</div>
		</div>
	);
};

export default DeliverManage;
