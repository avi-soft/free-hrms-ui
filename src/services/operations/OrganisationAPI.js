import toast from "react-hot-toast";
import { OrganisationEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
  ADD_ORGANISATION_REQUEST,
  UPDATE_ORGANISATION_REQUEST,
  ADD_ORGANISATION_LOGO_REQUEST,
  DELETE_ORGANISATION_REQUEST,
  GET_ORGANISATION_REQUEST,
  GET_ORGANIZATION_ATTRIBUTES_REQUEST,
  ADD_ORGANIZATION_ATTRIBUTES_REQUEST,
  UPDATE_ORGANIZATION_ATTRIBUTES_REQUEST,
  DELETE_ORGANIZATION_ATTRIBUTES_REQUEST
} = OrganisationEndpoints;

export const uploadOrganisationLogo = (
  AccessToken,
  navigate,
  organisationId,
  formData
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");
    try {
      console.log(AccessToken);
      console.log(formData);
      const response = await apiConnector(
        "POST",
        ADD_ORGANISATION_LOGO_REQUEST(organisationId),
        formData,
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

export const addOrganisation = (AccessToken, body) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector(
        "POST",
        ADD_ORGANISATION_REQUEST,
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

export const updateOrganisation = (AccessToken, data,navigate, organisationId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "PATCH",
        UPDATE_ORGANISATION_REQUEST(organisationId),
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

export const getOrganisation = (AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "GET",
        GET_ORGANISATION_REQUEST,
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

export const deleteOrganisation = (AccessToken, organisationId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "DELETE",
        DELETE_ORGANISATION_REQUEST(organisationId),
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

export const getOrganisationAttributes = (AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "GET",
        GET_ORGANIZATION_ATTRIBUTES_REQUEST,
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

export const addOrganisationAttributes = (AccessToken, body) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(AccessToken);
      console.log(body);
      const response = await apiConnector(
        "POST",
        ADD_ORGANIZATION_ATTRIBUTES_REQUEST,
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

export const updateOrganisationAttributes = (AccessToken, data,organisationAttributeId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "PATCH",
        UPDATE_ORGANIZATION_ATTRIBUTES_REQUEST(organisationAttributeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status != 200) throw new Error(response?.data?.message);
      else {
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

export const deleteOrganisationAttributes = (AccessToken, organisationId) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "DELETE",
        DELETE_ORGANIZATION_ATTRIBUTES_REQUEST(organisationId),
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