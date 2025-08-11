// src/components/ResetOnNavigate.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearError } from "../redux/user/userSlice.js";

const ResetOnNavigate = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname]);

  useEffect(() => {
    const handleUnload = () => {
      dispatch(clearError()); 
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return children;
};

export default ResetOnNavigate;
