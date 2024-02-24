import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthorityState {
  authority: number;
}

const initialState: AuthorityState = {
  authority: 0,
};

const authoritySlice = createSlice({
  name: "authority",
  initialState,
  reducers: {
    setAuthority: (state, action: PayloadAction<number>) => {
      const newAuthority = Math.max(0, Math.min(2, action.payload));
      state.authority = newAuthority;
    },
  },
});

export const { setAuthority } = authoritySlice.actions;
export default authoritySlice.reducer;
