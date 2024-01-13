import React from "react";
import { Space } from "antd";
import { useAppSelector } from "../../../../store/hooks";
import { selectCurTableColumn, selectCurTableRecords } from "../../../../store/workflowSlice";

import Search from "./Search";
import Filter from "./Filter"; // 筛选
import Sort from "./Sort"; // 排序
import Senior from "./Senior";
import LinePng from "../../../../assets/line.png";

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = () => {
	const dstColumns = useAppSelector(selectCurTableColumn);
	const records = useAppSelector(selectCurTableRecords);

	return (
		<Space>
			<Search columns={dstColumns} />
			<Filter records={records} columns={dstColumns} />
			<img src={LinePng} style={{ width: "14px", height: "14px" }} />
			<Sort columns={dstColumns} />
			<img src={LinePng} style={{ width: "14px", height: "14px" }} />
			<Senior />
		</Space>
	);
};

export default HeaderToolBar;
