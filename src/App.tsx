import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import React from "react";
// import MyTest from "./pages/Test/MyTest";
import Login from "./pages/User/Login";
import DashboardRouterOutlet from "./routes/DashboardRouterOutlet";
import Register from "./pages/User/Register";
import Preview from "./pages/Preview";

import "./styles/tailwind.css";
import "./styles/cover.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import PaySuccess from "./pages/PaySuccess";
import ResetPwd from "./pages/User/ResetPwd";
import Setting from "./pages/Setting";

setupIonicReact();

const App: React.FC = () => {
	return (
		<IonApp>
			<ConfigProvider locale={zhCN}>
				<IonReactRouter>
					<IonRouterOutlet>
						<Route exact path="/">
							<Redirect to="/dashboard" />
						</Route>
						<Route path="/dashboard">
							<DashboardRouterOutlet />
						</Route>

						<Route path="/setting">
							<Setting />
						</Route>
						<Route path="/preview" exact={true}>
							<Preview />
						</Route>
						{/* 付款成功 */}
						<Route path="/pay-success" exact={true}>
							<PaySuccess />
						</Route>
						{/* 登录 */}
						<Route path="/login" exact={true}>
							<Login />
						</Route>
						{/* 注册 */}
						<Route path="/register" exact={true}>
							<Register />
						</Route>
						{/* 重置 */}
						<Route path="/reset" exact={true}>
							<ResetPwd />
						</Route>
					</IonRouterOutlet>
				</IonReactRouter>
			</ConfigProvider>
		</IonApp>
	);
};
export default App;
