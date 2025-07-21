import * as yup from "yup";

const updateProfileSchema = yup.object({
  email: yup.string().email().required("Please provide a valid email"),
  first_name: yup.string().required("Provide first name"),
  last_name: yup.string().required("Provide last Name"),
  personal_info: yup.object({
    father_name: yup.string().nullable(),
    mother_name: yup.string().nullable(),
    gender: yup.string().nullable(),
    marital_status: yup.string().nullable(),
    blood_group: yup.string().nullable(),
    dob: yup.string().nullable("Enter Date of Birth"),
    nationality: yup.string().required(" Bangladesh?"),
    present_address: yup
      .string()
      .required()
      .min(20, "Present Address should be min 20 characters")
      .max(255, "Present Address cannot exceed 255 characters"),

    permanent_address: yup
      .string()
      .required()
      .min(20, "Permanent Address should be min 20 characters")
      .max(255, "Permanent Address cannot exceed 255 characters"),
    employment_address: yup
      .string()
      .required()
      .min(20, "Employment details should be min 20 characters")
      .max(255, "Employment details cannot exceed 255 characters"),
    phone_number: yup
      .string()
      .required("Eleven Digit")
      .matches(/^\d{11}$/, "Phone number must be 11 digits"),
  }),
  member_info: yup.object({
    short_bio: yup
      .string()
      .required()
      .min(250, "Min 150 characters")
      .max(455, "Can not exceed 255 characters"),
  }),
  // qualifications: yup.array().of(yup.object()).nullable(),
  // experiences_info: yup.array().of(yup.object()).nullable(),
});
export default updateProfileSchema;
