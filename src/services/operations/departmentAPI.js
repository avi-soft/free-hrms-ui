import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { DepartmentEndpoints } from "../apis";
import { AddDepartment } from "../../slices/departmentSlice";
import axios from "axios";
const { ADD_DEPARTMENT_API,DELETE_DEPARTMENT_API,UPDATE_DEPARTMENT_API,DEPARTMENT_LIST_API } = DepartmentEndpoints;



export const Departmentlist = (AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        DEPARTMENT_LIST_API,
        null, 
        { Authorization: `Bearer ${AccessToken}` } 
      );
      
        return response;
      } catch (err) {
        console.log(err);
        toast.error("ERROR FETCHING DEPARTMENTS LIST");
      }
    };
  };
  

export const addDepartment = (formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(formData);
      const {AccessToken,navigate}=formData;
      console.log(AccessToken);
      console.log(navigate)
      const response = await apiConnector(
        "POST",
        ADD_DEPARTMENT_API,
        formData,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
      console.log(response)
      if (!response?.data?.success==="true") throw new Error(response.data.message);
      else{
        toast.success(response?.data?.message);
        navigate("/department/department-list");
        dispatch(AddDepartment(response?.data?.Department))
      }
    } catch (err) {
      console.log(err);
      toast.error("DEPARTMENT ADDITION FAILED");
    }
    toast.dismiss(toastId);
  };
};

export const updateDepartment = (AccessToken,formData,DepartmentId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(formData);
      const {navigate}=formData;
      console.log(AccessToken);
      console.log(navigate)
      const response = await apiConnector(
        "PATCH",
        UPDATE_DEPARTMENT_API(DepartmentId),
        formData,
        { Authorization: `Bearer ${AccessToken}` } 

      );
      console.log(response)
      if(response?.status!="204") throw new Error(response.data.message);
      else{
      toast.success("Updated Department Successfully");
      navigate("/department/department-list");
      }
    } catch (err) {
      console.log(err);
      toast.error("DEPARTMENT UPDATION FAILED");
    }
    toast.dismiss(toastId);
  };
};



export const deleteDepartment = (AccessToken, DepartmentId) => {
  return async (dispatch) => {
    const toastId = toast.loading("DELETING...");
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_DEPARTMENT_API(DepartmentId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
      console.log(response)
      if (response?.status!==204) throw new Error(response.data.message);
      toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      console.log(err);
      toast.error("DEPARTMENT DELETION FAILED");
    }
    toast.dismiss(toastId);
  };
};
