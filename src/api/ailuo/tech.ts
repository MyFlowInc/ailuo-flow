// 技术审批

import qs from "qs";
import { apiCall } from "../../network";
import { ITechStatus } from "./dict";

interface PageParams {
	pageNum: number;
	pageSize: number;
	id?: number;
}

export function techProjectList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/page",
		method: "get",
		params,
	});
}

interface SaveParams {
	[key: string]: any;
}
export function techProjectAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/save",
		method: "post",
		data,
	});
}
interface EditParams {
	id: number;
	[key: string]: any;
}
export function techProjectEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/edit",
		method: "PUT",
		data,
	});
}

export function techProjectRemove(id: number) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/remove",
		method: "DELETE",
		params: { id },
	});
}

export function techProjectRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/removeBatch",
		method: "DELETE",
		params: { ids },
		// @ts-ignore
		paramsSerializer: (params: any) => {
			// 使用qs库来序列化参数，重复参数的键名不会带有索引
			return qs.stringify(params, { arrayFormat: "repeat" });
		},
	});
}

export function changeStatus(data: {
	id: number;
	status: ITechStatus[keyof ITechStatus];
}) {
	return apiCall({
		url: "api/sys/projectTechnicalProcess/edit",
		method: "put",
		data,
	});
}
