import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/features/Auth/firebase/firebaseAuth";
import { FcGoogle } from "rocketicons/fc";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authAPI.continueWithGoogle(idToken);

      if (response.status === 200 || response.status === 201) {
        Cookies.set("accessToken", idToken);
        const decodedToken = jwtDecode<JwtPayload>(idToken);
        const userId = decodedToken.sub; // sub is the user id

        if (!userId) {
          throw new Error("User id not found in token");
        }

        localStorage.setItem("userId", userId);

        navigate("/");
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.log("Login with Google error", error);
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
