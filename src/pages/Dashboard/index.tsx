import React, { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import { selectUser, selectIsMember } from "../../store/globalSlice";
import { useAppSelector } from "../../store/hooks";
import { selectCurFlowDstId } from "../../store/workflowSlice";
import { fetchOwerWorkflowList } from "../../controller/dsTable";
import { apitableDeveloperUserList } from "../../api/apitable/ds-share";
import _ from "lodash";
import type { WorkFlowInfo } from "../../store/workflowSlice";
import { dashboardTheme } from "../../theme/theme";
import dayjs from "dayjs";

const Page: React.FC = () => {
	const curDstId = useAppSelector(selectCurFlowDstId);
	const user = useAppSelector(selectUser);
	const isVip = useAppSelector(selectIsMember);

	const [isReader, setIsReader] = useState<boolean>(false);
	const [isWriter, setIsWriter] = useState<boolean>(false);
	const [isManager, setIsManager] = useState<boolean>(false);

	const fetchUserList = async () => {
		const flowList = await fetchOwerWorkflowList(true);

		if (flowList.some((flow: WorkFlowInfo) => flow.dstId === curDstId)) {
			if (!isVip) {
				const list = flowList.sort((a, b) => dayjs(a.createTime).diff(dayjs(b.createTime), "seconds")).filter((item, i) => i < 3);
				if (list.some((flow: WorkFlowInfo) => flow.dstId === curDstId)) {
					setIsReader(true);
					setIsWriter(true);
					setIsManager(true);
				} else {
					setIsReader(true);
					setIsWriter(false);
					setIsManager(false);
				}
			} else {
				setIsReader(true);
				setIsWriter(true);
				setIsManager(true);
			}
		} else {
			const res = await apitableDeveloperUserList(curDstId!);
			if (_.get(res, "data.record")) {
				const userList = res.data.record;
				setIsReader(userList.some((item: any) => item.userId === user.id && (item.allowEdit || item.allowManage || item.allowWatch)));
				setIsWriter(userList.some((item: any) => item.userId === user.id && (item.allowEdit || item.allowManage)));
				setIsManager(userList.some((item: any) => item.userId === user.id && item.allowManage));
			}
		}
	};

	useEffect(() => {
		console.log("Dashboard 初始化");
		fetchUserList();
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
