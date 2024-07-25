import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import employeeReducer from "../slices/employeeSlice";
import departmentReducer from "../slices/departmentSlice"
import editingReducer from "../slices/editingSlice";
import themeReducer from "../slices/themeSlice";
import OrganisationReducer from "../slices/OrganisationSlice";
import roleReducer from "../slices/roleSlice";

const rootReducer=combineReducers({
     auth: authReducer,
     profile : profileReducer,
     Organisation:OrganisationReducer,
     employee:employeeReducer,
     department:departmentReducer,
     editing:editingReducer,
     theme:themeReducer,
     role:roleReducer

})


export default rootReducer;