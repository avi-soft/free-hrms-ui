import toast from "react-hot-toast";
import { LeaveEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
const {CREATE_LEAVE,ALL_LEAVE_REQUESTS,APPROVE_LEAVE_REQUEST,DECLINE_LEAVE_REQUEST,EMPLOYEE_APPROVED_LEAVE_REQUESTS,EMPLOYEE_PENDING_LEAVE_REQUESTS,EMPLOYEE_LEAVE_LIST,EMPLOYEE_DECLINED_LEAVE_REQUESTS}=LeaveEndpoints;


export const createLeave = (employeeId,formData,AccessToken,navigate) => {
    return async (dispatch) => {
      const toastId = toast.loading("Adding...");
      try {
        console.log(formData);
        console.log(AccessToken);
        console.log(navigate);
        const response = await apiConnector(
          "POST",
          CREATE_LEAVE(employeeId),
          formData,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        console.log(response);
        if (response?.status !=201) throw new Error(response?.data?.message);
        else{
          navigate("/leave/leave-list");
          toast.success(response?.data?.Message);
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message);
      }
      toast.dismiss(toastId);
    };
  };
  
  
export const AllLeaveRequests = (AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        ALL_LEAVE_REQUESTS,
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
        return response;
    } catch (err) {
      console.log(err);
    }
  };
};

export const approveLeaveRequests = (LeaveId,AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("APPROVING...");
    try {
      const response = await apiConnector(
        "PATCH",
        APPROVE_LEAVE_REQUEST(LeaveId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
      console.log(response)
      if (response?.status!=200) throw new Error(response.data.message);
      toast.success("LEAVE APPROVED SUCCESSFULLY");
    } catch (err) {
      console.log(err);
      toast.error("LEAVE APPROVAL FAILED");
    }
    toast.dismiss(toastId);
  };
};


export const declineLeaveRequests = (LeaveId,AccessToken) => {
  return async (dispatch) => {
    const toastId = toast.loading("DECLINING...");
    try {
      const response = await apiConnector(
        "PATCH",
        DECLINE_LEAVE_REQUEST(LeaveId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
      console.log(response);
      if (response?.status!=200) throw new Error(response.data.message);
      toast.success("LEAVE DECLINED SUCCESSFULLY");
    } catch (err) {
      console.log(err);
      toast.error("LEAVE DECLINE FAILED");
    }
    toast.dismiss(toastId);
  };
};


  
export const pendingLeaveRequestsForEmployee = (employeeId,AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_PENDING_LEAVE_REQUESTS(employeeId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
        return response;
    } catch (err) {
      console.log(err);
    }
  };
};



  
export const approvedLeaveRequestsForEmployee = (employeeId,AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_APPROVED_LEAVE_REQUESTS(employeeId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
        return response;
    } catch (err) {
      console.log(err);
    }
  };
};



  
export const declinedLeaveRequestsForEmployee = (employeeId,AccessToken) => {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_DECLINED_LEAVE_REQUESTS(employeeId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
        return response;
    } catch (err) {
      console.log(err);
    }
  };
};


export const employeeLeavesList=(employeeId,AccessToken)=> {
  return async (dispatch) => {
    try {
      console.log(AccessToken);
      const response = await apiConnector(
        "GET",
        EMPLOYEE_LEAVE_LIST(employeeId),
        null,
        {
          Authorization: `Bearer ${AccessToken}`
        }
      );
        return response;
    } catch (err) {
      console.log(err);
    }
  };
}