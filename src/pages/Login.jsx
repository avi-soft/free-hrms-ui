import React from "react";
import LoginFormTemplate from "../components/core/Form/LoginFormTemplate";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";

const Login = () => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="">
      {loading ? (
        <div className=" absolute grid place-content-center h-screen w-screen">
          <Spinner />
        </div>
      ) : (
        <LoginFormTemplate />
      )}
    </div>
  );
};

export default Login;
