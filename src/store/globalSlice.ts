import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { userProfile } from "../api/user";
import { userGradeList } from "../api/shop";
import _ from "lodash";
import dayjs from "dayjs";
import { IMenu } from "../api/ailuo/menu";
import { IFlowStatus, dictFlowStatus } from "../api/ailuo/dict";

export interface User {
	id: string;
	username: string;
	nickname: string;
	avatar: string;
	phone: string;
	gradeId: string;
	gradeName: string;
	endTime: string;
	email: string;
	isInvite: number;
	roles: Array<{id: string, name: string, code: string}>
}

export interface DeveloperUser {
	id: string;
	allowEdit: number;
	allowManage: number;
	allowSave: number;
	allowWatch: number;
	dstId: string;
	userId: string;
	userInfo: User;
}

export interface globalState {
	user: User;
	userMenus: IMenu[];
	gradeList: any[];
	Authorization: string;
	"Authorization-key": string;
	collapsed: boolean; // side menu
	is_archive: boolean; // 归档状态
	is_archive_view: boolean; // 项目归档视图
	is_show_tour: boolean; // 导航
	isAddTableModalOpen: boolean; // 新建项目modal
	isAddOrderModalOpen: boolean; // 新建工单modal
	isShowSaleModal: boolean; // 新建报价
	isStatusSettingModalOpen: boolean;
	isOpenDrawer: boolean; // 是否打开通知,
	flowStatus: IFlowStatus[];
}

const initialState: globalState = {
	user: {} as User,
	userMenus: [],
	gradeList: [],
	Authorization: "",
	"Authorization-key": "",
	is_archive: false,
	is_archive_view: false,
	is_show_tour: false,
	collapsed: false,
	isAddTableModalOpen: false, // 新建项目modal
	isAddOrderModalOpen: false, // 新建工单modal
	isShowSaleModal: false,
	isStatusSettingModalOpen: false, //  状态流设置modal
	isOpenDrawer: false, // 是否打开通知
	flowStatus: []
};

export const fetchFlowStatus = createAsyncThunk("global/fetchFlowStatus", async () => {
	const res = await dictFlowStatus();
	// The value we return becomes the `fulfilled` action payload
	return res;
});

export const freshUser = createAsyncThunk("global/freshUser", async () => {
	const res = await userProfile();
	// The value we return becomes the `fulfilled` action payload
	return res.data;
});

export const freshGradeList = createAsyncThunk("global/freshGradeList", async () => {
	const res = await userGradeList();
	return _.get(res, "data.record") || [];
});

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setUser: (state, action) => {
			// console.log('setUser', action)
			state.user = action.payload;
		},
		setUserMenus: (state, action) => {
			// console.log('setUser', action)
			state.userMenus = action.payload;
		},
		loginSuccess: (state, action) => {
			state.user = action.payload;
		},
		setIsArchive: (state, action) => {
			state.is_archive = action.payload;
		},
		setIsArchiveView: (state, action) => {
			state.is_archive_view = action.payload;
		},
		setIsShowTour: (state, action) => {
			// console.log('setIsShowTour', action)
			state.is_show_tour = action.payload;
		},
		setCollapsed: (state, action) => {
			console.log("setCollapsed", action);
			state.collapsed = action.payload;
		},
		setIsAddTableModalOpen: (state, action) => {
			state.isAddTableModalOpen = action.payload;
		},
		setIsAddOrderModalOpen: (state, action) => {
			state.isAddOrderModalOpen = action.payload;
		},
		setIsShowSaleModal: (state, action) => {
			state.isShowSaleModal = action.payload;
		},
		setIsStatusSettingModalOpen: (state, action) => {
			state.isStatusSettingModalOpen = action.payload;
		},
		setIsOpenDrawer: (state, action) => {
			state.isOpenDrawer = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchFlowStatus.fulfilled, (state, action) => {
			state.flowStatus = action.payload;
		});
		builder.addCase(freshUser.fulfilled, (state, action) => {
			state.user = action.payload;
		});
		builder.addCase(freshGradeList.fulfilled, (state, action) => {
			state.gradeList = action.payload;
		});
	}
});

export const {
	setUser,
	setUserMenus,
	loginSuccess,
	setCollapsed,
	setIsArchive,
	setIsArchiveView,
	setIsShowTour,
	setIsAddTableModalOpen,
	setIsAddOrderModalOpen,
	setIsShowSaleModal,
	setIsStatusSettingModalOpen,
	setIsOpenDrawer
} = globalSlice.actions;

export const selectUser = (state: RootState) => state.global.user;
export const selectUserMenus = (state: RootState) => state.global.userMenus;
export const selectCollapsed = (state: RootState) => state.global.collapsed;
export const selectIsAddTableModalOpen = (state: RootState) => state.global.isAddTableModalOpen;
export const selectIsAddOrderModalOpen = (state: RootState) => state.global.isAddOrderModalOpen;
export const selectIsShowSaleModal = (state: RootState) => state.global.isShowSaleModal;
export const selectIsStatusSettingModalOpen = (state: RootState) => state.global.isStatusSettingModalOpen;
export const selectIsOpenDrawer = (state: RootState) => state.global.isOpenDrawer;

export const selectIsArchive = (state: RootState) => state.global.is_archive;
export const selectIsArchiveView = (state: RootState) => state.global.is_archive_view;
export const selectIsShowTour = (state: RootState) => state.global.is_show_tour;
export const selectGradeList = (state: RootState) => state.global.gradeList;

export const selectIsManager = (state: RootState) => {
	const { user } = state.global;
	const { roles } = user
	let res = false
	if (!roles) {
		return res
	}
	roles.forEach(item => {
		if (item.code === "manage") {
			res = true
		}
	})
	return res
}

// 是否是会员
export const selectIsMember = (state: RootState) => {
	const { user } = state.global;
	// TODO: 当前时间  后面改成服务器时间
	const curTime = dayjs().format("YYYY-MM-DD hh:mm:ss");
	const endTime = dayjs(user.endTime).format("YYYY-MM-DD hh:mm:ss");

	const p1 = !!user.gradeId;
	const d1 = dayjs(curTime);
	const d2 = dayjs(endTime);
	const p2 = d1.isBefore(d2);
	// console.log("selectIsMember", p1, p2);
	return p1 && p2;
};
// 续费= 旧会员+时间过期
export const selectIsExpired = (state: RootState) => {
	const { user } = state.global;
	const p1 = !!user.gradeId;
	// TODO: 当前时间  后面改成服务器时间
	const curTime = dayjs().format("YYYY-MM-DD hh:mm:ss");
	const endTime = dayjs(user.endTime).format("YYYY-MM-DD hh:mm:ss");
	const d1 = dayjs(curTime);
	const d2 = dayjs(endTime);
	const p2 = d1.isAfter(d2);
	return p1 && p2;
};

export default globalSlice.reducer;

