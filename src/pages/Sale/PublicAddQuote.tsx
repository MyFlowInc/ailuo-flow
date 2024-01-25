import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { saleProjectList, saleProjectRemove } from "../../api/ailuo/sale";
import { DashboardRoot } from "./styles";
import _ from "lodash";
import { IfetchSaleList } from "./types";
import CustomModal from "./FormModal/CustomModal";
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
