import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { Steps } from "antd";
import { dashboardTheme } from "../../theme/theme";
import { saleProjectList, saleProjectRemove } from "../../api/ailuo/sale";
import { BaseLoading } from "../../BaseUI/BaseLoading";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

import _ from "lodash";
import styled from "styled-components";
import { IfetchSaleList } from "./types";
import { UserOutlined } from "@ant-design/icons";
import PrepareForm from "./FormModal/PrepareForm";
import ReviewForm from "./FormModal/ReviewForm";
import DataConfig from "./FormModal/DataConfig";
const DashboardRoot = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	.ant-modal {
		height: 100vh;
	}
`;
export const SaleManageContext = React.createContext<any>({});

const PreProductionManage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [current, setCurrent] = useState(0);

	const PreSteps = () => {
		const onChange = (value: number) => {
			console.log("onChange:", value);
			setCurrent(value);
		};
		return (
			<Steps
				className="mt-4"
				current={current}
				onChange={onChange}
				labelPlacement="vertical"
				items={[
					{
						description: "立项准备",
					},
					{
						description: "立项审核",
					},
					{
						description: "生产资料配置",
					},
					{
						description: "生产资料审核",
					},
					{
						description: "提交车间",
					},
				]}
			/>
		);
	};
	const CurForm = () => {
		if (current === 0) {
			return <PrepareForm />
		}
		if (current === 1) {
			return <ReviewForm />
		}

		if (current === 2) {
			return <DataConfig />
		}

	}
	return (
		<ConfigProvider theme={dashboardTheme}>
			<SaleManageContext.Provider value={{}}>
				<DashboardRoot>
					<div className="w-full" style={{ padding: '0 10%' }}>
						<PreSteps />
					</div>
					{loading && <BaseLoading />}
					{CurForm()}
				</DashboardRoot>
			</SaleManageContext.Provider>
		</ConfigProvider>
	);
};

export default PreProductionManage;
