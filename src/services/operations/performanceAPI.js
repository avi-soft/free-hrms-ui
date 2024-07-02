import toast from "react-hot-toast";
import { PerformanceEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
const {ADD_PERFORMANCE_REVIEW,VIEW_MANAGER_EMPLOYEES,ALL_REVIEWS,EMPLOYEE_PERFORMANCE_REVIEWS,MANAGER_ADDED_REVIEWS,EDIT_MANAGER_ADDED_REVIEW,DELETE_MANAGER_ADDED_REVIEW}=PerformanceEndpoints

export const ViewManagerEmployees = (managerId,AccessToken) => {
  return async (dispatch) => {
      try {
        const response=await apiConnector(
          "GET",
          VIEW_MANAGER_EMPLOYEES(managerId),
          null,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        )
        console.log(response)
        return response;
      } catch (error) {
        toast.error("Error Fetching Employees");
      }
  }
}

export const addPerformanceReview = (reviewerId,employeeId,data,AccessToken,navigate) => {
    return async (dispatch) => {
      const toastId = toast.loading("Adding...");
      try {
        console.log(reviewerId);
        console.log(employeeId);
        console.log(data);
        console.log(AccessToken);
        console.log(navigate)
        const response = await apiConnector(
          "POST",
          ADD_PERFORMANCE_REVIEW(employeeId,reviewerId),
          data,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        console.log(response)
        if (response?.status!=201) throw new Error(response?.data?.message);
        else{
          toast.success(response?.data?.message);
          navigate("/performance/review-list");
        }
      } catch (err) {
        console.log(err);
        toast.error("FAILED ADDING REVIEW");
      }
      toast.dismiss(toastId);

    };
  };
  
  export const allReviews = (AccessToken) => {
    return async (dispatch) => {
      try {
   
        const response = await apiConnector(
          "GET",
          ALL_REVIEWS,
          null,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        console.log(response);
        if (response?.status!=200) throw new Error(response.data.message);
        else{
          toast.success("REVIEWS LOADED SUCCESSFULLY");
          return response;
        }
      } catch (err) {
        console.log(err);
        toast.error("FAILED LOADING REVIEWS");
      }
    };
  };
  export const EmployeePerformanceReviews = (employeeId,AccessToken) => {
    return async (dispatch) => {
      try {
        console.log(employeeId);
   
        const response = await apiConnector(
          "GET",
          EMPLOYEE_PERFORMANCE_REVIEWS(employeeId),
          null,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        console.log(response);
        if (response?.status!=200) throw new Error(response.data.message);
        else{
          toast.success("REVIEWS LOADED SUCCESSFULLY");
          return response;
        }
      } catch (err) {
        console.log(err);
        toast.error("FAILED LOADING REVIEWS");
      }
    };
  };

  
  export const ManagerAddedReviews = (reviewerId,AccessToken) => {
    return async (dispatch) => {
      try {
        console.log(reviewerId);
   
        const response = await apiConnector(
          "GET",
          MANAGER_ADDED_REVIEWS(reviewerId),
          null,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
         return response;
      } catch (err) {
        console.log(err);
        toast.error("FAILED LOADING REVIEWS");
      }
    };
  };
    

    
  export const EditManagerAddedReview = (performanceId,AccessToken,data) => {
    return async (dispatch) => {
      try {
   
        const response = await apiConnector(
          "PATCH",
           EDIT_MANAGER_ADDED_REVIEW(performanceId),
          data,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        return response;
      } catch (err) {
        console.log(err);
        toast.error("FAILED LOADING REVIEWS");
      }
    };
  };
    
     
  export const DeleteManagerAddedReview = (performanceId,AccessToken) => {
    return async (dispatch) => {
      try {
   
        const response = await apiConnector(
          "DELETE",
           DELETE_MANAGER_ADDED_REVIEW(performanceId),
          null,
          {
            Authorization: `Bearer ${AccessToken}`
          }
        );
        console.log(response);
        if (response?.status !=204) throw new Error(response?.data?.message);
        else{
          toast.success("REVIEW DELETED SUCCESSFULLY");
        }
      } catch (err) {
        console.log(err);
        toast.error("FAILED DELETING REVIEW");
      }
    };
  };
    