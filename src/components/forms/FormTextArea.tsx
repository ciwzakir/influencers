"use client";
import { Input } from "antd";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";

const { TextArea } = Input;

interface ITextArea<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  style?: React.CSSProperties;
  // Add other props you need
}

const FormTextArea = <T extends FieldValues>({
  name,
  rows = 4,
  placeholder,
  label,
}: ITextArea<T>) => {
  const { control } = useFormContext<T>();

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "8px" }}>{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextArea
              {...field}
              rows={rows}
              placeholder={placeholder}
              status={error ? "error" : ""}
            />
            {error && (
              <div style={{ color: "red", marginTop: "4px" }}>
                {error.message}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FormTextArea;
