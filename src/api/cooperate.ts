// 协作

import { apiCall } from "../network";

// 获取会员列表
export function userGradeList() {
	return apiCall({
		url: "/api/sys/sysUserGrade/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 10
		}
	});
}
