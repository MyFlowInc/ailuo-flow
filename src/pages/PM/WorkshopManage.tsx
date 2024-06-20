import { Button, Card, ConfigProvider, Flex, Space, Tag, message } from "antd";
import { blueButtonTheme, dashboardTheme } from "../../theme/theme";
import categorySvg from "./assets/Category.svg";
import { getWorkshopManagement } from "../../api/ailuo/workshop";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import WorkShopFullDataModal from "./FormModal/WorkShopFullDataModal";

export const WorkshopManageContext = React.createContext<any>({});

const RoundImg = (props: {
	width: string;
	height: string;
	backgroundColor: string;
	src: any;
}) => {
	return (
		<div
			style={{
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
	iconSrc: any;
	title: string;
	status: string;
	actions: string[];
	actionHandler: (action: string) => void;
	enterButtonHandler: () => void;
}) => {
	const params: any = useParams();
	return (
		<Card styles={{ body: { padding: "10px" } }} style={{ width: "19%" }}>
			<Flex gap={10} vertical>
				<Flex gap={10} align="center" style={{ width: "100%" }}>
					<RoundImg
						width="20px"
						height="20px"
						backgroundColor="blue"
						src={props.iconSrc}
					/>
					<span>{props.title}</span>
					<Button style={{}} type="primary" onClick={props.enterButtonHandler}>
						进入
					</Button>
				</Flex>
				<div>
					<span>状态</span>
				</div>
				{props.actions.length ? (
					<Flex gap={5}>
						<span>操作</span>
						{props.actions.map((action) => {
							return (
								<Tag onClick={() => props.actionHandler(action)}>{action}</Tag>
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

	const handleViewFullData = () => {
		setIsShowFullDataModal(true);
	};

	const fetchWorkshop = async () => {
		const resp = await getWorkshopManagement({ id: params.wspId });
		if (resp.code == 200) {
			setWorkShopInfo(resp.data);
			console.log('workshopInfo', resp.data);
		} else {
			message.error(resp.msg);
		}
	};

	useEffect(() => {
		fetchWorkshop();
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
						<WorkshopCard
							iconSrc={categorySvg}
							status=""
							actions={["开始备料"]}
							actionHandler={() => {}}
							enterButtonHandler={() => {}}
							title="备料"
						></WorkshopCard>
						<WorkshopCard
							iconSrc={categorySvg}
							status=""
							actions={[]}
							actionHandler={() => {}}
							enterButtonHandler={() => {}}
							title="加工"
						></WorkshopCard>
						<WorkshopCard
							iconSrc={categorySvg}
							status=""
							actions={[]}
							actionHandler={() => {}}
							enterButtonHandler={() => {}}
							title="装配"
						></WorkshopCard>
						<WorkshopCard
							iconSrc={categorySvg}
							status=""
							actions={[]}
							actionHandler={() => {}}
							enterButtonHandler={() => {}}
							title="调试"
						></WorkshopCard>
						<WorkshopCard
							iconSrc={categorySvg}
							status=""
							actions={[]}
							actionHandler={() => {}}
							enterButtonHandler={() => {}}
							title="出厂检验"
						></WorkshopCard>
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
