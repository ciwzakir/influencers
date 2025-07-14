"use client";
import { Input } from "antd";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";

interface IInput<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  // Add other props you need
}

const FormInput = <T extends FieldValues>({
  name,
  type,
  size = "large",
  placeholder,
  label,
}: IInput<T>) => {
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
            {type === "password" ? (
              <Input.Password
                {...field}
                type={type}
                size={size}
                placeholder={placeholder}
                status={error ? "error" : ""}
              />
            ) : (
              <Input
                {...field}
                type={type}
                size={size}
                placeholder={placeholder}
                status={error ? "error" : ""}
              />
            )}
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

export default FormInput;
