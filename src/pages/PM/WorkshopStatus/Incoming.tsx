import { Button, ConfigProvider, Pagination, Table, Tag } from "antd";
import React, { useRef, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { greyButtonTheme } from "../../../theme/theme";
import TableColumnRender from "../../../components/Dashboard/TableColumnRender";

const StatusView = () => {
	return (
		<div className="flex items-center mt-2">
			<div className="flex items-center">
				<div className="mr-2 text-[#848484]">状态: </div>
				<Tag color={"#E8F2FF"} style={{ color: "#000" }}>
					{"未启动"}
				</Tag>
			</div>
			<div className="flex  items-center ml-4">
				<div className="mr-2 text-[#848484]">操作: </div>
				<Tag
					className="cursor-pointer"
					color={"#D4F3F2"}
					style={{ color: "#000" }}
				>
					{"开始备料"}
				</Tag>
			</div>
		</div>
	);
};

const tableColumns: any = [
	{
		title: "请购类型",
		width: 200,
		dataIndex: "请购类型",
		key: "请购类型",
		render: (text: string, record: any) => {
			return <div></div>;
		},
	},
	{
		title: "状态",
		width: 200,
		dataIndex: "状态",
		key: "状态",
		render: (text: string, record: any) => {
			return <div></div>;
		},
	},
];

interface WorkshopStockViewProps {}

const Incoming: React.FC<WorkshopStockViewProps> = () => {
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
			<Table
				size="small"
				pagination={false}
				components={{
					body: {
						cell: TableColumnRender,
					},
				}}
				columns={tableColumns}
				dataSource={datasource}
				scroll={{ x: true, y: `calc(100vh - 240px)` }}
			/>
			<div className="flex items-center justify-end mt-4">
				<Pagination
					current={curPage.current.pageNum}
					total={curPage.current.total}
					pageSize={curPage.current.pageSize}
					showTotal={(total) => `共 ${total} 条`}
					onChange={pageNumChange}
				/>
			</div>
		</div>
	);
};

export default Incoming;
