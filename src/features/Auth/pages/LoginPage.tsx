import intellab_bottom from "@/assets/logos/intellab_bottom.svg";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";
import { useNavigate } from "react-router-dom";
import { authAPI, userAPI } from "@/lib/api";
import LoginGoogle from "@/features/Auth/components/LoginGoogle";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { setUser, setProgress } from "@/redux/user/userSlice";

export const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [inputErrors, setInputErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputValidation = () => {
    let isValid = true;
    // Prevent override other error not showing
    const errors = { email: "", password: "" };

    if (!loginInfo.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!loginInfo.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const handleGetUser = async (accessToken: string) => {
    const user = await userAPI.getUser(accessToken);
    if (user) {
      dispatch(setUser(user));
    }
  };

  const handleGetProgress = async (userId: string) => {
    const progress = await userAPI.getProgress(userId);
    if (progress) {
      dispatch(setProgress(progress));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    // Add preventDefault first so the page doesnt reload when the form is submitted
    e.preventDefault();

    if (!inputValidation()) return;

    try {
      const response = await authAPI.login(loginInfo.email, loginInfo.password);

      if (response.status === 200) {
        Cookies.set("accessToken", response.data.accessToken, {
          // process.env.NODE_ENV is automatically set by Vite development/production
          // if production, will use HTTPS and secure cookie
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict", // Mitigate CSRF
          expires: 1 / 24 // Token expiry (1 hour)
        });

        const decodedToken = jwtDecode<JwtPayload>(response.data.accessToken);
        const userId = decodedToken.sub; // sub is the user id

        if (!userId) {
          throw new Error("User id not found in token");
        }

        localStorage.setItem("userId", userId);
        await handleGetUser(response.data.accessToken);
        await handleGetProgress(userId);
        dispatch(loginSuccess());
        navigate("/");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Invalid email or password";
        setInputErrors({ ...inputErrors, email: errorMessage });
      } else {
        // For other errors (network issues, etc.)
        setInputErrors({ ...inputErrors, email: "Something went wrong!" });
      }
      console.error("Login error", error);
    }
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
              onFocus={() => setInputErrors({ ...inputErrors, email: "" })}
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
                value={loginInfo.password}
                onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                onFocus={() => setInputErrors({ ...inputErrors, password: "" })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 items-center justify-center text-gray3 right-2 top-1 focus:outline-none"
              >
                {showPassword ? (
                  <MdOutlineVisibilityOff className="icon-lg" />
                ) : (
                  <MdOutlineVisibility className="icon-lg" />
                )}
              </button>
            </div>
            {inputErrors.password && <p className="mt-2 text-sm text-appHard">{inputErrors.password}</p>}

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

        <LoginGoogle />

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
