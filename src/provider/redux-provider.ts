import { configureStore } from "@reduxjs/toolkit";
import flightRulesReducer from "../redux/flight-rules-firewall";
import feesCommissionReducer from "../redux/fees-commison";

export const store = configureStore({
  reducer: {
    flightRules: flightRulesReducer,
    feesCommission: feesCommissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;