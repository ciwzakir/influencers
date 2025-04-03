// import { Checkbox } from "antd";
// import { useFormContext, Controller } from "react-hook-form";

// type CheckboxFieldProps = {
//   name: string;
//   label?: string;
//   checked?: boolean;
//   defaultChecked?: boolean;
//   handleChange?: (checked: boolean) => void;
// };

// const FormCheckboxField = ({
//   name,
//   label,
//   checked,
//   defaultChecked,
//   handleChange,
// }: CheckboxFieldProps) => {
//   const { control } = useFormContext();

//   return (
//     <>
//       {label && <label>{label}</label>}
//       <Controller
//         control={control}
//         name={name}
//         render={({ field: { value, onChange } }) => (
//           <Checkbox
//             checked={checked}
//             defaultChecked={defaultChecked}
//             onChange={
//               handleChange ? (e) => handleChange(e.target.checked) : onChange
//             }
//           />
//         )}
//       />
//     </>
//   );
// };

// export default FormCheckboxField;
