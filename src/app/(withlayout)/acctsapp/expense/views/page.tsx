"use client";
import React, { Suspense, useRef, useState } from "react";
import {
  Collapse,
  DatePicker,
  Space,
  Spin,
  Divider,
  Button,
  message,
  Checkbox,
  Col,
  Row,
} from "antd";

import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { useGetExpensesQuery } from "@/redux/api/expenseApi";
import RETable from "@/components/ui/RETable";
import { CSVLink } from "react-csv";
import { useGetFinancialYearQuery } from "@/redux/api/fiscal-year";
import { getUserInfo } from "@/app/services/auth.service";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";

const { RangePicker } = DatePicker;
const userInfo = getUserInfo() as any;
const role = userInfo?.userRole ?? "superuser"; // Provide a fallback

const ExpensePage = () => {
  interface FiscalYear {
    id: string;
    fiscal_year: string;
  }

  interface Element {
    fiscal_year?: FiscalYear | null;
    is_cheque?: boolean;
    is_published?: boolean;
    updated_at?: string;
  }
  const componentRef = useRef<any>();
  const { data, isError, isLoading } = useGetExpensesQuery(undefined);
  const { data: getFinancialYear } = useGetFinancialYearQuery(undefined);
  // console.log("getFinancialYear", getFinancialYear);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  const [showPaidBuyCheque, setShowPaidBuyCheque] = useState(false);
  const [currentStatusOfBill, setCurrentStatusOfBill] = useState(false);

  const [selectFiscalYear, setSelectFiscalYear] = useState([]);

  // console.log("dateRange", dateRange);
  const handleDateRangeChange = (payload: any) => {
    // console.log("handleDateRangeChange", payload);
    setDateRange(payload);
  };

  const handlePaidBuyChequeChange = (checked: any) => {
    setShowPaidBuyCheque(checked);
  };

  const handleCurrentStatusOfBill = (checked: any) => {
    setCurrentStatusOfBill(checked);
  };

  const handleFiscalYearChange = (checkedValues: any) => {
    setSelectFiscalYear(checkedValues);
  };

  const filteredExpense = data?.filter((element: Element) => {
    const startDate =
      dateRange && dateRange[0]
        ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    const endDate =
      dateRange && dateRange[1]
        ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;

    // Check if startDate and endDate are valid before using them
    const dateRangeCondition =
      !dateRange ||
      (startDate &&
        endDate &&
        dayjs(element.updated_at).isAfter(startDate) &&
        dayjs(element.updated_at).isBefore(endDate));

    const showPaidBuyChequeCondition = showPaidBuyCheque
      ? element.is_cheque === true
      : true;
    const currentStatusOfBillCondition = currentStatusOfBill
      ? element.is_published === true
      : true;
    const fiscalYearCondition =
      selectFiscalYear.length === 0 ||
      (element?.fiscal_year &&
        // @ts-expect-error - React 18 types conflict with our HOC (TODO: Remove after upgrade)
        selectFiscalYear.includes(element?.fiscal_year?.id));
    return (
      fiscalYearCondition &&
      dateRangeCondition &&
      showPaidBuyChequeCondition &&
      currentStatusOfBillCondition
    );
  });

  const columns = [
    {
      title: "Expenditure Code",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data) {
          return data.name;
        } else return "No Code Found";
      },
    },
    {
      title: "Code Full Name",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data) {
          return data.seven_digit_code;
        } else return "No Code Found";
      },
    },
    {
      title: "Code Full Name",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data) {
          return data.heading;
        } else return "No Code Found";
      },
    },

    {
      title: " Code Type",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data && data.is_general) {
          return <span style={{ color: "green" }}>General</span>;
        } else {
          return <span style={{ color: "red" }}>Special</span>;
        }
      },
      sorter: (a: any, b: any) => {
        // Extract the is_general property from the expenditure_code objects
        const isGeneralA = a.expenditure_code?.is_general || false;
        const isGeneralB = b.expenditure_code?.is_general || false;

        // Compare the is_general properties
        if (isGeneralA === isGeneralB) {
          return 0;
        } else if (isGeneralA) {
          return 1; // General should appear after Special
        } else {
          return -1; // Special should appear before General
        }
      },
    },

    {
      title: "Supplier",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.name;
        } else return "No Supplier Found";
      },
    },
    {
      title: "Total Bill",
      dataIndex: "get_totals",
      key: "getTotals",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Income Tax",
      dataIndex: "get_income_tax",
      key: "incomeTax",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "VAT",
      dataIndex: "get_value_added_tax",
      key: "vat",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Paid",
      dataIndex: "get_paid_amount",
      key: "paidAmount",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Payment Method",
      dataIndex: "is_cheque",
      render: function (data: any) {
        if (data === true) {
          return (
            <div className="" style={{ color: "green" }}>
              Cheque
            </div>
          );
        } else
          return (
            <div className="" style={{ color: "purple" }}>
              Cash
            </div>
          );
      },
    },
    {
      title: "Bill Current Status",
      dataIndex: "is_published",
      render: function (data: any) {
        if (data === true) {
          return (
            <div className="" style={{ color: "green" }}>
              Published
            </div>
          );
        } else
          return (
            <div className="" style={{ color: "red" }}>
              Draft
            </div>
          );
      },
    },

    // {
    //   title: "Updated At",
    //   dataIndex: "updated_at",
    //   render: function (data: any) {
    //     if (data) {
    //       return dayjs(data).format("DD MMM YYYY HH:mm:ss");
    //     } else {
    //       return "Invalid date";
    //     }
    //   },
    //   sorter: (a: any, b: any) => a.createdAt - b.createdAt,
    // },

    {
      title: "Actions",
      render: (data: any) => {
        return (
          <div className="action-div">
            <Link href={`/${role}/expense/edit/${data.id}`}>
              <Button type="primary" ghost style={{ marginRight: "10px" }}>
                <EyeOutlined /> Proceed to Pay
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onPaginationChange = (page: number, pageSize: number) => {
  //   // console.log("Page:", page, "PageSize:", pageSize);
  //   // setPage(page);
  //   // setSize(pageSize);
  // };
  // const onTableChange = (pagination: any, filter: any, sorter: any) => {
  //   const { order, field } = sorter;
  //   // console.log(order, field);
  //   setSortBy(field as string);
  //   setSortOrder(order === "ascend" ? "asc" : "desc");
  // };

  if (isLoading) return <Spin />;

  if (isError) return <p>Error : {isError}</p>;

  const pageCount = (): number => {
    return filteredExpense?.length || 0;
  };

  const exportData = filteredExpense?.map((expense: any) => {
    return {
      "Expenditure Code": expense.expenditure_code?.name || "No Code Found",
      "Code Full Name":
        expense.expenditure_code?.seven_digit_code || "No Code Found",
      Type: expense.expenditure_code?.is_general ? "General" : "Special",
      Supplier: expense.item_supplier?.name || "No Supplier Found",
      "Total Bill": expense.get_totals || 0,
      "Income Tax": expense.get_income_tax || 0,
      VAT: expense.get_value_added_tax || 0,
      Paid: expense.get_paid_amount || 0,
      "Payment Method": expense.is_cheque ? "Cheque" : "Cash",
      "Bill Current Status": expense.is_published ? "Published" : "Draft",
      "Updated At": dayjs(expense.updated_at).format("DD MMM YYYY HH:mm:ss"),
    };
  });

  return (
    <>
      <div className="main" style={{ margin: "20px" }}>
        <div className="bread-cumb">
          <Suspense fallback={<Spin />}>
            <UMBreadCrumb
              items={[
                {
                  label: "Edit",
                  link: `/${role}/expense/edit`,
                },
                {
                  label: "Asper Codes",
                  link: `/${role}/expense/codes`,
                },
                {
                  label: "as per suppliers",
                  link: `/${role}/expense/suppliers`,
                },

                {
                  label: "Draft Bill",
                  link: `/${role}/expense/suppliers/draft`,
                },
              ]}
            />
          </Suspense>
        </div>

        <div
          className="sub__div--style"
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <Link href={`/${role}/products/create`}>
            <Button type="primary">Add New </Button>
          </Link>
        </div>

        <Row>
          <Col flex="1 1 200px" style={{ marginRight: "15px" }}>
            <div style={{ textAlign: "right" }}></div>
            <div className="content-section">
              <h1> Regular Bills</h1>
              <div className="download" style={{ textAlign: "right" }}>
                <CSVLink
                  filename={"Expense_Table.csv"}
                  data={exportData}
                  className="btn btn-primary"
                  onClick={() => {
                    message.success("The file is downloading");
                  }}
                >
                  <Button type="primary" ghost>
                    Download Excel
                  </Button>
                </CSVLink>
              </div>
              <Suspense fallback={<Spin />}>
                <RETable
                  loading={false}
                  columns={columns}
                  dataSource={filteredExpense}
                  pageSize={10}
                  // total={count}
                  total={pageCount()}
                  showSizeChanger={true}
                  // onChangeOfPagintion={onPaginationChange}
                  // onChangeTable={onTableChange}
                  showPagination={true}
                  // @ts-expect-error - React 18 types conflict with our HOC (TODO: Remove after upgrade)
                  defaultExpandAllRows={true}
                  ref={componentRef}
                ></RETable>
              </Suspense>
            </div>
          </Col>

          <Col flex="0 1 300px">
            <h2 style={{ margin: "30px 0" }}> Search and Filter Data</h2>

            <div className="accordions">
              <Divider orientation="left">Default Size</Divider>

              <Collapse
                style={{ marginBottom: "5px" }}
                items={[
                  {
                    key: "6",
                    label: "Filter By Date Range",
                    children: (
                      <Col>
                        <h3 style={{ margin: "30px 0" }}>
                          Filter By Date Range
                        </h3>
                        <Space direction="vertical" size={12}>
                          <RangePicker
                            showTime
                            onChange={(e) => handleDateRangeChange(e)}
                          />
                        </Space>
                      </Col>
                    ),
                  },
                ]}
              />

              <Collapse
                style={{ marginBottom: "5px" }}
                items={[
                  {
                    key: "1",
                    label: " Payment Method",
                    children: (
                      <Checkbox
                        checked={showPaidBuyCheque}
                        onChange={(e) =>
                          handlePaidBuyChequeChange(e.target.checked)
                        }
                      >
                        Show Cheque Paid Only
                      </Checkbox>
                    ),
                  },
                ]}
              />

              <Collapse
                style={{ marginBottom: "5px" }}
                items={[
                  {
                    key: "3",
                    label: "Filter By Fiscal Year",
                    children: (
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={handleFiscalYearChange}
                      >
                        <Row>
                          {getFinancialYear?.map((financialYear: any) => (
                            <Col span={8} key={financialYear?.id}>
                              <Checkbox value={financialYear?.id}>
                                {financialYear?.fiscal_year}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    ),
                  },
                ]}
              />
              <Collapse
                style={{ marginBottom: "5px" }}
                items={[
                  {
                    key: "2",
                    label: "Draft",
                    children: (
                      <Checkbox
                        checked={currentStatusOfBill}
                        onChange={(e) =>
                          handleCurrentStatusOfBill(e.target.checked)
                        }
                      >
                        Exclude Draft
                      </Checkbox>
                    ),
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ExpensePage;
