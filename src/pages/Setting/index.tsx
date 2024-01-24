import React from "react";
import { Route, Switch, Redirect } from "react-router";
import styled from "styled-components";
import { Layout, ConfigProvider } from "antd";
import NavMenu from "../../components/Setting/NavMenu";
import Personal from "./Personal";
import Security from "./Security";
import { useLoginByCache } from "../../hooks";

const SettingRoot = styled.div`
	display: flex;
	height: 100%;
	overflow: auto;
	overflow-x: hidden;
	background-color: #ffffff;

	.nav-side {
		padding: 16px;
		flex-grow: 1;
		background-color: #e8ecf1;
	}

	.setting-content {
		display: "flex";
		height: 100%;
		background-color: #ffffff;
	}
`;

const Setting: React.FC = () => {
	useLoginByCache();

	return (
		<ConfigProvider
			theme={{
				token: {
					fontSize: 12,
					fontFamily: `"Harmony_Regular", sans-serif`
				}
			}}>
			<SettingRoot>
				<Layout>
					<Layout.Sider theme="light" width={212} className="nav-side">
						<NavMenu />
					</Layout.Sider>
					<Layout>
						<Layout.Content className="setting-content">
							<Switch>
								<Route exact path="/setting">
									<Redirect to="/setting/personal" />
								</Route>
								<Route path="/setting/personal" exact={true}>
									<Personal />
								</Route>
								<Route path="/setting/security" exact={true}>
									<Security />
								</Route>

							</Switch>
						</Layout.Content>
					</Layout>
				</Layout>
			</SettingRoot>
		</ConfigProvider>
	);
};

export default Setting;
