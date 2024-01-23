import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";

import { dashboardTheme } from "../../theme/theme";
import { saleProjectList, saleProjectRemove } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { MainStatus } from "../../api/ailuo/dict";
import { SaleManageContext } from "./SaleManage";

const MyQuoteProcess: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any | undefined>(
		undefined,
	); // 当前编辑的记录
	const curPage = useRef({
		pageNum: 1,
		pageSize: 50,
		total: 0,
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
				pageSize: curPage.current.pageSize,
				status: MainStatus.QuotationReview,
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
		console.log("MyQuoteProcess 初始化");
		fetchSaleList();
		return () => {
			console.log("MyQuoteProcess 销毁");
		};
	}, []);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<SaleManageContext.Provider value={{ fetchSaleList }}>
				<DashboardRoot>
					{/* 表头 */}
					<TableHeader
						selectedRows={selectedRows}
						setSelectedRows={setSelectedRows}
					/>
					{loading && <BaseLoading />}
					{/* 表格主体 */}
					<TableBody
						tableDataSource={tableDataSource} // 数据源
						{...{ curPage }}
						editFlowItemRecord={editFlowItemRecord}
						deleteFlowItem={deleteFlowItemHandler}
						setEditFlowItemRecord={setEditFlowItemRecord}
						setSelectedRows={setSelectedRows}
					/>
				</DashboardRoot>
			</SaleManageContext.Provider>
		</ConfigProvider>
	);
};

export default MyQuoteProcess;
