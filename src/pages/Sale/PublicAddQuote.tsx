/**
 * 神奇表单
 */
import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import _ from "lodash";
import PublicAddEditor from "./FormModal/PublicAddEditor";

export const PublicAddQuoteContext = React.createContext<any>({});

const PublicAddQuote: React.FC = () => {
	const curPage = useRef({
		pageNum: 1,
		pageSize: 50,
		total: 0,
	});
	const props: any = {};
	useEffect(() => {
		console.log("PublicAddQuote 初始化");
		return () => {
			console.log("PublicAddQuote 销毁");
		};
	}, []);

	return (
		<ConfigProvider theme={dashboardTheme}>
			<PublicAddQuoteContext.Provider value={{}}>
				<PublicAddEditor />
			</PublicAddQuoteContext.Provider>
		</ConfigProvider>
	);
};

export default PublicAddQuote;
