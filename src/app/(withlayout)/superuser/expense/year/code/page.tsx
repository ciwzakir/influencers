"use client";
import React, { Suspense, useState } from "react";
import {
  Collapse,
  DatePicker,
  Space,
  Spin,
  Divider,
  Button,
  message,
  Col,
  Row,
} from "antd";
import dayjs from "dayjs";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import RETable from "@/components/ui/RETable";
import { useExpensesWithFilterQuery } from "@/redux/api/expenseWithFilterApi";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import { getUserInfo } from "@/app/services/auth.service";

const { RangePicker } = DatePicker;

const ReturnAsPerCodePage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { data, isError, isLoading } = useExpensesWithFilterQuery(undefined);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  const userInfo = getUserInfo() as any;
  const role = userInfo?.user_role ?? "superuser";

  const handleDateRangeChange = (payload: any) => {
    // console.log("handleDateRangeChange", payload);
    setDateRange(payload);
  };

  const filteredExpense = data?.filter((element: any) => {
    const startDate = dateRange?.[0]
      ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const endDate = dateRange?.[1]
      ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const dateRangeCondition =
      !dateRange ||
      (startDate &&
        endDate &&
        dayjs(element.updated_at).isAfter(startDate) &&
        dayjs(element.updated_at).isBefore(endDate));

    return dateRangeCondition;
  });

  const summaryYearlyReturnAsperCode = filteredExpense?.reduce(
    (acc: Record<string, any>, value: any) => {
      const codeId = value.expenditure_code.id;
      if (!acc[codeId]) {
        acc[codeId] = {
          id: codeId,
          expenditure_code: value.expenditure_code,
          get_totals: 0,
          get_income_tax: 0,
          get_value_added_tax: 0,
          get_paid_amount: 0,
        };
      }

      acc[codeId].get_totals += parseFloat((value?.get_totals || 0).toFixed(2));
      acc[codeId].get_income_tax += parseFloat(
        (value?.get_income_tax || 0).toFixed(2)
      );
      acc[codeId].get_value_added_tax += parseFloat(
        (value?.get_value_added_tax || 0).toFixed(2)
      );
      acc[codeId].get_paid_amount += parseFloat(
        (value?.get_paid_amount || 0).toFixed(2)
      );

      return acc;
    },
    {} as Record<string, any>
  );

  const processedData = summaryYearlyReturnAsperCode
    ? Object.values(summaryYearlyReturnAsperCode)
    : [];

  if (isLoading) return <Spin />;
  if (isError) return <p>Error : {isError}</p>;

  const ColumnCodes = [
    {
      title: "Code ID",
      dataIndex: "expenditure_code",
      render: (data: any) => data?.id || "No Code Found",
    },
    {
      title: "Full Code Name",
      dataIndex: "expenditure_code",
      render: (data: any) => data?.name || "No Code Found",
    },
    {
      title: "Code Title",
      dataIndex: "expenditure_code",
      render: (data: any) => data?.heading || "No Code Found",
    },
    {
      title: "Seven Digit",
      dataIndex: "expenditure_code",
      render: (data: any) => data?.seven_digit_code || "No Code Found",
    },
    {
      title: "Code Type",
      dataIndex: "expenditure_code",
      render: (data: any) => (
        <span style={{ color: data?.is_general ? "green" : "red" }}>
          {data?.is_general ? "General" : "Special"}
        </span>
      ),
      sorter: (a: any, b: any) => {
        const isGeneralA = a.expenditure_code?.is_general || false;
        const isGeneralB = b.expenditure_code?.is_general || false;
        return isGeneralA === isGeneralB ? 0 : isGeneralA ? 1 : -1;
      },
    },
    {
      title: "Total Bill",
      dataIndex: "get_totals",
      key: "getTotals",
    },
    {
      title: "Income Tax",
      dataIndex: "get_income_tax",
      key: "incomeTax",
    },
    {
      title: "VAT",
      dataIndex: "get_value_added_tax",
      key: "vat",
    },
    {
      title: "Paid",
      dataIndex: "get_paid_amount",
      key: "paidAmount",
    },
  ];

  const exportData = processedData.map((expense: any) => ({
    "Code Id": expense.expenditure_code?.id || "No Code Found",
    "Full Code": expense.expenditure_code?.name || "No Code Found",
    "Code Title": expense.expenditure_code?.heading || "No Code Found",
    "Economic Code":
      expense.expenditure_code?.seven_digit_code || "No Code Found",
    "Exp Type": expense.expenditure_code?.is_general ? "General" : "Special",
    "Total Bill": parseFloat(expense.get_totals || 0).toFixed(2),
    "Income Tax": parseFloat(expense.get_income_tax || 0).toFixed(2),
    VAT: parseFloat(expense.get_value_added_tax || 0).toFixed(2),
    Paid: parseFloat(expense.get_paid_amount || 0).toFixed(2),
  }));

  return (
    <div className="main" style={{ margin: "20px" }}>
      <div className="bread-cumb">
        <Suspense fallback={<Spin />}>
          <UMBreadCrumb
            items={[
              {
                label: "Yearly Return as Company",
                link: `/${role}/expense/year/company`,
              },
            ]}
          />
        </Suspense>
      </div>

      <Row>
        <Col flex="1 1 200px" style={{ margin: "20px", textAlign: "center" }}>
          <div
            className="content-section"
            ref={targetRef}
            style={{ marginTop: "30px", padding: "70px" }}
          >
            <h1>Return as per Codes</h1>
            <p style={{ fontSize: "16px" }}>
              {dateRange?.[0] && dateRange?.[1] ? (
                <>
                  From {dateRange[0].format("DD MMMM YYYY")}
                  <span style={{ margin: "0 5px" }}>to</span>
                  {dateRange[1].format("DD MMMM YYYY")}
                </>
              ) : null}
            </p>
            <br />
            <Suspense fallback={<Spin />}>
              <RETable
                loading={false}
                columns={ColumnCodes}
                dataSource={processedData}
                pageSize={40}
                total={processedData.length}
                showPagination={true}
              />
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
              data={exportData}
              filename="Expense_Table.csv"
              onClick={() => message.success("The file is downloading")}
            >
              <Button type="primary" ghost>
                Download Excel
              </Button>
            </CSVLink>
          </div>
        </Col>

        <Col flex="0 1 300px">
          <h2 style={{ margin: "30px 0" }}>Search and Filter Data</h2>
          <div className="accordions">
            <Divider orientation="left">Date Range</Divider>
            <Collapse
              items={[
                {
                  key: "date-filter",
                  label: "Filter By Date Range",
                  children: (
                    <Space direction="vertical" size={12}>
                      <RangePicker showTime onChange={handleDateRangeChange} />
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReturnAsPerCodePage;
