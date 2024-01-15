import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import _ from "lodash";
import { DBApitableDatasheet } from "../interface/db_datasheet";
import { fetchDSMeta } from "../api/apitable/ds-meta";
import { fetchRecords } from "../api/apitable/ds-record";

import type { User } from "./globalSlice";

export interface TableRow {
	key: string;
	[key: string]: any;
}

export interface FlowItemField {
	id: number;
	fieldId: number;
	flowItemId: number;
	flowValue: string;
}
export type WorkFlowInfo = DBApitableDatasheet;

export interface WorkFlowStatusInfo {
	id: string;
	name: string;
	color: string;
	type?: "add" | "edit"; // 业务状态: 新增还是编辑
	children?: WorkFlowStatusInfo[];
}

export type WorkFlowFieldInfo = TableColumnItem;

export interface TableColumnItem {
	dstId: string; // 助记属于哪个表
	fieldId: string;
	statType: number;
	type: number;
	name: string;
	dataIndex: string;
	key: string;
	fieldConfig: any; // 当前field的配置
	dictCode?: string;
}

export interface MetaData {
	fieldMap: {
		[propName: string]: any;
	};
	view: Array<{
		columns: Array<{ fieldId: string }>;
		rows: Array<{ recordId: string }>;
	}>;
}
export interface workflowState {
	curFlowDstId: string | undefined; // 当前展示的dstId
	curShowMode: "list" | "status";
	WorkflowList: WorkFlowInfo[]; // 所有项目
	curMetaData: MetaData | null; // 当前的表格定义
	metaId: string;
	curTableStatusList: {
		id: string;
		name: string;
		color: string;
	}[]; // 当前的表格的状态
	curStatusFieldId: string; // 当前的状态字段id
	curTableColumn: TableColumnItem[];
	curTableRows: any[]; //  当前表格的行数据
	curTableRecords: any[]; //  数据筛选使用 【勿删】
	members: User[];
	inviteMembers: User[];
	status: "idle" | "loading" | "failed"; // 接口状态
	copyModalProps: { isShow: boolean; copyText: string };
}
const initialState: workflowState = {
	curFlowDstId: undefined,
	curShowMode: "list",
	WorkflowList: [],
	metaId: "",
	curMetaData: null,
	curTableStatusList: [],
	curStatusFieldId: "",
	curTableColumn: [], // 当前的列视图  可能切换
	curTableRows: [], //  当前表格的行数据
	curTableRecords: [], // 数据筛选使用 【勿删】
	members: [],
	inviteMembers: [],
	copyModalProps: { isShow: false, copyText: "" },
	status: "idle"
};

export const fetchMetaDataByDstId = async (dstId: string) => {
	const response = await fetchDSMeta({ dstId });
	const res = response.data.record;
	res.map((item: any) => {
		item.metaData = JSON.parse(item.metaData);
	});
	const metaData = res[0].metaData;
	const metaId = res[0].id;
	let columns = _.get(metaData, "views.0.columns");
	const fieldMap = _.get(metaData, "fieldMap");
	if (!columns) {
		columns = [];
	}
	columns = columns.map((item: any) => {
		const fieldId = item.fieldId;
		const type = fieldMap[fieldId].type;
		const name = fieldMap[fieldId].name;
		const name_en = fieldMap[fieldId].name_en;
		return {
			dstId,
			fieldId: fieldId,
			dataIndex: fieldId,
			name: name,
			name_en,
			title: name,
			fieldConfig: fieldMap[fieldId],
			type
		};
	});
	// The value we return becomes the `fulfilled` action payload
	return [metaId, metaData, columns];
};

// 刷新  meta data
export const freshCurMetaData = createAsyncThunk("workflow/freshCurMetaData", fetchMetaDataByDstId);

export const freshCurTableRows = createAsyncThunk("workflow/freshCurTableRows", async (dstId: string) => {
	const rows = await fetchRecords(dstId);
	// The value we return becomes the `fulfilled` action payload
	return rows;
});

const initCurTableColumn = (state: workflowState, columns: TableColumnItem[]) => {
	state.curTableColumn = columns;
	const temp = _.find(columns, { type: 26 });
	if (temp) {
		state.curTableStatusList = _.get(temp, "fieldConfig.property.options");
		state.curStatusFieldId = _.get(temp, "fieldId");
	} else {
		state.curTableStatusList = [];
		state.curStatusFieldId = "";
	}
};

export const workflowSlice = createSlice({
	name: "workflow",
	initialState,
	reducers: {
		updateCurFlowDstId: (state, action) => {
			state.curFlowDstId = action.payload;
			// console.log('updateCurFlowDstId', state.curFlowDstId)
		},

		updateCurShowMode: (state, action) => {
			state.curShowMode = action.payload;
			console.log("updateCurShowMode", state.curShowMode);
		},
		removeWorkflowList: (state, action: PayloadAction<string>) => {
			const list = [...state.WorkflowList];
			const id = action.payload;
			const idx = _.findIndex(list, { id });
			list.splice(idx, 1);
			state.WorkflowList = list;
		},
		setWorkflowList: (state, action: PayloadAction<WorkFlowInfo[]>) => {
			state.WorkflowList = action.payload;
		},
		renameWorkflow: (state, action: PayloadAction<Partial<WorkFlowInfo>>) => {
			const { id, dstName } = action.payload;
			const item = _.find(state.WorkflowList, { id });
			if (!item) return;
			item.dstName = dstName || "";
			console.log("renameWorkflow", action);
		},
		updateFlowIcon: (state, action: PayloadAction<Partial<WorkFlowInfo>>) => {
			const { dstId, icon } = action.payload;
			const item = _.find(state.WorkflowList, { dstId });
			if (!item) return;
			item.icon = icon || "";
			console.log("updateFlowIcon", action);
		},
		setCurMetaData: (state, action) => {
			console.log("setCurMetaData", action);
			state.curMetaData = action.payload;
		},
		updateFieldName: (state, action) => {
			console.log("updateFieldName", action);
		},
		setCurTableStatusList: (state, action) => {
			console.log("setCurTableStatusList", action);
			state.curTableStatusList = action.payload;
		},
		// type=26 特殊列
		setCurTableColumn: (state, action) => {
			console.log("setCurTableColumn", action);
			const columns = action.payload;
			initCurTableColumn(state, columns);
		},
		// column 变化后状态同步
		syncCurMetaDataColumn: (state, action) => {
			const newColumns = action.payload;
			const metaData = _.cloneDeep(state.curMetaData);
			const columns = _.get(metaData, "views.0.columns");
			if (columns && metaData) {
				_.set(
					metaData,
					"views.0.columns",
					newColumns.map((item: any) => {
						return {
							fieldId: item.fieldId
						};
					})
				);
			}
			state.curMetaData = metaData;
		},
		setCurTableRows: (state, action) => {
			console.log("setCurTableRows", action);
			state.curTableRows = action.payload;
		},
		updateTableRow: (state, action) => {
			console.log("redux", action.payload);
			const { recordId, ...row } = action.payload;
			const newData = _.cloneDeep(state.curTableRows);
			const idx = _.findIndex(newData, { recordId });
			const item = state.curTableRows[idx];
			newData.splice(idx, 1, { ...item, ...row });
			state.curTableRows = newData;
			state.curTableRecords = newData;
		},
		setMembers: (state, action) => {
			state.members = action.payload;
		},
		setInviteMembers: (state, action) => {
			state.inviteMembers = action.payload;
		},
		setCopyModalPorps: (state, action) => {
			state.copyModalProps = action.payload;
		}
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: builder => {
		builder.addCase(freshCurMetaData.fulfilled, (state, action) => {
			state.metaId = action.payload[0];
			state.curMetaData = action.payload[1];
			initCurTableColumn(state, action.payload[2]);
			// console.log('addCase---', action)
		});
		builder.addCase(freshCurTableRows.fulfilled, (state, action) => {
			state.curTableRows = action.payload;
			state.curTableRecords = action.payload;
			// console.log('addCase---', action)
		});
	}
});

export const {
	updateCurFlowDstId,
	updateCurShowMode,
	removeWorkflowList,
	setWorkflowList,
	renameWorkflow,
	updateFlowIcon,
	setCurMetaData,
	setCurTableColumn,
	syncCurMetaDataColumn,
	setCurTableRows,
	setMembers,
	setInviteMembers,
	updateTableRow,
	setCurTableStatusList,
	setCopyModalPorps
} = workflowSlice.actions;

const generateAttachedFlowList = (list: WorkFlowInfo[]) => {
	const ids = list.map(item => item.createBy);
	const s = new Set(ids);
	const uniqueIds = Array.from(s);
	return uniqueIds.map(id => {
		const children = list.filter(item => item.createBy === id);
		return {
			id,
			nickname: _.get(children, "0.createUserInfo.nickname") + " - 创建的表格",
			children
		};
	}) as IAttachedWorkflowList[];
};
export interface IAttachedWorkflowList {
	id: string;
	nickname: string;
	children: any[];
}

export const selectCurFlowDstId = (state: RootState) => state.workflow.curFlowDstId;

export const selectCurShowMode = (state: RootState) => state.workflow.curShowMode;

export const selectCurFlowId = (state: RootState) => {
	const dstId = state.workflow.curFlowDstId;
	const list = state.workflow.WorkflowList;
	const item = _.find(list, { dstId });
	if (item) {
		return item.id;
	}
	return "";
};

export const selectCurFlowName = (state: RootState) => {
	const dstId = state.workflow.curFlowDstId;
	const list = state.workflow.WorkflowList;
	const item = _.find(list, { dstId });
	if (item) {
		return item.dstName;
	}
	return "";
};
// TODO 删掉所有表格
export const selectAllWorkflowList = (state: RootState) => {
	return state.workflow.WorkflowList;
};

// 我创建的表格
export const selectWorkflowList = (state: RootState) => {
	return state.workflow.WorkflowList.filter(item => item.isCreator).sort((a, b) => Number(a.sort) - Number(b.sort));
};

export const selectTeamWorkflowList = (state: RootState) => {
	return state.workflow.WorkflowList.filter(item => item.isDeveloper).sort((a, b) => Number(a.sort) - Number(b.sort));
};

// 当前选中的表格
export const selectCurWorkflow = (state: RootState) => {
	const curTable = _.find(state.workflow.WorkflowList, {
		dstId: state.workflow.curFlowDstId
	});
	return curTable;
};

export const selectAttachedWorkflowList = (state: RootState) => {
	const res = state.workflow.WorkflowList.filter(item => item.isDeveloper);
	return generateAttachedFlowList(res);
};

export const selectCurTableColumn = (state: RootState) => state.workflow.curTableColumn;

export const selectCurTableStatusList = (state: RootState) => state.workflow.curTableStatusList;

export const selectCurStatusFieldId = (state: RootState) => state.workflow.curStatusFieldId;

export const selectCurTableRows = (state: RootState) => state.workflow.curTableRows;

export const selectCurTableRecords = (state: RootState) => state.workflow.curTableRecords;

export const selectMembers = (state: RootState) => state.workflow.members;

export const selectInviteMembers = (state: RootState) => {
	const list = _.cloneDeep(state.workflow.inviteMembers);
	const curTable = _.find(state.workflow.WorkflowList, {
		dstId: state.workflow.curFlowDstId
	});
	const createUserInfo = _.get(curTable, "createUserInfo");
	if (createUserInfo) {
		list.push({
			...(createUserInfo as any),
			userInfo: createUserInfo
		} as any);
	}
	return list;
};

export const selectCurMetaData = (state: RootState) => state.workflow.curMetaData;

export const selectCurMetaId = (state: RootState) => state.workflow.metaId;

export const selectCopyModalProps = (state: RootState) => state.workflow.copyModalProps;

// 扁平 statusList
export const flatList = (list: WorkFlowStatusInfo[]) => {
	const res: WorkFlowStatusInfo[] = [];
	const arr = _.cloneDeep(list);
	while (arr.length) {
		const item = arr.shift();
		if (item?.children) {
			arr.unshift(...item.children);
		}
		res.push(item!);
	}
	return res;
};

export default workflowSlice.reducer;
