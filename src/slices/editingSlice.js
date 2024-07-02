import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isEditing: false,
    preEditedEmployeeDetails: []
};

const editingSlice = createSlice({
    name: "editing",
    initialState: initialState,
    reducers: {
        setEditing(state, action) {
            state.isEditing = action.payload;
        },
        setPreEditedEmployeeDetails(state,action) {
               state.preEditedEmployeeDetails=action.payload;
        }
    },
});

export const { setEditing,setPreEditedEmployeeDetails } = editingSlice.actions;
export default editingSlice.reducer;
