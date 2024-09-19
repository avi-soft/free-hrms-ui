// const BASE_URL = "http://localhost:5555/api/v1"

const BASE_URL =
  "https://www.avihtech.com/api/v1";
//Auth ENDPOINTS
export const authEndpoints = {
  LOGIN_API: BASE_URL + "/user/login",
};

//Employee ENDPOINTS
export const employeeEndpoints = {
  ADD_EMPLOYEE_API: BASE_URL + "/user/addNewUser",
  DELETE_EMPLOYEE_API: (userId) => BASE_URL + `/user/${userId}`,
  EMPLOYEE_LIST_API: BASE_URL + "/employee/getAllEmployees",
  UPLOAD_EMPLOYEE_IMAGE_API: (employeeId) =>
    BASE_URL + `/employee/${employeeId}/uploadImage`,
  ADD_EMPLOYEE_PERSONAL_DETAILS_API: (employeeId) =>
    BASE_URL + `/employee/${employeeId}`,
  UPDATE_EMPLOYEE_PERSONAL_DETAILS_API: (employeeId) =>
    BASE_URL + `/employee/updateEmployeeDetails/${employeeId}`,
  ADD_EMPLOYEE_EMERGENCY_CONTACT_API: (employeeId) =>
    BASE_URL + `/emergencyContact/employee/${employeeId}`,
  EDIT_EMPLOYEE_EMERGENCY_CONTACT_API: (contactId) =>
    BASE_URL + `/emergencyContact/${contactId}`,
  ADD_EMPLOYEE_ADDRESS_DETAILS_API: (employeeId) =>
    BASE_URL + `/address/${employeeId}/addNewAddress`,
  EDIT_EMPLOYEE_ADDRESS_DETAILS_API: (employeeId, addressId) =>
    BASE_URL + `/address/${employeeId}/editAddress/${addressId}`,
  ADD_EMPLOYEE_BANK_DETAILS_API: (employeeId) =>
    BASE_URL + `/account/${employeeId}/AddBankAccount`,
  EDIT_EMPLOYEE_BANK_DETAILS_API: (employeeId) =>
    BASE_URL + `/account/${employeeId}`,
  EMPLOYEE_SEARCH_API: (employeeName) =>
    BASE_URL + `/employee/searchEmployee?name=${employeeName}`,
  DEPARTMENT_EMPLOYEE_LIST: (deptId) => BASE_URL + `/department/${deptId}`,
  ASSIGN_EMPLOYEE_DEPARTMENT: (empId,deptId)=> BASE_URL + `/department/${empId}/assignEmployeeToDepartment/${deptId}`,
  UNASSIGN_EMPLOYEE_DEPARTMENT: (empId,deptId)=> BASE_URL + `/department/${empId}/removeEmployeeFromDepartment/${deptId}`

};

//Department Endpoints
export const DepartmentEndpoints = {
  DEPARTMENT_LIST_API: BASE_URL + "/organization",
  ADD_DEPARTMENT_API: BASE_URL + "/department",
  UPDATE_DEPARTMENT_API: (departmentId) =>
    BASE_URL + `/department/${departmentId}`,
  DELETE_DEPARTMENT_API: (departmentId) =>
    BASE_URL + `/department/${departmentId}`,
  DEPARTMENT_ATTRIBUTES: BASE_URL + "/departmentAttribute",
  ADD_DEPARTMENT_ATTRIBUTES: BASE_URL + "/departmentAttribute",
  UPDATE_DEPARTMENT_ATTRIBUTES_API: (departmentAttributeId) =>
    BASE_URL + `/departmentAttribute/${departmentAttributeId}`,
  DELETE_DEPARTMENT_ATTRIBUTES_API: (departmentAttributeId) =>
    BASE_URL + `/departmentAttribute/${departmentAttributeId}`,
  UNASSIGN_DEPARTMENT_ORGANIZATION_API: (orgId, depId) =>
    BASE_URL + `/department/${orgId}/removeDepartment/${depId}`,
  ASSIGN_DEPARTMENT_ORGANIZATION_API: (orgId, depId) =>
    BASE_URL + `/department/${orgId}/assignDepartment/${depId}`,
  UNASSIGN_DEPARTMENT_SUB_ORGANIZATION_API: (SubOrgId, depId) =>
    BASE_URL + `/department/${SubOrgId}/removeDepartmentFromBranch/${depId}`,
  UNASSIGNED_DEPARTMENTS_LIST_ORGANIZATION:
    BASE_URL + "/department/unassignedDepartmentsOfOrganization",
  ALL_DEPARTMENTS_LIST: BASE_URL + "/department",
  UNASSIGN_DEPARTMENT_SUB_ORG_API: (SubOrgId, depId) =>
    BASE_URL + `/department/${SubOrgId}/removeDepartmentFromBranch/${depId}`,
  ASSIGN_DEPARTMENT_SUB_ORG_API: (SubOrgId, depId) =>
    BASE_URL + `/department/${SubOrgId}/assignDepartmentToBranch/${depId}`,
};

//Performance Endpoints
export const PerformanceEndpoints = {
  ALL_REVIEWS: BASE_URL + "/performance",
  VIEW_MANAGER_EMPLOYEES: (managerId) =>
    BASE_URL + `/employee/searchByManager?managerId=${managerId}`,
  ADD_PERFORMANCE_REVIEW: (employeeId, reviewerId) =>
    BASE_URL + `/performance?employeeId=${employeeId}&reviewerId=${reviewerId}`,
  EMPLOYEE_PERFORMANCE_REVIEWS: (employeeId) =>
    BASE_URL + `/performance/employee/${employeeId}`,
  MANAGER_ADDED_REVIEWS: (reviewerId) =>
    BASE_URL + `/performance/reviewer/${reviewerId}`,
  EDIT_MANAGER_ADDED_REVIEW: (performanceId) =>
    BASE_URL + `/performance?performanceId=${performanceId}`,
  DELETE_MANAGER_ADDED_REVIEW: (performanceId) =>
    BASE_URL + `/performance?performanceId=${performanceId}`,
};

//Leave Endpoints
export const LeaveEndpoints = {
  CREATE_LEAVE: (employeeId) => BASE_URL + `/leave/${employeeId}/leaveRequest`,
  ALL_LEAVE_REQUESTS: BASE_URL + `/leave/getLeaveRequests`,
  APPROVE_LEAVE_REQUEST: (LeaveRequestId) =>
    BASE_URL + `/leave/${LeaveRequestId}/approve`,
  DECLINE_LEAVE_REQUEST: (LeaveRequestId) =>
    BASE_URL + `/leave/declineLeaveRequest/${LeaveRequestId}`,
  EMPLOYEE_PENDING_LEAVE_REQUESTS: (employeeId) =>
    BASE_URL +
    `/leave/pendingLeaveRequestsForEmployee?employeeId=${employeeId}`,
  EMPLOYEE_APPROVED_LEAVE_REQUESTS: (employeeId) =>
    BASE_URL +
    `/leave/approvedLeaveRequestsForEmployee?employeeId=${employeeId}`,
  EMPLOYEE_DECLINED_LEAVE_REQUESTS: (employeeId) =>
    BASE_URL +
    `/leave/declinedLeaveRequestsForEmployee?employeeId=${employeeId}`,
  EMPLOYEE_LEAVE_LIST: (employeeId) =>
    BASE_URL + `/leave/getLeaveRequestsForEmployee/${employeeId}`,
};

// Role Endpoints
export const RoleEndpoints = {
  GET_ROLE_REQUEST: BASE_URL + "/role",
  UPDATE_ROLE_REQUEST: (roleId) => BASE_URL + `/role/${roleId}`,
  ADD_ROLE_REQUEST: BASE_URL + "/role",
  DELETE_ROLE_REQUEST: (roleId) => BASE_URL + `/role/${roleId}`,
};

// Organization Endpoints
export const OrganisationEndpoints = {
  GET_ORGANISATION_REQUEST: BASE_URL + "/organization",
  UPDATE_ORGANISATION_REQUEST: (organisationId) =>
    BASE_URL + `/organization/${organisationId}`,
  ADD_ORGANISATION_REQUEST: BASE_URL + "/organization",
  ADD_ORGANISATION_LOGO_REQUEST: (organisationId) =>
    BASE_URL + `/organization/${organisationId}/uploadImage`,
  REMOVE_ORGANISATION_LOGO_REQUEST: (organisationId) =>
    BASE_URL + `/organization/${organisationId}/removeImage`,
  DELETE_ORGANISATION_REQUEST: (organisationId) =>
    BASE_URL + `/organization/${organisationId}`,
  GET_ORGANIZATION_ATTRIBUTES_REQUEST: BASE_URL + "/organizationAttribute",
  ADD_ORGANIZATION_ATTRIBUTES_REQUEST: BASE_URL + "/organizationAttribute",
  UPDATE_ORGANIZATION_ATTRIBUTES_REQUEST: (organizationAttributeId) =>
    BASE_URL + `/organizationAttribute/${organizationAttributeId}`,
  DELETE_ORGANIZATION_ATTRIBUTES_REQUEST: (organizationAttributeId) =>
    BASE_URL + `/organizationAttribute/${organizationAttributeId}`,
};

// EmployeeAttributes Endpoints
export const EmployeeAttributesEndpoints = {
  GET_EmployeeAttributes_Endpoint: BASE_URL + "/employeeAttribute",
  ADD_EmployeeAttributes_Endpoint: BASE_URL + "/employeeAttribute",
  DELETE_EmployeeAttributes_Endpoint: (id) =>
    BASE_URL + `/employeeAttribute/${id}`,
  PATCH_EmployeeAttributes_Endpoint: (id) =>
    BASE_URL + `/employeeAttribute/${id}`,
};

// EmployeeSkills Endpoints
export const EmployeeSkillsEndpoints = {
  GET_EmployeeSkills_Endpoint: BASE_URL + "/skill",
  ADD_EmployeeSkill_Endpoint: BASE_URL + "/skill",
  DELETE_EmployeeSkill_Endpoint: (id) => BASE_URL + `/skill/${id}`,
  PATCH_EmployeeSkill_Endpoint: (id) => BASE_URL + `/skill/${id}`,
};

// EmployeeDesignations Endpoints
export const EmployeeDesignationsEndpoints = {
  GET_EmployeeDesignations_Endpoint: BASE_URL + "/designation",
  ADD_EmployeeDesignation_Endpoint: BASE_URL + "/designation",
  DELETE_EmployeeDesignation_Endpoint: (id) => BASE_URL + `/designation/${id}`,
  PATCH_EmployeeDesignation_Endpoint: (id) => BASE_URL + `/designation/${id}`,
};

export const SubOrganizationAttributesEndPoints = {
  GET_SUBORGANIZATION_ATTRIBUTES_REQUEST: BASE_URL + "/branchAttribute",
  ADD_SUBORGANIZATION_ATTRIBUTES_REQUEST: BASE_URL + "/branchAttribute",
  UPDATE_SUBORGANIZATION_ATTRIBUTES_REQUEST: (suborganizationAttributeId) =>
    BASE_URL + `/branchAttribute/${suborganizationAttributeId}`,
  DELETE_SUBORGANIZATION_ATTRIBUTES_REQUEST: (suborganizationAttributeId) =>
    BASE_URL + `/branchAttribute/${suborganizationAttributeId}`,
};

export const SubOrganizationEndPoints = {
  GET_SUBORGANIZATION_LIST: BASE_URL + "/branch",
  GET_SUBORGANIZATION_REQUEST: BASE_URL + "/organization/branches",
  ADD_SUBORGANIZATION_REQUEST: BASE_URL + "/branch",
  UPDATE_SUBORGANIZATION_REQUEST: (suborganizationId) =>
    BASE_URL + `/branch/${suborganizationId}`,
  DELETE_SUBORGANIZATION_REQUEST: (suborganizationId) =>
    BASE_URL + `/branch/${suborganizationId}`,
  UNASSIGNED_LIST_SUBORGANIZATION: BASE_URL + "/branch/unassignedBranches",
  UNASSIGN_SUBORGANIZATION_FROM_ORGANIZATION: (OrgId, SuborganizationId) =>
    BASE_URL + `/branch/${OrgId}/removeBranch/${SuborganizationId}`,
  ASSIGN_SUBORGANIZATION_TO_ORGANIZATION: (OrgId, SuborganizationId) =>
    BASE_URL + `/branch/${OrgId}/assignBranch/${SuborganizationId}`,
};


//Attendence api
export const LocationEndPoints = {
  ADD_SHIFT_TIMINGS : BASE_URL + '/shiftDuration',
  DELETE_SHIFT_TIMINGS :(shiftId)=> BASE_URL + `/shiftDuration/${shiftId}`,
UPDATE_DELETE_ATTENDENCE_LOCATION :(attendenceLocationId)=> BASE_URL + `/attendanceLocation/${attendenceLocationId}`,
ATTENDENCE_LOCATION : BASE_URL + '/attendanceLocation',
}

export const AttendenceEndpoints = {
   CLOCK_IN_API: BASE_URL + '/attendance/start',
   CLOCK_OUT_API: BASE_URL + '/attendance/stop',
   EMPLOYEE_ATTENDENCE_STATUS :(userId)=> BASE_URL + `/attendance/userStatus/${userId}`
}