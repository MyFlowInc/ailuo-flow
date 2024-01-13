import React, { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import { selectUser, selectIsMember } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import { selectCurFlowDstId } from "../../store/workflowSlice";
import { dashboardTheme } from "../../theme/theme";
import { saleProjectList } from "../../api/ailuo/sale";

const Page: React.FC = () => {
	const curDstId = useAppSelector(selectCurFlowDstId);
	const user = useAppSelector(selectUser);
	const isVip = useAppSelector(selectIsMember);

	const [isReader, setIsReader] = useState<boolean>(false);
	const [isWriter, setIsWriter] = useState<boolean>(false);
	const [isManager, setIsManager] = useState<boolean>(false);

	// 获取销售列表
	const fetchSaleList = async () => {
		const res = await saleProjectList({
			pageNum: 1,
			pageSize: 50
		});
		console.log("fetchSaleList", res);
	};

	useEffect(() => {
		console.log("Dashboard 初始化");
		fetchSaleList();
		return () => {
			console.log("Dashboard 销毁");
		};
	}, [curDstId]);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<DashboardContainer reader={isReader} writer={isWriter} manager={isManager} />
		</ConfigProvider>
	);
};

export default Page;
