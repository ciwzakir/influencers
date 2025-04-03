import * as yup from "yup";

const updateProfileSchema = yup.object().shape({
  // email: yup.string().email("Invalid email format"),
  // first_name: yup.string().required("First Name is required"),
  // last_name: yup.string().required("First Name is required"),
  member_info: yup.object().shape({
    short_bio: yup
      .string()
      .required("Short bio is required")
      .test("min-words", "Short bio must be at least 80 words", (value) => {
        // Return true if the value is not provided (for required check) or if it has 50 or more words
        return !value || value.trim().split(/\s+/).length >= 50;
      })
      .test("max-words", "Short bio must be 230 words or fewer", (value) => {
        // Return true if the value is not provided (for required check) or if it has 100 or fewer words
        return !value || value.trim().split(/\s+/).length <= 150;
      }),
    share: yup.number().required("share is required").positive(),
  }),

  // personal_info: yup.object().shape({
  //   father_name: yup.string().required(),
  //   mother_name: yup.string().required(),
  //   gender: yup.string().oneOf(["male", "female"]).required(),
  //   marital_status: yup.string().required(),
  //   blood_group: yup.string().required(),
  //   dob: yup.date().required(),
  //   nationality: yup.string().required(),
  //   present_address: yup
  //     .string()
  //     .required()
  //     .min(20, "Present Address cannot exceed 20 characters")
  //     .max(255, "Present Address cannot exceed 255 characters"),

  //   permanent_address: yup
  //     .string()
  //     .required()
  //     .min(20, "Permanent Address cannot exceed 20 characters")
  //     .max(255, "Permanent Address cannot exceed 255 characters"),
  //   employment_address: yup
  //     .string()
  //     .required()
  //     .min(20, "Employment details cannot exceed 20 characters")
  //     .max(255, "Employment details cannot exceed 255 characters"),
  //   phone_number: yup
  //     .string()
  //     .required()
  //     .matches(/^\d{11}$/, "Phone number must be 11 digits"),
  // }),

  // qualifications: yup.array().of(
  //   yup.object().shape({
  //     certification: yup.string().required(),
  //     institute_name: yup.string().required(),
  //     graduation_year: yup.number().integer().positive().required(),
  //   })
  // ),

  // experiences_info: yup.array().of(
  //   yup.object().shape({
  //     experiences: yup
  //       .string()
  //       .required()
  //       .test("min-words", "Your plan must be at least 30 words", (value) => {
  //         // Return true if the value is not provided (for required check) or if it has 50 or more words
  //         return !value || value.trim().split(/\s+/).length >= 30;
  //       })
  //       .test("max-words", "Your plan must be 70 words or fewer", (value) => {
  //         // Return true if the value is not provided (for required check) or if it has 100 or fewer words
  //         return !value || value.trim().split(/\s+/).length <= 70;
  //       }),
  //   })
  // ),
});

export default updateProfileSchema;
