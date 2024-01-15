// 表格列

import { apiCall } from "../../network";

interface PageParams {
	pageNum: number;
	pageSize: number;
}

export function saleProjectList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/page",
		method: "get",
		params
	});
}

interface SaveParams {
	[key: string]: any;
}
export function saleProjectAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/save",
		method: "post",
		data
	});
}
interface EditParams {
	id: number;
	[key: string]: any;
}
export function saleProjectEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/edit",
		method: "PUT",
		data
	});
}
