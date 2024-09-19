import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { AttendenceEndpoints, LocationEndPoints } from "../apis";

const { ATTENDENCE_LOCATION,UPDATE_DELETE_ATTENDENCE_LOCATION, ADD_SHIFT_TIMINGS,DELETE_SHIFT_TIMINGS } = LocationEndPoints;

const  {CLOCK_IN_API,CLOCK_OUT_API,EMPLOYEE_ATTENDENCE_STATUS}=AttendenceEndpoints

export function AddShiftTimings(body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("POST", ADD_SHIFT_TIMINGS, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);

      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

export function UpdateShiftTimings(body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("PATCH", ADD_SHIFT_TIMINGS, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);

      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

export function DeleteShiftTimings(shiftId, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("DELETE", DELETE_SHIFT_TIMINGS(shiftId), null, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };
}

export function GetShiftTimings(AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("GET", ADD_SHIFT_TIMINGS, null, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message)
    }
  };
}

export function AddAttendenceLocation(body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("POST", ATTENDENCE_LOCATION, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}


export function  GetAttendenceLocation( AccessToken,page, itemsPerPage) {
  return async () => {
    try {
      const response = await apiConnector(
        "GET", 
        ATTENDENCE_LOCATION, 
        null,
         {
        Authorization: `Bearer ${AccessToken}`,
      },
      {
        page: page,
        size: itemsPerPage,
      }
    );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message)
    }
  };
}

export function DeleteAttendenceLocation(locationId, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("DELETE",  UPDATE_DELETE_ATTENDENCE_LOCATION(locationId), null, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      // toast.error(err?.response?.data?.message)
    }
  };
}


export function UpdateAttendenceLocation(locationId,body, AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("PATCH",  UPDATE_DELETE_ATTENDENCE_LOCATION(locationId), body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}


export function AttendenceClockIn(body,AccessToken,userId) {
  return async () => {
    try {
      const response = await apiConnector("POST", CLOCK_IN_API, body, {
        Authorization: `Bear      er ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}



export function AttendenceClockOut(body,AccessToken) {
  return async () => {
    try {
      const response = await apiConnector("POST", CLOCK_OUT_API, body, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}



export function EmployeeAttendenceStatus(AccessToken,userId) {
  return async () => {
    try {
      const response = await apiConnector("GET", EMPLOYEE_ATTENDENCE_STATUS(userId), null, {
        Authorization: `Bearer ${AccessToken}`,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
    }
  };
}