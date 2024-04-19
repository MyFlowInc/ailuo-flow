import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import _ from "lodash";
const store = configureStore({
	reducer: {
		global: globalReducer,
	},
});

// hack
export function getStore(path: string) {
	const state = store.getState();
	return _.get(state, path);
}

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
