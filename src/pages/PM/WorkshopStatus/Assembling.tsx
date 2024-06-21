import { Button, ConfigProvider, Layout, Tag, message } from "antd";
import { getStore } from "../../../store";
import { useHistory, useParams } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getWorkshopManagement } from "../../../api/ailuo/workshop";
import { setCurWorkshop } from "../../../store/globalSlice";
import { useAppDispatch } from "../../../store/hooks";
import { greyButtonTheme } from "../../../theme/theme";
import { Status, Stage } from "../types";
import {
	getNextActionsByTypeAndStatus,
	getTagColorByStatus,
	getLabel,
	updateStatusByStage,
} from "../WorkshopManage";
const StatusView = (props: {
	id: string;
	status: Status;
	fecthWorkshop: () => void;
}) => {
	const stage: Stage = "assembling";
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
							updateStatusByStage(props.id, stage, action, props.fecthWorkshop);
						}}
					>
						{getLabel(stage, action, "actionLabel")}
					</Tag>
				</div>
			)}
		</div>
	);
};
const Assembling: React.FC = () => {
	const workshop = useSelector((state) => (state as any).global.curWorkshop);
	const params = useParams<{ wspId: string }>();
	const history = useHistory();
	const dispatch = useAppDispatch();
	const fetchWorkshop = async () => {
		const resp = await getWorkshopManagement({ id: params.wspId });
		if (resp.code == 200) {
			dispatch(setCurWorkshop(resp.data));
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		if (_.isEmpty(workshop)) {
			fetchWorkshop();
		}
	}, []);

	return (
		<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
			<div className="flex items-center mb-2">
				<div className="font-bold text-lg">装配</div>
				<ConfigProvider theme={greyButtonTheme}>
					<Button
						className="ml-4 text-[#5966D6]"
						type="primary"
						icon={<LeftOutlined />}
						onClick={() => history.goBack()}
					>
						返回车间管理仪表盘
					</Button>
				</ConfigProvider>
			</div>
			<div className="flex items-center justify-between mt-4">
				<div>
					<StatusView
						id={workshop.children[2].id}
						status={workshop.children[2].status}
						fecthWorkshop={fetchWorkshop}
					/>
				</div>
			</div>
		</div>
	);
};
export default Assembling;
