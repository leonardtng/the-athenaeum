import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import appState from "../features/appStateSlice";
import ownedNftsListReducer from "../features/ownedNftListSlice";

export const store = configureStore({
  reducer: {
    appState: appState,
    ownedNftsList: ownedNftsListReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
