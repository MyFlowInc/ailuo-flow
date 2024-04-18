import React from "react";
import { Space } from "antd";
import Search from "./Search";
import Sort from "./Sort"; // 排序

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = ({ }) => {
	// const dstColumns = useAppSelector(selectCurTableColumn);
	// const records = useAppSelector(selectCurTableRecords);
	const dstColumns = [
		{ label: "标准件名称", key: "name", value: "name" },
		{ label: "配料单", key: "ingredientsList", value: "ingredientsList" },
		{ label: "BOM", key: "bom", value: "bom" },
		{ label: "加工图纸包", key: "processPkg", value: "processPkg" },
		{ label: "装配图纸包", key: "fitOutPkg", value: "fitOutPkg" },
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
