import { Button, ConfigProvider, Pagination, Table, Tag } from "antd";
import React, { useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router";
import { blueButtonTheme, greyButtonTheme } from "../../../theme/theme";
import TableColumnRender from "../../../components/Dashboard/TableColumnRender";
import PurchaseTable from "./IncomingPurchase/PurchaseTable";
import EditFilled from "../../../assets/icons/EditFilled";
import { getStore } from "../../../store";

const StatusView = () => {
	const curWorkshop = { ...getStore("global.curWorkshop") };
	const params = useParams<any>()
	const history = useHistory();
	return (
		<div className="flex items-center mt-2">
			<div className="flex items-center">
				<div className="mr-2 text-[#848484]">状态: </div>
				<Tag
					className="flex items-center"
					color={"#E8F2FF"}
					style={{ color: "#000", height: "27px" }}
				>
					{"未启动"}
				</Tag>
			</div>
			<div className="flex  items-center ml-4">
				<div className="mr-2 text-[#848484]">操作: </div>
				<Tag
					className="cursor-pointer flex items-center"
					color={"#D4F3F2"}
					style={{ color: "#000", height: "27px" }}
				>
					{"开始备料"}
				</Tag>
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
			</div>
		</div>
	);
};

interface IncomingProps {}

const Incoming: React.FC<IncomingProps> = () => {
	const history = useHistory();

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
							onClick={() => history.goBack()}
						>
							返回车间管理仪表盘
						</Button>
					</ConfigProvider>
				</div>
				<div className="flex items-center justify-between mt-4">
					<div>{StatusView()}</div>
				</div>
			</div>
			<div className="mt-16">
				<PurchaseTable></PurchaseTable>
			</div>
		</div>
	);
};

export default Incoming;
