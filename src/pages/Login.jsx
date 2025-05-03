import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err.message);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="text-center p-7">
      <h1 className="text-4xl font-sans font-bold text-[#148359]">Archievo</h1>
      <p className="p-4 text-xl">Join hundreds of users set and achieve their goals with ease.</p>

      <form onSubmit={handleLogin} className="flex flex-col justify-self-center mt-6 text-left w-[450px] p-10 shadow-lg">
        <h1 className="text-[#148359] font-bold text-3xl mb-5">Login</h1>



        <label className="pt-2" htmlFor="email">Email Address:</label>
        <input
          className="ring-2 outline-[#148359] ring-[#148359] rounded-sm p-1 mt-2"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="pt-2" htmlFor="password">Password:</label>
        <input
          className="ring-2 outline-[#148359] ring-[#148359] rounded-sm p-1 mt-2"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button
          type="submit"
          className="bg-[#148359] p-2 rounded-sm hover:bg-slate-50 hover:text-[#148359] 
          transition-all duration-150 ease-in-out font-semibold mt-5 text-white">
          Login
        </button>
        <p className="text-center mt-4">
          Don’t have an account? <Link className="text-blue-500" to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
