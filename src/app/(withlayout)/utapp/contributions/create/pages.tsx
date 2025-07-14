// "use client";

// import { Button, Card, Col, Row, Typography, message } from "antd";
// import { SubmitHandler } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import FormInput from "@/components/forms/FormInput";
// import Form from "@/components/forms/Form";
// import FormSelectField from "@/components/forms/FormSelectFields";
// import { getUserInfo } from "@/app/services/auth.service";
// import { useCreateSingleMonthlyRatesMutation } from "@/redux/api/uttoronapi/contribution-rates";
// import { finYearOptions, monthOptions } from "@/constants/selectOptions";

// const { Title } = Typography;

// type Inputs = {
//   name: string;
//   contribution_amount: number;
//   fiscal_year_name: string;
//   contribution_month_name: string;
// };

// const CreateSubscriptionRates = () => {
//   const router = useRouter();
//   const userInfo = getUserInfo() as any;
//   const role = userInfo?.user_role ?? "utapp";
//   const [createSingleMonthlyRates, { isError, isLoading, isSuccess }] =
//     useCreateSingleMonthlyRatesMutation();

//   useEffect(() => {
//     if (isSuccess) {
//       message.success("Subscription Rates updated successfully.");
//       router.push(`/${role}/contributions`);
//     }
//     if (isError) {
//       message.error("Failed to Create Subscription.");
//     }
//   }, [isSuccess, isError, router, role]);

//   const onSubmit: SubmitHandler<Inputs> = async (values) => {
//     console.log(values);
//     try {
//       await createSingleMonthlyRates({
//         data: {
//           name: values.name,
//           contribution_amount: Number(values.contribution_amount), // Ensure it's a number
//           fiscal_year_name: values.fiscal_year_name,
//           contribution_month_name: values.contribution_month_name,
//         },
//       }).unwrap();
//     } catch (error) {
//       console.error("Creating failed:", error);
//     }
//   };

//   return (
//     <div className="px-6 py-6 max-w-5xl mx-auto">
//       <Card bordered={false} className="shadow-md rounded-md">
//         <div className="text-center mb-6">
//           <Title level={3} className="text-blue-600">
//             Update Subscription Rates
//           </Title>
//         </div>

//         <Form submitHandler={onSubmit}>
//           <Row gutter={[24, 16]}>
//             <Col xs={24} md={12}>
//               <FormInput name="name" label="Month Name" size="large" />
//             </Col>

//             <Col xs={24} md={12}>
//               <FormInput
//                 name="contribution_amount"
//                 label="Contribution Amount"
//                 size="large"
//                 type="number"
//               />
//             </Col>

//             <Col xs={24} md={12}>
//               <FormSelectField
//                 name="fiscal_year_name"
//                 label="Financial Year"
//                 options={finYearOptions}
//                 placeholder="Select"
//                 size="large"
//               />
//             </Col>

//             <Col xs={24} md={12}>
//               <FormSelectField
//                 name="contribution_month_name"
//                 label="Subscription Month"
//                 options={monthOptions}
//                 placeholder="Select"
//                 size="large"
//               />
//             </Col>

//             <Col xs={24} className="text-right">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={isLoading}
//                 size="large"
//                 className="mt-4 w-52 h-11 rounded font-semibold"
//               >
//                 {isLoading ? "Updating..." : "Create Subscription Rate"}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default CreateSubscriptionRates;
