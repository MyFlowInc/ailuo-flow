// 表格列

import { apiCall } from "../../network";

export function getUserMenu(): Promise<{ params: any }> {
	return apiCall({
		url: "/api/sys/inbox/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 10,
		},
	});
}
