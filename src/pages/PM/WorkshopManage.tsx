import {
	Button,
	Card,
	ConfigProvider,
	Flex,
	Space,
	Table,
	Tag,
	message,
} from "antd";
import { blueButtonTheme, dashboardTheme } from "../../theme/theme";
import categorySvg from "./assets/Category.svg";
import {
	getImportantEvents,
	getWorkshopManagement,
	updateWorkshopManagementStatus,
	updateWorkshopStatus,
} from "../../api/ailuo/workshop";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import WorkShopFullDataModal from "./FormModal/WorkShopFullDataModal";
import React from "react";
import { useAppDispatch } from "../../store/hooks";
import { setCurWorkshop } from "../../store/globalSlice";
import {
	Stage,
	Status,
	stageCardInfoMap,
	statusActionsMap,
	typeStatusTagLabelMap,
} from "./types";

export const WorkshopManageContext = React.createContext<any>({});

const defaultColumns: any = [
	{
		title: "时间",
		dataIndex: "createTime",
		width: "15%",
	},
	{
		title: "人员",
		dataIndex: "name",
		width: "15%",
	},
	{
		title: "类型",
		dataIndex: "type",
		width: "15%",
	},
	{
		title: "描述",
		dataIndex: "content",
		width: "40%",
	},
	{
		title: "是否影响交期",
		dataIndex: "deliveryTime",
		width: "15%",
		render: () => <span>是</span>,
	},
];

export const getNextActionsByTypeAndStatus = (stage: Stage, status: Status) => {
	return statusActionsMap.common[status];
};

const getCardInfoByStage = (stage: Stage) => {
	return stageCardInfoMap[stage];
};

export const getLabel = (
	stage: Stage,
	status: Status,
	labelType: "statusLabel" | "actionLabel",
) => {
	return typeStatusTagLabelMap[stage][labelType][status];
};

export const updateStatusByStage = async (
	id: string,
	stage: Stage,
	status: Status,
	refreshWorkshop?: () => void,
) => {
	let res: any;
	//调用接口不一样。。
	if (stage === "debugging" || stage === "factoryproduction") {
		res = await updateWorkshopManagementStatus(id, stage, status);
	} else {
		res = await updateWorkshopStatus({
			id: id,
			type: stage,
			status: status,
		});
	}
	if (!res.success) {
		message.error(stage + " 状态更新失败！有工单未完成！");
	} else if (refreshWorkshop) {
		refreshWorkshop();
	}
};

export const getTagColorByStatus = (status: Status) => {
	switch (status) {
		case "not_start":
			return "#E8F2FF";
		case "start":
			return "#FFEEE3";
		case "over":
			return "#E8FFEA";
		//不知道啥颜色
		case "tobe_tested":
			return "#E8FFEA";
	}
};

const getWorkshopCardInfo = (workshopInfo: any) => {
	let infos = workshopInfo.children;
	//备料 加工 装配 车间状态
	infos = infos.map((info: any) => {
		return {
			id: info.id,
			stage: info.type ?? "",
			status: info.status ?? "not_start",
		};
	});
	//调试 出厂
	infos.push(
		{
			id: workshopInfo.id,
			stage: "debugging",
			status: workshopInfo.debuggingStatus ?? "not_start",
		},
		{
			id: workshopInfo.id,
			stage: "factoryproduction",
			status: workshopInfo.factoryproductionStatus ?? "not_start",
		},
	);
	return infos;
};

const RoundImg = (props: {
	width: string;
	height: string;
	backgroundColor: string;
	src: any;
}) => {
	return (
		<div
			style={{
				minWidth: "20px",
				width: props.width,
				height: props.height,
				borderRadius: "50%",
				backgroundColor: props.backgroundColor,
				justifyContent: "center",
				alignItems: "center",
				display: "flex",
			}}
		>
			<img style={{ maxWidth: "100%", height: "70%" }} src={props.src}></img>
		</div>
	);
};

const WorkshopCard = (props: {
	id: string;
	stage: Stage;
	status: Status;
	fetchWorkshop: () => void;
}) => {
	const cardInfo = getCardInfoByStage(props.stage);
	const cardActions = getNextActionsByTypeAndStatus(props.stage, props.status);
	const history = useHistory();
	const location = useLocation();

	return (
		<Card styles={{ body: { padding: "10px" } }} style={{ width: "19%" }}>
			<Flex gap={20} vertical>
				<Flex gap={10} align="center" style={{ width: "100%" }}>
					<RoundImg
						width="20px"
						height="20px"
						backgroundColor={cardInfo.imgColor}
						src={cardInfo.imgSrc}
					/>
					<span style={{ minWidth: "30%" }}>{cardInfo.title}</span>
					<Flex style={{ width: "100%" }} justify={"flex-end"}>
						<Button
							style={{ float: "right" }}
							type="primary"
							onClick={() => {
								history.push(location.pathname + "/" + props.stage);
							}}
						>
							进入
						</Button>
					</Flex>
				</Flex>
				<Flex gap={5}>
					<span>状态</span>
					<Tag color={getTagColorByStatus(props.status)}>
						<span style={{ color: "black" }}>
							{getLabel(props.stage, props.status, "statusLabel")}
						</span>
					</Tag>
				</Flex>
				{cardActions.length ? (
					<Flex gap={5}>
						<span>操作</span>
						{cardActions.map((action: any) => {
							return (
								<Tag
									className="cursor-pointer"
									key={action}
									color="#D4F3F2"
									onClick={() => {
										updateStatusByStage(
											props.id,
											props.stage,
											action as Status,
											props.fetchWorkshop,
										);
									}}
								>
									<span style={{ color: "black" }}>
										{getLabel(props.stage, action as Status, "actionLabel")}
									</span>
								</Tag>
							);
						})}
					</Flex>
				) : (
					""
				)}
			</Flex>
		</Card>
	);
};

const WorkshopManage: React.FC = () => {
	const params = useParams<{ wspId: string }>();

	const [isShowFullDataModal, setIsShowFullDataModal] = useState(false);
	const [workshopInfo, setWorkShopInfo] = useState({});
	const [workshopCardInfo, setWorkshopCardInfo] = useState<any>([]);
	const [importantEvents, setImportantEvents] = useState<any[]>([]);
	const dispatch = useAppDispatch();

	const handleViewFullData = () => {
		setIsShowFullDataModal(true);
	};

	const fetchWorkshop = async () => {
		const resp = await getWorkshopManagement({ id: params.wspId });
		if (resp.code == 200) {
			setWorkShopInfo(resp.data);
			setWorkshopCardInfo(getWorkshopCardInfo(resp.data));
			dispatch(setCurWorkshop(resp.data));
		} else {
			message.error(resp.msg);
		}
	};

	const getWorkshopImportantEvents = async () => {
		const resp = await getImportantEvents({
			pageNum: 1,
			pageSize: 9999,
			deliveryTime: "yes",
			relatedWorkshop: params.wspId,
		});
		if (resp.code == 200) {
			setImportantEvents(resp.data.record);
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		fetchWorkshop();
		getWorkshopImportantEvents();
	}, [params.wspId]);

	return (
		<WorkshopManageContext.Provider value={{ workshopInfo }}>
			<ConfigProvider theme={dashboardTheme}>
				<Space style={{ width: "100%" }} direction="vertical" size={40}>
					<Flex align="center" gap={15}>
						<Flex align="center" gap={5}>
							<RoundImg
								width="20px"
								height="20px"
								backgroundColor="blue"
								src={categorySvg}
							/>

							<span>总仪表盘</span>
						</Flex>
						<ConfigProvider theme={blueButtonTheme}>
							<Button type="primary" onClick={handleViewFullData}>
								查看完整资料包
							</Button>
						</ConfigProvider>
					</Flex>
					<Flex style={{ width: "100%" }} justify={"space-between"}>
						{workshopCardInfo.map((info: any) => {
							return (
								<WorkshopCard
									id={info.id}
									stage={info.stage}
									status={info.status}
									fetchWorkshop={fetchWorkshop}
									key={info.stage}
								></WorkshopCard>
							);
						})}
					</Flex>
					<Flex gap={20} vertical>
						<span>重要事件</span>
						<Table
							rowKey={"id"}
							size="small"
							pagination={false}
							bordered
							dataSource={importantEvents}
							columns={defaultColumns}
						/>
					</Flex>
				</Space>
				<WorkShopFullDataModal
					open={isShowFullDataModal}
					setOpen={setIsShowFullDataModal}
				></WorkShopFullDataModal>
			</ConfigProvider>
		</WorkshopManageContext.Provider>
	);
};

export default WorkshopManage;
