// Employee Privileges
export const employeePrivileges = [
    { index: 1, value: "ADD_EMPLOYEE", default: false, description: "Permission to add new employees." },
    { index: 2, value: "UPLOAD_EMPLOYEE_IMAGE", default: false, description: "Permission to upload employee images." },
    { index: 3, value: "GET_ALL_EMPLOYEES", default: false, description: "View all employees in the organization." },
    { index: 4, value: "UPDATE_EMPLOYEE_COMPANY_DETAILS", default: false, description: "Permission to update company-related details of employees." },
    { index: 5, value: "FIND_EMPLOYEE_BY_ID", default: false, description: "Find specific employees by their ID." },
    { index: 6, value: "SEARCH_EMPLOYEE_BY_NAME", default: false, description: "Search employees by name." },
    { index: 7, value: "SEARCH_EMPLOYEE_BY_MANAGER_ID", default: false, description: "Search employees by their manager's ID." },
    { index: 8, value: "CREATE_EMPLOYEE_ATTRIBUTE", default: false, description: "Permission to create new employee attributes." },
    { index: 9, value: "UPDATE_EMPLOYEE_ATTRIBUTE", default: false, description: "Permission to update employee attributes." },
    { index: 10, value: "DELETE_EMPLOYEE_ATTRIBUTE", default: false, description: "Permission to delete employee attributes." },
    { index: 11, value: "GET_ALL_EMPLOYEE_ATTRIBUTES", default: false, description: "View all employee attributes." },
    { index: 12, value: "ADD_ADDRESS", default: false, description: "Permission to add new address information for employees." },
    { index: 13, value: "REMOVE_ADDRESS", default: false, description: "Permission to remove existing address information." },
    { index: 14, value: "UPDATE_ADDRESS", default: false, description: "Permission to update address information." },
    { index: 15, value: "ADD_ACCOUNT", default: false, description: "Permission to add new account information." },
    { index: 16, value: "REMOVE_ACCOUNT", default: false, description: "Permission to remove existing account information." },
    { index: 17, value: "SAVE_USER", default: false, description: "Permission to save user information." },
    { index: 18, value: "CREATE_NEW_USER", default: false, description: "Permission to create new user accounts." },
    { index: 19, value: "DELETE_EMPLOYEE", default: false, description: "Permission to delete employee records." },
    { index: 20, value: "GET_ALL_USERS", default: false, description: "View all user accounts in the organization." }
];

// Address Privileges
export const addressPrivileges = [
    { index: 1, value: "ADD_ADDRESS", default: false, description: "Permission to add new address information." },
    { index: 2, value: "REMOVE_ADDRESS", default: false, description: "Permission to remove existing address information." },
    { index: 3, value: "UPDATE_ADDRESS", default: false, description: "Permission to update address information." }
];

// Emergency Contact Privileges
export const emergencyContactPrivileges = [
    { index: 1, value: "GET_EMPLOYEE_EMERGENCY_CONTACT", default: false, description: "View emergency contact information for employees." },
    { index: 2, value: "ADD_EMERGENCY_CONTACT", default: false, description: "Permission to add emergency contact information." },
    { index: 3, value: "UPDATE_EMERGENCY_CONTACT", default: false, description: "Permission to update emergency contact information." },
    { index: 4, value: "DELETE_EMERGENCY_CONTACT", default: false, description: "Permission to delete emergency contact information." }
];

// Performance Privileges
export const performancePrivileges = [
    { index: 1, value: "GET_ALL_PERFORMANCE_OF_EMPLOYEE", default: false, description: "View all performance records of a specific employee." },
    { index: 2, value: "ADD_EMPLOYEE_PERFORMANCE", default: false, description: "Permission to add new performance records for employees." },
    { index: 3, value: "GET_ALL_PERFORMANCES", default: false, description: "View all performance records." },
    { index: 4, value: "GET_PERFORMANCE_BY_REVIEWER", default: false, description: "View performance records reviewed by a specific reviewer." },
    { index: 5, value: "DELETE_PERFORMANCE_RECORD", default: false, description: "Permission to delete performance records." }
];

// Leave Privileges
export const leavePrivileges = [
    { index: 1, value: "CREATE_LEAVE_REQUEST", default: false, description: "Permission to create a new leave request." },
    { index: 2, value: "GET_ALL_LEAVE_REQUESTS", default: false, description: "Access to view all leave requests." },
    { index: 3, value: "DECLINE_LEAVE_REQUEST", default: false, description: "Authority to decline leave requests." },
    { index: 4, value: "APPROVE_LEAVE_REQUEST", default: false, description: "Authority to approve leave requests." },
    { index: 5, value: "GET_LEAVE_REQUEST_OF_EMPLOYEE", default: false, description: "View specific employee's leave requests." },
    { index: 6, value: "GET_PENDING_LEAVE_REQUEST_OF_EMPLOYEE", default: false, description: "View pending leave requests for a specific employee." },
    { index: 7, value: "GET_APPROVED_REQUEST_OF_EMPLOYEE", default: false, description: "View approved leave requests for a specific employee." },
    { index: 8, value: "GET_DECLINED_REQUEST_OF_EMPLOYEE", default: false, description: "View declined leave requests for a specific employee." },
    { index: 9, value: "ADD_LEAVE_TYPE", default: false, description: "Permission to add new leave types." },
    { index: 10, value: "REMOVE_LEAVE_TYPE", default: false, description: "Permission to remove existing leave types." },
    { index: 11, value: "UPDATE_LEAVE_TYPE", default: false, description: "Permission to update existing leave types." },
    { index: 12, value: "GET_ALL_LEAVE_TYPES", default: false, description: "View all available leave types." },
    { index: 13, value: "GET_LEAVE_TYPE", default: false, description: "View specific leave type details." },
    { index: 14, value: "GET_LEAVE_BALANCE_FOR_ALL_EMPLOYEES", default: false, description: "View leave balance for all employees." }
];

// Role Privileges
export const rolePrivileges = [
    { index: 1, value: "CREATE_ROLE", default: false, description: "Permission to create a new role." },
    { index: 2, value: "UPDATE_ROLE", default: false, description: "Permission to update existing roles." },
    { index: 3, value: "DELETE_ROLE", default: false, description: "Permission to delete roles." },
    { index: 4, value: "CHANGE_USER_ROLE", default: false, description: "Permission to change user roles." },
    { index: 5, value: "GET_ALL_ROLES", default: false, description: "View all roles." },
    { index: 6, value: "ASSIGN_ROLE_TO_USER", default: false, description: "Assign a role to a user." }
];

// Personal Profile Privileges
export const personalProfilePrivileges = [
    { index: 1, value: "ADD_DESIGNATION", default: false, description: "Permission to add a designation." },
    { index: 2, value: "UPDATE_DESIGNATION", default: false, description: "Permission to update designations." },
    { index: 3, value: "DELETE_DESIGNATION", default: false, description: "Permission to delete designations." },
    { index: 4, value: "GET_ALL_DESIGNATION", default: false, description: "View all designations." },
    { index: 5, value: "ADD_SKILL", default: false, description: "Permission to add a skill." },
    { index: 6, value: "UPDATE_SKILL", default: false, description: "Permission to update skills." },
    { index: 7, value: "DELETE_SKILL", default: false, description: "Permission to delete skills." },
    { index: 8, value: "GET_ALL_SKILL", default: false, description: "View all skills." }
];

// Organization Privileges
export const organizationPrivileges = [
    { index: 1, value: "GET_ALL_ORGANIZATION_ATTRIBUTES", default: false, description: "Access to view all organization attributes." },
    { index: 2, value: "CREATE_ORGANIZATION_ATTRIBUTE", default: false, description: "Permission to create new organization attributes." },
    { index: 3, value: "UPDATE_ORGANIZATION_ATTRIBUTE", default: false, description: "Permission to update organization attributes." },
    { index: 4, value: "DELETE_ORGANIZATION_ATTRIBUTE", default: false, description: "Permission to delete organization attributes." },
    { index: 5, value: "CREATE_ORGANIZATION", default: false, description: "Permission to create a new organization." },
    { index: 6, value: "UPDATE_ORGANIZATION", default: false, description: "Permission to update organization details." },
    { index: 7, value: "DELETE_ORGANIZATION", default: false, description: "Permission to delete an organization." },
    { index: 8, value: "GET_ALL_ORGANIZATIONS", default: false, description: "View all organizations." },
    { index: 9, value: "UPLOAD_ORGANIZATION_IMAGE", default: false, description: "Permission to upload organization images." },
    { index: 10, value: "GET_DEPARTMENTS_OF_ORGANIZATION", default: false, description: "View departments associated with an organization." },
    { index: 11, value: "GET_BRANCHES_OF_ORGANIZATION", default: false, description: "View branches associated with an organization." }
];

// Department Privileges
export const departmentPrivileges = [
    { index: 1, value: "GETALL_DEPARTMENTS", default: false, description: "Access to view all departments." },
    { index: 2, value: "ADD_DEPARTMENT", default: false, description: "Permission to add new departments." },
    { index: 3, value: "UPDATE_DEPARTMENT", default: false, description: "Permission to update existing departments." },
    { index: 4, value: "DELETE_DEPARTMENT", default: false, description: "Permission to delete departments." },
    { index: 5, value: "GET_EMPLOYEES_OF_DEPARTMENT", default: false, description: "View employees in a specific department." },
    { index: 6, value: "ASSIGN_DEPARTMENT_TO_ORGANIZATION", default: false, description: "Assign a department to an organization." },
    { index: 7, value: "REMOVE_DEPARTMENT_FROM_ORGANIZATION", default: false, description: "Remove a department from an organization." },
    { index: 8, value: "ASSIGN_DEPARTMENT_TO_EMPLOYEE", default: false, description: "Assign a department to an employee." },
    { index: 9, value: "REMOVE_DEPARTMENT_FROM_EMPLOYEE", default: false, description: "Remove a department from an employee." }
];

// Branch Privileges
export const branchPrivileges = [
    { index: 1, value: "ADD_BRANCH", default: false, description: "Permission to add a new branch." },
    { index: 2, value: "GET_ALL_BRANCH", default: false, description: "View all branches." },
    { index: 3, value: "GET_DEPARTMENTS_OF_BRANCH", default: false, description: "View departments associated with a specific branch." },
    { index: 4, value: "UPDATE_BRANCH", default: false, description: "Permission to update branch details." },
    { index: 5, value: "DELETE_BRANCH", default: false, description: "Permission to delete a branch." },
    { index: 6, value: "ASSIGN_BRANCH", default: false, description: "Permission to assign branches." },
    { index: 7, value: "REMOVE_BRANCH", default: false, description: "Permission to remove branches." },
    { index: 8, value: "ASSIGN_DEPARTMENT_TO_BRANCH", default: false, description: "Permission to assign a department to a branch." },
    { index: 9, value: "REMOVE_DEPARTMENT_FROM_BRANCH", default: false, description: "Permission to remove a department from a branch." },
    { index: 10, value: "ADD_BRANCH_ATTRIBUTE", default: false, description: "Permission to add attributes to a branch." },
    { index: 11, value: "GET_BRANCH_ATTRIBUTE", default: false, description: "View attributes of a branch." },
    { index: 12, value: "UPDATE_BRANCH_ATTRIBUTE", default: false, description: "Permission to update attributes of a branch." },
    { index: 13, value: "DELETE_BRANCH_ATTRIBUTE", default: false, description: "Permission to delete attributes from a branch." }
];


// Attendance Privileges
export const attendancePrivileges = [
    { index: 1, value: "GET_ALL_ATTENDANCE", default: false, description: "View all attendance records." },
    { index: 2, value: "UPDATE_ATTENDANCE_RECORD", default: false, description: "Permission to update attendance records." },
    { index: 3, value: "ADD_ATTENDANCE_LOCATION", default: false, description: "Permission to add new attendance locations." },
    { index: 4, value: "GET_ALL_ATTENDANCE_LOCATION", default: false, description: "View all attendance locations." },
    { index: 5, value: "UPDATE_ATTENDANCE_LOCATION", default: false, description: "Permission to update attendance locations." },
    { index: 6, value: "DELETE_ATTENDANCE_LOCATION", default: false, description: "Permission to delete attendance locations." },
    { index: 7, value: "ADD_SHIFT_DURATION", default: false, description: "Permission to add new shift durations." },
    { index: 8, value: "GET_SHIFT_DURATION", default: false, description: "View shift durations." },
    { index: 9, value: "UPDATE_SHIFT_DURATION", default: false, description: "Permission to update shift durations." },
    { index: 10, value: "DELETE_SHIFT_DURATION", default: false, description: "Permission to delete shift durations." }
];
