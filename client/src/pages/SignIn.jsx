import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (errorMessage) dispatch(clearError());
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      formData.email.trim() === "" ||
      formData.password.trim() === ""
    ) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data.user));
        // Use data.user.isAdmin here instead of currentUser.isAdmin
        if (data.user.isAdmin) {
          navigate("/dashboard?tab=dash");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center mb-15">
      <div className="flex flex-col md:flex-row gap-10 p-6 max-w-3xl mx-auto md:items-center">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Quick
            </span>
            Court
          </Link>

          <p className="text-sm mt-5">
            You can sign up with your and email and password or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label>Your email</Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                value={formData.email}
                onChange={handleChange}
                color={errorMessage ? "warning" : "gray"}
              />
            </div>

            <div className="">
              <Label>Your password</Label>
              <TextInput
                type="password"
                placeholder="************"
                id="password"
                value={formData.password}
                onChange={handleChange}
                color={errorMessage ? "warning" : "gray"}
              />
            </div>

            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer"
              type="submit"
              disabled={loading}
              onSubmit={handleSubmit}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* <OAuth /> */}
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
