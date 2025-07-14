// import { useFieldArray, useFormContext } from "react-hook-form";
// import { Button, Col, Empty, Row } from "antd";
// import FormSelectField from "./FormSelectFields";
// import FormInput from "./FormInput";
// import {
//   graduationYearOptions,
//   qualificationOptions,
// } from "@/constants/selectOptions";

// const EdnFormDynamicFields: React.FC = () => {
//   const { control } = useFormContext();

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "qualifications",
//   });

//   return (
//     <>
//       <div>
//         {fields.length > 0 ? (
//           fields.map((item, index) => {
//             return (
//               <div
//                 key={item.id}
//                 style={{
//                   marginBottom: "5px",
//                   padding: "20px",
//                   border: "1px solid #d9d9d9",
//                   borderRadius: "5px",
//                 }}
//               >
//                 <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//                   <Col
//                     className="gutter-row"
//                     span={8}
//                     style={{ marginBottom: "10px" }}
//                   >
//                     <FormSelectField
//                       size="large"
//                       name={`qualifications.${index}.certification`}
//                       options={qualificationOptions}
//                       label="Qualification"
//                       placeholder="Select"
//                     />
//                   </Col>
//                   <Col
//                     className="gutter-row"
//                     span={8}
//                     style={{ marginBottom: "10px" }}
//                   >
//                     <FormSelectField
//                       size="large"
//                       name={`qualifications.${index}.graduation_year`}
//                       options={graduationYearOptions}
//                       label="Graduation Year"
//                       placeholder="Select"
//                     />
//                   </Col>
//                   <Col
//                     className="gutter-row"
//                     span={8}
//                     style={{ marginBottom: "10px" }}
//                   >
//                     <FormInput
//                       type="text"
//                       name={`qualifications.${index}.institute_name`}
//                       size="large"
//                       label="Institute"
//                     />
//                   </Col>
//                 </Row>

//                 <Button
//                   type="primary"
//                   onClick={() => remove(index)}
//                   danger
//                   style={{ margin: "5px 0px" }}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             );
//           })
//         ) : (
//           <Empty description="Not found" />
//         )}
//       </div>
//       <div style={{ textAlign: "center" }}>
//         <Button type="primary" onClick={() => append({})}>
//           Add More
//         </Button>
//       </div>
//     </>
//   );
// };

// export default EdnFormDynamicFields;
