// 表格列

import { apiCall } from "../../network";

export function noticeListFetch(recipientId: string) {
	const params: any = {
		pageNum: 1,
		pageSize: 50,
	};
	if (recipientId) {
		params.recipientId = recipientId;
	}
	return apiCall({
		url: "/api/sys/inbox/page",
		method: "get",
		params,
	});
}

export function noticeAdd(data: { content: string; recipientId: string }) {
	return apiCall({
		url: "/api/sys/inbox/save",
		method: "POST",
		data,
	});
}

export function noticeRemove(id: string) {
	return apiCall({
		url: "/api/sys/inbox/remove",
		method: "DELETE",
		params: {
			id,
		},
	});
}

export function noticeEdit(data: { id: string;[key: string]: any }) {
	return apiCall({
		url: "/api/sys/inbox/edit",
		method: "PUT",
		data,
	});
}
