import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupSchema } from "../Schemas/index.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../components/firebase/firebase.jsx";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import '../index.css';

const onSubmit = async (values, actions, navigate) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    const user = userCredential.user;

    // Generate initials for avatar
    const nameParts = values.name.split(' ');
    const initials = nameParts
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Create initial avatar URL
    const initialAvatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

    // Update user profile with name and initial avatar
    await updateProfile(user, {
      displayName: values.name,
      photoURL: initialAvatar
    });

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: values.name,
      email: values.email,
      photoURL: initialAvatar,
      createdAt: new Date()
    });

    actions.resetForm();
    toast.success("Signup successful");
    navigate("/login");
  } catch (error) {
    console.error("Firebase signup Error", error.message);

    // Check for specific Firebase auth errors
    if (error.code === "auth/email-already-in-use") {
      toast.error("A user with this Email Address already exists");
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Unable to Signup check your Internet connection and try again!!");
    } else {
      toast.error("Unable to Signup check your Internet connection and try again!!");
    }
  }
};

export default function Signup() {
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, isSubmitting, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values, actions) => onSubmit(values, actions, navigate)
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-[#148359] mb-2">
            Archievo
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Join hundreds of users set and achieve their goals with ease.
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-[#148359] font-bold text-2xl sm:text-3xl mb-6 text-center sm:text-left">
            Signup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="name"
              >
                Username:
              </label>
              <input
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full p-3 text-base rounded-md border-2 transition-all duration-200 
                         outline-none focus:ring-2 focus:ring-offset-1 ${errors.name && touched.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#148359] focus:border-[#148359] focus:ring-[#148359]'
                  }`}
                type="text"
                name="name"
                id="name"
                placeholder="Enter your username"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1 p-2 bg-red-50 rounded-md">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address:
              </label>
              <input
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full p-3 text-base rounded-md border-2 transition-all duration-200 
                         outline-none focus:ring-2 focus:ring-offset-1 ${errors.email && touched.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#148359] focus:border-[#148359] focus:ring-[#148359]'
                  }`}
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1 p-2 bg-red-50 rounded-md">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full p-3 text-base rounded-md border-2 transition-all duration-200 
                         outline-none focus:ring-2 focus:ring-offset-1 ${errors.password && touched.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#148359] focus:border-[#148359] focus:ring-[#148359]'
                  }`}
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1 p-2 bg-red-50 rounded-md">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className={`w-full font-semibold py-3 px-4 rounded-md text-base sm:text-lg
                       transition-all duration-200 ease-in-out mt-6 flex items-center 
                       justify-center gap-2 ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-[#148359] text-white hover:bg-slate-50 hover:text-[#148359] hover:ring-2 hover:ring-[#148359]'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                'Signup'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <Link
                className="text-[#148359] hover:text-[#0f6b47] font-medium underline 
                         transition-colors duration-200"
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}