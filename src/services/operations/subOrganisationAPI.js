import toast from "react-hot-toast";
import { SubOrganizationAttributesEndPoints, SubOrganizationEndPoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
  GET_SUBORGANIZATION_ATTRIBUTES_REQUEST,
  ADD_SUBORGANIZATION_ATTRIBUTES_REQUEST,
  UPDATE_SUBORGANIZATION_ATTRIBUTES_REQUEST,
  DELETE_SUBORGANIZATION_ATTRIBUTES_REQUEST,
  
  } = SubOrganizationAttributesEndPoints;

const {ADD_SUBORGANIZATION_REQUEST,GET_SUBORGANIZATION_REQUEST,DELETE_SUBORGANIZATION_REQUEST,
  UPDATE_SUBORGANIZATION_REQUEST,GET_SUBORGANIZATION_LIST,UNASSIGN_SUBORGANIZATION_FROM_ORGANIZATION,ASSIGN_SUBORGANIZATION_TO_ORGANIZATION,UNASSIGNED_LIST_SUBORGANIZATION} = SubOrganizationEndPoints


export const getSubOrganisationAttributes = (AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "GET",
        GET_SUBORGANIZATION_ATTRIBUTES_REQUEST,
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

export const addSubOrganisationAttributes = (body, AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector(
        "POST",
        ADD_SUBORGANIZATION_ATTRIBUTES_REQUEST,
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
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

export const updateSubOrganisationAttributes = (
  AccessToken,
  data,
  suborganisationAttributeId
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "PATCH",
        UPDATE_SUBORGANIZATION_ATTRIBUTES_REQUEST(suborganisationAttributeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status == 200) {
        toast.success(response?.data?.message);
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

export const deleteSubOrganisationAttributes = (
  AccessToken,
  suborganisationId
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "DELETE",
        DELETE_SUBORGANIZATION_ATTRIBUTES_REQUEST(suborganisationId),
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

export const addSubOrganisation = (AccessToken, body) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector(
        "POST",
        ADD_SUBORGANIZATION_REQUEST,
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
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

export const getSubOrganization = (AccessToken, selectedOrganization) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        `${GET_SUBORGANIZATION_REQUEST}/${selectedOrganization}`,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );

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

export const getSubOrganizationList = (AccessToken) => {
  return async (dispatch) => {
    try {
      // console.log(AccessToken,"sub org called",GET_SUBORGANIZATION_LIST);
      const response = await apiConnector(
        "GET",
        GET_SUBORGANIZATION_LIST,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );

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

export const UnAssignedSubOrgList = (AccessToken ) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        `${UNASSIGNED_LIST_SUBORGANIZATION}`,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );

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

export const deleteSubOrganisation = (AccessToken, suborganisationId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "DELETE",
        DELETE_SUBORGANIZATION_REQUEST(suborganisationId),
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

export const updateSubOrganisation = (AccessToken, data, suborganisationId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "PATCH",
        UPDATE_SUBORGANIZATION_REQUEST(suborganisationId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
        toast.success(response?.data?.message);
        navigate("/organization/organization-list");
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

export const UnassignSubOrganizationFromOrganization = (AccessToken, organizationId,subOrgId) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
         UNASSIGN_SUBORGANIZATION_FROM_ORGANIZATION(organizationId,subOrgId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    }finally{
    }
    
  };
};


export const  AssignSubOrganizationToOrganization=(AccessToken,organizationId,DepartmentId)=> {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
         ASSIGN_SUBORGANIZATION_TO_ORGANIZATION(organizationId,DepartmentId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    }finally{
    }
    
  };
}
