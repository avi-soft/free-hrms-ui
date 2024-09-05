import toast from "react-hot-toast";
import { setLoading } from "../../slices/authSlice.js";
import { EmployeeDesignationsEndpoints, employeeEndpoints } from "../apis.js";
import { EmployeeAttributesEndpoints } from "../apis.js";
import { EmployeeSkillsEndpoints } from "../apis.js";
import { apiConnector } from "../apiconnector.js";
const {
  ADD_EMPLOYEE_API,
  EMPLOYEE_LIST_API,
  DELETE_EMPLOYEE_API,
  UPLOAD_EMPLOYEE_IMAGE_API,
  ADD_EMPLOYEE_PERSONAL_DETAILS_API,
  UPDATE_EMPLOYEE_PERSONAL_DETAILS_API,
  ADD_EMPLOYEE_EMERGENCY_CONTACT_API,
  EDIT_EMPLOYEE_EMERGENCY_CONTACT_API,
  ADD_EMPLOYEE_ADDRESS_DETAILS_API,
  EDIT_EMPLOYEE_ADDRESS_DETAILS_API,
  ADD_EMPLOYEE_BANK_DETAILS_API,
  EDIT_EMPLOYEE_BANK_DETAILS_API,
  EMPLOYEE_SEARCH_API,
  DEPARTMENT_EMPLOYEE_LIST
} = employeeEndpoints;
const {
  GET_EmployeeAttributes_Endpoint,
  ADD_EmployeeAttributes_Endpoint,
  PATCH_EmployeeAttributes_Endpoint,
  DELETE_EmployeeAttributes_Endpoint
}=EmployeeAttributesEndpoints;
const {ADD_EmployeeSkill_Endpoint,GET_EmployeeSkills_Endpoint,PATCH_EmployeeSkill_Endpoint,DELETE_EmployeeSkill_Endpoint}=EmployeeSkillsEndpoints
import { addEmployees, setStep } from "../../slices/employeeSlice.js";

export function addEmployee(employeeData) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      console.log(employeeData);
      const { AccessToken, navigate, email, password, role,organization } = employeeData;
      console.log(AccessToken);
      console.log(organization)
      const response = await apiConnector(
        "POST",
        `${ADD_EMPLOYEE_API}/${organization}`,
        {
          email,
          password,
          role,
        },
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
        toast.error("Error adding employee:.");
      }
    }

    dispatch(setLoading(false));
  };
}
export function EmployeeSearch(AccessToken, employeeName) {
  return async (dispatch) => {
    try {
      console.log(employeeName);
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_SEARCH_API(employeeName),
        null,
        { Authorization: `Bearer ${AccessToken}` }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error uploading employee image:", error);
    }
  };
}

export function uploadEmployeeImage(employeeId, AccessToken, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");
    try {
      console.log(AccessToken);
      console.log(employeeId);
      console.log(formData);
      const response = await apiConnector(
        "POST",
        UPLOAD_EMPLOYEE_IMAGE_API(employeeId),
        formData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      if (response?.status != 200) return;
      console.log(response);
      toast.success("Uploaded Profile Image");
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
}

export function addEmployeePersonalDetails(employeeId, data, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      console.log(employeeId);
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "POST",
        ADD_EMPLOYEE_PERSONAL_DETAILS_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status != 200) return;
      toast.success("Added Employee Personal Details");
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
}

export function UpdateEmployeePersonalDetails(employeeId, data, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(employeeId);
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "PATCH",
        UPDATE_EMPLOYEE_PERSONAL_DETAILS_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      if (response?.status == 200)
        toast.success("Updated Employee Personal Details");
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
}
export function addEmployeeEmergencyContactDetails(
  employeeId,
  data,
  AccessToken
) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...");
    try {
      const response = await apiConnector(
        "POST",
        ADD_EMPLOYEE_EMERGENCY_CONTACT_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      if (response?.status != 201) return;
      console.log(response);
      toast.success("Added Emergency Contact Details Successfully");
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
}

export function EditEmployeeEmergencyContactDetails(
  contactId,
  contactData,
  AccessToken
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log(contactId);
      const response = await apiConnector(
        "PATCH",
        EDIT_EMPLOYEE_EMERGENCY_CONTACT_API(contactId),
        contactData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success("Updated Emergency Contact Details Successfully");
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
}
export function addEmployeeAddressDetails(employeeId, data, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log(employeeId);
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "POST",
        ADD_EMPLOYEE_ADDRESS_DETAILS_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success("Added Employee Address Details");
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
}

export function UpdateEmployeeAddressDetails(
  editedEmployeeId,
  addressId,
  addressData,
  AccessToken
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log(editedEmployeeId);
      console.log(AccessToken);
      const response = await apiConnector(
        "PUT",
        EDIT_EMPLOYEE_ADDRESS_DETAILS_API(editedEmployeeId, addressId),
        addressData,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success("Updated Employee Address Details");
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
}
export function addEmployeeBankDetails(employeeId, data, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log(employeeId);
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "POST",
        ADD_EMPLOYEE_BANK_DETAILS_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success("Added bank Account Details");
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
}

export function EditEmployeeBankDetails(employeeId, data, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...");
    try {
      console.log(employeeId);
      console.log(AccessToken);
      console.log(data);
      const response = await apiConnector(
        "POST",
        EDIT_EMPLOYEE_BANK_DETAILS_API(employeeId),
        data,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      toast.success("Added bank Account Details");
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
}
export function DepartmentEmployeesList(AccessToken,deptId,page, size, sortBy) {
  return async (dispatch) => {
    try {

      const response = await apiConnector(
        "GET",
        DEPARTMENT_EMPLOYEE_LIST(deptId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        },
        {
          page: page,
          size: size,
          sortBy: sortBy
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}
export function EmployeesList(AccessToken, page, size,sortBy) {
  return async (dispatch) => {
    try {
      console.log(page);
      console.log(size);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_LIST_API,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        },
        {
          page: page,
          size: size,
          sortBy: sortBy
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}

export function EmployeeDelete(userId, AccessToken) {
  return async (dispatch) => {
    try {
      console.log(userId);
      const response = await apiConnector(
        "DELETE",
        DELETE_EMPLOYEE_API(userId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}


// Employee Attributes functions
export function GetEmployeeAttributes(AccessToken) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_EmployeeAttributes_Endpoint,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}

export function AddEmployeeAttributes(body,AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        ADD_EmployeeAttributes_Endpoint,
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}

export function EditEmployeeAttributes(body,id,AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "PATCH",
         PATCH_EmployeeAttributes_Endpoint(id),
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}

export function DeleteEmployeeAttribute(id,AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "DELETE",
          DELETE_EmployeeAttributes_Endpoint(id),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}

// Employee Skills functions

// Function to Get Employee Skills
export function GetEmployeeSkills(AccessToken) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_EmployeeSkills_Endpoint,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

// Function to Add Employee Skill
export function AddEmployeeSkill(body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        ADD_EmployeeSkill_Endpoint,
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

// Function to Edit Employee Skill
export function EditEmployeeSkill(body, id, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "PATCH",
        PATCH_EmployeeSkill_Endpoint(id),
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

// Function to Delete Employee Skill
export function DeleteEmployeeSkill(id, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_EmployeeSkill_Endpoint(id),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}


// employee designation functions

export function GetEmployeeDesignations(AccessToken) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        EmployeeDesignationsEndpoints.GET_EmployeeDesignations_Endpoint,
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}

export function AddEmployeeDesignation(body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "POST",
        EmployeeDesignationsEndpoints.ADD_EmployeeDesignation_Endpoint,
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}

export function EditEmployeeDesignation(body, id, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "PATCH",
        EmployeeDesignationsEndpoints.PATCH_EmployeeDesignation_Endpoint(id),
        body,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}

export function DeleteEmployeeDesignation(id, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector(
        "DELETE",
        EmployeeDesignationsEndpoints.DELETE_EmployeeDesignation_Endpoint(id),
        null,
        {
          Authorization: `Bearer ${AccessToken}`,
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };
}