import React from "react";
import { Space } from "antd";
import Search from "./Search";
import Sort from "./Sort"; // 排序

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = () => {
	const dstColumns = [
		{ label: "项目名称", key: "name", value: "name" },
		{ label: "单位名称", key: "company", value: "company" },
		{ label: "单位联系方式", key: "phone", value: "phone" },
		{ label: "销售经理", key: "salesManager", value: "salesManager" },
		{ label: "合同编号", key: "uuid", value: "uuid", },
		{ label: "合同日期", key: "contractTime", value: "contractTime", },
		{ label: "执行机构形式", key: "mechanismForm", value: "mechanismForm", },
		{ label: "货币", key: "currency", value: "currency", },
		{ label: "交期", key: "quotationEnd", value: "quotationEnd", },
		{ label: "质保", key: "qualityTime", value: "qualityTime", },
		{ label: "付款方式", key: "payType", value: "payType", },

	];
	const records = [] as any;
	return (
		<Space>
			<Search columns={dstColumns} />
			<Sort columns={dstColumns} />
		</Space>
	);
};

export default HeaderToolBar;
