
// External Library Imports
import { BsCircle } from "react-icons/bs";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const MenuItems = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.profile);
    const userPrivileges = user?.roles[0].privilege || [];

    // Function to check if user has a specific privilege
    const hasPrivilege = (privilege) => userPrivileges.includes(privilege);

    // Define menu items based on user privileges
    const adminMenuItems = () => {
        return [
            { key: "navigation", label: t("MANAGER PANEL"), isTitle: true },
            {
                key: "Dashboard",
                label: t("Dashboard"),
                url: "/",
                isTitle: false,
                icon: <RiDashboardLine className="side-bar-item-icon" />,
            },
            {
              key: "Organization",
              label: t("Organization"),
              isTitle: false,
              icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
              children: [
                {
                  key: "NewOrganization",
                  label: t("Create Organization"),
                  url: "/organization/organization-create-update",
                  parentKey: "Organization",
                  icon: (
                    <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />
                  ),
                },
                {
                  key: "Organization List",
                  label: t("Organization List"),
                  url: "/Organization/Organization-list",
                  parentKey: "Organization",
                  icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                },
              ],
            },
            {
                key: "SubOrganization",
                label: t("Sub Organization"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                  {
                    key: "NewSubOrganization",
                    label: t("Create Sub Organization"),
                    url: "/suborganization/suborganization-create-update",
                    parentKey: "SubOrganization",
                    icon: (
                      <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />
                    ),
                  },
                  {
                    key: "SubOrganization List",
                    label: t("Sub Organization List"),
                    url: "/SubOrganization/SubOrganization-list",
                    parentKey: "SubOrganization",
                    icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                  },
                ],
              },
            {
                key: "Department",
                label: t("Department"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    {
                        key: "NewDepartment",
                        label: t("New Department"),
                        url: "/department/department-create-update",
                        parentKey: "Department",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    {
                        key: "DepartmentList",
                        label: t("Department List"),
                        url: "/department/department-list",
                        parentKey: "Department",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ],
            },
            {
                key: "Role",
                label: t("Role"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    {
                        key: "NewRole",
                        label: t("New Role"),
                        url: "/role/role-create-update",
                        parentKey: "Role",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    {
                        key: "Role List",
                        label: t("Role List"),
                        url: "/role/role-list",
                        parentKey: "Role",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ],
            },
            {
                key: "Employee",
                label: t("Employee"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    {
                        key: "NewEmployee",
                        label: t("New Employee"),
                        url: "/employee/employee-create-update",
                        parentKey: "Employee",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    {
                        key: "Employee List",
                        label: t("Employee List"),
                        url: "/employee/employee-list",
                        parentKey: "Employee",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ],
            },
            {
                key: "Performance Review",
                label: t("Performance Review"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    {
                        key: "All Reviews",
                        label: t("All Reviews"),
                        url: "/performance/all-reviews",
                        parentKey: "Performance Review",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                    {
                        key: "Add Performance Review",
                        label: t("Add Performance Review"),
                        url: "/performance/add-review",
                        parentKey: "Performance Review",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                    {
                        key: "Performance Review List",
                        label: t("Performance Review List"),
                        url: "/performance/review-list",
                        parentKey: "Performance Review",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ],
            },
            {
                key: "Leave",
                label: t("Leave"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    {
                        key: "Requested Leaves List",
                        label: t("Requested Leaves List"),
                        url: "/leave/Requested-leaves-list",
                        parentKey: "Leave",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ],
            },
        ];
    };

    const userMenuItems = () => {
        return [
            { key: "navigation", label: user?.roles[0]?.role, isTitle: true },
            {
                key: "Dashboard",
                label: t("Dashboard"),
                url: "/dashboard",
                isTitle: false,
                icon: <RiDashboardLine className="side-bar-item-icon" />,
            },
            {
                key: "Department",
                label: t("Department"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("ADD_DEPARTMENT") && {
                        key: "NewDepartment",
                        label: t("New Department"),
                        url: "/department/department-create-update",
                        parentKey: "Department",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("GETALL_DEPARTMENTS") && {
                        key: "DepartmentList",
                        label: t("Department List"),
                        url: "/department/department-list",
                        parentKey: "Department",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
            {
                key: "Roles",
                label: t("Roles"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("CREATE_ROLE") && {
                        key: "CreateRole",
                        label: t("Create Role"),
                        url: "/role/role-create-update",
                        parentKey: "Roles",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("GET_ALL_ROLES") && {
                        key: "RoleList",
                        label: t("Role List"),
                        url: "/role/role-list",
                        parentKey: "Roles",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
            {
                key: "Employee",
                label: t("Employee"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("ADD_EMPLOYEE") && {
                        key: "NewEmployee",
                        label: t("New Employee"),
                        url: "/employee/employee-create-update",
                        parentKey: "Employee",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("GET_ALL_EMPLOYEES") && {
                        key: "EmployeeList",
                        label: t("Employee List"),
                        url: "/employee/employee-list",
                        parentKey: "Employee",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
            {
                key: "Performance Review",
                label: t("Performance Review"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("GET_ALL_PERFORMANCE_OF_EMPLOYEE") && {
                        key: "PerformanceReviewList",
                        label: t("Performance Review List"),
                        url: "/performancereview/performancereview-list",
                        parentKey: "Performance Review",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("ADD_EMPLOYEE_PERFORMANCE") && {
                        key: "NewPerformanceReview",
                        label: t("New Performance Review"),
                        url: "/performancereview/performancereview-create-update",
                        parentKey: "Performance Review",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
            {
                key: "Leave",
                label: t("Leave"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("CREATE_LEAVE_REQUEST") && {
                        key: "NewLeaveRequest",
                        label: t("New Leave Request"),
                        url: "/leaverequest/leaverequest-create-update",
                        parentKey: "Leave Requests",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("GET_ALL_LEAVE_REQUESTS") && {
                        key: "LeaveRequestList",
                        label: t("Leave Request List"),
                        url: "/leaverequest/leaverequest-list",
                        parentKey: "Leave Requests",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
            {
                key: "Emergency Contacts",
                label: t("Emergency Contacts"),
                isTitle: false,
                icon: <HiOutlineDocumentDuplicate className="side-bar-item-icon" />,
                children: [
                    hasPrivilege("ADD_EMERGENCY_CONTACT") && {
                        key: "NewEmergencyContact",
                        label: t("New Emergency Contact"),
                        url: "/emergencycontact/emergencycontact-create-update",
                        parentKey: "Emergency Contacts",
                        icon: <AiOutlineUserAdd size={16} className="side-bar-subitem-icon" />,
                    },
                    hasPrivilege("GET_EMPLOYEE_EMERGENCY_CONTACT") && {
                        key: "EmergencyContactList",
                        label: t("Emergency Contact List"),
                        url: "/emergencycontact/emergencycontact-list",
                        parentKey: "Emergency Contacts",
                        icon: <BsCircle size={16} className="side-bar-subitem-icon" />,
                    },
                ].filter(Boolean),
            },
        ];
    };

    const getMenuItems = () => {
        if (user?.roles[0]?.role === "Manager") {
            return adminMenuItems();
        } else {
            return userMenuItems();
        }
    };

    // Get menu items and filter out items where children are empty
    const menu = getMenuItems();
    const filteredMenu = menu.map((item) => ({
        ...item,
        children: item.children && item.children.length > 0 ? item.children : undefined,
    })).filter((item) => item.key==="navigation" || item.key === "Dashboard" || item.children);

    return filteredMenu;
};

export default MenuItems;

