import { Route, Switch } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
	fetchFlowStatus,
	selectCollapsed,
	selectIsOpenDrawer,
	selectUser,
	setIsOpenDrawer,
} from "../store/globalSlice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import Loading from "../assets/icons/Loading";
import { LoadingRoot, RouterContainer } from "./style";
import { Layout, theme, Spin, Modal } from "antd";
import AppHeader from "../components/layout/AppHeader";
import Setting from "../pages/Setting";
import NavSide from "../components/NavSide";
import NotifyDrawer from "../pages/Notify/NotifyDrawer";
import { useLoginByCache } from "../hooks";
import SaleManage from "../pages/Sale/SaleManage";
import TechFeedBack from "../pages/Tech/TechFeedBack";
import MyQuoteProcess from "../pages/Sale/MyQuoteProcess";
import MySaleManage from "../pages/Sale/MySaleManage";
import CustomModalView from "../pages/Sale/FormModal/CustomModalView";

const { Sider, Content } = Layout;
export const DashboardRouterOutletContext = React.createContext<any>({});

const DashboardRouterOutlet: React.FC = () => {
	// 通过缓存自动登录
	useLoginByCache();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isEmpty = _.isEmpty(user);
	const [loading, setLoading] = useState(isEmpty);
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const collapsed = useAppSelector(selectCollapsed);
	//  通知抽屉
	const isOpenDrawer = useAppSelector(selectIsOpenDrawer);
	// 全局工单详情显示
	const [isSaleModalViewOpen, setIsSaleModalViewOpen] = useState(false);
	const [saleId, setSaleId] = useState(undefined); // 当前展示的 

	// 全局预览文件
	const [isPdfModalViewOpen, setIsPdfModalViewOpen] = useState(false);
	const [fileUrl, setFileUrl] = useState('');
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
	const renderSaleViewModal = () => {
		if (!saleId) {
			return null
		}
		return <Modal
			key={'notify_modal'}
			open={isSaleModalViewOpen}
			modalRender={() => <CustomModalView
				{...{
					title: "查看报价",
					open: isSaleModalViewOpen,
					setOpen: setIsSaleModalViewOpen,
				}}
			/>}
			width={560}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>

	}
	const renderPdfViewModal = () => {
		if (!fileUrl) {
			return
		}
		return <Modal title="Basic Modal" open={isPdfModalViewOpen} footer={null} onCancel={() => setIsPdfModalViewOpen(false)}>
			<div className="w-full h-full">
				<iframe src={`/preview?url=${fileUrl}`}  ></iframe>
			</div>
		</Modal>
	}
	return (
		<DashboardRouterOutletContext.Provider value={{ saleId, setSaleId, isSaleModalViewOpen, setIsSaleModalViewOpen }}>
			<RouterContainer className="router-container">
				<Layout>
					<Sider
						theme="light"
						className={collapsed ? "sider-collapsed" : "sider-uncollapsed"}
						width={212}
						trigger={null}
						collapsedWidth={48}
						collapsible
						collapsed={collapsed}
					>
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
								padding: "0px 16px",
							}}
						>
							<div className="router-content">
								<Switch>
									{/* 报价管理 */}
									<Route path="/dashboard/quote-manage" exact={true}>
										<SaleManage />
									</Route>
									{/* 我的报价管理 */}
									<Route path="/dashboard/my-quote" exact={true}>
										<MySaleManage />
									</Route>
									{/* 报价技术反馈 */}
									<Route path="/dashboard/quote-tech-feedback" exact={true}>
										<TechFeedBack />
									</Route>
									{/* 我的报价审核 */}
									<Route path="/dashboard/my-quote-process" exact={true}>
										<MyQuoteProcess />
									</Route>

									<Route path="/dashboard/setting" exact={true}>
										<Setting />
									</Route>
								</Switch>
							</div>
						</Content>
						<NotifyDrawer
							onDrawerClose={onDrawerClose}
							isOpenDrawer={isOpenDrawer}
						/>
					</Layout>
					{/* 显示工单-复用 */}
					{renderSaleViewModal()}
					{renderPdfViewModal()}
				</Layout>
			</RouterContainer>
		</DashboardRouterOutletContext.Provider>

	);
};

export default DashboardRouterOutlet;
