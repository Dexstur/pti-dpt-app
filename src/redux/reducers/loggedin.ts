import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoggedState {
  loggedIn: boolean;
}

const initialState: LoggedState = {
  loggedIn: false,
};

const loggedSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    setLogged: (state, action: PayloadAction<boolean>) => {
      const loggedStatus = action.payload;
      state.loggedIn = loggedStatus;
    },
  },
});

export const { setLogged } = loggedSlice.actions;
export default loggedSlice.reducer;
