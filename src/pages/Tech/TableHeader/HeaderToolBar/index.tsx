import React from "react";
import { Space } from "antd";

import Search from "./Search";
import Filter from "./Filter"; // 筛选
import Sort from "./Sort"; // 排序
import LinePng from "../../../../assets/line.png";

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = () => {
	// const dstColumns = useAppSelector(selectCurTableColumn);
	// const records = useAppSelector(selectCurTableRecords);
	const dstColumns = [
		{ label: "项目名称", key: "name" },
		{ label: "分析结果", key: "result" },
		{ label: "选型分析", key: "status" },
		{ label: "生产分析", key: "status" }
	];
	const records = [] as any;
	return (
		<Space>
			<Search columns={dstColumns} />
			<Filter records={records} columns={dstColumns} />
			<img src={LinePng} style={{ width: "14px", height: "14px" }} />
			<Sort columns={dstColumns} />
		</Space>
	);
};

export default HeaderToolBar;
