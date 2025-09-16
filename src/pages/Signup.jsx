import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupSchema } from "../Schemas/index.jsx";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification
} from "firebase/auth";
import { auth, db } from "../components/firebase/firebase.jsx";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { BsGoogle } from "react-icons/bs";
import { useState } from "react";
import "../index.css";

// Email signup
const onSubmit = async (values, actions, navigate) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;

    // Generate initials avatar
    const nameParts = values.name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const initialAvatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

    // Update profile
    await updateProfile(user, {
      displayName: values.name,
      photoURL: initialAvatar
    });

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: values.name,
      email: values.email,
      photoURL: initialAvatar,
      createdAt: new Date(),
      provider: "email"
    });

    // Send verification email
    await sendEmailVerification(user);
    toast.info("Verification email sent! Please check your inbox.");

    actions.resetForm();

    // Redirect to verify page
    navigate("/verify-email");
  } catch (error) {
    console.error("Firebase signup Error", error.message);
    if (error.code === "auth/email-already-in-use") {
      toast.error("A user with this Email Address already exists");
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Unable to Signup. Check your Internet connection.");
    } else {
      toast.error("Signup failed. Please try again.");
    }
  }
};

// Google signup
const handleGoogleSignup = async (navigate, setIsGoogleLoading) => {
  setIsGoogleLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Firestore check
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        photoURL:
          user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || user.email
          )}&background=random&color=fff&size=128`,
        createdAt: new Date(),
        provider: "google"
      });

      toast.success("Signup successful!!");
    } else {
      // toast.success("Welcome back!");
    }

    // Skip verification step for Google accounts
    navigate("/Onboarding");
  } catch (error) {
    console.error("Google signup error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      toast.error("Signup cancelled");
    } else if (error.code === "auth/popup-blocked") {
      toast.error("Popup blocked. Please allow popups and try again");
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Network error. Please check your connection");
    } else {
      toast.error("Google signup failed. Please try again");
    }
  } finally {
    setIsGoogleLoading(false);
  }
};

export default function Signup() {
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: SignupSchema,
    onSubmit: (values, actions) => onSubmit(values, actions, navigate)
  });

  return (
    <div className="bg-white min-h-screen relative lg:overflow-y-hidden overflow-y-auto">

      <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen items-center justify-center">
        <div className="w-[100%] lg:max-w-2xl md:max-w-xl mx-auto h-max flex flex-col justify-center items-center lg:pt-0 pt-20 z-10">
          <h1 className="sm:text-3xl text-xl font-semibold py-4">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="py-6 w-[80%]">
            {/* Username */}
            <div className="flex flex-col gap-2 pt-2">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isGoogleLoading}
                placeholder="Enter your username"
                className={`outline-none border p-2 rounded-md h-10 transition-all duration-200 ${errors.name && touched.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#fc4c00]"
                  } ${isSubmitting || isGoogleLoading ? "bg-gray-100" : ""}`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2 pt-4">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isGoogleLoading}
                placeholder="Enter your email"
                className={`outline-none border p-2 rounded-md h-10 transition-all duration-200 ${errors.email && touched.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#fc4c00]"
                  } ${isSubmitting || isGoogleLoading ? "bg-gray-100" : ""}`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 pt-4">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isGoogleLoading}
                placeholder="Enter your password"
                className={`outline-none border p-2 rounded-md h-10 transition-all duration-200 ${errors.password && touched.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#fc4c00]"
                  } ${isSubmitting || isGoogleLoading ? "bg-gray-100" : ""}`}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Already have account */}
            <div className="flex items-center justify-end pt-6 font-semibold sm:text-[17px] text-sm gap-2">

              Already have an account?  <Link
                to="/login"
                className="text-[#fc4c00] hover:text-[#ff6e26] transition-colors underline"
              >Login
              </Link>
            </div>

            {/* Submit */}
            <div className="w-full pt-7">
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className={`rounded-md w-full h-10 cursor-pointer transition duration-200 flex items-center justify-center gap-2 ${isSubmitting || isGoogleLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#fc4c00] text-white hover:bg-[#ff6e26]"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>

            {/* Or continue with */}
            <div className="text-center pt-6">
              <hr className="mb-5 border border-gray-300" />
              <span className="sm:text-[17px] text-sm">Or continue with</span>

              <div className="flex gap-3 py-6">
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleSignup(navigate, setIsGoogleLoading)
                  }
                  disabled={isSubmitting || isGoogleLoading}
                  className={`border border-gray-300 text-black rounded-md w-full h-10 cursor-pointer transition duration-200 flex items-center justify-center gap-3 ${isSubmitting || isGoogleLoading
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <BsGoogle /> Google
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Image */}
        <div className="w-full h-screen lg:block hidden relative">
          <img
            src="/Achievo2.png"
            alt="Archievo Showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
