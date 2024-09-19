
const  user  = localStorage.getItem("user");

// Employee privileges
export const hasAddEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("ADD_EMPLOYEE");
export const hasUploadEmployeeImagePrivilege = user?.roles?.[0]?.privilege?.includes("UPLOAD_EMPLOYEE_IMAGE");
export const hasGetAllEmployeesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_EMPLOYEES");
export const hasUpdateEmployeeCompanyDetailsPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_EMPLOYEE_COMPANY_DETAILS");
export const hasFindEmployeeByIdPrivilege = user?.roles?.[0]?.privilege?.includes("FIND_EMPLOYEE_BY_ID");
export const hasSearchEmployeeByNamePrivilege = user?.roles?.[0]?.privilege?.includes("SEARCH_EMPLOYEE_BY_NAME");
export const hasSearchEmployeeByManagerIdPrivilege = user?.roles?.[0]?.privilege?.includes("SEARCH_EMPLOYEE_BY_MANAGER_ID");
export const hasCreateEmployeeAttributePrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_EMPLOYEE_ATTRIBUTE");
export const hasUpdateEmployeeAttributePrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_EMPLOYEE_ATTRIBUTE");
export const hasDeleteEmployeeAttributePrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_EMPLOYEE_ATTRIBUTE");
export const hasGetAllEmployeeAttributesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_EMPLOYEE_ATTRIBUTES");

// Address privileges
export const hasAddAddressPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_ADDRESS");
export const hasRemoveAddressPrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_ADDRESS");
export const hasUpdateAddressPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ADDRESS");

// Emergency Contact privileges
export const hasGetEmployeeEmergencyContactPrivilege = user?.roles?.[0]?.privilege?.includes("GET_EMPLOYEE_EMERGENCY_CONTACT");
export const hasAddEmergencyContactPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_EMERGENCY_CONTACT");
export const hasUpdateEmergencyContactPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_EMERGENCY_CONTACT");
export const hasDeleteEmergencyContactPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_EMERGENCY_CONTACT");

// Account privileges
export const hasAddAccountPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_ACCOUNT");
export const hasRemoveAccountPrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_ACCOUNT");

// Performance privileges
export const hasGetAllPerformanceOfEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_PERFORMANCE_OF_EMPLOYEE");
export const hasAddEmployeePerformancePrivilege = user?.roles?.[0]?.privilege?.includes("ADD_EMPLOYEE_PERFORMANCE");
export const hasGetAllPerformancesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_PERFORMANCES");
export const hasGetPerformanceByReviewerPrivilege = user?.roles?.[0]?.privilege?.includes("GET_PERFORMANCE_BY_REVIEWER");
export const hasDeletePerformanceRecordPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_PERFORMANCE_RECORD");

// User privileges
export const hasSaveUserPrivilege = user?.roles?.[0]?.privilege?.includes("SAVE_USER");
export const hasCreateNewUserPrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_NEW_USER");
export const hasDeleteEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_EMPLOYEE");
export const hasGetAllUsersPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_USERS");

// Leave privileges
export const hasCreateLeaveRequestPrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_LEAVE_REQUEST");
export const hasGetAllLeaveRequestsPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_LEAVE_REQUESTS");
export const hasDeclineLeaveRequestPrivilege = user?.roles?.[0]?.privilege?.includes("DECLINE_LEAVE_REQUEST");
export const hasApproveLeaveRequestPrivilege = user?.roles?.[0]?.privilege?.includes("APPROVE_LEAVE_REQUEST");
export const hasGetLeaveRequestOfEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("GET_LEAVE_REQUEST_OF_EMPLOYEE");
export const hasGetPendingLeaveRequestOfEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("GET_PENDING_LEAVE_REQUEST_OF_EMPLOYEE");
export const hasGetApprovedRequestOfEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("GET_APPROVED_REQUEST_OF_EMPLOYEE");
export const hasGetDeclinedRequestOfEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("GET_DECLINED_REQUEST_OF_EMPLOYEE");
export const hasAddLeaveTypePrivilege = user?.roles?.[0]?.privilege?.includes("ADD_LEAVE_TYPE");
export const hasRemoveLeaveTypePrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_LEAVE_TYPE");
export const hasUpdateLeaveTypePrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_LEAVE_TYPE");
export const hasGetAllLeaveTypesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_LEAVE_TYPES");
export const hasGetLeaveTypePrivilege = user?.roles?.[0]?.privilege?.includes("GET_LEAVE_TYPE");
export const hasGetLeaveBalanceForAllEmployeesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_LEAVE_BALANCE_FOR_ALL_EMPLOYEES");

// Role privileges
export const hasCreateRolePrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_ROLE");
export const hasUpdateRolePrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ROLE");
export const hasDeleteRolePrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_ROLE");
export const hasChangeUserRolePrivilege = user?.roles?.[0]?.privilege?.includes("CHANGE_USER_ROLE");
export const hasGetAllRolesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_ROLES");
export const hasAssignRoleToUserPrivilege = user?.roles?.[0]?.privilege?.includes("ASSIGN_ROLE_TO_USER");

// Personal Profile
export const hasAddDesignationPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_DESIGNATION");
export const hasUpdateDesignationPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_DESIGNATION");
export const hasDeleteDesignationPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_DESIGNATION");
export const hasGetAllDesignationPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_DESIGNATION");

export const hasAddSkillPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_SKILL");
export const hasUpdateSkillPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_SKILL");
export const hasDeleteSkillPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_SKILL");
export const hasGetAllSkillPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_SKILL");

// Organization Privileges
export const hasGetAllOrganizationAttributesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_ORGANIZATION_ATTRIBUTES");
export const hasCreateOrganizationAttributePrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_ORGANIZATION_ATTRIBUTE");
export const hasUpdateOrganizationAttributePrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ORGANIZATION_ATTRIBUTE");
export const hasDeleteOrganizationAttributePrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_ORGANIZATION_ATTRIBUTE");
export const hasCreateOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_ORGANIZATION");
export const hasUpdateOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ORGANIZATION");
export const hasDeleteOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_ORGANIZATION");
export const hasGetAllOrganizationsPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_ORGANIZATIONS");
export const hasUploadOrganizationImagePrivilege = user?.roles?.[0]?.privilege?.includes("UPLOAD_ORGANIZATION_IMAGE");
export const hasGetDepartmentsOfOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("GET_DEPARTMENTS_OF_ORGANIZATION");
export const hasGetBranchesOfOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("GET_BRANCHES_OF_ORGANIZATION");

// Department Privileges
export const hasGetAllDepartmentAttributesPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_DEPARTMENT_ATTRIBUTES");
export const hasCreateDepartmentAttributePrivilege = user?.roles?.[0]?.privilege?.includes("CREATE_DEPARTMENT_ATTRIBUTE");
export const hasUpdateDepartmentAttributePrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_DEPARTMENT_ATTRIBUTE");
export const hasDeleteDepartmentAttributePrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_DEPARTMENT_ATTRIBUTE");
export const hasGetAllDepartmentsPrivilege = user?.roles?.[0]?.privilege?.includes("GETALL_DEPARTMENTS");
export const hasAddDepartmentPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_DEPARTMENT");
export const hasUpdateDepartmentPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_DEPARTMENT");
export const hasDeleteDepartmentPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_DEPARTMENT");
export const hasGetEmployeesOfDepartmentPrivilege = user?.roles?.[0]?.privilege?.includes("GET_EMPLOYEES_OF_DEPARTMENT");
export const hasAssignDepartmentToOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("ASSIGN_DEPARTMENT_TO_ORGANIZATION");
export const hasRemoveDepartmentFromOrganizationPrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_DEPARTMENT_FROM_ORGANIZATION");
export const hasAssignDepartmentToEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("ASSIGN_DEPARTMENT_TO_EMPLOYEE");
export const hasRemoveDepartmentFromEmployeePrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_DEPARTMENT_FROM_EMPLOYEE");

// Branch privileges
export const hasAddBranchPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_BRANCH");
export const hasGetAllBranchPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_BRANCH");
export const hasGetDepartmentsOfBranchPrivilege = user?.roles?.[0]?.privilege?.includes("GET_DEPARTMENTS_OF_BRANCH");
export const hasUpdateBranchPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_BRANCH");
export const hasDeleteBranchPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_BRANCH");
export const hasAssignBranchPrivilege = user?.roles?.[0]?.privilege?.includes("ASSIGN_BRANCH");
export const hasRemoveBranchPrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_BRANCH");
export const hasAssignDepartmentToBranchPrivilege = user?.roles?.[0]?.privilege?.includes("ASSIGN_DEPARTMENT_TO_BRANCH");
export const hasRemoveDepartmentFromBranchPrivilege = user?.roles?.[0]?.privilege?.includes("REMOVE_DEPARTMENT_FROM_BRANCH");

// Attendance privileges
export const hasGetAllAttendancePrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_ATTENDANCE");
export const hasUpdateAttendanceRecordPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ATTENDANCE_RECORD");
export const hasAddAttendanceLocationPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_ATTENDANCE_LOCATION");
export const hasGetAllAttendanceLocationPrivilege = user?.roles?.[0]?.privilege?.includes("GET_ALL_ATTENDANCE_LOCATION");
export const hasUpdateAttendanceLocationPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_ATTENDANCE_LOCATION");
export const hasDeleteAttendanceLocationPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_ATTENDANCE_LOCATION");
export const hasAddShiftDurationPrivilege = user?.roles?.[0]?.privilege?.includes("ADD_SHIFT_DURATION");
export const hasGetShiftDurationPrivilege = user?.roles?.[0]?.privilege?.includes("GET_SHIFT_DURATION");
export const hasUpdateShiftDurationPrivilege = user?.roles?.[0]?.privilege?.includes("UPDATE_SHIFT_DURATION");
export const hasDeleteShiftDurationPrivilege = user?.roles?.[0]?.privilege?.includes("DELETE_SHIFT_DURATION");
