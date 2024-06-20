import { apiCall } from "../../network";
interface Params {
	id?: string;
}
export function getWorkshopManagement(params: Params) {
	return apiCall({
		url: "api/sys/workshopManagement/management",
		method: "get",
		params: params,
	});
}
