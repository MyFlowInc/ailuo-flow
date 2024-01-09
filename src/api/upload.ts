import { uploadApiCall } from "../network";

export function myFlowUpload(data: any) {
	return uploadApiCall({
		url: "api/sys/oss/upload",
		method: "post",
		data
	});
}
