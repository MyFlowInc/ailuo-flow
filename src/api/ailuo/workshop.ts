import { apiCall } from "../../network";
interface Params {
	id?: string;
}

interface UpdateWorkshopStatusReq {
	id: string;
	type: string;
	status: string;
	relatedProjects?: string;
	relatedWorkshop?: string;
}

interface UpdateWorkshopManagementReq {
	id: string;
	debuggingStatus?: string;
	factoryproductionStatus?: string;
}

interface getImportantEventsReq {
	pageNum: number;
	pageSize: number;
	relationRequisition?: string;
	relatedStock?: string;
	relatedAssembling?: string;
	relatedMachining?: string;
	relatedWorkshop?: string;
	deliveryTime?: string;
}

export function getImportantEvents(params: getImportantEventsReq) {
	return apiCall({
		url: "api/sys/purImportantevents/page",
		method: "get",
		params: params,
	});
}
export function getWorkshopManagement(params: Params) {
	return apiCall({
		url: "api/sys/workshopManagement/management",
		method: "get",
		params: params,
	});
}

export function updateWorkshopStatus(data: UpdateWorkshopStatusReq) {
	return apiCall({
		url: "api/sys/purWorkshopstatus/edit",
		method: "put",
		data,
	});
}

export function updateWorkshopManagementStatus(
	id: string,
	stage: string,
	status: string,
) {
	let data: UpdateWorkshopManagementReq = {
		id: id,
	};
	if (stage === "debugging") {
		data.debuggingStatus = status;
	} else if (stage === "factoryproduction") {
		data.factoryproductionStatus = status;
	} else {
		return new Promise((resolve) => {
			resolve({ success: false });
		});
	}
	return apiCall({
		url: "api/sys/workshopManagement/edit",
		method: "put",
		data,
	});
}
