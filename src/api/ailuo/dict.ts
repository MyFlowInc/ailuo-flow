import { apiCall } from "../../network";

const cache: any = {};

export function dictPage(code: string, fresh: boolean = false) {
	if (cache[code] && !fresh) {
		return Promise.resolve(cache[code]);
	}

	return apiCall({
		url: "api/sys/dict/data/page",
		method: "get",
		params: {
			pageNum: 1,
			pageSize: 999,
			code
		}
	});
}

export function dictAdd(data: any) {
	return apiCall({
		url: "api/sys/dict/data/save",
		method: "post",
		data: {
			code: data.code,
			enable: "true",
			label: data.label,
			sort: 0,
			value: data.value
		}
	});
}

export function dictRemove(id: string) {
	return apiCall({
		url: "api/sys/dict/data/remove",
		method: "DELETE",
		params: {
			id
		}
	});
}
export interface IFlowStatus {
	value: string;
	label: string;
	id: string;
	color: string;
}

// code :  flow_status
export const FlowStatus = [
	{
		value: "not_started",
		label: "未启动",
		id: "1746847549987905538",
		color: "#E8F2FF"
	},
	{
		value: "processing",
		label: "处理中",
		id: "1746847583802384385",
		color: "#FFEEE3"
	},
	{
		value: "technical_review",
		label: "技术审核中",
		id: "1746847658217725954",
		color: "#FFEEE3"
	},
	{
		value: "technical_over",
		label: "技术审核完成",
		id: "1746847896856846338",
		color: "#E8FFEA"
	},
	{
		value: "quotation_review",
		label: "报价终审中",
		id: "1746847836731498498",
		color: "#FFEEE3"
	},
	{
		value: "approved",
		label: "审批通过",
		id: "1746847974359195650",
		color: "#E8FFEA"
	},
	{
		value: "review_failed",
		label: "审批驳回",
		id: "1746848020739809282",
		color: "#FF9F9F"
	}
];

export enum MainStatus {
	NotStarted = "not_started",
	Processing = "processing",
	TechnicalReview = "technical_review",
	TechnicalOver = "technical_over",
	QuotationReview = "quotation_review",
	Approved = "approved",
	ReviewFailed = "review_failed"
}

export const TechStatus = [
	{
		"value": "t_todo",
		"label": "待开始",
		"id": "1747826125270597134",
		"color": "#E8F2FF"
	},
	{
		"value": "t_processing",
		"label": "处理中",
		"id": "1747826896261599234",
		"color": "#E8F2FF"
	},
	{
		"value": "t_over",
		"label": "处理完成",
		"id": "1747826967833202689",
		"color": "#E8F2FF"
	}
]
export enum ITechStatus {
	Todo = "t_todo",
	Processing = "t_processing",
	Over = "t_over"
}

export function dictFlowStatus(): Promise<IFlowStatus[]> {
	return Promise.resolve(FlowStatus);
}
