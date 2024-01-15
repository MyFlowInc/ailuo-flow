import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { saleProjectList, saleProjectRemove } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";

const TechFeedBack: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any | undefined>(undefined); // 当前编辑的记录
	const curPage = useRef({
		pageNum: 1,
		pageSize: 50,
		total: 0
	});

	const deleteFlowItemHandler = async (id: number) => {
		try {
			await saleProjectRemove(id);
			await fetchSaleList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	// 获取销售列表
	const fetchSaleList = async () => {
		try {
			const res = await saleProjectList({
				pageNum: curPage.current.pageNum,
				pageSize: curPage.current.pageSize
			});
			const list = _.get(res, "data.record") || [];
			list.forEach((item: any) => {
				item.key = item.id;
			});
			setTableDataSource(_.get(res, "data.record") || []);
			curPage.current.total = _.get(res, "data.total");
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
				<TableHeader selectedRows={selectedRows} fetchSaleList={fetchSaleList} setSelectedRows={setSelectedRows} />
				{loading && <BaseLoading />}
				{/* 表格主体 */}
				<TableBody
					tableDataSource={tableDataSource} // 数据源
					fetchSaleList={fetchSaleList}
					{...{ curPage }}
					editFlowItemRecord={editFlowItemRecord}
					deleteFlowItem={deleteFlowItemHandler}
					setEditFlowItemRecord={setEditFlowItemRecord}
					setSelectedRows={setSelectedRows}
				/>
			</DashboardRoot>
		</ConfigProvider>
	);
};

export default TechFeedBack;
