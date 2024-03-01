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
		{ label: "销售经理", key: "salesManager", value: "salesManager" },
		{
			label: "合同编号",
			key: "uuid",
			value: "uuid",
		},
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
