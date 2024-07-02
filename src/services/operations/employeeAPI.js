import toast from "react-hot-toast";
import { setLoading} from "../../slices/authSlice.js"
import { employeeEndpoints } from "../apis.js";
import { apiConnector } from "../apiconnector.js";
const {
  ADD_EMPLOYEE_API
  ,EMPLOYEE_LIST_API,
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
  EMPLOYEE_SEARCH_API
}=employeeEndpoints;
import { addEmployees, setStep } from "../../slices/employeeSlice.js";

export function addEmployee(employeeData) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        console.log(employeeData);
        const {AccessToken,navigate,email,password,role}=employeeData;
        console.log(AccessToken)
        const response = await apiConnector(
          "POST",
         ADD_EMPLOYEE_API,
         {
          email,
          password,
          role
         },
         {
          Authorization: `Bearer ${AccessToken}`,
      });
        console.log(response);
        dispatch(addEmployees(response?.data?.newUser?.employeeId)); 
        toast.success("Employee Created Successfully");
        dispatch(setStep(2))
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message);
        console.error("Error adding employee:", error);
      }
      dispatch(setLoading(false));
    };
  }
  export function EmployeeSearch(AccessToken,employeeName) {
    return async (dispatch) => {
        try {
          console.log(employeeName)
          console.log(AccessToken)
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
    }
}

  export function uploadEmployeeImage(employeeId,AccessToken, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Uploading...")
        try {
            console.log(AccessToken)
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
            if(response?.status!=200) return;
            console.log(response);
            toast.success("Uploaded Profile Image")
        } catch (error) {
            console.error("Error uploading employee image:", error);
            toast.error("Error uploading Profile Image");
        }
        toast.dismiss(toastId)
    }
}

export function addEmployeePersonalDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...")
      try {
          console.log(employeeId);
          console.log(AccessToken);
          console.log(data)
          const response = await apiConnector(
               "POST",
               ADD_EMPLOYEE_PERSONAL_DETAILS_API(employeeId),
              data,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }
          );
          console.log(response);
          if(response?.status!=200) return;
          toast.success("Added Employee Personal Details")
      } catch (error) {
          console.error( error);
          toast.error("Error adding Personal Details");
      }
      toast.dismiss(toastId);
  }
}

export function UpdateEmployeePersonalDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...")
      try {
          console.log(employeeId);
          console.log(AccessToken);
          console.log(data)
          const response = await apiConnector(
               "PUT",
              UPDATE_EMPLOYEE_PERSONAL_DETAILS_API(employeeId),
              data,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }
          );
          console.log(response);
          if(response?.status==200) toast.success("Updated Employee Personal Details")
      } catch (error) {
          console.error( error);
          toast.error("Error Updating Personal Details");
      }
      toast.dismiss(toastId);
  }
}
export function addEmployeeEmergencyContactDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding...")
      try {
          const response = await apiConnector(
               "POST",
              ADD_EMPLOYEE_EMERGENCY_CONTACT_API(employeeId)
               , data,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }
          );
         if(response?.status!=201) return;
          console.log(response);
          toast.success("Added Emergency Contact Details Successfully")
      } catch (error) {
          console.error( error);
          toast.error("Error adding Emergency Contact Details");
      }
      toast.dismiss(toastId);
  }
}

export function EditEmployeeEmergencyContactDetails(contactId, contactData, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
      try {
           console.log(contactId)
          const response = await apiConnector(
               "PATCH",
               EDIT_EMPLOYEE_EMERGENCY_CONTACT_API(contactId),
                contactData,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }
          );
          console.log(response);
          toast.success("Updated Emergency Contact Details Successfully")
      } catch (error) {
          console.error( error);
          toast.error("Error Updating Emergency Contact Details");
      }
      toast.dismiss(toastId);
  }
}
export function addEmployeeAddressDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
      try {
          console.log(employeeId);
          console.log(AccessToken);
          console.log(data)
          const response = await apiConnector(
               "POST",
               ADD_EMPLOYEE_ADDRESS_DETAILS_API(employeeId),
                data,
              {
                Authorization: `Bearer ${AccessToken}`,
              }
          );
          console.log(response);
          toast.success("Added Employee Address Details")
      } catch (error) {
          console.error( error);
          toast.error("Error adding Employee Address Details");
      }
      toast.dismiss(toastId);
  }
}


export function UpdateEmployeeAddressDetails(editedEmployeeId,addressId,addressData, AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
      try {
          console.log(editedEmployeeId);
          console.log(AccessToken);
          const response = await apiConnector(
               "PUT",
               EDIT_EMPLOYEE_ADDRESS_DETAILS_API(editedEmployeeId,addressId),
               addressData,
              {
                Authorization: `Bearer ${AccessToken}`,
              }
          );
          console.log(response);
          toast.success("Updated Employee Address Details")
      } catch (error) {
          console.error( error);
          toast.error("Error Updating Employee Address Details");
      }
      toast.dismiss(toastId);
  }
}
export function addEmployeeBankDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
      try {
          console.log(employeeId);
          console.log(AccessToken);
          console.log(data)
          const response = await apiConnector(
               "POST",
               ADD_EMPLOYEE_BANK_DETAILS_API(employeeId),
                data,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }

          );
          console.log(response);
          toast.success("Added bank Account Details")
      } catch (error) {
          console.error( error);
          toast.error("Error adding bank Account Details");
      }
      toast.dismiss(toastId);
  }
}

export function EditEmployeeBankDetails(employeeId,data,AccessToken) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating...")
      try {
          console.log(employeeId);
          console.log(AccessToken);
          console.log(data)
          const response = await apiConnector(
               "POST",
               EDIT_EMPLOYEE_BANK_DETAILS_API(employeeId),
                data,
              {
                      Authorization: `Bearer ${AccessToken}`,
              }

          );
          console.log(response);
          toast.success("Added bank Account Details")
      } catch (error) {
          console.error( error);
          toast.error("Error adding bank Account Details");
      }
      toast.dismiss(toastId);
  }
}

  export function EmployeesList(AccessToken,page,size) {
    return async(dispatch) => {
      try{
       console.log(page)
       console.log(size)      
      const response = await apiConnector("GET", EMPLOYEE_LIST_API,
      null,
      {
         Authorization: `Bearer ${AccessToken}`,
    },
    {
      page: page,
      size:size
    }
      );
      return response; 
      }catch (err) {
        console.log(err)
      }  
    }
  }


  export function EmployeeDelete(userId,AccessToken) {
    return async(dispatch) => {
      try{
        console.log(userId)
      const response = await apiConnector("DELETE", DELETE_EMPLOYEE_API(userId),
      null,
      {
         Authorization: `Bearer ${AccessToken}`,
    },
      );
      console.log(response);
      return response; 
      }catch (err) {
        console.log(err)
      }  
    }
  }


