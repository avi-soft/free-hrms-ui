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

// Department Privileges
export const departmentPrivileges = [
    { index: 1, value: "GETALL_DEPARTMENTS", default: false, description: "Access to view all departments." },
    { index: 2, value: "ADD_DEPARTMENT", default: false, description: "Permission to add new departments." },
    { index: 3, value: "UPDATE_DEPARTMENT", default: false, description: "Permission to update existing departments." },
    { index: 4, value: "DELETE_DEPARTMENT", default: false, description: "Permission to delete departments." }
];

// Performance Privileges
export const performancePrivileges = [
    { index: 1, value: "GET_ALL_PERFORMANCE_OF_EMPLOYEE", default: false, description: "View all performance records of a specific employee." },
    { index: 2, value: "ADD_EMPLOYEE_PERFORMANCE", default: false, description: "Permission to add new performance records for employees." },
    { index: 3, value: "GET_ALL_PERFORMANCES", default: false, description: "View all performance records." },
    { index: 4, value: "GET_PERFORMANCE_BY_REVIEWER", default: false, description: "View performance records reviewed by a specific reviewer." },
    { index: 5, value: "DELETE_PERFORMANCE_RECORD", default: false, description: "Permission to delete performance records." }
];

// Emergency Contact Privileges
export const emergencyContactPrivileges = [
    { index: 1, value: "GET_EMPLOYEE_EMERGENCY_CONTACT", default: false, description: "View emergency contact information for employees." },
    { index: 2, value: "ADD_EMERGENCY_CONTACT", default: false, description: "Permission to add emergency contact information." },
    { index: 3, value: "UPDATE_EMERGENCY_CONTACT", default: false, description: "Permission to update emergency contact information." },
    { index: 4, value: "DELETE_EMERGENCY_CONTACT", default: false, description: "Permission to delete emergency contact information." }
];

// Employee Privileges
export const employeePrivileges = [
    { index: 1, value: "ADD_EMPLOYEE", default: false, description: "Permission to add new employees." },
    { index: 2, value: "UPLOAD_EMPLOYEE_IMAGE", default: false, description: "Permission to upload employee images." },
    { index: 3, value: "GET_ALL_EMPLOYEES", default: false, description: "View all employees in the organization." },
    { index: 4, value: "UPDATE_EMPLOYEE_COMPANY_DETAILS", default: false, description: "Permission to update company-related details of employees." },
    { index: 5, value: "FIND_EMPLOYEE_BY_ID", default: false, description: "Find specific employees by their ID." },
    { index: 6, value: "SEARCH_EMPLOYEE_BY_NAME", default: false, description: "Search employees by name." },
    { index: 7, value: "SEARCH_EMPLOYEE_BY_MANAGER_ID", default: false, description: "Search employees by their manager's ID." },
    { index: 8, value: "ADD_ADDRESS", default: false, description: "Permission to add new address information for employees." },
    { index: 9, value: "REMOVE_ADDRESS", default: false, description: "Permission to remove existing address information." },
    { index: 10, value: "UPDATE_ADDRESS", default: false, description: "Permission to update address information." },
    { index: 11, value: "ADD_ACCOUNT", default: false, description: "Permission to add new account information." },
    { index: 12, value: "REMOVE_ACCOUNT", default: false, description: "Permission to remove existing account information." },
    { index: 13, value: "SAVE_USER", default: false, description: "Permission to save user information." },
    { index: 14, value: "CREATE_NEW_USER", default: false, description: "Permission to create new user accounts." },
    { index: 15, value: "DELETE_EMPLOYEE", default: false, description: "Permission to delete employee records." },
    { index: 16, value: "GET_ALL_USERS", default: false, description: "View all user accounts in the organization." }
];
