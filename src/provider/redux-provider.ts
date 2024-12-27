import { configureStore } from "@reduxjs/toolkit";
import flightRulesReducer from "../redux/flight-rules-firewall";
import commissionManagerSlice from "../redux/fees-commison";
import rolesReducer from "../redux/user-role-permission";
import socialSettingsSlice from "../redux/socials";
import ticketsSlice from "../redux/tickets"; //
import emailSMTPSlice from "../redux/email-smtp";
import privacyPolicySlice from "../redux/privacy-settings";
import termsAndConditionsSlice from "../redux/terms-settings";
import dealsSlice from "../redux/deals";
import manageUsersSlice from "../redux/manage-user";
import searchManagementSlice from "../redux/search-management";
import customerSlice from "../redux/registered-customers";
import userReducer from "../redux/useSlice";
import bookingsSlice from "../redux/booking";
import blogSlice from '../redux/blogSlice';

export const store = configureStore({
  reducer: {
    flightRules: flightRulesReducer,
    feesCommission: commissionManagerSlice,
    roles: rolesReducer,
    socials: socialSettingsSlice,
    manageUser: manageUsersSlice,
    tickets: ticketsSlice,
    emailSmtp: emailSMTPSlice,
    privacy: privacyPolicySlice,
    deals: dealsSlice,
    terms: termsAndConditionsSlice,
    searchManagement: searchManagementSlice,
    customers: customerSlice,
    user: userReducer,
    bookings: bookingsSlice,
    blogs: blogSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
