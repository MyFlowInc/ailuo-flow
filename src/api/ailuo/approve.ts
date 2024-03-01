import { apiCall } from "../../network";

//  当前报价的审批人设置情况
export function approveInfo(options: any = {}) {
	const { belong } = options;
	let params: any = {
		pageNum: 1,
		pageSize: 99,
		status: 1,
		belong, // sale or contract
	};

	return apiCall({
		url: "api/sys/projectFlowStep/page",
		method: "get",
		params,
	});
}

// 设置 当前 是会签 还是  或签
export function approvePersonEdit(data: { type: string; belong: string }) {
	return apiCall({
		url: "api/sys/projectFlowStep/edit",
		method: "post",
		data,
	});
}

interface ApprovePersonAddParams {
	carbonUserId: string;
	projectSaleId?: string;
	relationUserId: string;
	type: "and" | "or" | string;
	belong: "sale" | "contract" | string;
}
// 添加审批人
export function approvePersonAdd(data: ApprovePersonAddParams) {
	return apiCall({
		url: "api/sys/projectFlowStep/save",
		method: "post",
		data,
	});
}

interface ApproveSaveBathParams {
	carbonUserId: string;
	projectSaleId?: string;
	relationUserId: string;
	type: "and" | "or" | string;
	belong: "sale" | "contract" | string;
}
export function approveSaveBath(data: ApproveSaveBathParams[]) {
	return apiCall({
		url: "api/sys/projectFlowStep/saveBath",
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

// 终审阶段会签

// 确定终审情况
export function finalInfoPage(projectSaleId?: string) {
	let params: any = {
		pageNum: 1,
		pageSize: 10,
		projectSaleId,
	};

	return apiCall({
		url: "api/sys/projectFlowApprove/page",
		method: "get",
		params,
	});
}

// 会签审批接口
export function finalApproveEdit(data: any) {
	return apiCall({
		url: "api/sys/projectFlowApprove/edit",
		method: "put",
		data,
	});
}
