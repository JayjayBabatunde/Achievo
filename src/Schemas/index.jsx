import * as yup from 'yup';
// import { object, string, number, date, InferType } from 'yup';
const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5,}$/;

export const SignupSchema = yup.object().shape({
    name: yup.string().min(2, 'Name must be at least 2 characters').matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces').required('Required'),
    email: yup.string().email("Pls enter a valid email").required("Required"),
    password: yup.string().min(5).matches(passwordRules, {message: 'Password must contain uppercase, lowercase and numbers'}).required('Required'),
});