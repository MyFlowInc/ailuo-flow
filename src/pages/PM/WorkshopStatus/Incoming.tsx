import { Button, ConfigProvider, Pagination, Table, Tag, message } from "antd";
import React, { useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import TableColumnRender from "../../../components/Dashboard/TableColumnRender";
import PurchaseTable from "./IncomingPurchase/PurchaseTable";
import EditFilled from "../../../assets/icons/EditFilled";
import { getStore } from "../../../store";
import {
	selectIsManager,
	selectIsWorkshop,
	setCurWorkshop,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
	getNextActionsByTypeAndStatus,
	getTagColorByStatus,
	getLabel,
	updateStatusByStage,
} from "../WorkshopManage";
import { Status, Stage } from "../types";
import { useSelector } from "react-redux";
import { getWorkshopManagement } from "../../../api/ailuo/workshop";

const StatusView = (props: {
	id: string;
	status: Status;
	fecthWorkshop: () => void;
	relatedProjectId: string;
}) => {
	const params = useParams<any>();
	const history = useHistory();
	const stage: Stage = "incoming";
	const isManager = useAppSelector(selectIsManager);
	const isWorkshop = useAppSelector(selectIsWorkshop);
	const action = getNextActionsByTypeAndStatus(
		stage,
		props.status,
	)?.[0] as Status;
	return (
		<div className="flex items-center mt-2">
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
				<div className="flex  items-center ml-4">
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
								isManager || isWorkshop,
								props.fecthWorkshop,
								props.relatedProjectId,
							);
						}}
					>
						{getLabel(stage, action, "actionLabel")}
					</Tag>
				</div>
			)}
			{props.status == "start" && (isManager || isWorkshop) && (
				<ConfigProvider theme={blueButtonTheme}>
					<Button
						className="ml-4"
						type="primary"
						icon={<EditFilled></EditFilled>}
						onClick={() =>
							history.push(
								`/dashboard/work-shop-manage/${params.wspId}/incoming/purchase/new`,
							)
						}
					>
						新建请购单
					</Button>
				</ConfigProvider>
			)}
		</div>
	);
};
interface IncomingProps {}

const Incoming: React.FC<IncomingProps> = () => {
	const history = useHistory();
	const workshop = useSelector((state) => (state as any).global.curWorkshop);
	const dispatch = useAppDispatch();
	const params = useParams<{ wspId: string }>();

	const fetchWorkshop = async () => {
		const resp = await getWorkshopManagement({ id: params.wspId });
		if (resp.code == 200) {
			dispatch(setCurWorkshop(resp.data));
		} else {
			message.error(resp.msg);
		}
	};
	const [datasource, setDatasource] = useState([]);
	const curPage = useRef({
		pageNum: 1,
		pageSize: 50,
		total: 0,
	});

	const pageNumChange = () => {};

	return (
		<div>
			<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
				<div className="flex items-center mb-2">
					<div className="font-bold text-lg">备料</div>
					<ConfigProvider theme={greyButtonTheme}>
						<Button
							className="ml-4 text-[#5966D6]"
							type="primary"
							icon={<LeftOutlined />}
							onClick={() =>
								history.push(`/dashboard/work-shop-manage/${workshop.id}`)
							}
						>
							返回车间管理仪表盘
						</Button>
					</ConfigProvider>
				</div>
				<div className="flex items-center justify-between mt-4">
					<div>
						<StatusView
							id={workshop.children?.[0]?.id}
							status={workshop.children?.[0]?.status}
							fecthWorkshop={fetchWorkshop}
							relatedProjectId={workshop.relationProject}
						/>
					</div>
				</div>
				<div className="mt-8">
					<PurchaseTable></PurchaseTable>
				</div>
			</div>
		</div>
	);
};

export default Incoming;
