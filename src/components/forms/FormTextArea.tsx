import { getErrorMessageByPropertyName } from "@/utils/input.form.validators";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaProps = {
  name: string;
  label?: string;
  rows?: number;
  placeholder?: string;
};

const FormTextArea = ({ name, label, rows, placeholder }: TextAreaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Use getErrorMessageByPropertyName to handle nested paths
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className="flex flex-col w-full">
      {label && <label>{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input.TextArea {...field} rows={rows} placeholder={placeholder} />
        )}
      />
      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
    </div>
  );
};

export default FormTextArea;
