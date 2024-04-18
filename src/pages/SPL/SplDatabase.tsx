import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import _ from "lodash";
import styled from "styled-components";
import { splFileDataList, splFileDataRemove } from "../../api/ailuo/spl-db";
const DashboardRoot = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	.ant-modal {
		height: 100vh;
	}
`;
export const SplDatabaseContext = React.createContext<any>({});

const SplDatabase: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [isShowModal, setIsShowModal] = useState(false)
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
			await splFileDataRemove(id);
			await fetchList();
		} catch (error) {
			console.log(error);
		}
	};
	const [tableDataSource, setTableDataSource] = useState<any[]>([]);

	// 获取销售列表
	const fetchList = async (options: any = {}) => {
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
			const res = await splFileDataList(params);
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
		fetchList();
	}, []);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<SplDatabaseContext.Provider
				value={{ fetchList, tableDataSource, setTableDataSource, isShowModal, setIsShowModal }}
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
			</SplDatabaseContext.Provider>
		</ConfigProvider>
	);
};

export default SplDatabase;
