import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: [],
  loading: false,
};

const roleSlice = createSlice({
  name: 'Role',
  initialState: initialState,
  reducers: {

    setRoles(state, action) {
      state.roles = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {setLoading,setRoles  } = roleSlice.actions;
export default roleSlice.reducer;
