import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  loading: false,
  step : 1,
  currentOrganizationId: null,

};

const employeeSlice = createSlice({
  name: 'employee',
  initialState: initialState,
  reducers: {
    setStep(state, value) {
      state.step = value.payload
  },
    addEmployees(state, action) {
      state.employees.push(action.payload);
    },
    setCurrentOrganizationId(state, action) {
      state.currentOrganizationId = action.payload;
    },
    updateEmployee(state, action) {
      const { id, updatedEmployeeData } = action.payload;
      const index = state.employees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...updatedEmployeeData };
      }
    },

    deleteEmployee(state, action) {
      const idToDelete = action.payload;
      state.employees = state.employees.filter(emp => emp.id !== idToDelete);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { addEmployees,setStep, updateEmployee, deleteEmployee, setLoading,setCurrentOrganizationId } = employeeSlice.actions;
export default employeeSlice.reducer;
