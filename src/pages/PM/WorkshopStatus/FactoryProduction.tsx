import { Button, ConfigProvider, message, Tag, Flex } from "antd";
import { useHistory, useParams } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	getWorkshopManagement,
	updateInpectionForm,
} from "../../../api/ailuo/workshop";
import {
	selectIsManager,
	selectIsWorkshop,
	setCurWorkshop,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { TableTheme, greyButtonTheme } from "../../../theme/theme";
import { Stage, Status } from "../types";
import {
	getNextActionsByTypeAndStatus,
	getTagColorByStatus,
	getLabel,
	updateStatusByStage,
} from "../WorkshopManage";
import MilestoneTable from "./Milestone/MilestoneTable";
import TypeAttachment from "../../../components/Dashboard/FormModal/TypeEditor/TypeAttachment";
import { Attachment } from "../../../components/Dashboard/TableColumnRender";

const AttachmentView = (
	record: any,
	key: any,
	setDataSource: any,
	disabled: boolean = false,
) => {
	return disabled ? (
		<Attachment useFlex={true} value={record[key]}></Attachment>
	) : (
		<TypeAttachment
			setForm={setDataSource}
			cell={{ key }}
			form={{ [key]: record[key] }}
			useFlex={true}
		></TypeAttachment>
	);
};

const StatusView = (props: {
	id: string;
	status: Status;
	relatedProjectId: string;
	fecthWorkshop: () => void;
}) => {
	const stage: Stage = "factory_production";
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
		</div>
	);
};

const FactoryProduction: React.FC = () => {
	const workshop = useSelector((state) => (state as any).global.curWorkshop);
	const params = useParams<{ wspId: string }>();
	const history = useHistory();
	const dispatch = useAppDispatch();
	const [inspectionFiles, setInspectionFiles] = useState({
		url: workshop.inspectionForm,
	});
	const isManager = useAppSelector(selectIsManager);
	const isWorkshop = useAppSelector(selectIsWorkshop);

	const updateInspectionFiles = async () => {
		if (inspectionFiles.url !== workshop.inspectionForm) {
			let resp = await updateInpectionForm({
				id: workshop.id,
				inspectionForm: inspectionFiles.url,
				relationProject: workshop.relationProject,
			});
			if (resp.code == 200) {
				fetchWorkshop();
			} else {
				message.error(resp.msg);
			}
		}
	};

	const shouldDisabled = (status: any) => {
		let disabled = true;
		if (isWorkshop && status === "start") {
			disabled = false;
		}
		if (isManager) {
			disabled = false;
		}
		return disabled;
	};

	const fetchWorkshop = async () => {
		const resp = await getWorkshopManagement({ id: params.wspId });
		if (resp.code == 200) {
			dispatch(setCurWorkshop(resp.data));
			setInspectionFiles({ url: resp.data.inspectionForm });
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		if (_.isEmpty(workshop)) {
			fetchWorkshop();
		}
	}, []);

	useEffect(() => {
		updateInspectionFiles();
	}, [inspectionFiles]);

	return (
		<div className="bg-white fixed top-0 z-10 w-full pr-[286px] pt-5">
			<div className="flex items-center mb-2">
				<div className="font-bold text-lg">出厂检验</div>
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
						id={workshop.id}
						status={workshop.factoryproductionStatus}
						fecthWorkshop={fetchWorkshop}
						relatedProjectId={workshop.relationProject}
					/>
				</div>
			</div>
			<div className="flex items-center justify-center mt-4">
				<Flex>
					<span>成品检验单：</span>
					{AttachmentView(
						inspectionFiles,
						"url",
						setInspectionFiles,
						shouldDisabled(workshop.factoryproductionStatus),
					)}
				</Flex>
			</div>
			<ConfigProvider theme={TableTheme}>
				<MilestoneTable
					status={workshop.factoryproductionStatus}
					workshopType="factory_production"
				></MilestoneTable>
			</ConfigProvider>
		</div>
	);
};
export default FactoryProduction;
