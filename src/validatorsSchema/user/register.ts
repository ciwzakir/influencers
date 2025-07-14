import * as yup from "yup";

export const registerUserSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  password: yup.string().min(6).required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
