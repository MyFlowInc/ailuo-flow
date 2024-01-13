import { Route, Switch, useLocation } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectCollapsed, selectIsOpenDrawer, selectUser, setIsOpenDrawer } from "../store/globalSlice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Loading from "../assets/icons/Loading";
import { setWorkflowList, updateCurFlowDstId } from "../store/workflowSlice";
import { LoadingRoot, RouterContainer } from "./style";
import { Layout, theme, Spin } from "antd";
import AppHeader from "../components/layout/AppHeader";
import Setting from "../pages/Setting";
import NavSide from "../components/NavSide";
import NotifyDrawer from "../pages/Notify/NotifyDrawer";
import { useLoginByCache } from "../hooks";
import SaleManage from "../pages/Sale/SaleManage";

const { Sider, Content } = Layout;
const DashboardRouterOutlet: React.FC = () => {
	// 通过缓存自动登录
	useLoginByCache();
	const dispatch = useDispatch();
	const user = useAppSelector(selectUser);
	const isEmpty = _.isEmpty(user);
	const [loading, setLoading] = useState(isEmpty);
	const location = useLocation();
	const {
		token: { colorBgContainer }
	} = theme.useToken();
	const collapsed = useAppSelector(selectCollapsed);

	//  通知抽屉
	const isOpenDrawer = useAppSelector(selectIsOpenDrawer);
	const onDrawerClose = () => {
		dispatch(setIsOpenDrawer(false));
	};

	const getFlowList = async () => {
		try {
			const list: any = [
				{
					name: "报价管理",
					url: "/dashboard/workflow-view/dstlpMrFpxKLdDqkvm",
					createBy: "1667098686809821185",
					updateBy: null,
					createTime: "2023-12-12 02:52:49",
					updateTime: "2024-01-10 14:56:08",
					deleted: false,
					remark: null,
					id: "1734405916127686657",
					dstId: "dstlpMrFpxKLdDqkvm",
					nodeId: "dstlpMrFpxKLdDqkvm",
					dstName: "报价管理",
					icon: "✡️",
					spaceId: "default",
					revision: 0,
					archive: 0,
					enable: false,
					sort: 1,
					tenantId: null,
					isCreator: true,
					isDeveloper: false,
					createUserInfo: {
						createBy: null,
						updateBy: null,
						createTime: "2023-06-09 09:17:55",
						updateTime: "2023-12-14 14:31:39",
						deleted: false,
						remark: "asd",
						id: "1667098686809821185",
						username: "jiangyi",
						password: "$2a$10$8DI.wy5CWZM0D53.gLbRxuXWSYaddat7O3ah9lH3AVhg05q6zloSy",
						enable: true,
						locked: false,
						roles: null,
						authorities: null,
						nickname: "jiangyi",
						email: "cn_jiangyi@163.com",
						phone: "18362983757",
						avatar: "https://s2-cdn.oneitfarm.com/1686750357705-75ced7cb339f4a1f264392a2eb2af865.gif",
						gender: "0",
						deptId: "1676119681516285954",
						deptName: null,
						postId: "1388197937639247873",
						postName: null,
						tenantId: null,
						sign: null,
						code: null,
						fromAgent: "web",
						gradeId: "1667101456283586561",
						gradeName: null,
						startTime: "2023-12-04 16:16:26",
						endTime: "2037-02-07 02:03:20",
						isInvite: 0,
						enabled: true,
						accountNonLocked: true,
						accountNonExpired: true,
						credentialsNonExpired: true
					}
				}
			];
			dispatch(setWorkflowList(list));
			if (list.length > 0) {
				const item0 = list[0];
				dispatch(updateCurFlowDstId(item0.dstId));
				// history.push(item0.url);
			} else {
				// history.push("/dashboard/workflow-view/undefined");
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
								<Route path="/dashboard/quotation-management" exact={true}>
									<SaleManage />
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
