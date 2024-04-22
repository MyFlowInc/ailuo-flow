/**
 * 项目管理  新建 记录后  会 自动向  预生产管理 车间管理等 产生一条记录
 * 预生产 管理
 *
 */

import { apiCall } from "../../network";
import qs from "qs";




interface FileCreateParams {
	name: string;
}
// 新建项目
export function splFolderFileCreate(data: FileCreateParams) {
	return apiCall({
		url: "api/sys/splFolderFile/save",
		method: "POST",
		data,
	});
}

interface ListParams {
	pageNum: number;
	pageSize: number;
	status?: string;
	id?: string;
	createBy?: string;
}
export function splProjectList(params: ListParams) {
	return apiCall({
		url: "api/sys/splProject/page",
		method: "get",
		params,
	});
}
export function splFolderFileTree(params: ListParams) {
	return apiCall({
		url: "api/sys/splFolderFile/tree",
		method: "GET",
		params,
	});
}

