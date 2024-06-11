import { apiCall } from "../../network";
import qs from "qs";

export function purQualitycontrol(params: any) {
	return apiCall({
		url: "api/sys/purQualitycontrol/page",
		method: "get",
		params,
	});
}

export function savePurQualitycontrol(data: any) {
	return apiCall({
		url: "api/sys/purQualitycontrol/save",
		method: "post",
		data,
	});
}

export function updatePurQualitycontrol(data: any) {
	return apiCall({
		url: "api/sys/purQualitycontrol/edit",
		method: "put",
		data,
	});
}

export function removePurQualitycontrol(params: any) {
	return apiCall({
		url: "api/sys/purQualitycontrol/remove",
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

export function updateMilestone(data: any) {
	return apiCall({
		url: "api/sys/purImportantevents/edit",
		method: "put",
		data,
	});
}

