import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupSchema } from "../Schemas/index.jsx";

import '../index.css';

const onSubmit = async (values, actions, navigate) => {
  console.log(values);

  // Save the signup data in localStorage
  localStorage.setItem("userData", JSON.stringify(values));

  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
  alert("Signup successful!");

  // Redirect to login page
  navigate('/login');
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
    <div className="text-center p-7">
      <h1 className="text-4xl font-sans font-bold text-[#148359]">Archievo</h1>
      <p className="p-4 text-xl">Join hundreds of users set and achieve their goals with ease.</p>

      <form onSubmit={handleSubmit} className="flex flex-col justify-self-center mt-6 text-left w-[450px] p-10 shadow-lg">
        <h1 className="text-[#148359] font-bold text-3xl mb-5">Signup</h1>

        <label className="pt-2" htmlFor="name">Username:</label>
        <input value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-1 mt-2 rounded-md border-2 border-[#148359] ${errors.name && touched.name ? 'outline-red-500' : 'outline-[#148359]'}`}
          type="text" name="name" id="name" />
        {errors.name && touched.name && <p className="error">{errors.name}</p>}

        <label className="pt-2" htmlFor="email">Email Address:</label>
        <input value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-1 mt-2 rounded-md border-2 border-[#148359] ${errors.email && touched.email ? 'outline-red-500' : 'outline-[#148359]'}`}
          type="email" name="email" id="email" />
        {errors.email && touched.email && <p className="error">{errors.email}</p>}

        <label className="pt-2" htmlFor="password">Password:</label>
        <input value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-1 mt-2 rounded-md border-2 border-[#148359] ${errors.password && touched.password ? 'outline-red-500' : 'outline-[#148359]'}`}
          type="password" name="password" id="password" />
        {errors.password && touched.password && <p className="error">{errors.password}</p>}

        <button disabled={isSubmitting} type="submit"
          className="bg-[#148359] p-2 rounded-sm hover:bg-slate-50 hover:text-[#148359] transition-all duration-150 ease-in-out font-semibold mt-8 text-white">
          Signup
        </button>
        <p className="text-center mt-4">Already have an account? <Link className="text-blue-500" to='/login'>Login</Link></p>
      </form>
    </div>
  );
}
