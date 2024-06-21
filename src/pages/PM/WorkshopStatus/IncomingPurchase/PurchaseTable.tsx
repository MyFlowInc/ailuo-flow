import React, { useContext, useEffect, useRef, useState } from "react";
import { ConfigProvider, message } from "antd";

import _ from "lodash";
import {
	purRequisition,
	removePurRequisition,
} from "../../../../api/ailuo/pms";
import { IfetchSaleList } from "../../types";
import { dashboardTheme } from "../../../../theme/theme";
import { DashboardRoot } from "../../../Sale/styles";
import TableBody from "./TableBody";
import { WorkshopManageContext } from "../../WorkshopManage";
import { getStore } from "../../../../store";
import { useParams } from "react-router";

export const PurchaseManageContext = React.createContext<any>({});

const PurchaseTable: React.FC = () => {
	const routeParams = useParams<any>();

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
				relationProject: routeParams.projectId,
			};
			if (options.status) {
				params.status = options.status;
			}
			if (options.search) {
				params = {
					...params,
					...options.search,
					relationProject: routeParams.projectId,
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

export default PurchaseTable;
