import toast from "react-hot-toast";
import { setLoading, setToken} from "../../slices/authSlice.js"
import { apiConnector } from "../apiconnector.js"
import { authEndpoints } from "../apis.js";
import { setUser } from "../../slices/profileSlice.js";


const {
  LOGIN_API
}=authEndpoints;

export function login({ email, password,role, navigate }) {
    return async (dispatch) => {
      console.log(navigate)
      dispatch(setLoading(true))
      console.log(role)
      try {
        const response = await apiConnector("POST", LOGIN_API, {
            email, password,role: `${role}`
        })
        console.log(response)
        if (!response.data.success) {
          throw new Error("Token not found in response");
        }
        toast.success(response?.data?.message);
        dispatch(setToken(response?.data?.token));
        const userImage = response?.data?.loginUser?.profileImage ? response?.data?.loginUser?.profileImage :  `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`
        dispatch(setUser({...response?.data?.loginUser,image:userImage}));
        localStorage.setItem("user", JSON.stringify(response?.data?.loginUser))
        localStorage.setItem("AccessToken", JSON.stringify(response?.data?.token));
      } catch (err) {
        toast.error(err?.response?.data?.message)
        console.log(err);
      }
      dispatch(setLoading(false));
      navigate("/")

    };
  }
       

        
export function logout(navigate){
    return (dispatch) => {
        const toastId = toast.loading("Logging Out...")
        dispatch(setToken(null))
        localStorage.clear()
        toast.success("Logged Out")
        toast.dismiss(toastId)
        navigate("/login")
    }
}