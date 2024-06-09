import { apiCall } from "../../network";
import qs from "qs";

export function purRequisition(params: any) {
	return apiCall({
		url: "api/sys/purRequisition/page",
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
