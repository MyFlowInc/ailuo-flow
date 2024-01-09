import { apiCall } from "../../network";

interface InviteUserListParams {
	dstId: string;
}
export function inviteUserList(params: InviteUserListParams) {
	return apiCall({
		url: "api/sys/apitableDeveloper/user/list/all",
		method: "get",
		params
	});
}

interface UserInviteParams {
	dstId: string;
	userId: string;
}
// 邀请指定用户
export function userInvite(data: UserInviteParams) {
	return apiCall({
		url: "api/sys/apitableDeveloper/save",
		method: "post",
		data
	});
}

// 获取全部邀请信息
export function getInviteList(params: any = {}) {
	return apiCall({
		url: "api/sys/apitableInviteRecord/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 999,
			...params
		}
	});
}

// 手动忽略消息提醒
export function readMessage(data: any = {}) {
	return apiCall({
		url: "api/sys/apitableInviteRecord/edit",
		method: "put",
		data
	});
}
interface AgreeInviteParams {
	dstId?: string;
	userId?: string;
	enable?: 0 | 1 | 2; // enable:1 同意 enabe:2拒绝 enable:0 未处理 ignore:0 1未读/已读
	id?: string;
	ignoreMsg?: 0 | 1;
}
// 同意邀请
export function respondInvite(data: AgreeInviteParams) {
	return apiCall({
		url: "api/sys/apitableDeveloper/enable",
		method: "post",
		data
	});
}

// 当前表格协作者列表

export function apitableDeveloperUserList(dstId: string) {
	return apiCall({
		url: "api/sys/apitableDeveloper/page",
		method: "get",
		params: { dstId }
	});
}

interface EditInviteUserParams {
	allowEdit?: number;
	allowManage?: number;
	allowSave?: number;
	allowWatch?: number;
	id: string;
}

// 修改协作者权限
export function editInviteUser(data: EditInviteUserParams) {
	return apiCall({
		url: "api/sys/apitableDeveloper/edit",
		method: "PUT",
		data
	});
}

export function dropDeveloper(params: { dstId: string }) {
	return apiCall({
		url: "api/sys/apitableDeveloper/delete",
		method: "delete",
		params
	});
}

// 移除协作者
export function deleteInviteUser(params: { id: string }) {
	return apiCall({
		url: "api/sys/apitableDeveloper/remove",
		method: "delete",
		params
	});
}

// 删除通知

// 修改协作者权限
export function deleteInviteRecord(data: { id: string }) {
	return apiCall({
		url: "api/sys/apitableInviteRecord/remove",
		method: "delete",
		params: data
	});
}
