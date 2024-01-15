// 技术审批

import { apiCall } from "../../network";

interface PageParams {
	pageNum: number;
	pageSize: number;
}

export function techProjectList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/page",
		method: "get",
		params
	});
}

interface SaveParams {
	[key: string]: any;
}
export function techProjectAdd(data: SaveParams) {
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
export function techProjectEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/edit",
		method: "PUT",
		data
	});
}

export function techProjectRemove(id: number) {
	return apiCall({
		url: "api/sys/projectSaleProcess/remove",
		method: "DELETE",
		params: { id }
	});
}
