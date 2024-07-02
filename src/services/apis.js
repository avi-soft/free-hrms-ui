// const BASE_URL = "http://localhost:5555/api/v1"


const BASE_URL='http://ec2-16-16-249-120.eu-north-1.compute.amazonaws.com/api/v1'
//Auth ENDPOINTS
export const authEndpoints = {
    LOGIN_API : BASE_URL + "/user/login",
}

//Employee ENDPOINTS
export const employeeEndpoints = {
    ADD_EMPLOYEE_API : BASE_URL + "/user/addNewUser",
    DELETE_EMPLOYEE_API: (userId)=> BASE_URL + `/user/${userId}`,
    EMPLOYEE_LIST_API : BASE_URL + "/user/getAllUserInfo",
    UPLOAD_EMPLOYEE_IMAGE_API: (employeeId)=> BASE_URL + `/employee/${employeeId}/uploadImage`,
    ADD_EMPLOYEE_PERSONAL_DETAILS_API :(employeeId)=> BASE_URL + `/employee/${employeeId}`,
    UPDATE_EMPLOYEE_PERSONAL_DETAILS_API: (employeeId) => BASE_URL + `/employee/updateEmployeeDetails/${employeeId}`,
    ADD_EMPLOYEE_EMERGENCY_CONTACT_API : (employeeId) => BASE_URL +  `/emergencyContact/employee/${employeeId}`,
    EDIT_EMPLOYEE_EMERGENCY_CONTACT_API : (contactId) => BASE_URL +  `/emergencyContact/${contactId}`,
    ADD_EMPLOYEE_ADDRESS_DETAILS_API:(employeeId) =>BASE_URL + `/address/${employeeId}/addNewAddress`,
    EDIT_EMPLOYEE_ADDRESS_DETAILS_API:(employeeId,addressId) =>BASE_URL + `/address/${employeeId}/editAddress/${addressId}`,
    ADD_EMPLOYEE_BANK_DETAILS_API: (employeeId) => BASE_URL + `/account/${employeeId}/AddBankAccount`,
    EDIT_EMPLOYEE_BANK_DETAILS_API: (employeeId) => BASE_URL + `/account/${employeeId}/EditBankAccount`,
    EMPLOYEE_SEARCH_API: (employeeName)=>BASE_URL + `/employee/searchEmployee?name=${employeeName}`
}


//Department Endpoints
export const DepartmentEndpoints={
    DEPARTMENT_LIST_API : BASE_URL + "/department",
    ADD_DEPARTMENT_API : BASE_URL + "/department",
    UPDATE_DEPARTMENT_API : (departmentId)=>BASE_URL + `/department/${departmentId}`,
    DELETE_DEPARTMENT_API :(departmentId)=> BASE_URL + `/department/${departmentId}`
}

//Performance Endpoints
export const PerformanceEndpoints= {
    ALL_REVIEWS: BASE_URL + '/performance',
    VIEW_MANAGER_EMPLOYEES : (managerId)=> BASE_URL + `/employee/searchByManager?managerId=${managerId}`,
    ADD_PERFORMANCE_REVIEW :(employeeId,reviewerId)=>BASE_URL + `/performance?employeeId=${employeeId}&reviewerId=${reviewerId}`,
    EMPLOYEE_PERFORMANCE_REVIEWS: (employeeId)=> BASE_URL + `/performance/employee/${employeeId}`,
    MANAGER_ADDED_REVIEWS : (reviewerId)=> BASE_URL + `/performance/reviewer/${reviewerId}`,
    EDIT_MANAGER_ADDED_REVIEW : (performanceId)=> BASE_URL + `/performance?performanceId=${performanceId}`,
    DELETE_MANAGER_ADDED_REVIEW : (performanceId)=> BASE_URL + `/performance?performanceId=${performanceId}`
}

//Leave Endpoints
export const LeaveEndpoints= {
    CREATE_LEAVE: (employeeId)=> BASE_URL + `/leave/${employeeId}/leaveRequest`,
    ALL_LEAVE_REQUESTS: BASE_URL + `/leave/getLeaveRequests`,
    APPROVE_LEAVE_REQUEST:(LeaveRequestId)=> BASE_URL + `/leave/${LeaveRequestId}/approve`,
    DECLINE_LEAVE_REQUEST:(LeaveRequestId)=> BASE_URL + `/leave/declineLeaveRequest/${LeaveRequestId}`,
    EMPLOYEE_PENDING_LEAVE_REQUESTS: (employeeId)=>BASE_URL +`/leave/pendingLeaveRequestsForEmployee?employeeId=${employeeId}`,
    EMPLOYEE_APPROVED_LEAVE_REQUESTS: (employeeId)=>BASE_URL +`/leave/approvedLeaveRequestsForEmployee?employeeId=${employeeId}`,
    EMPLOYEE_DECLINED_LEAVE_REQUESTS: (employeeId)=>BASE_URL +`/leave/declinedLeaveRequestsForEmployee?employeeId=${employeeId}`,
    EMPLOYEE_LEAVE_LIST: (employeeId)=>BASE_URL +`/leave/getLeaveRequestsForEmployee/${employeeId}`
}