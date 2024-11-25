import intellab_bottom from "@/assets/logos/intellab_bottom.svg";
import { FcGoogle } from "rocketicons/fc";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const [signUpInfo, setsignUpInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [inputErrors, setInputErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputValidation = () => {
    let isValid = true;
    if (!signUpInfo.username) {
      setInputErrors({ ...inputErrors, username: "Username is required" });
      isValid = false;
    }
    if (!signUpInfo.email) {
      setInputErrors({ ...inputErrors, email: "Email is required" });
      isValid = false;
    }
    if (!signUpInfo.password) {
      setInputErrors({ ...inputErrors, password: "Password is required" });
      isValid = false;
    }
    if (!signUpInfo.confirmPassword) {
      setInputErrors({ ...inputErrors, confirmPassword: "Confirm Password is required" });
      isValid = false;
    }
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      setInputErrors({ ...inputErrors, confirmPassword: "Passwords do not match" });
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // if(!inputValidation()) return;

    console.log("Signup info:", signUpInfo);

    navigate("/");
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray5">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img src={intellab_bottom} alt="Intellab Logo" className="h-16 mb-2" />
        </div>

        <form id="signup-form" onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={signUpInfo.username}
              onChange={(e) => setsignUpInfo({ ...signUpInfo, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
            />
            {inputErrors.username && <p className="mt-2 text-sm text-appHard">{inputErrors.username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={signUpInfo.email}
              onChange={(e) => setsignUpInfo({ ...signUpInfo, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
            />
            {inputErrors.email && <p className="mt-2 text-sm text-appHard">{inputErrors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={signUpInfo.password}
                onChange={(e) => setsignUpInfo({ ...signUpInfo, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 flex items-center justify-center text-gray3 right-2 top-1 focus:outline-none"
              >
                {showPassword ? (
                  <MdOutlineVisibilityOff className="icon-sm" />
                ) : (
                  <MdOutlineVisibility className="icon-sm" />
                )}
              </button>
            </div>
            {inputErrors.password && <p className="mt-2 text-sm text-appHard">{inputErrors.password}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                value={signUpInfo.confirmPassword}
                onChange={(e) => setsignUpInfo({ ...signUpInfo, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 flex items-center justify-center text-gray3 right-2 top-1 focus:outline-none"
              >
                {showPassword ? (
                  <MdOutlineVisibilityOff className="icon-sm" />
                ) : (
                  <MdOutlineVisibility className="icon-sm" />
                )}
              </button>
            </div>
            {inputErrors.confirmPassword && <p className="mt-2 text-sm text-appHard">{inputErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90"
          >
            Sign Up
          </button>
        </form>

        <button
          className="flex items-center justify-center w-full py-2 mt-4 font-semibold transition border border-gray-300 rounded-lg hover:bg-gray-100"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span>Continue with Google</span>
        </button>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-appPrimary hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
