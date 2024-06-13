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
		{ label: "请购类型", key: "type", value: "type" },
		{ label: "状态", key: "status", value: "status" },
		{ label: "关联项目名称", key: "relationProject", value: "relationProject" },
		{ label: "请购人", key: "requestor", value: "requestor" },
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
