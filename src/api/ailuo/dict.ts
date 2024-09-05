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
			code,
		},
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
			value: data.value,
		},
	});
}

export function dictRemove(id: string) {
	return apiCall({
		url: "api/sys/dict/data/remove",
		method: "DELETE",
		params: {
			id,
		},
	});
}
export interface IFlowStatus {
	value: string;
	label: string;
	id: string;
	color: string;
}

// code :  flow_status
export const SaleStatus = [
	{
		value: "not_started",
		label: "未启动",
		id: "1746847549987905538",
		color: "#E8F2FF",
	},
	{
		value: "processing",
		label: "处理中",
		id: "1746847583802384385",
		color: "#FFEEE3",
	},
	{
		value: "technical_review",
		label: "技术审核中",
		id: "1746847658217725954",
		color: "#FFEEE3",
	},
	{
		value: "technical_over",
		label: "技术审核完成",
		id: "1746847896856846338",
		color: "#E8FFEA",
	},
	{
		value: "quotation_review",
		label: "报价终审中",
		id: "1746847836731498498",
		color: "#FFEEE3",
	},
	{
		value: "approved",
		label: "审批通过",
		id: "1746847974359195650",
		color: "#E8FFEA",
	},
	{
		value: "review_failed",
		label: "审批驳回",
		id: "1746848020739809282",
		color: "#FF9F9F",
	},
];

export enum MainStatus {
	NotStarted = "not_started",
	Processing = "processing",
	TechnicalReview = "technical_review",
	TechnicalOver = "technical_over",
	QuotationReview = "quotation_review",
	Approved = "approved",
	ReviewFailed = "review_failed",
}

export const TechStatus = [
	{
		value: "t_todo",
		label: "待开始",
		id: "1747826125270597134",
		color: "#E8F2FF",
	},
	{
		value: "t_processing",
		label: "处理中",
		id: "1747826896261599234",
		color: "#FFEEE3",
	},
	{
		value: "t_over",
		label: "处理完成",
		id: "1747826967833202689",
		color: "#E8FFEA",
	},
];
export enum ITechStatus {
	Todo = "t_todo",
	Processing = "t_processing",
	Over = "t_over",
}

export const ContractStatusList = [
	{
		id: "1761946363040456705",
		label: "未启动",
		value: "not_started",
		color: "#E8F2FF",
	},
	{
		id: "1761946475552661506",
		label: "处理中",
		value: "processing",
		color: "#FFEEE3",
	},
	{
		id: "1761948993703731202",
		label: "审批中",
		value: "reviewing",
		color: "#FFEEE3",
	},
	{
		id: "1761949089929453570",
		label: "审批通过",
		value: "approved",
		color: "#E8FFEA",
	},
	{
		id: "1761949144291827714",
		label: "审批驳回",
		value: "review_failed",
		color: "#FF9F9F",
	},
];

export enum ContractStatusMap {
	NotStarted = "not_started",
	Processing = "processing",
	Reviewing = "reviewing",
	Approved = "approved",
	ReviewFailed = "review_failed",
}

export const SPLProductStatusList = [
	{
		id: "1780123698553700353",
		label: "立项审核中",
		value: "pro_reviewing",
		color: "",
	},
	{
		id: "1780124220534833154",
		label: "立项审批驳回",
		value: "pro_review_failed",
		color: "",
	},
	{
		id: "1780126517297954817",
		label: "生产资料配置",
		value: "materials",
		color: "",
	},
	{
		id: "1780128996119126018",
		label: "生产资料审核",
		value: "materials_rev",
		color: "",
	},
	{
		id: "1780130282054983682",
		label: "提交车间中",
		value: "sub_workshop",
		color: "",
	},
	{
		id: "1780518639209566209",
		label: "提交车间",
		value: "ended",
		color: "",
	},
	{
		id: "1785128711080505346",
		label: "预生产变更中",
		value: "pro_change",
	},
];
export enum SPLProductStatusMap {
	ProStart = "pro_start",
	ProReviewing = "pro_reviewing",
	ProReviewFailed = "pro_review_failed",
	Materials = "materials",
	MaterialsRev = "materials_rev",
	SubWorkshop = "sub_workshop",
	Ended = "ended",
	ProChange = "pro_change",
	ChangeReview = "change_review",
}

export enum PurchaseTypeMap {
	BackupWarehouse = "backup_warehouse",
	Order = "order",
	MachiningCenter = "machining_center",
	Warehouse = "warehouse",
	Workshop = "workshop",
	AfterSales = "after_sales",
	Other = "other",
	erp = 10,
}

export const PurchaseTypeMapDict = {
	backup_warehouse: "备库用",
	order: "订单用",
	machining_center: "加工中心用",
	warehouse: "仓库用",
	workshop: "车间用",
	after_sales: "售后用",
	other: "其他部门用",
	10: "订单用",
};

export enum PurchaseStatusEnum {
	NotStart = "not_start",
	Start = "start",
	InProcurement = "in_procurement",
	Over = "over",
	Received = 'received',
	Erp_Start = 10,
	Erp_Over = 20,
}

export enum PurchaseItemStatusEnum {
	Approve = "approve",
	Reject = "reject",
	TobeTested = "tobe_tested",
	Todo = "todo",
}

export const PurchaseItemStatusMapDict = {
	approve: "通过",
	reject: "重检",
	tobe_tested: "请检中",
	todo: "请检",
};

export enum PurchaseItemWarehousingsStatusEnum {
	Yes = "yes", //已入库
	Or = "or", //未入库
}

export const QualityStatusMapDict = {
	tobe_tested: "待检验",
	reject: "驳回",
	approved: "	通过",
};
export const QualityMapDict = {
	incoming: "来料检",
	warehousing: "入库检",
	machining: "加工检",
	assembling: "装配检",
};

export const MilestoneTypeDict = {
	adopt: "系统",
	exception: "系统异常",
};

export function dictFlowStatus(): Promise<IFlowStatus[]> {
	return Promise.resolve(SaleStatus);
}
