// 表格列

import { apiCall } from "../../network";

export function getUserMenu() {
	return apiCall({
		url: "/api/sys/user/menu",
		method: "get",
		params: {}
	});
}
