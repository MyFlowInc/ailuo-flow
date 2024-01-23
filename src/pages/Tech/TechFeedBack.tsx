import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { techProjectList, techProjectRemove } from "../../api/ailuo/tech";

export const TechFeedBackContext = React.createContext<any>({});

const TechFeedBack: React.FC = () => {
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
			await techProjectRemove(id);
			await fetchTechFeedbackList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	// 获取技术反馈列表
	const fetchTechFeedbackList = async (options: any = {}) => {
		try {
			let params: any = {
				pageNum: curPage.current.pageNum,
				pageSize: curPage.current.pageSize,
			};

			if (options.search) {
				params = {
					...params,
					...options.search,
				};
			}
			const res = await techProjectList(params);
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
		fetchTechFeedbackList();
		return () => {
			console.log("SaleManage 销毁");
		};
	}, []);
	return (
		<TechFeedBackContext.Provider
			value={{
				fetchTechFeedbackList,
				tableDataSource,
				setTableDataSource,
			}}
		>
			<ConfigProvider theme={dashboardTheme}>
				<DashboardRoot>
					{/* 表头 */}
					<TableHeader
						selectedRows={selectedRows}
						fetchTechFeedbackList={fetchTechFeedbackList}
						setSelectedRows={setSelectedRows}
					/>
					{loading && <BaseLoading />}
					{/* 表格主体 */}
					<TableBody
						tableDataSource={tableDataSource} // 数据源
						fetchTechFeedbackList={fetchTechFeedbackList}
						{...{ curPage }}
						editFlowItemRecord={editFlowItemRecord}
						deleteFlowItem={deleteFlowItemHandler}
						setEditFlowItemRecord={setEditFlowItemRecord}
						setSelectedRows={setSelectedRows}
					/>
				</DashboardRoot>
			</ConfigProvider>
		</TechFeedBackContext.Provider>
	);
};

export default TechFeedBack;
