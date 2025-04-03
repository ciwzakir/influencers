import { DatePicker, DatePickerProps } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";

dayjs.locale("en");

type UTDatePickerProps = {
  onChange?: (valOne: Dayjs | null, valTwo: string) => void;
  name: string;
  label?: string;
  size?: "large" | "small";
};

const FormDatePicker = ({
  name,
  label,
  onChange,
  size = "large",
}: UTDatePickerProps) => {
  const { control, setValue } = useFormContext();

  const handleOnChange: DatePickerProps["onChange"] = (date) => {
    if (onChange && date) {
      onChange(date, date.format("YYYY-MM-DD"));
    }

    // Format the date to "YYYY-MM-DD" before setting the value
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;

    setValue(name, formattedDate);
    console.log("formattedDate", formattedDate); // Confirm the format in console
  };

  return (
    <div>
      {label && <label>{label}</label>}
      <br />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            size={size}
            onChange={handleOnChange}
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
          />
        )}
      />
    </div>
  );
};

export default FormDatePicker;
