import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/features/Auth/firebase/firebaseAuth";
import { FcGoogle } from "rocketicons/fc";
import { authAPI, userAPI } from "@/lib/api";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { setPoint, setUser } from "@/redux/user/userSlice";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { setPremiumStatus } from "@/redux/premiumStatus/premiumStatusSlice";
import { LOGIN_TYPES } from "@/constants";

type TLoginGoogleProps = {
  callback: () => void;
};

const GoogleLogin = (props: TLoginGoogleProps) => {
  const { callback } = props;
  const dispatch = useDispatch();
  const toast = useToast();

  const getPremiumStatusAPI = async (uid: string) => {
    await authAPI.getPremiumStatus({
      query: { uid },
      onSuccess: async (data) => {
        dispatch(setPremiumStatus(data));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const getMyPointAPI = async () => {
    await userAPI.getMyPoint({
      onSuccess: async (point) => {
        dispatch(setPoint(point));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const getProfileMeAPI = async () => {
    await userAPI.getProfileMe({
      onSuccess: async (user) => {
        dispatch(setUser(user));
        await getMyPointAPI();
        await getPremiumStatusAPI(user.userId!);
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authAPI.continueWithGoogle(idToken);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("accessToken", idToken);
        // Use login type to determine whether it uses refreshtoken or firebase
        localStorage.setItem("loginType", LOGIN_TYPES.GOOGLE);

        const decodedToken = jwtDecode<JwtPayload>(idToken);
        const userId = decodedToken.sub; // sub is the user id

        if (!userId) {
          throw new Error("User id not found in token");
        }

        localStorage.setItem("userId", userId);
        await getProfileMeAPI();
        dispatch(loginSuccess());

        callback();
      }
    } catch (error) {
      console.log("Login with Google error", error);
      showToastError({
        toast: toast.toast,
        message: "Login with Google failed. Please try again."
      });
    }
  };

  return (
    <button
      className="flex items-center justify-center w-full py-2 mt-4 font-semibold transition border border-gray-300 rounded-lg hover:bg-gray-100"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLogin;
