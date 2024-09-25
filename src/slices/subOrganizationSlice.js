import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subOrganization: [],
  loading: false,
  AllSubOrganization:  null
};

const subOrganizationSlice = createSlice({
  name: 'subOrganization',
  initialState: initialState,
  reducers: {
    AddSubOrganization(state, action) {
      state.subOrganization.push(action.payload);
    },
    setSubOrganization(state, action) {
      state.AllSubOrganization = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { AddSubOrganization, setSubOrganization,setLoading } = subOrganizationSlice.actions;
export default subOrganizationSlice.reducer;