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
	| "factoryproduction";

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
			start: "开始备料",
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
	factoryproduction: {
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
	factoryproduction: {
		title: "出厂检验",
		imgSrc: factorypoduction,
		imgColor: "#FFF5D4",
	},
};
