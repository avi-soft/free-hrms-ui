import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  loading: false,
  AllDepartments: []
};

const departmentSlice = createSlice({
  name: 'department',
  initialState: initialState,
  reducers: {
    AddDepartment(state, action) {
      state.departments.push(action.payload);
    },
    setDepartments(state, action) {
      state.AllDepartments = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { AddDepartment, setDepartments,setLoading } = departmentSlice.actions;
export default departmentSlice.reducer;
