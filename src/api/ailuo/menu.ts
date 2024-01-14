// 表格列

import { apiCall } from "../../network";
export interface IMenu {
	parent: string;
	children: IMenu[];
	id: string;
	component: string;
	code: string;
	path: string;
	type: string;
	icon: string;
	title: string;
	sort: number;
	link: string;
	i18n: string;
	hidden: boolean;
	enable: boolean;
}

export function getUserMenu(): Promise<{ data: IMenu[] }> {
	return apiCall({
		url: "/api/sys/user/menu",
		method: "get",
		params: {}
	});
}
