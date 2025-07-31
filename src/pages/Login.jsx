import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase/firebase";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem(
        "userData",
        JSON.stringify({ uid: user.uid, email: user.email })
      );

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err.message);

      // Check for specific Firebase auth errors
      if (err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential") {
        toast.error("Incorrect username or password");
      } else if (err.code === "auth/network-request-failed") {
        toast.error("Unable to Login, check your Internet connection and try again!!");
      } else {
        toast.error("Unable to Login, check your Internet connection and try again!!");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-[#148359] font-bold text-2xl sm:text-3xl mb-6 text-center sm:text-left">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address:
              </label>
              <input
                className="w-full ring-2 outline-none ring-[#148359] focus:ring-[#148359] 
                         rounded-md p-3 text-base transition-all duration-200 
                         focus:ring-2 focus:ring-offset-1"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                placeholder="Enter your email"
              />
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
                className="w-full ring-2 outline-none ring-[#148359] focus:ring-[#148359] 
                         rounded-md p-3 text-base transition-all duration-200 
                         focus:ring-2 focus:ring-offset-1"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 px-4 rounded-md text-base sm:text-lg
                       transition-all duration-200 ease-in-out mt-6 flex items-center 
                       justify-center gap-2 ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-[#148359] text-white hover:bg-slate-50 hover:text-[#148359] hover:ring-2 hover:ring-[#148359]'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center mt-6 text-sm sm:text-base text-gray-600">
              Don`t have an account?{" "}
              <Link
                className="text-[#148359] hover:text-[#0f6b47] font-medium underline 
                         transition-colors duration-200"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}