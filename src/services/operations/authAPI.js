import toast from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice.js";
import { apiConnector } from "../apiconnector.js";
import { authEndpoints } from "../apis.js";
import { setUser } from "../../slices/profileSlice.js";
import { setShowOption } from "../../slices/OrganisationSlice.js";

const { LOGIN_API } = authEndpoints;

export function login({ email, password, navigate }) {
  return async (dispatch) => {
    console.log("1234");
    console.log(navigate);
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
      console.log(response);
      if (!response.data.success) {
        throw new Error("Token not found in response");
      } else {
        console.log("hello");
        toast.success(response?.data?.message);
        dispatch(setToken(response?.data?.token));
        const userImage = response?.data?.loginUser?.profileImage
          ? response?.data?.loginUser?.profileImage
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`;
        dispatch(setUser({ ...response?.data?.loginUser, image: userImage }));
        localStorage.setItem("user", JSON.stringify(response?.data?.loginUser));
        localStorage.setItem(
          "AccessToken",
          JSON.stringify(response?.data?.token)
        );
        return response;
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function logout(navigate) {
  return (dispatch) => {
    const toastId = toast.loading("Logging Out...");
    dispatch(setToken(null));
    dispatch(setUser(null)); // Clear user data from state
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    toast.dismiss(toastId);
    navigate("/login");
  };
}
