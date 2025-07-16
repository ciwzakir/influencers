"use client";

import React, { Suspense, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Spin,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Table,
  DatePicker,
  Form,
  Space,
  Dropdown,
} from "antd";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";
import { useGetCategorySummaryQuery } from "@/redux/api/uttoronapi/expense";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Content } = Layout;
const { RangePicker } = DatePicker;

interface ExpenseItem {
  key: string;
  code: string | number;
  category: string;
  cash: number;
  bank: number;
  total: number;
  month: string;
  date: string;
  voucher: string;
}

interface CategoryTotal {
  key: string;
  code: string | number;
  category: string;
  cash: number;
  bank: number;
  total: number;
  count: number;
}

interface ApiResponseItem {
  id: number;
  name: string;
  cash_book_month: {
    id: number;
    name: string;
    slug: string;
  };
  uttoron_outflow: {
    id: number;
    expense_codes: {
      id: number;
      name: string;
      expense_economic_code: number;
    };
    expense_on: string;
    cash_amount_debit: string;
    bank_amount_debit: string;
    voucher_reference: string;
  }[];
}

const expenseColumns = [
  {
    title: "Expense Code",
    dataIndex: "code",
    key: "code",
    sorter: (a: ExpenseItem, b: ExpenseItem) => Number(a.code) - Number(b.code),
  },
  {
    title: "Title",
    dataIndex: "category",
    key: "category",
    sorter: (a: ExpenseItem, b: ExpenseItem) =>
      a.category.localeCompare(b.category),
  },
  {
    title: "Cash Amount",
    dataIndex: "cash",
    key: "cash",
    render: (value: number) => (
      <Text strong style={{ color: value > 0 ? "#389e0d" : undefined }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: ExpenseItem, b: ExpenseItem) => a.cash - b.cash,
  },
  {
    title: "Bank Amount",
    dataIndex: "bank",
    key: "bank",
    render: (value: number) => (
      <Text strong style={{ color: value > 0 ? "#096dd9" : undefined }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: ExpenseItem, b: ExpenseItem) => a.bank - b.bank,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (value: number) => (
      <Text strong style={{ color: "#d48806" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: ExpenseItem, b: ExpenseItem) => a.total - b.total,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    sorter: (a: ExpenseItem, b: ExpenseItem) =>
      dayjs(a.date).unix() - dayjs(b.date).unix(),
  },
] as const;

const categoryColumns = [
  {
    title: "Expense Code",
    dataIndex: "code",
    key: "code",
    sorter: (a: CategoryTotal, b: CategoryTotal) => {
      if (typeof a.code === "number" && typeof b.code === "number") {
        return a.code - b.code;
      }
      return String(a.code).localeCompare(String(b.code));
    },
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    sorter: (a: CategoryTotal, b: CategoryTotal) =>
      a.category.localeCompare(b.category),
  },
  {
    title: "Transaction Count",
    dataIndex: "count",
    key: "count",
    sorter: (a: CategoryTotal, b: CategoryTotal) => a.count - b.count,
  },
  {
    title: "Cash Total",
    dataIndex: "cash",
    key: "cash",
    render: (value: number) => (
      <Text strong style={{ color: "#389e0d" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: CategoryTotal, b: CategoryTotal) => a.cash - b.cash,
  },
  {
    title: "Bank Total",
    dataIndex: "bank",
    key: "bank",
    render: (value: number) => (
      <Text strong style={{ color: "#096dd9" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: CategoryTotal, b: CategoryTotal) => a.bank - b.bank,
  },
  {
    title: "Sub Total",
    dataIndex: "total",
    key: "total",
    render: (value: number) => (
      <Text strong style={{ color: "#d48806" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: CategoryTotal, b: CategoryTotal) => a.total - b.total,
  },
];

const ExpenseReportPage = () => {
  // Separate PDF hooks for each table
  const { toPDF: toPDFExpenses, targetRef: expensesPdfRef } = usePDF({
    filename: "expense-transactions-report.pdf",
  });
  const { toPDF: toPDFCategories, targetRef: categoriesPdfRef } = usePDF({
    filename: "category-summary-report.pdf",
  });

  const { data, isLoading, isError } = useGetCategorySummaryQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [form] = Form.useForm();

  const transformData = () => {
    if (!data || !Array.isArray(data)) return { expenses: [], categories: [] };

    const allExpenses: ExpenseItem[] = [];
    const categoryMap = new Map<string, CategoryTotal>();

    (data as ApiResponseItem[]).forEach((entry) => {
      if (entry.uttoron_outflow?.length > 0) {
        entry.uttoron_outflow.forEach((expense) => {
          const expenseDate = dayjs(expense.expense_on);

          if (dateRange) {
            const [startDate, endDate] = dateRange;
            if (
              expenseDate.isBefore(startDate) ||
              expenseDate.isAfter(endDate)
            ) {
              return;
            }
          }

          const categoryName = expense.expense_codes?.name || "Uncategorized";
          const categoryCode =
            expense.expense_codes?.expense_economic_code || "N/A";
          const cashAmount = parseFloat(expense.cash_amount_debit) || 0;
          const bankAmount = parseFloat(expense.bank_amount_debit) || 0;
          const totalAmount = cashAmount + bankAmount;

          allExpenses.push({
            key: `expense-${expense.id}`,
            code: categoryCode,
            category: categoryName,
            cash: cashAmount,
            bank: bankAmount,
            total: totalAmount,
            month: entry.cash_book_month?.name || "N/A",
            date: expense.expense_on,
            voucher: expense.voucher_reference,
          });

          if (categoryMap.has(categoryName)) {
            const existing = categoryMap.get(categoryName)!;
            categoryMap.set(categoryName, {
              ...existing,
              cash: existing.cash + cashAmount,
              bank: existing.bank + bankAmount,
              total: existing.total + totalAmount,
              count: existing.count + 1,
            });
          } else {
            categoryMap.set(categoryName, {
              key: `category-${categoryName}`,
              code: categoryCode,
              category: categoryName,
              cash: cashAmount,
              bank: bankAmount,
              total: totalAmount,
              count: 1,
            });
          }
        });
      }
    });

    return {
      expenses: allExpenses.sort(
        (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
      ),
      categories: Array.from(categoryMap.values()).sort((a, b) =>
        a.category.localeCompare(b.category)
      ),
    };
  };

  const { expenses, categories } = transformData();
  const totalExpense = categories.reduce((sum, item) => sum + item.total, 0);
  const totalCash = categories.reduce((sum, item) => sum + item.cash, 0);
  const totalBank = categories.reduce((sum, item) => sum + item.bank, 0);

  const handleDateFilter = (values: any) => {
    if (values.dateRange) {
      setDateRange(values.dateRange);
    } else {
      setDateRange(null);
    }
  };

  const resetFilters = () => {
    form.resetFields();
    setDateRange(null);
  };

  // Download menu items for expenses table
  const expensesDownloadItems = [
    {
      key: "1",
      label: (
        <CSVLink
          data={expenses}
          filename={`expense-transactions-${
            new Date().toISOString().split("T")[0]
          }.csv`}
        >
          Download as Excel
        </CSVLink>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="text" onClick={() => toPDFExpenses()}>
          Download as PDF
        </Button>
      ),
    },
  ];

  // Download menu items for categories table
  const categoriesDownloadItems = [
    {
      key: "1",
      label: (
        <CSVLink
          data={categories}
          filename={`category-summary-${
            new Date().toISOString().split("T")[0]
          }.csv`}
        >
          Download as Excel
        </CSVLink>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="text" onClick={() => toPDFCategories()}>
          Download as PDF
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="error-container">
        <Title level={4} type="danger">
          Failed to load expense data
        </Title>
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Layout className="expense-report-layout">
      <Content className="expense-report-content">
        <Card className="filter-card" style={{ padding: " 0 10px" }}>
          <Form form={form} onFinish={handleDateFilter} layout="inline">
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker
                style={{ width: 250 }}
                disabledDate={(current) => current && current > dayjs()}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilterOutlined />}
                >
                  Apply Filter
                </Button>
                <Button onClick={resetFilters}>Reset</Button>
              </Space>
            </Form.Item>
            {dateRange && (
              <Text type="secondary" style={{ marginLeft: 16 }}>
                Showing expenses from {dateRange[0].format("DD MMM YYYY")} to{" "}
                {dateRange[1].format("DD MMM YYYY")}
              </Text>
            )}
          </Form>
        </Card>

        <Divider />

        <Row
          gutter={16}
          className="summary-cards"
          style={{ textAlign: "center" }}
        >
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Expenses"
                value={totalExpense}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix="৳"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Cash Expenses"
                value={totalCash}
                precision={2}
                valueStyle={{ color: "#389e0d" }}
                prefix="৳"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Bank Expenses"
                value={totalBank}
                precision={2}
                valueStyle={{ color: "#096dd9" }}
                prefix="৳"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Transactions" value={expenses.length} />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Expenses Table with Download Options */}
        <Card
          style={{ padding: " 0 10px" }}
          className="report-table-card"
          title="All Expense Transactions"
          extra={
            <Dropdown
              menu={{ items: expensesDownloadItems }}
              placement="bottomLeft"
              disabled={isLoading || expenses.length === 0}
            >
              <Button icon={<DownloadOutlined />}>Download</Button>
            </Dropdown>
          }
        >
          <div ref={expensesPdfRef}>
            <Suspense
              fallback={<Spin size="large" className="table-loading" />}
            >
              <RETable
                loading={isLoading}
                columns={expenseColumns}
                dataSource={expenses}
                pageSize={15}
                total={expenses.length}
              />
            </Suspense>
          </div>
        </Card>

        <Divider />

        {/* Categories Table with Download Options */}
        <Card
          style={{ padding: " 0 10px" }}
          className="report-table-card"
          title="Category-wise Summary"
          extra={
            <Dropdown
              menu={{ items: categoriesDownloadItems }}
              placement="bottomLeft"
              disabled={isLoading || categories.length === 0}
            >
              <Button icon={<DownloadOutlined />}>Download</Button>
            </Dropdown>
          }
        >
          <div ref={categoriesPdfRef}>
            <Table
              loading={isLoading}
              columns={categoryColumns}
              dataSource={categories}
              pagination={false}
              scroll={{ x: true }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Grand Total</Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1}>
                      <Text strong>{expenses.length}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text strong style={{ color: "#389e0d" }}>
                        {totalCash.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text strong style={{ color: "#096dd9" }}>
                        {totalBank.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text strong style={{ color: "#d48806" }}>
                        {totalExpense.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ExpenseReportPage;
