// import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
// import { Button, message, Steps } from "antd";
// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";

// interface ISteps {
//   title?: string;
//   content?: React.ReactElement | React.ReactNode;
// }

// interface IStepsProps {
//   steps: ISteps[];
//   persistKey: string;
//   submitHandler: (el: any) => void;
//   defaultValues?: any;
//   validationSchema?: any;
// }

// const StepperForm = ({
//   steps,
//   submitHandler,
//   defaultValues,
//   persistKey,
//   validationSchema,
// }: IStepsProps) => {
//   const [current, setCurrent] = useState<number>(
//     !!getFromLocalStorage("step")
//       ? Number(JSON.parse(getFromLocalStorage("step") as string).step)
//       : 0
//   );

//   const [savedValues] = useState(
//     !!getFromLocalStorage(persistKey)
//       ? JSON.parse(getFromLocalStorage(persistKey) as string)
//       : defaultValues // Use default values if nothing is saved
//   );

//   const methods = useForm({
//     defaultValues: savedValues,
//     resolver: yupResolver(validationSchema),
//   });

//   // Update local storage with current step
//   useEffect(() => {
//     setToLocalStorage("step", JSON.stringify({ step: current }));
//   }, [current]);

//   // Update local storage with form values
//   useEffect(() => {
//     const watch = methods.watch();
//     setToLocalStorage(persistKey, JSON.stringify(watch));
//   }, [persistKey, methods]);

//   const next = () => {
//     setCurrent(current + 1);
//   };

//   const prev = () => {
//     setCurrent(current - 1);
//   };

//   const items = steps.map((item) => ({ key: item.title, title: item.title }));

//   const { handleSubmit, reset } = methods;

//   const handleUserDataOnSubmit = (data: any) => {
//     submitHandler(data); // Pass form data to submit handler
//     reset(defaultValues); // Reset the form with default values
//     setToLocalStorage("step", JSON.stringify({ step: 0 })); // Reset step to 0
//     setToLocalStorage(persistKey, JSON.stringify({})); // Clear saved values
//   };

//   return (
//     <>
//       <Steps current={current} items={items} />
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(handleUserDataOnSubmit)}>
//           <div>{steps[current].content}</div>
//           <div style={{ marginTop: 24 }}>
//             {current < steps.length - 1 && (
//               <Button type="primary" onClick={next}>
//                 Next
//               </Button>
//             )}
//             {current === steps.length - 1 && (
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 onClick={() => message.success("Processing complete!")}
//               >
//                 Done
//               </Button>
//             )}
//             {current > 0 && (
//               <Button style={{ margin: "0 8px" }} onClick={prev}>
//                 Previous
//               </Button>
//             )}
//           </div>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default StepperForm;
