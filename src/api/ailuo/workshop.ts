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

interface GetImportantEventsReq {
	pageNum: number;
	pageSize: number;
	relationRequisition?: string;
	relatedStock?: string;
	relatedAssembling?: string;
	relatedMachining?: string;
	relatedWorkshop?: string;
	deliveryTime?: string;
}

interface GetPurMachiningReq {
	type: string;
	relatedProjects: string;
	pageNum: number;
	pageSize: number;
}

interface SavePurMachiningReq {
	type: string;
	endTime?: string;
	expectedTime?: string;
	workerName?: string;
	number?: string;
	status?: string;
	relatedWorkshopstatus: string;
	relatedProject: string;
	relatedManage: string;
}

interface UpdatePurMachiningReq {
	type?: string;
	endTime?: string;
	expectedTime?: string;
	workerName?: string;
	number?: string;
	status?: string;
	id: string;
}

export function getImportantEvents(params: GetImportantEventsReq) {
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

export function getPurMachining(params: GetPurMachiningReq) {
	return apiCall({
		url: "api/sys/purMachining/page",
		method: "get",
		params,
	});
}

export function savePurMachining(data: SavePurMachiningReq) {
	return apiCall({
		url: "api/sys/purMachining/save",
		method: "post",
		data,
	});
}

export function updatePurMachining(data: UpdatePurMachiningReq) {
	return apiCall({
		url: "api/sys/purMachining/edit",
		method: "put",
		data,
	});
}

export function removePurMachining(params: Params) {
	return apiCall({
		url: "api/sys/purMachining/remove",
		method: "delete",
		params,
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
