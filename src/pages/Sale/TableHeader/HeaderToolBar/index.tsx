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
		{ label: "单位名称", key: "company" },
		{ label: "销售经理", key: "salesManager" },
		{ label: "报价开始日期", key: "quotationBegin" },
		{ label: "扭矩/推力", key: "torqueThrust" },
		{ label: "其他技术要求", key: "otherTechnicalRequirements" },
		{ label: "执行机构形式", key: "mechanismForm" },
		{ label: "货币", key: "currency" },
		{ label: "交期", key: "quotationEnd" },
		{ label: "质保", key: "qualityTime" },
		{ label: "贸易方式", key: "modeTrade" },
		{ label: "付款方式", key: "payType" }
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
