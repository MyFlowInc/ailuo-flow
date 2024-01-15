// 表格列

import { apiCall } from "../../network";

const cache: any = {};

export function dictPage(code: string, fresh: boolean = false) {
	if (cache[code] && !fresh) {
		return Promise.resolve(cache[code]);
	}

	return apiCall({
		url: "api/sys/dict/data/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 999,
			code
		}
	});
}

export function dictAdd(data: any) {
	return apiCall({
		url: "api/sys/dict/data/save",
		method: "post",
		data: {
			code: data.code,
			enable: "true",
			label: data.label,
			sort: 0,
			value: data.value
		}
	});
}
export function dictRemove(id: string) {
	return apiCall({
		url: "api/sys/dict/data/remove",
		method: "DELETE",
		params: {
			id
		}
	});
}
