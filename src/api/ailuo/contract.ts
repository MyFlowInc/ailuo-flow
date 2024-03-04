// 表格列

import qs from "qs";
import { apiCall } from "../../network";

interface PageParams {
	pageNum: number;
	pageSize: number;
	status?: string;
	id?: string;
	createBy?: string;
}
export function contractList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/page",
		method: "get",
		params,
	});
}

interface SaveParams {
	[key: string]: any;
}
export function contractAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/save",
		method: "post",
		data,
	});
}

interface EditParams {
	id: number;
	[key: string]: any;
}
export function contractEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/edit",
		method: "PUT",
		data,
	});
}

export function contractRemove(id: number) {
	return apiCall({
		url: "api/sys/projectFlowContract/remove",
		method: "DELETE",
		params: { id },
	});
}

export function contractRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/projectFlowContract/removeBatch",
		method: "DELETE",
		params: { ids },
		// @ts-ignore
		paramsSerializer: (params: any) => {
			// 使用qs库来序列化参数，重复参数的键名不会带有索引
			return qs.stringify(params, { arrayFormat: "repeat" });
		},
	});
}
