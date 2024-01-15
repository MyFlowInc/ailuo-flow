import React from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";

const Page: React.FC = () => {
	return (
		<ConfigProvider theme={dashboardTheme}>
			<div>123</div>
		</ConfigProvider>
	);
};

export default Page;
