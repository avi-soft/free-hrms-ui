import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organizations: [],
  loading: false,
  AllOrganizations: [],
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState: initialState,
  reducers: {
    AddOrganization(state, action) {
        state.departments.push(action.payload);
      },

    setOrganization(state, action) {
      state.AllOrganizations = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { AddOrganization,setOrganization,setLoading } = organizationSlice.actions;
export default organizationSlice.reducer;
