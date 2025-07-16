"use client";
import React, { Suspense, useState } from "react";
import {
  Collapse,
  DatePicker,
  Space,
  Spin,
  Divider,
  Col,
  Row,
  Button,
  message,
} from "antd";
import { useExpensesWithFilterQuery } from "@/redux/api/expenseWithFilterApi";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import RETable from "@/components/ui/RETable";
import { getUserInfo } from "@/app/services/auth.service";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";

const { RangePicker } = DatePicker;
const userInfo = getUserInfo() as any;
const role = userInfo?.user_role ?? "acctentry";

const ReturnAsPerCompanyPage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "company.pdf" });
  const { data, isError, isLoading } = useExpensesWithFilterQuery(undefined);

  const [dateRange, setDateRange] = useState("");

  const handleDateRangeChange = (payload: any) => {
    setDateRange(payload);
    // console.log("setDateRange", payload);
  };

  const filteredExpense = data?.filter((element: any) => {
    const dateRangeCondition =
      !dateRange ||
      (element?.updated_at >= dateRange[0]?.valueOf() &&
        element?.updated_at <= dateRange[1]?.valueOf());

    return dateRangeCondition;
  });

  const summaryYearlyReturnAsperCompany: any[] = [];

  filteredExpense?.reduce(function (res: any, value: any) {
    if (!res[value.item_supplier.id]) {
      res[value.item_supplier.id] = {
        id: value.item_supplier.id,
        get_totals: 0, // Initialize to 0
        get_income_tax: 0, // Initialize to 0
        get_value_added_tax: 0, // Initialize to 0
        get_paid_amount: 0, // Initialize to 0
      };
      summaryYearlyReturnAsperCompany.push(res[value.item_supplier.id]);
    }
    res[value.item_supplier.id].item_supplier = value?.item_supplier;
    res[value.item_supplier.id].get_totals += value?.get_totals || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_income_tax += value?.get_income_tax || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_value_added_tax +=
      value?.get_value_added_tax || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_paid_amount += value?.get_paid_amount || 0; // Use || 0 to handle undefined
    return res;
  }, {});

  const pageCount = (): number => {
    return summaryYearlyReturnAsperCompany?.length || 0;
  };
  if (isLoading) return <Spin />;

  if (isError) return <p>Error : {isError}</p>;

  const filteredColumnForSuppliers = [
    {
      title: "Name",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.name;
        } else return "No Supplier Found";
      },
    },
    {
      title: "Tin No",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.tin_no;
        } else return "No address Found";
      },
    },
    {
      title: "VAT No",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.tin_no;
        } else return "No address Found";
      },
    },
    {
      title: "Address",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.address;
        } else return "No address Found";
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
  ];

  return (
    <>
      <div className="main" style={{ margin: "20px" }}>
        <div className="bread-cumb">
          <Suspense fallback={<Spin />}>
            <UMBreadCrumb
              items={[
                {
                  label: "Yearly Return as Codes",
                  link: `/${role}/expense/year/code`,
                },
              ]}
            />
          </Suspense>
        </div>
        <div
          className="sub__div--style"
          style={{ justifyContent: "space-between", display: "flex" }}
        ></div>

        <Row>
          <Col flex="1 1 200px" style={{ margin: "20px", textAlign: "center" }}>
            <div
              className="content-section"
              ref={targetRef}
              style={{ marginTop: "30px", padding: "70px" }}
            >
              <h1>Yearly Return as per Company</h1>
              <p style={{ fontSize: "16px" }}>
                Here Cash and Cheque all are included
              </p>
              <p></p>
              <Suspense fallback={<Spin />}>
                <RETable
                  loading={false}
                  columns={filteredColumnForSuppliers}
                  dataSource={summaryYearlyReturnAsperCompany}
                  pageSize={10}
                  // total={50}
                  total={pageCount()}
                  //   showSizeChanger={true}
                  //   onChangeOfPagintion={onPaginationChange}
                  //   onChangeTable={onTableChange}
                  showPagination={true}
                ></RETable>
              </Suspense>
            </div>
            <div style={{ textAlign: "right", paddingRight: "100px" }}>
              <Button
                type="primary"
                ghost
                onClick={() => toPDF()}
                style={{ marginRight: "10px" }}
              >
                Download PDF
              </Button>
              <CSVLink
                data={summaryYearlyReturnAsperCompany}
                filename="company_Table.csv"
                onClick={() => message.success("The file is downloading")}
              >
                <Button type="primary" ghost>
                  Download Excel
                </Button>
              </CSVLink>
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
                            // showTime
                            onChange={(e) => handleDateRangeChange(e)}
                          />
                        </Space>
                      </Col>
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

export default ReturnAsPerCompanyPage;
