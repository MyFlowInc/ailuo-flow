// 表格列

import { apiCall } from "../../network";

interface saleProjectListParams {
	pageNum: number;
	pageSize: number;
}

export function saleProjectList(params: saleProjectListParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/page",
		method: "get",
		params
	});
}

export function saleProjectAdd(data: saleProjectListParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/save",
		method: "post",
		data
	});
}
