import { apiCall } from "../../network";

//  当前报价的审批人设置情况
export function approveInfo(projectSaleId?: string) {
	let params: any = {
		pageNum: 1,
		pageSize: 99,
	};
	if (projectSaleId) {
		params.projectSaleId = projectSaleId;
	}
	return apiCall({
		url: "api/sys/projectFlowStep/page",
		method: "get",
		params,
	});
}

interface ApprovePersonAddParams {
	carbonUserId: string;
	projectSaleId?: string;
	relationUserId: string;
}
// 添加审批人
export function approvePersonAdd(data: ApprovePersonAddParams) {
	return apiCall({
		url: "api/sys/projectFlowStep/save",
		method: "post",
		data,
	});
}

// 移除审批人
export function approvePersonRemove(id: number) {
	return apiCall({
		url: "api/sys/projectFlowStep/remove",
		method: "DELETE",
		params: {
			id,
		},
	});
}
