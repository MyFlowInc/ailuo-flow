import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { contractList, contractRemove } from "../../api/ailuo/contract";
import { selectUser } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import { ContracContext } from "./ContractManage";

const MyContractManage: React.FC = () => {
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
	const user = useAppSelector(selectUser);

	const deleteFlowItemHandler = async (id: number) => {
		try {
			await contractRemove(id);
			await fetchContractList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	// 获取技术反馈列表
	const fetchContractList = async (options: any = {}) => {
		try {
			let params: any = {
				pageNum: curPage.current.pageNum,
				pageSize: curPage.current.pageSize,
				createBy: user.id,
			};

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

	useEffect(() => {
		fetchContractList();
	}, []);
	return (
		<ContracContext.Provider
			value={{
				fetchContractList,
				tableDataSource,
				setTableDataSource,
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
