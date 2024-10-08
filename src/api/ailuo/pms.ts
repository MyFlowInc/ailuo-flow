import { apiCall } from "../../network";
import qs from "qs";

export function purRequisition(params: any) {
	return apiCall({
		url: "api/sys/erp/page",
		method: "get",
		params,
	});
}

export function purRequisitionItem(params: any) {
	return apiCall({
		url: "api/sys/erp/list",
		method: "get",
		params,
	});
}

export function purRequisitionList(params: any) {
	return apiCall({
		url: "api/sys/purRequisition/list",
		method: "get",
		params,
	});
}

export function savePurRequisition(data: any) {
	return apiCall({
		url: "api/sys/purRequisition/save",
		method: "post",
		data,
	});
}

export function updatePurRequisition(data: any) {
	return apiCall({
		url: "api/sys/purRequisition/edit",
		method: "put",
		data,
	});
}

export function removePurRequisition(params: any) {
	return apiCall({
		url: "api/sys/purRequisition/remove",
		method: "delete",
		params,
	});
}

export function getPurChaseItemList(params: any) {
	return apiCall({
		url: "api/sys/purItem/page",
		method: "get",
		params,
	});
}

export function getQualityItemList(params: any) {
	return apiCall({
		url: "api/sys/purItem/list",
		method: "get",
		params,
	});
}

export function savePurchaseItem(data: any) {
	return apiCall({
		url: "api/sys/purItem/save",
		method: "post",
		data,
	});
}

export function updatePurchaseItem(data: any) {
	return apiCall({
		url: "api/sys/purItem/edit",
		method: "put",
		data,
	});
}

export function removePurchaseItem(params: any) {
	return apiCall({
		url: "api/sys/purItem/remove",
		method: "delete",
		params,
	});
}

export function getMilestoneList(params: any) {
	return apiCall({
		url: "api/sys/purImportantevents/page",
		method: "get",
		params,
	});
}

export function saveMilestone(data: any) {
	return apiCall({
		url: "api/sys/purImportantevents/save",
		method: "post",
		data,
	});
}

export function removeMilestone(params: any) {
	return apiCall({
		url: "api/sys/purImportantevents/remove",
		method: "delete",
		params,
	});
}

export function updateMilestone(data: any) {
	return apiCall({
		url: "api/sys/purImportantevents/edit",
		method: "put",
		data,
	});
}

export function getRelationProject() {
	return apiCall({
		url: "api/sys/splProject/selectByRelationProject",
		method: "get",
	});
}

