import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { contractList, contractRemove } from "../../api/ailuo/contract";
import { ContractStatusMap } from "../../api/ailuo/dict";
import { ContracContext } from "./ContractManage";
import { useAppSelector } from "../../store/hooks";
import { selectIsFinance, selectUser } from "../../store/globalSlice";
import { approveInfo } from "../../api/ailuo/approve";

const MyContractManage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [selectedRows, setSelectedRows] = useState<any[]>([]); //  多选
	const isFinance = useAppSelector(selectIsFinance);
	const user = useAppSelector(selectUser);
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
			await contractRemove(id);
			await fetchContractList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	// 获取列表
	const fetchContractList = async (options: any = {}) => {
		try {
			let params: any = {
				pageNum: curPage.current.pageNum,
				pageSize: curPage.current.pageSize,
				status: ContractStatusMap.Reviewing,
			};
			// 财务角色 特殊处理 要求看到所有的
			if (isFinance) {
				delete params.status;
			}

			if (options.search) {
				params = {
					...params,
					...options.search,
				};
			}
			const res = await contractList(params);
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
	// 获取审批权限
	const fetchApproveInfo = async () => {
		const res = await approveInfo({ belong: "contract" });
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

	useEffect(() => {
		fetchContractList();
	}, [isFinance]);

	return (
		<ContracContext.Provider
			value={{
				fetchContractList,
				tableDataSource,
				setTableDataSource,
				hasApprovePermission,
			}}
		>
			<ConfigProvider theme={dashboardTheme}>
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
			</ConfigProvider>
		</ContracContext.Provider>
	);
};

export default MyContractManage;
