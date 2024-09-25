import { getSubOrganization } from "../services/operations/subOrganisationAPI";
import { setSubOrganization } from "../slices/subOrganizationSlice";

 export const fetchSubOrganizationOrgSpecific = async (dispatch,AccessToken,orgId) => {

    try {
        const res = await dispatch(getSubOrganization(AccessToken, orgId));
        console.log("res",res);
        dispatch(setSubOrganization(res?.data?.BranchList));
         return res  
      }
    catch (error) {
      console.error("Error fetching departments", error);
      dispatch(setLoading(false));
    }
}
