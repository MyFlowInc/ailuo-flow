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
		url: "api/sys/splFileData/tree",
		method: "get",
		params,
	});
}



interface SaveParams {
	name: string;
	[key: string]: any;
}

export function splFileDataAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/splFileData/save",
		method: "post",
		data,
	});
}

interface EditParams {
	id: string;
	[key: string]: any;
}
export function splFileDataEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/splFileData/edit",
		method: "PUT",
		data,
	});
}

export function splFileDataRemove(id: string | number) {
	return apiCall({
		url: "api/sys/splFileData/remove",
		method: "DELETE",
		params: { id },
	});
}
export function splFileDataRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/splFileData/removeBatch",
		method: "delete",
		params: { ids },
		paramsSerializer: {
			serialize: ((params: any) => {
				return qs.stringify(params, { arrayFormat: "repeat" });
			}) as any,
		} as any,
	});
}