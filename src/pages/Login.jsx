import React, { useEffect } from "react";
import LoginFormTemplate from "../components/core/Form/LoginFormTemplate";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loading, AccessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (AccessToken) {
      navigate("/");
    }
  }, []);

  return (
    <div className="">
      <LoginFormTemplate />
    </div>
  );
};

export default Login;
