import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { delay } from "../../util/delay";

import { dashboardTheme } from "../../theme/theme";
import { saleProjectList } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const SaleManage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any | undefined>(undefined);
	const deleteFlowItemHandler = async (recordId: string) => {};

	const freshFlowItem = async () => {
		setLoading(true);
		await delay();
		setLoading(false);
	};

	// 获取销售列表
	const fetchSaleList = async () => {
		const res = await saleProjectList({
			pageNum: 1,
			pageSize: 50
		});
		console.log("fetchSaleList", res);
	};

	useEffect(() => {
		console.log("SaleManage 初始化");
		fetchSaleList();
		return () => {
			console.log("SaleManage 销毁");
		};
	}, []);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<DashboardRoot>
				<TableHeader selectedRows={selectedRows} freshFlowItem={freshFlowItem} setSelectedRows={setSelectedRows} />
				{loading && <BaseLoading />}
				{/* 表格主体 */}
				<TableBody
					freshFlowItem={freshFlowItem}
					editFlowItemRecord={editFlowItemRecord}
					deleteFlowItem={deleteFlowItemHandler}
					setEditFlowItemRecord={setEditFlowItemRecord}
					setSelectedRows={setSelectedRows}
				/>
			</DashboardRoot>
		</ConfigProvider>
	);
};

export default SaleManage;
