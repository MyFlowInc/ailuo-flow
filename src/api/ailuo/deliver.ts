import { apiCall } from "../../network";

interface Params {
	id?: string;
}

interface GetBatchParam {
	id?: string;
	relationProject?: string;
}

interface EditBatchInfoReq {
	id?: string;
	dataPackage?: string;
	status?: string;
}

interface EditDeliverManageReq {
	id?: string;
	status?: string;
	addTo?: string;
	remark?: string;
}

interface RemoveBatchParam {
	id?: string;
}

interface GetProEquipParam {
	relationDeliver?: string;
}

export function getDeliverManage(params: Params) {
	return apiCall({
		url: "api/sys/proDeliver/page",
		method: "get",
		params: params,
	});
}

export function editDeliverManage(data: EditDeliverManageReq) {
	return apiCall({
		url: "api/sys/proDeliver/edit",
		method: "put",
		data,
	});
}

export function getBatchInfo(params: GetBatchParam) {
	return apiCall({
		url: "api/sys/proBatch/page",
		method: "get",
		params: params,
	});
}

export function editBatchInfo(data: EditBatchInfoReq) {
	return apiCall({
		url: "api/sys/proBatch/edit",
		method: "put",
		data,
	});
}

export function removeBatchInfo(params: RemoveBatchParam) {
	return apiCall({
		url: "api/sys/proBatch/remove",
		method: "delete",
		params: params,
	});
}

export function getEquipInfo(params: GetProEquipParam) {
	return apiCall({
		url: "api/sys/proEquipmentinformation/page",
		method: "get",
		params: params,
	});
}
