import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../components/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { BsGoogle } from "react-icons/bs";

const handleGoogleLogin = async (navigate, setIsGoogleLoading) => {
  setIsGoogleLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await auth.signOut();
      toast.error("Account not Found, Signup!");
      return;
    }

    const userData = userDoc.data();
    localStorage.setItem(
      "userData",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: userData.name || user.displayName,
        photoURL: userData.photoURL || user.photoURL
      })
    );

    toast.success("Google login successful!");
    navigate("/dashboard");
  } catch (error) {
    console.error("Google login error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      toast.error("Login cancelled");
    } else if (error.code === "auth/popup-blocked") {
      toast.error("Popup blocked. Please allow popups and try again");
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Network error. Please check your connection and try again");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      toast.error(
        "An account already exists with the same email address but different sign-in credentials"
      );
    } else {
      toast.error("Google login failed. Please try again");
    }
  } finally {
    setIsGoogleLoading(false);
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await auth.signOut();
        toast.error("Account not Found, Signup!");
        return;
      }

      const userData = userDoc.data();
      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: userData.name,
          photoURL: userData.photoURL
        })
      );

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err.message);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        toast.error("Incorrect Email or password");
      } else if (err.code === "auth/network-request-failed") {
        toast.error("Unable to Login, check your Internet connection and try again!!");
      } else {
        toast.error("Unable to Login, please try again!!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setIsResetting(true);
      await sendPasswordResetEmail(auth, forgotEmail, {
        url: window.location.origin + "/login",
        handleCodeInApp: false
      });
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email. Try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center relative">
      <div className="w-full mx-auto h-max flex flex-col justify-center items-center pt-10 z-10">
        <h1 className="text-2xl font-semibold py-4">Login to your account</h1>

        <form onSubmit={handleLogin} className="w-full max-w-md px-6 py-6">
          <div className="flex flex-col gap-2 pt-4">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
              className="border p-2 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
              className="border p-2 rounded-md"
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <Link to="/signup" className="text-orange-600 font-semibold">
              {` Don't have an account? `}
            </Link>
            <span
              onClick={() => setShowForgotModal(true)}
              className="text-orange-600 font-semibold cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          <div className="w-full pt-7">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="bg-orange-600 text-white rounded-md w-full h-10"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-center pt-6">
            <hr className="mb-5" />
            <span>Or continue with</span>
            <div className="flex flex-col sm:flex-row gap-3 py-6">
              <button
                type="button"
                onClick={() => handleGoogleLogin(navigate, setIsGoogleLoading)}
                disabled={isLoading || isGoogleLoading}
                className="border rounded-md w-full h-10 flex items-center justify-center gap-3"
              >
                {isGoogleLoading ? "Signing in..." : <><BsGoogle /> Google</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="border p-2 rounded-md w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={isResetting}
                className="px-4 py-2 bg-orange-600 text-white rounded-md"
              >
                {isResetting ? "Next" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
