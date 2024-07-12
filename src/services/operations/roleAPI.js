import toast from "react-hot-toast";
import { RoleEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const { GET_ROLE_REQUEST, UPDATE_ROLE_REQUEST, ADD_ROLE_REQUEST } =
  RoleEndpoints;

export const addRole = (AccessToken, body, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body)
      const response = await apiConnector("POST", ADD_ROLE_REQUEST, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      if (response?.status != 201) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        navigate("/role/role-list");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const updateRole = (AccessToken, body,navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector("PATCH", UPDATE_ROLE_REQUEST, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      if (response?.status != 204) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        navigate("/role/role-list");
      }
    } catch (err) {
      console.log(err);
      toast.error("FAILED UPDATING ROLE");
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const getRole = () => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", GET_ROLE_REQUEST);
      console.log(response);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
        return response;
      }
    } catch (err) {
      console.log(err);
      toast.error("FAILED UPDATINGG ROLE");
    } finally {
      toast.dismiss(toastId);
    }
  };
};
