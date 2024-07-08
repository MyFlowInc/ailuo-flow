import incoming from "./assets/incoming.svg";
import machining from "./assets/machining.svg";
import assembling from "./assets/assembling.svg";
import debugging from "./assets/debugging.svg";
import factorypoduction from "./assets/factorypoduction.svg";

export type IfetchSaleList = (options?: { [key: string]: any }) => void;
export type Status = "not_start" | "start" | "tobe_tested" | "over";
export type Stage =
	| "incoming"
	| "machining"
	| "assembling"
	| "debugging"
	| "factory_production";

export const statusActionsMap = {
	common: {
		not_start: ["start"],
		start: ["over"],
		tobe_tested: [],
		over: [],
	},
};

export type TypeStatusTagLabelMap = Record<Stage, any>;

export const typeStatusTagLabelMap: TypeStatusTagLabelMap = {
	incoming: {
		statusLabel: {
			not_start: "未开始",
			start: "备料中",
			over: "已完成",
		},
		actionLabel: {
			start: "开始备料",
			over: "完成备料",
		},
	},
	machining: {
		statusLabel: {
			not_start: "未开始",
			start: "加工中",
			over: "完成加工",
		},
		actionLabel: {
			start: "开始加工",
			over: "完成加工",
		},
	},
	assembling: {
		statusLabel: {
			not_start: "未开始",
			start: "总装中",
			over: "完成总装",
		},
		actionLabel: {
			start: "开始总装",
			over: "完成总装",
		},
	},
	debugging: {
		statusLabel: {
			not_start: "未开始",
			start: "调试中",
			over: "完成调试",
		},
		actionLabel: {
			start: "开始调试",
			over: "完成调试",
		},
	},
	factory_production: {
		statusLabel: {
			not_start: "未开始",
			start: "出厂检验中",
			over: "完成出厂检验",
		},
		actionLabel: {
			start: "开始出厂检验",
			over: "完成出厂检验",
		},
	},
};

export const stageCardInfoMap = {
	incoming: {
		title: "备料",
		imgSrc: incoming,
		imgColor: "#E7EAFF",
	},
	machining: {
		title: "加工",
		imgSrc: machining,
		imgColor: "#E7F7FF",
	},
	assembling: {
		title: "装配",
		imgSrc: assembling,
		imgColor: "#F0FFFD",
	},
	debugging: {
		title: "调试",
		imgSrc: debugging,
		imgColor: "#F1FDEE",
	},
	factory_production: {
		title: "出厂检验",
		imgSrc: factorypoduction,
		imgColor: "#FFF5D4",
	},
};

export const DeliverStatusActionsMap = {
	deliver: {
		not_start: ["start"],
		start: ["over"],
		over: [],
	},
	batch: {
		not_start: ["start"],
		start: ["prepare_done"],
		prepare_done: ["delivering"],
		delivering: ["received"],
		received: [],
	},
};

export type DeliverStatus = "not_start" | "start" | "over";

export type BatchStatus =
	| "not_start"
	| "start"
	| "prepare_done"
	| "delivering"
	| "received";
export type DeliverType = "deliver" | "batch";
type DeliverTypeStatusTagLabelMap = Record<DeliverType, any>;
export const DeliverTypeStatusTagLabelMap: DeliverTypeStatusTagLabelMap = {
	deliver: {
		statusLabel: {
			not_start: "未启动",
			start: "处理中",
			over: "交付完成",
		},
		actionLabel: {
			start: "开始处理 ",
			over: "完成交付",
		},
	},
	batch: {
		statusLabel: {
			not_start: "未启动",
			start: "资料准备中  ",
			prepare_done: "资料准备完成",
			delivering: "物流中",
			received: "已签收",
		},
		actionLabel: {
			start: "开始资料准备",
			prepare_done: "完成资料准备",
			delivering: "开始发货",
			received: "确认签收",
		},
	},
};
