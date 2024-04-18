// 表格列

import { apiCall } from "../../network";
import { MainStatus } from "./dict";
import qs from "qs";
interface PageParams {
	pageNum: number;
	pageSize: number;
	status?: string;
	id?: string;
	createBy?: string;
}

export function splFileDataList(params: PageParams) {
	return apiCall({
		url: "api/sys/splFileData/page",
		method: "get",
		params,
	});
}
