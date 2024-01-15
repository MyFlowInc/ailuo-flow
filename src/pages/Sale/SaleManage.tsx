import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { delay } from "../../util/delay";

import { dashboardTheme } from "../../theme/theme";
import { saleProjectList } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";

const SaleManage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any | undefined>(undefined);
	const deleteFlowItemHandler = async (recordId: string) => {};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	const freshFlowItem = async () => {
		setLoading(true);
		await delay();
		setLoading(false);
	};

	// 获取销售列表
	const fetchSaleList = async () => {
		try {
			const res = await saleProjectList({
				pageNum: 1,
				pageSize: 50
			});
			const list = _.get(res, "data.record") || [];
			list.forEach((item: any) => {
				item.key = item.id;
			});
			setTableDataSource(_.get(res, "data.record") || []);
		} catch (error) {
			console.log(error);
		}
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
				{/* 表头 */}
				<TableHeader selectedRows={selectedRows} freshFlowItem={freshFlowItem} setSelectedRows={setSelectedRows} />
				{loading && <BaseLoading />}
				{/* 表格主体 */}
				<TableBody
					tableDataSource={tableDataSource}
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
