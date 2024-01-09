import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import workflowSlice from "./workflowSlice";

const store = configureStore({
	reducer: {
		global: globalReducer,
		workflow: workflowSlice
	}
});
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
