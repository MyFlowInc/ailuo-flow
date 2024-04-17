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

export function splProjectList(params: PageParams) {
	return apiCall({
		url: "api/sys/splProject/page",
		method: "get",
		params,
	});
}
