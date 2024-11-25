import intellab_bottom from "@/assets/logos/intellab_bottom.svg";
import { FcGoogle } from "rocketicons/fc";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login info:", loginInfo);

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

        <form id="login-form" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={loginInfo.email}
              onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={loginInfo.password}
                onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
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

            <div className="mt-2 text-right">
              <a href="/forgot-password" className="text-sm text-appPrimary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90"
          >
            Log In
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
          <div className="text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-bold text-appPrimary hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
