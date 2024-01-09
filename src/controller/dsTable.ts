import { fetchInviteWorkflowList, fetchWorkflowList } from "../api/apitable/ds-table";
import { WorkFlowInfo } from "../store/workflowSlice";

// TODO: 最大支持 999张表
export async function fetchAllWorkflowList(archive: boolean = true) {
	try {
		const p1 = fetchWorkflowList({
			pageNum: 1,
			pageSize: 999,
			archive: archive ? 1 : 0
		});
		const p2 = fetchInviteWorkflowList({
			pageNum: 1,
			pageSize: 999,
			archive: archive ? 1 : 0
		});
		const [response, response2] = await Promise.all([p1, p2]);
		const data = response.data.record as WorkFlowInfo[];
		const data2 = response2.data.record as WorkFlowInfo[];
		const list = [...data, ...data2].map((item: WorkFlowInfo) => ({
			name: item.dstName,
			url: "/dashboard/workflow-view/" + item.dstId,
			...item
		}));
		return list;
	} catch (error) {
		throw error;
	}
}

// TODO: 最大支持 999张表
export async function fetchOwerWorkflowList(archive: boolean = false) {
	try {
		const p = fetchWorkflowList({
			pageNum: 1,
			pageSize: 999,
			archive: archive ? 1 : 0
		});
		const [response] = await Promise.all([p]);
		const data = response.data.record as WorkFlowInfo[];

		const list = [...data].map((item: WorkFlowInfo) => ({
			name: item.dstName,
			url: "/dashboard/workflow-view/" + item.dstId,
			...item
		}));
		return list.sort((a, b) => Number(a.sort) - Number(b.sort));
	} catch (error) {
		throw error;
	}
}

// TODO: 最大支持 999张表
export async function fetchTeamWorkflowList(archive: boolean = false) {
	try {
		const p = fetchInviteWorkflowList({
			pageNum: 1,
			pageSize: 999,
			archive: archive ? 1 : 0
		});
		const [response] = await Promise.all([p]);
		const data = response.data.record as WorkFlowInfo[];

		const list = [...data].map((item: WorkFlowInfo) => ({
			name: item.dstName,
			url: "/dashboard/workflow-view/" + item.dstId,
			...item
		}));

		return list.sort((a, b) => Number(a.sort) - Number(b.sort));
	} catch (error) {
		throw error;
	}
}
