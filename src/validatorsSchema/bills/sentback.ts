import * as Yup from "yup";

export const sentBackSchema = Yup.object().shape({
  title: Yup.string().required("Write something"),
});
