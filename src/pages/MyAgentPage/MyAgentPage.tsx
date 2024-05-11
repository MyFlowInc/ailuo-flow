import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { DashboardRoot } from "./styles";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import { techProjectRemove } from "../../api/ailuo/tech";
import { AgentProjectList } from "../../api/ailuo/sale";
import { string32 } from "pdfjs-dist/types/src/shared/util";
import { log } from "console";
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
			await fetchAgentList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);
	// 获取技术反馈列表
	const fetchAgentList = async (options: any = {}) => {
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

			const res = await AgentProjectList(params);

			const list = _.get(res, "data") || [];
			if (list.length > 0) {
				list.forEach((item: any) => {
					item.key = item.id;
				});
			}
			setTableDataSource(_.get(res, "data") || []);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchAgentList();
	}, []);
	return (
		<TechFeedBackContext.Provider
			value={{
				fetchAgentList,
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
						fetchAgentList={fetchAgentList}
					/>
					{loading && <BaseLoading />}
					{/* 表格主体 */}
					<TableBody
						tableDataSource={tableDataSource} // 数据源
						fetchAgentList={fetchAgentList}
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
