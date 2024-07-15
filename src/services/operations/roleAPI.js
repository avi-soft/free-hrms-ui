import toast from "react-hot-toast";
import { RoleEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
  GET_ROLE_REQUEST,
  UPDATE_ROLE_REQUEST,
  ADD_ROLE_REQUEST,
  DELETE_ROLE_REQUEST,
} = RoleEndpoints;

export const addRole = (AccessToken, body, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body);
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
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const updateRole = (AccessToken, roleId, body, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector(
        "PATCH",
        UPDATE_ROLE_REQUEST(roleId),
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status != 204) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        navigate("/role/role-list");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const getRole = (AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", GET_ROLE_REQUEST,null, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
        return response;
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const deleteRole = (AccessToken,roleId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "DELETE",
        DELETE_ROLE_REQUEST(roleId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
        return response;
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};
