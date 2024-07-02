import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  loading: false,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState: initialState,
  reducers: {
    AddDepartment(state, action) {
      state.departments.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { AddDepartment,setLoading } = departmentSlice.actions;
export default departmentSlice.reducer;
