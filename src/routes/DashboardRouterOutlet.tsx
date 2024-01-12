import { Route, Switch, useHistory, useLocation } from "react-router";
import Dashboard from "../pages/Dashboard";
import { useAppSelector } from "../store/hooks";
import { selectCollapsed, selectIsOpenDrawer, selectUser, setIsOpenDrawer } from "../store/globalSlice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Loading from "../assets/icons/Loading";
import { setWorkflowList, WorkFlowInfo, updateCurFlowDstId } from "../store/workflowSlice";
import { LoadingRoot, RouterContainer } from "./style";
import { Layout, theme, Spin } from "antd";
import AppHeader from "../components/layout/AppHeader";
import Setting from "../pages/Setting";
import TourContext from "../context/tour";
import { fetchInviteWorkflowList, fetchWorkflowList } from "../api/apitable/ds-table";
import NavSide from "../components/NavSide";
import NotifyDrawer from "../pages/Notify/NotifyDrawer";
import { useLoginByCache } from "../hooks";

const { Sider, Content } = Layout;
const DashboardRouterOutlet: React.FC = () => {
	// 通过缓存自动登录
	useLoginByCache();
	const dispatch = useDispatch();
	const user = useAppSelector(selectUser);
	const isEmpty = _.isEmpty(user);
	const [loading, setLoading] = useState(isEmpty);
	const location = useLocation();
	const history = useHistory();
	const [showMenu, setShowMenu] = useState<"block" | "none">("none");
	const {
		token: { colorBgContainer }
	} = theme.useToken();
	const collapsed = useAppSelector(selectCollapsed);
	const [tourRefs, setTourRefs] = useState([]);

	//  通知抽屉
	const isOpenDrawer = useAppSelector(selectIsOpenDrawer);
	const onDrawerClose = () => {
		dispatch(setIsOpenDrawer(false));
	};

	const getFlowList = async () => {
		try {
			const p1 = fetchWorkflowList({ pageNum: 1, pageSize: 999 });
			const p2 = fetchInviteWorkflowList({ pageNum: 1, pageSize: 999 });
			const [response, response2] = await Promise.all([p1, p2]);
			const data = response.data.record as WorkFlowInfo[];
			const data2 = response2.data.record as WorkFlowInfo[];

			const list = [...data, ...data2].map((item: WorkFlowInfo) => ({
				name: item.dstName,
				url: "/dashboard/workflow-view/" + item.dstId,
				...item
			}));
			dispatch(setWorkflowList(list));
			if (list.length > 0) {
				const item0 = list[0];
				dispatch(updateCurFlowDstId(item0.dstId));
				history.push(item0.url);
			} else {
				history.push("/dashboard/workflow-view/undefined");
			}
			setLoading(false);
		} catch (error) {
			console.log("error", error);
		}
	};

	// 菜单初始化
	useEffect(() => {
		getFlowList();
	}, []);

	if (loading) {
		return (
			<LoadingRoot>
				<div>
					<Spin tip="Loading" indicator={<Loading style={{ fontSize: 96 }} />} />
					<div className="loading-title">Loading...</div>
				</div>
			</LoadingRoot>
		);
	}

	return (
		<RouterContainer className="router-container">
			<TourContext.Provider value={{ tourRefs, setTourRefs }}>
				<Layout>
					<Sider
						theme="light"
						className={collapsed ? "sider-collapsed" : "sider-uncollapsed"}
						width={212}
						trigger={null}
						collapsedWidth={48}
						collapsible
						collapsed={collapsed}>
						<NavSide path={location.pathname} />
					</Sider>
					<Layout className="site-layout">
						<AppHeader />
						<Content
							style={{
								minHeight: 280,
								display: "flex",
								background: colorBgContainer,
								flex: 1,
								padding: "0px 16px"
							}}>
							<div className="router-content">
								<Switch>
									<Route path="/dashboard/workflow-view/:dstId" exact={true}>
										<Dashboard />
									</Route>

									{/* 报价管理 */}
									<Route path="/dashboard/quotation-management" exact={true}>
										<Dashboard />
									</Route>

									<Route path="/dashboard/setting" exact={true}>
										<Setting />
									</Route>
								</Switch>
							</div>
						</Content>
						<NotifyDrawer onDrawerClose={onDrawerClose} isOpenDrawer={isOpenDrawer} />
					</Layout>
				</Layout>
			</TourContext.Provider>
		</RouterContainer>
	);
};

export default DashboardRouterOutlet;
