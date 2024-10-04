import { configureStore } from "@reduxjs/toolkit";
import flightRulesReducer from "../redux/flight-rules-firewall";
import feesCommissionReducer from "../redux/fees-commison";
import rolesReducer from "../redux/user-role-permission";
import socialSettingsSlice from "../redux/socials";
import usersSlice from "../redux/manage-user";
import ticketsSlice from "../redux/tickets"; //
import emailSMTPSlice from "../redux/email-smtp";

// Configuring the store with the reducers
export const store = configureStore({
  reducer: {
    flightRules: flightRulesReducer,
    feesCommission: feesCommissionReducer,
    roles: rolesReducer,
    socials: socialSettingsSlice,
    users: usersSlice,
    tickets: ticketsSlice,
    emailSmtp: emailSMTPSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
