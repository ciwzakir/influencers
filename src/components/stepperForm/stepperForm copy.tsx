// "use client";

// import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
// import { Button, message, Steps } from "antd";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";

// interface ISteps {
//   title?: string;
//   content?:
//     | React.ReactElement
//     | React.ReactNode
//     | ((errors: any) => React.ReactElement | React.ReactNode);
// }

// interface IStepsProps {
//   steps: ISteps[];
//   persistKey: string;
//   submitHandler: (el: any) => void;
//   navigateLink?: string;
//   defaultValues?: any;
//   resolver?: any;
// }

// const StepperForm = ({
//   steps,
//   submitHandler,
//   navigateLink,
//   persistKey,
//   defaultValues = {},
//   resolver,
// }: IStepsProps) => {
//   const router = useRouter();

//   // State for current step
//   const [current, setCurrent] = useState<number>(
//     !!getFromLocalStorage("step")
//       ? Number(JSON.parse(getFromLocalStorage("step") as string).step)
//       : 0
//   );

//   // Load values from localStorage or fallback to defaultValues (from backend)
//   const persistedValue = getFromLocalStorage(persistKey);

//   let persistedValues = {};
//   if (persistedValue) {
//     try {
//       persistedValues = JSON.parse(persistedValue);
//     } catch (error) {
//       console.error("Error parsing persisted values:", error);
//       persistedValues = {}; // Fallback to empty object if parsing fails
//     }
//   }

//   // Merge persisted values from localStorage with defaultValues (backend)
//   const mergedValues = { ...defaultValues, ...persistedValues };

//   useEffect(() => {
//     setToLocalStorage("step", JSON.stringify({ step: current }));
//   }, [current]);

//   const next = () => {
//     setCurrent(current + 1);
//   };

//   const prev = () => {
//     setCurrent(current - 1);
//   };

//   const items = steps.map((item) => ({ key: item.title, title: item.title }));

//   // Initialize the form with the merged values (localStorage + backend)
//   const methods = useForm({
//     defaultValues: mergedValues, // Merged persisted + backend values
//     resolver, // Pass the resolver for validation
//   });

//   // Destructure formState to access errors
//   const {
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = methods;

//   // Persist form values in localStorage whenever they change
//   useEffect(() => {
//     setToLocalStorage(persistKey, JSON.stringify(watch));
//   }, [watch, persistKey]);

//   const handleStudentOnSubmit = (data: any) => {
//     submitHandler(data);
//     reset();
//     setToLocalStorage("step", JSON.stringify({ step: 0 }));
//     setToLocalStorage(persistKey, JSON.stringify({}));
//     if (navigateLink) {
//       router.push(navigateLink);
//     }
//   };

//   return (
//     <>
//       <Steps current={current} items={items} />
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(handleStudentOnSubmit)}>
//           <div>
//             {steps[current]?.content
//               ? typeof steps[current].content === "function"
//                 ? steps[current].content(errors)
//                 : steps[current].content
//               : null}
//           </div>
//           <div style={{ marginTop: 24 }}>
//             {current < steps.length - 1 && (
//               <Button type="primary" onClick={() => next()}>
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
//               <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
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
