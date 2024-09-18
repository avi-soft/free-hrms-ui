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
  DEPARTMENT_ATTRIBUTES,
  ADD_DEPARTMENT_ATTRIBUTES,
  UPDATE_DEPARTMENT_ATTRIBUTES_API,
  DELETE_DEPARTMENT_ATTRIBUTES_API,
  UNASSIGN_DEPARTMENT_ORGANIZATION_API,
  UNASSIGN_DEPARTMENT_SUB_ORGANIZATION_API,
  UNASSIGNED_DEPARTMENTS_LIST_ORGANIZATION,
  ASSIGN_DEPARTMENT_ORGANIZATION_API,
  ALL_DEPARTMENTS_LIST,
  ASSIGN_DEPARTMENT_SUB_ORG_API,
  UNASSIGN_DEPARTMENT_SUB_ORG_API,
} = DepartmentEndpoints;

export const Departmentlist = (AccessToken, selectedOrganization) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        `${DEPARTMENT_LIST_API}/${selectedOrganization}`,
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
export const AllDepartmentlist = (AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector("GET", ALL_DEPARTMENTS_LIST, null, {
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

export const UnAssignedOrgDepartmentlist = (AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        `${UNASSIGNED_DEPARTMENTS_LIST_ORGANIZATION}`,
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
export const addDepartment = (formData) => {
  return async (dispatch) => {
    try {
      console.log(formData);
      const { AccessToken,organizationId } = formData;
      console.log(AccessToken);
      console.log(organizationId);
      const response = await apiConnector(
        "POST",
        `${ADD_DEPARTMENT_API}`,
        formData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (!response?.data?.success == "true") {
        console.log("error");
      } else {
        console.log("Success");
        toast.success(response?.data?.message);
        dispatch(AddDepartment(response?.data?.Department));
        return response
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
      const { organizationId } = formData;

      console.log(AccessToken);
      const response = await apiConnector(
        "PATCH",
        UPDATE_DEPARTMENT_API(DepartmentId),
        formData,
        { Authorization: `Bearer ${AccessToken}` }
      );
      console.log(response);
      if (response?.status != "200") throw new Error(response.data.message);
      else {
        toast.success("Updated Department Successfully");
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
      return response;
      if (response?.status !== 200) throw new Error(response.data.message);
      toast.success("DEPARTMENT DELETED SUCCESSFULLY");
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

export const DepartmentAttributeslist = (AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        `${DEPARTMENT_ATTRIBUTES}`,
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

export const addDepartmentAttributes = (formData, AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(formData);
      const response = await apiConnector(
        "POST",
        `${ADD_DEPARTMENT_ATTRIBUTES}`,
        formData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (!response?.data?.success == "true") {
        console.log("error");
        throw new Error(response.data.message);
      } else {
        console.log("Success");
        toast.success(response?.data?.message);
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

export const updateDepartmentAttributes = (
  AccessToken,
  formData,
  DepartmentAttributeId
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");

    try {
      const response = await apiConnector(
        "PATCH",
        UPDATE_DEPARTMENT_ATTRIBUTES_API(DepartmentAttributeId),
        formData,
        { Authorization: `Bearer ${AccessToken}` }
      );
      console.log(response);
      if (response?.status != "200") throw new Error(response.data.message);
      else {
        toast.success("Updated Department Attributes Successfully");
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
export const deleteDepartmentAttributes = (
  AccessToken,
  DepartmentAttributeId
) => {
  return async (dispatch) => {
    const toastId = toast.loading("DELETING...");
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_DEPARTMENT_ATTRIBUTES_API(DepartmentAttributeId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success(response?.data?.message)
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

export const AssignDepartmentOrganization = (
  AccessToken,
  organizationId,
  DepartmentId
) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
        ASSIGN_DEPARTMENT_ORGANIZATION_API(organizationId, DepartmentId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
    }
  };
};
export const UnassignDepartmentOrganization = (
  AccessToken,
  organizationId,
  DepartmentId
) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
        UNASSIGN_DEPARTMENT_ORGANIZATION_API(organizationId, DepartmentId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
    }
  };
};

// DEPARTMENT SUB ORGANIZATION

export const AssignDepartmentSubOrganization = (
  AccessToken,
  subOrgId,
  DepartmentId
) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
        ASSIGN_DEPARTMENT_SUB_ORG_API(subOrgId, DepartmentId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
    }
  };
};

export const UnassignDepartmentSubOrganization = (
  AccessToken,
  SubOrganizationId,
  DepartmentId
) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PATCH",
        UNASSIGN_DEPARTMENT_SUB_ORGANIZATION_API(
          SubOrganizationId,
          DepartmentId
        ),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
      // if (response?.status !== 200) throw new Error(response.data.message);
      // toast.success("DEPARTMENT DELETED SUCCESSFULLY");
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
    }
  };
};
