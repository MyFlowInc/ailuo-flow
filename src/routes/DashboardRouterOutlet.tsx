import { Route, Switch } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchFlowStatus, selectCollapsed, selectIsOpenDrawer, selectUser, setIsOpenDrawer } from "../store/globalSlice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import Loading from "../assets/icons/Loading";
import { LoadingRoot, RouterContainer } from "./style";
import { Layout, theme, Spin } from "antd";
import AppHeader from "../components/layout/AppHeader";
import Setting from "../pages/Setting";
import NavSide from "../components/NavSide";
import NotifyDrawer from "../pages/Notify/NotifyDrawer";
import { useLoginByCache } from "../hooks";
import SaleManage from "../pages/Sale/SaleManage";
import TechFeedBack from "../pages/Tech/TechFeedBack";

const { Sider, Content } = Layout;
const DashboardRouterOutlet: React.FC = () => {
	// 通过缓存自动登录
	useLoginByCache();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isEmpty = _.isEmpty(user);
	const [loading, setLoading] = useState(isEmpty);
	const {
		token: { colorBgContainer }
	} = theme.useToken();
	const collapsed = useAppSelector(selectCollapsed);
	//  通知抽屉
	const isOpenDrawer = useAppSelector(selectIsOpenDrawer);
	const onDrawerClose = () => {
		dispatch(setIsOpenDrawer(false));
	};

	useEffect(() => {
		dispatch(fetchFlowStatus()).then(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<LoadingRoot>
				<div>
					<Spin indicator={<Loading style={{ fontSize: 96 }} />} />
					<div className="loading-title">Loading...</div>
				</div>
			</LoadingRoot>
		);
	}

	return (
		<RouterContainer className="router-container">
			<Layout>
				<Sider theme="light" className={collapsed ? "sider-collapsed" : "sider-uncollapsed"} width={212} trigger={null} collapsedWidth={48} collapsible collapsed={collapsed}>
					<NavSide />
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
								{/* 报价管理 */}
								<Route path="/dashboard/quote-manage" exact={true}>
									<SaleManage />
								</Route>
								{/* 报价技术反馈 */}
								<Route path="/dashboard/quote-tech-feedback" exact={true}>
									<TechFeedBack />
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
		</RouterContainer>
	);
};

export default DashboardRouterOutlet;
