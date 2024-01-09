// 表格

import { DBApitableDatasheet } from "../../interface/db_datasheet";
import { apiCall } from "../../network";

interface ListParams {
	pageNum: number;
	pageSize: number;
	archive?: 0 | 1;
}

interface DSTableList {
	code: number;
	data: {
		total: 5;
		record: Array<DBApitableDatasheet>;
	};
}

// 自己创建的表格
export function fetchWorkflowList(data: ListParams): Promise<DSTableList> {
	return apiCall({
		url: "api/sys/apitableDatasheet/page",
		method: "get",
		params: data
	});
}
// 参与的表格
export function fetchInviteWorkflowList(data: ListParams): Promise<DSTableList> {
	return apiCall({
		url: "api/sys/apitableDatasheet/page",
		method: "get",
		params: { ...data, isDeveloper: 1 }
	});
}

interface AddParams {
	deleted: boolean;
	dstId: string;
	dstName: string; // 表格名称
	nodeId: string;
	remark: string;
	revision: number;
	spaceId: string;
	tenantId: string;
	updateBy: string;
}

export function addWorkFlow(data: Partial<AddParams>) {
	return apiCall({
		url: "api/sys/apitableDatasheet/save",
		method: "post",
		data: data
	});
}

interface updateParams {
	id: string;
	dstName?: string;
	archive?: number;
	icon?: string;
}
export function updateWorkFlow(data: updateParams) {
	return apiCall({
		url: "api/sys/apitableDatasheet/edit",
		method: "put",
		data: data
	});
}

interface resetSortParams {
	sortType: "personal" | "teamwork";
	dstIds: string[];
}

export function resetSortWorkFlow(data: resetSortParams) {
	const { sortType, dstIds } = data;
	return apiCall({
		url: "api/sys/apitableDatasheet/resetSort",
		method: "put",
		params: {
			sortType
		},
		data: dstIds
	});
}

export function deleteWorkFlow(id: string) {
	return apiCall({
		url: "api/sys/apitableDatasheet/remove",
		params: { id },
		method: "delete"
	});
}
