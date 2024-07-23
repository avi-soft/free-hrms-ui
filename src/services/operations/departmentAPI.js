import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { DepartmentEndpoints } from "../apis";
import { AddDepartment } from "../../slices/departmentSlice";
import axios from "axios";
const {
  ADD_DEPARTMENT_API,
  DELETE_DEPARTMENT_API,
  UPDATE_DEPARTMENT_API,
  DEPARTMENT_LIST_API,
} = DepartmentEndpoints;

export const Departmentlist = (AccessToken,selectedOrganization) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector("GET",
         `${DEPARTMENT_LIST_API}/${selectedOrganization}`, 
         null,
          {
        Authorization: `Bearer ${AccessToken}`,
      });

      return response;
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);   
      } else {
        toast.error("Something went wrong.");
      }
    }
  };
};

export const addDepartment = (formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(formData);
      const { AccessToken, navigate,organizationId } = formData;
      console.log(AccessToken);
      console.log(navigate);
      console.log(organizationId)
      const response = await apiConnector(
        "POST",
        `${ADD_DEPARTMENT_API}/${organizationId}`,
        formData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (!response?.data?.success === "true")
        throw new Error(response.data.message);
      else {
        toast.success(response?.data?.message);
        navigate("/department/department-list");
        dispatch(AddDepartment(response?.data?.Department));
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    }
    toast.dismiss(toastId);
  };
};

export const updateDepartment = (AccessToken, formData, DepartmentId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");

    try {
      console.log(formData);
      const { navigate } = formData;
      const { organizationId} = formData;


      console.log(AccessToken);
      console.log(navigate);
      const response = await apiConnector(
        "PATCH",
        UPDATE_DEPARTMENT_API(DepartmentId),
        formData,
        { Authorization: `Bearer ${AccessToken}` }
      );
      console.log(response);
      if (response?.status != "204") throw new Error(response.data.message);
      else {
        toast.success("Updated Department Successfully");
        navigate("/department/department-list");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
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
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status !== 204) throw new Error(response.data.message);
      toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    }
    toast.dismiss(toastId);
  };
};
