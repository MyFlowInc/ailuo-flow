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
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/globalSlice";
import { approveInfo } from "../../api/ailuo/approve";

const MyQuoteProcess: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const user = useAppSelector(selectUser);

	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const [editFlowItemRecord, setEditFlowItemRecord] = useState<any | undefined>(
		undefined,
	); // 当前编辑的记录
	// 当前角色是否有审批权限
	const [hasApprovePermission, setHasApprovePermission] = useState(false);


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
				// createBy: user.id,
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
		fetchSaleList();
	}, []);
	// 获取审批权限
	const fetchApproveInfo = async () => {
		const res = await approveInfo({ belong: "sale" });
		const list = _.get(res, "data.record", []);
		const item = _.find(list, { relationUserId: user.id });
		if (_.isEmpty(item)) {
			setHasApprovePermission(false);
		} else {
			setHasApprovePermission(true);
		}
	};

	useEffect(() => {
		user && fetchApproveInfo();
	}, [user]);


	return (
		<ConfigProvider theme={dashboardTheme}>
			<SaleManageContext.Provider value={{ fetchSaleList, hasApprovePermission }}>
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
