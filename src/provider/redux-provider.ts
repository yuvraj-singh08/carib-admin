import { configureStore } from "@reduxjs/toolkit";
import flightRulesReducer from "../redux/flight-rules-firewall";
import feesCommissionReducer from "../redux/fees-commison";
import rolesReducer from "../redux/user-role-permission"; 

export const store = configureStore({
  reducer: {
    flightRules: flightRulesReducer,
    feesCommission: feesCommissionReducer,
    roles: rolesReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
