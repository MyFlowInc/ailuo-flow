import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, message } from "antd";

import { dashboardTheme } from "../../theme/theme";
import { saleProjectList, saleProjectRemove } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { IfetchSaleList } from "./types";
import { purRequisition, removePurRequisition } from "../../api/ailuo/pms";

export const PurchaseManageContext = React.createContext<any>({});

const PurchaseManage: React.FC = () => {
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
			await removePurRequisition({ id });
			message.success("删除成功");
			await fetchPurchaseList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	const fetchPurchaseList: IfetchSaleList = async (options: any = {}) => {
		try {
			let params: any = {
				pageNum: curPage.current.pageNum,
				pageSize: curPage.current.pageSize,
			};
			if (options.status) {
				params.status = options.status;
			}
			if (options.search) {
				params = {
					...params,
					...options.search,
				};
			}
			const res = await purRequisition(params);
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
		fetchPurchaseList();
	}, []);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<PurchaseManageContext.Provider
				value={{ fetchPurchaseList, tableDataSource, setTableDataSource }}
			>
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
			</PurchaseManageContext.Provider>
		</ConfigProvider>
	);
};

export default PurchaseManage;
