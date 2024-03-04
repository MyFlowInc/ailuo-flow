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
// 需要token
export function saleProjectAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/save",
		method: "post",
		data,
	});
}

// 不需要token
export function saleProjectPublishAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectSaleProcess/publicSave",
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
export function saleProjectRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/projectSaleProcess/removeBatch",
		method: "DELETE",
		params: { ids },
		paramsSerializer: ((params: any) => {
			// 使用qs库来序列化参数，重复参数的键名不会带有索引
			console.log(
				"sadas",
				params,
				qs.stringify(params, { arrayFormat: "repeat" }),
			);
			return qs.stringify(params, { arrayFormat: "repeat" });
		}) as any,
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
