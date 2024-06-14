import React from "react";
import { Space } from "antd";

import Search from "./Search";
import Filter from "./Filter"; // 筛选
import Sort from "./Sort"; // 排序
import LinePng from "../../../../assets/line.png";

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = ({ }) => {
	// const dstColumns = useAppSelector(selectCurTableColumn);
	// const records = useAppSelector(selectCurTableRecords);
	const dstColumns = [
		{ label: "节点名称", key: "nodeName", value: "nodeName" },
		{ label: "检验项名称", key: "name", value: "name" },
		{ label: "发起请检时间", key: "createTime", value: "createTime" },
		{ label: "请检类型", key: "type", value: "type" },
		{ label: "完成请检时间", key: "completeInspection", value: "completeInspection" },
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
