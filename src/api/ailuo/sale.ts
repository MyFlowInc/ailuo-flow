// 表格列

import { apiCall } from "../../network";
import { MainStatus } from "./dict";

interface PageParams {
	pageNum: number;
	pageSize: number;
	status?: string;
	id?: string;
}

export function saleProjectList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/page",
		method: "get",
		params,
	});
}

interface SaveParams {
	[key: string]: any;
}
export function saleProjectAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/save",
		method: "post",
		data,
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
		data,
	});
}

export function saleProjectRemove(id: number) {
	return apiCall({
		url: "api/sys/projectSaleProcess/remove",
		method: "DELETE",
		params: { id },
	});
}

export function changeStatus(data: {
	id: number;
	status: MainStatus[keyof MainStatus];
}) {
	return apiCall({
		url: "api/sys/projectSaleProcess/changeStatus",
		method: "post",
		data,
	});
}

// 查询轮数
export function fetchTurnTime(name: string) {
	return apiCall({
		url: "api/sys/projectSaleProcess/turnTime",
		method: "get",
		params: {
			name,
		},
	});
}
