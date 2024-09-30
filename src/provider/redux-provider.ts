import { configureStore } from "@reduxjs/toolkit";
import flightRulesReducer from "../redux/flight-rules-firewall";

export const store = configureStore({
  reducer: {
    flightRules: flightRulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
