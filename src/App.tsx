import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/User/Login";
import DashboardRouterOutlet from "./routes/DashboardRouterOutlet";
import Preview from "./pages/Preview";
import "./styles/tailwind.css";
import "./styles/cover.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import ResetPwd from "./pages/User/ResetPwd";
import Setting from "./pages/Setting";
import ModeSelectTable from "./pages/Sale/ModeSelectTable";
import PublicAddQuote from "./pages/Sale/PublicAddQuote";

setupIonicReact();

const App: React.FC = () => {
	return (
		<IonApp>
			<ConfigProvider locale={zhCN}>
				<IonReactRouter>
					<IonRouterOutlet placeholder="loading...">
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

						{/* 登录 */}
						<Route path="/login" exact={true}>
							<Login />
						</Route>

						<Route path="/reset" exact={true}>
							<ResetPwd />
						</Route>
						<Route path="/test" exact={true}>
							<ModeSelectTable />
						</Route>
						{/* 神奇表单 */}
						<Route path="/add-quote" exact={true}>
							<PublicAddQuote />
						</Route>
					</IonRouterOutlet>
				</IonReactRouter>
			</ConfigProvider>
		</IonApp>
	);
};
export default App;
