import React from "react";
import { Space } from "antd";

import Search from "./Search";
import Filter from "./Filter"; // 筛选
import Sort from "./Sort"; // 排序
import LinePng from "../../../../assets/line.png";

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = ({}) => {
	// const dstColumns = useAppSelector(selectCurTableColumn);
	// const records = useAppSelector(selectCurTableRecords);
	const dstColumns = [
		{ label: "标准件名称", key: "name", value: "name" },
		{ label: "配料单", key: "company", value: "company" },
		{ label: "BOM", key: "salesManager", value: "salesManager" },
		{ label: "加工图纸包", key: "quotationBegin", value: "quotationBegin" },
		{ label: "装配图纸包", key: "torqueThrust", value: "torqueThrust" },
	];
	const records = [] as any;
	return (
		<Space>
			<Search columns={dstColumns} />
			{/* <Filter records={records} columns={dstColumns} />
			<img src={LinePng} style={{ width: "14px", height: "14px" }} /> */}
			<Sort columns={dstColumns} />
		</Space>
	);
};

export default HeaderToolBar;
