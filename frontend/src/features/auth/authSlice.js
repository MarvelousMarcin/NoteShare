import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const getCookies = () => {
  const cookies = new Cookies();
  return cookies.get("token");
};

const setCookies = (token) => {
  const cookies = new Cookies();
  cookies.set("token", token, { path: "/" });
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: getCookies(),
    isLoggedIn: !!getCookies(),
  },
  reducers: {
    logOut: (state) => {
      state.token = "";
      state.isLoggedIn = false;
      setCookies("");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      setCookies(action.payload);
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { logOut, setToken, setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
