// "use client";
// import React, { Suspense,  useState } from "react";
// import {
//   Collapse,

//   DatePicker,

//   Space,
//   Spin,
//   Divider,
//   Button,

//   message,

//   Col,
//   Row,
// } from "antd";
// import dayjs from "dayjs";
// import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
// import RETable from "@/components/ui/RETable";
// import { useExpensesWithFilterQuery } from "@/redux/api/expenseWithFilterApi";
// import { CSVLink } from "react-csv";
// import { usePDF } from "react-to-pdf";
// import { getUserInfo } from "@/app/services/auth.service";

// const { RangePicker } = DatePicker;
// const { userRole: role } = getUserInfo() as any;

// const ReturnAsPerCodePage = () => {
//   const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
//   const { data, isError, isLoading } = useExpensesWithFilterQuery(undefined);

//   const [dateRange, setDateRange] = useState<
//     [dayjs.Dayjs | null, dayjs.Dayjs | null]
//   >([null, null]);

//   const handleDateRangeChange = (payload: any) => {
//     console.log("handleDateRangeChange", payload);
//     setDateRange(payload);
//   };

//   const filteredExpense = data?.filter((element: any) => {
//     const startDate =
//       dateRange && dateRange[0]
//         ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss")
//         : null;
//     const endDate =
//       dateRange && dateRange[1]
//         ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss")
//         : null;

//     const dateRangeCondition =
//       !dateRange ||
//       (startDate &&
//         endDate &&
//         dayjs(element.updated_at).isAfter(startDate) &&
//         dayjs(element.updated_at).isBefore(endDate));

//     return dateRangeCondition;
//   });

//   let summaryYearlyReturnAsperCode: any[] = [];

//   filteredExpense?.reduce(function (res: any, value: any) {
//     if (!res[value.expenditure_code.id]) {
//       res[value.expenditure_code.id] = {
//         id: value.expenditure_code.id,
//         get_totals: 0, // Initialize to 0
//         get_income_tax: 0, // Initialize to 0
//         get_value_added_tax: 0, // Initialize to 0
//         get_paid_amount: 0, // Initialize to 0
//       };
//       summaryYearlyReturnAsperCode.push(res[value.expenditure_code.id]);
//     }

//     res[value.expenditure_code.id].expenditure_code = value?.expenditure_code;
//     res[value.expenditure_code.id].get_totals += parseFloat(
//       (value?.get_totals || 0.0).toFixed(2)
//     );
//     res[value.expenditure_code.id].get_income_tax += parseFloat(
//       (value?.get_income_tax || 0.0).toFixed(2)
//     );
//     res[value.expenditure_code.id].get_value_added_tax += parseFloat(
//       (value?.get_value_added_tax || 0.0).toFixed(2)
//     );
//     res[value.expenditure_code.id].get_paid_amount += parseFloat(
//       (value?.get_paid_amount || 0.0).toFixed(2)
//     );
//     return res;
//   }, {});

//   // Now, you should render your Ant Design Table using the processed data

//   const pageCount = async (): Promise<number> => {
//     if (summaryYearlyReturnAsperCode?.length >= 0) {
//       await summaryYearlyReturnAsperCode;
//       return summaryYearlyReturnAsperCode.length;
//     }
//     return 0;
//   };
//   // console.log(filteredExpense);
//   if (isLoading) return <Spin />;

//   console.log(filteredExpense);
//   if (isLoading) return <Spin />;

//   if (isError) return <p>Error : {isError}</p>;

//   const ColumnCodes = [
//     {
//       title: "Code ID",
//       dataIndex: "expenditure_code",
//       render: function (data: any) {
//         if (data) {
//           return data.id;
//         } else return "No Code Found";
//       },
//     },
//     {
//       title: "Full Code Name",
//       dataIndex: "expenditure_code",
//       render: function (data: any) {
//         if (data) {
//           return data.name;
//         } else return "No Code Found";
//       },
//     },
//     {
//       title: "Code Title",
//       dataIndex: "expenditure_code",
//       render: function (data: any) {
//         if (data) {
//           return data.heading;
//         } else return "No Code Found";
//       },
//     },

//     {
//       title: "Seven Digit",
//       dataIndex: "expenditure_code",
//       render: function (data: any) {
//         if (data) {
//           return data.seven_digit_code;
//         } else return "No address Found";
//       },
//     },

//     {
//       title: "Type",
//       dataIndex: "expenditure_code",
//       render: function (data: any) {
//         if (data && data.is_general) {
//           return <span style={{ color: "green" }}>General</span>;
//         } else {
//           return <span style={{ color: "red" }}>Special</span>;
//         }
//       },

//       sorter: (a: any, b: any) => {
//         // Extract the is_general property from the expenditure_code objects
//         const isGeneralA = a.expenditure_code?.is_general || false;
//         const isGeneralB = b.expenditure_code?.is_general || false;

//         // Compare the is_general properties
//         if (isGeneralA === isGeneralB) {
//           return 0;
//         } else if (isGeneralA) {
//           return 1; // General should appear after Special
//         } else {
//           return -1; // Special should appear before General
//         }
//       },
//     },

//     {
//       title: "Total Bill",
//       dataIndex: "get_totals",
//       key: "getTotals",
//       sorter: (a: any, b: any) => a.id - b.id,
//     },
//     {
//       title: "Income Tax",
//       dataIndex: "get_income_tax",
//       key: "incomeTax",
//       sorter: (a: any, b: any) => a.id - b.id,
//     },
//     {
//       title: "VAT",
//       dataIndex: "get_value_added_tax",
//       key: "vat",
//       sorter: (a: any, b: any) => a.id - b.id,
//     },
//     {
//       title: "Paid",
//       dataIndex: "get_paid_amount",
//       key: "paidAmount",
//       sorter: (a: any, b: any) => a.id - b.id,
//     },
//   ];

//   const exportData = summaryYearlyReturnAsperCode?.map((expense) => {
//     return {
//       "Code Id": expense.expenditure_code?.id || "No Code Found",
//       "Full Code": expense.expenditure_code?.name || "No Code Found",
//       "Code Title": expense.expenditure_code?.heading || "No Code Found",
//       "Economic Code":
//         expense.expenditure_code?.seven_digit_code || "No Code Found",

//       Type: expense.expenditure_code?.is_general ? "General" : "Special",

//       "Total Bill": parseFloat(expense.get_totals || 0).toFixed(2),

//       "Income Tax": parseFloat(expense.get_income_tax || 0).toFixed(2),

//       VAT: parseFloat(expense.get_value_added_tax || 0).toFixed(2),
//       Paid: parseFloat(expense.get_paid_amount || 0).toFixed(2),
//     };
//   });

//   return (
//     <>
//       <div className="main" style={{ margin: "20px" }}>
//         <div className="bread-cumb">
//           <Suspense fallback={<Spin />}>
//             <UMBreadCrumb
//               items={[
//                 {
//                   label: " Yearly Return as  Company",
//                   link: `/${role}/expense/year/company`,
//                 },
//               ]}
//             />
//           </Suspense>
//         </div>
//         <div
//           className="sub__div--style"
//           style={{ justifyContent: "space-between", display: "flex" }}
//         ></div>

//         <Row>
//           <Col flex="1 1 200px" style={{ margin: "20px", textAlign: "center" }}>
//             <div
//               className="content-section"
//               ref={targetRef}
//               style={{
//                 marginTop: "30px",
//                 padding: "100px 70px 70px 100px",
//               }}
//             >
//               <h1>Return as per Codes</h1>

//               <p style={{ fontSize: "16px" }}>
//                 {dateRange && dateRange[0] && dateRange[1] ? (
//                   <>
//                     From {dateRange[0].format("DD MMMM YYYY")}
//                     <span style={{ margin: "0 5px" }}>to</span>
//                     {dateRange[1].format("DD MMMM YYYY")}
//                   </>
//                 ) : (
//                   ""
//                 )}
//               </p>
//               <Suspense fallback={<Spin />}>
//                 <RETable
//                   loading={false}
//                   columns={ColumnCodes}
//                   dataSource={summaryYearlyReturnAsperCode}
//                   pageSize={40}
//                   total={50}
//                   // total={pageCount}
//                   //   showSizeChanger={true}
//                   //   onChangeOfPagintion={onPaginationChange}
//                   //   onChangeTable={onTableChange}
//                   showPagination={true}
//                 ></RETable>
//               </Suspense>
//             </div>
//             <div
//               className="download"
//               style={{ textAlign: "right", paddingRight: "100px" }}
//             >
//               <Button
//                 type="primary"
//                 style={{ marginRight: "10px" }}
//                 ghost
//                 onClick={() => toPDF()}
//               >
//                 Download PDF
//               </Button>
//               <CSVLink
//                 filename={"Expense_Table.csv"}
//                 data={exportData}
//                 className="btn btn-primary"
//                 onClick={() => {
//                   message.success("The file is downloading");
//                 }}
//               >
//                 <Button type="primary" ghost>
//                   Download Excel
//                 </Button>
//               </CSVLink>
//             </div>
//           </Col>

//           <Col flex="0 1 300px">
//             <h2 style={{ margin: "30px 0" }}> Search and Filter Data</h2>

//             <div className="accordions">
//               <Divider orientation="left">Default Size</Divider>

//               <Collapse
//                 style={{ marginBottom: "5px" }}
//                 items={[
//                   {
//                     key: "6",
//                     label: "Filter By Date Range",
//                     children: (
//                       <Col>
//                         <h3 style={{ margin: "30px 0" }}>
//                           Filter By Date Range
//                         </h3>
//                         <Space direction="vertical" size={12}>
//                           <RangePicker
//                             showTime
//                             onChange={(e) => handleDateRangeChange(e)}
//                           />
//                         </Space>
//                       </Col>
//                     ),
//                   },
//                 ]}
//               />
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// };

// export default ReturnAsPerCodePage;
