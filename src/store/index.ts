import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";

const store = configureStore({
	reducer: {
		global: globalReducer,
	}
});
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
