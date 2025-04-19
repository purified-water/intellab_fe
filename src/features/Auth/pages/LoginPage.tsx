import intellab_bottom from "@/assets/logos/intellab_bottom.svg";
import { useEffect, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, userAPI } from "@/lib/api";
import LoginGoogle from "@/features/Auth/components/LoginGoogle";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { setUser } from "@/redux/user/userSlice";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { navigateWithPreviousPagePassed, navigateToPreviousPage } from "@/utils";
import { TNavigationState } from "@/types";
import { FaSpinner } from "rocketicons/fa6";
import { setPremiumStatus } from "@/redux/premiumStatus/premiumStatusSlice";
import { LOGIN_TYPES } from "@/constants";

type inputValidationParams = {
  emailRequired: boolean;
  passwordRequired: boolean;
};

export const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [inputErrors, setInputErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const location = useLocation();

  const previousNavigationState = location.state as TNavigationState;

  useEffect(() => {
    document.title = "Login | Intellab";
  }, []);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputValidation = ({ emailRequired, passwordRequired }: inputValidationParams) => {
    let isValid = true;
    // Prevent override other error not showing
    const errors = { email: "", password: "" };

    if (emailRequired && !loginInfo.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (passwordRequired && !loginInfo.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const getPremiumStatusAPI = async (uid: string) => {
    await authAPI.getPremiumStatus({
      query: { uid },
      onSuccess: async (data) => {
        dispatch(setPremiumStatus(data));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const getProfileMeAPI = async () => {
    await userAPI.getProfileMe({
      onSuccess: async (user) => {
        dispatch(setUser(user));
        await getPremiumStatusAPI(user.userId);
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const goBack = () => {
    const state = { from: previousNavigationState?.from ?? "/" } as TNavigationState;
    navigateToPreviousPage(navigate, state);
  };

  const handleLogin = async (e: React.FormEvent) => {
    // Add preventDefault first so the page doesnt reload when the form is submitted
    e.preventDefault();

    if (!inputValidation({ emailRequired: true, passwordRequired: true })) return;

    setIsLoggingIn(true);

    try {
      const response = await authAPI.login(loginInfo.email, loginInfo.password);

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Use login type to determine whether it uses refreshtoken or firebase
        localStorage.setItem("loginType", LOGIN_TYPES.EMAIL);

        const decodedToken = jwtDecode<JwtPayload>(response.data.accessToken);
        const userId = decodedToken.sub; // sub is the user id

        if (!userId) {
          throw new Error("User id not found in token");
        }

        localStorage.setItem("userId", userId);
        await getProfileMeAPI();
        dispatch(loginSuccess());
        setIsLoggingIn(false);

        goBack();
      }
    } catch (error) {
      setIsLoggingIn(false);
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

  const handleSignup = () => {
    const state = { from: previousNavigationState?.from ?? "/" } as TNavigationState;
    navigateWithPreviousPagePassed(navigate, state, "/signup");
  };

  const handleForgotPassword = async () => {
    navigate("/forgot-password");
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
              <button
                type="button" // Prevent form submission
                onClick={handleForgotPassword}
                className="text-sm text-appPrimary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90 ${
              isLoggingIn ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="inline-block mr-2 icon-sm animate-spin icon-white" />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <LoginGoogle callback={goBack} />

        <div className="mt-6 text-center">
          <div className="text-sm">
            Don&apos;t have an account?{" "}
            <button onClick={handleSignup} className="font-bold text-appPrimary hover:underline">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
