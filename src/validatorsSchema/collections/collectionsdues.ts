import * as yup from "yup";

const updateDuesSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(10, "Must be at least 10 characters")
    .max(55, "Cannot exceed 55 characters"),

  payment_image: yup
    .mixed()
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || !(value instanceof File)) return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    })
    .test("fileSize", "File is too large", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 2 * 1024 * 1024;
    }),

  references: yup
    .string()
    .required("Reference is required")
    .min(7, "Must be at least 7 characters")
    .max(55, "Cannot exceed 55 characters"),

  payment_method: yup
    .string()
    .required("Payment method is required")
    .min(7, "Must be at least 7 characters")
    .max(55, "Cannot exceed 55 characters"),

  transaction_date: yup.string().required("Transaction date is required"),
});

export default updateDuesSchema;
