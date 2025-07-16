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
  MenuProps,
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

interface IncomeItem {
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
  uttoron_earnings: {
    id: number;
    income_codes: {
      id: number;
      name: string;
      income_economic_code: number;
    };
    earn_on: string;
    cash_amount_credit: string;
    bank_amount_credit: string;
    voucher_reference: string;
  }[];
}

const incomeColumns = [
  {
    title: "Income Code",
    dataIndex: "code",
    key: "code",
    sorter: (a: IncomeItem, b: IncomeItem) => Number(a.code) - Number(b.code),
  },
  {
    title: "Title",
    dataIndex: "category",
    key: "category",
    sorter: (a: IncomeItem, b: IncomeItem) =>
      a.category.localeCompare(b.category),
  },
  {
    title: "Cash Amount",
    dataIndex: "cash",
    key: "cash",
    render: (value: number) => (
      <Text strong style={{ color: "#389e0d" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: IncomeItem, b: IncomeItem) => a.cash - b.cash,
  },
  {
    title: "Bank Amount",
    dataIndex: "bank",
    key: "bank",
    render: (value: number) => (
      <Text strong style={{ color: "#096dd9" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: IncomeItem, b: IncomeItem) => a.bank - b.bank,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (value: number) => (
      <Text strong style={{ color: "#237804" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: IncomeItem, b: IncomeItem) => a.total - b.total,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    sorter: (a: IncomeItem, b: IncomeItem) =>
      dayjs(a.date).unix() - dayjs(b.date).unix(),
  },
] as const;

const categoryColumns = [
  {
    title: "Income Code",
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
      <Text strong style={{ color: "#237804" }}>
        {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    ),
    sorter: (a: CategoryTotal, b: CategoryTotal) => a.total - b.total,
  },
];

const IncomeReportPage = () => {
  const { toPDF: toPDFIncome, targetRef: incomePdfRef } = usePDF({
    filename: "income-transactions-report.pdf",
  });
  const { toPDF: toPDFCategory, targetRef: categoryPdfRef } = usePDF({
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
    if (!data || !Array.isArray(data)) return { incomes: [], categories: [] };

    const allIncomes: IncomeItem[] = [];
    const categoryMap = new Map<string, CategoryTotal>();

    (data as ApiResponseItem[]).forEach((entry) => {
      if (entry.uttoron_earnings?.length > 0) {
        entry.uttoron_earnings.forEach((income) => {
          const incomeDate = dayjs(income.earn_on);

          if (dateRange) {
            const [startDate, endDate] = dateRange;
            if (incomeDate.isBefore(startDate) || incomeDate.isAfter(endDate)) {
              return;
            }
          }

          const categoryName =
            income.income_codes?.name || "Uncategorized Income";
          const categoryCode =
            income.income_codes?.income_economic_code || "N/A";
          const cashAmount = parseFloat(income.cash_amount_credit) || 0;
          const bankAmount = parseFloat(income.bank_amount_credit) || 0;
          const totalAmount = cashAmount + bankAmount;

          allIncomes.push({
            key: `income-${income.id}`,
            code: categoryCode,
            category: categoryName,
            cash: cashAmount,
            bank: bankAmount,
            total: totalAmount,
            month: entry.cash_book_month?.name || "N/A",
            date: income.earn_on,
            voucher: income.voucher_reference,
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
      incomes: allIncomes.sort(
        (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
      ),
      categories: Array.from(categoryMap.values()).sort((a, b) =>
        a.category.localeCompare(b.category)
      ),
    };
  };

  const { incomes, categories } = transformData();
  const totalIncome = categories.reduce((sum, item) => sum + item.total, 0);
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

  const incomeDownloadItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <CSVLink
          data={incomes}
          filename={`income-transactions-${
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
        <Button type="text" onClick={() => toPDFIncome()}>
          Download as PDF
        </Button>
      ),
    },
  ];

  const categoryDownloadItems: MenuProps["items"] = [
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
        <Button type="text" onClick={() => toPDFCategory()}>
          Download as PDF
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="error-container">
        <Title level={4} type="danger">
          Failed to load income data
        </Title>
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Layout className="income-report-layout">
      <Content className="income-report-content">
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
              <Text type="secondary" style={{ marginLeft: 10 }}>
                Showing income from {dateRange[0].format("DD MMM YYYY")} to{" "}
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
                title="Total Income"
                value={totalIncome}
                precision={2}
                valueStyle={{ color: "#237804" }}
                prefix="৳"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Cash Income"
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
                title="Bank Income"
                value={totalBank}
                precision={2}
                valueStyle={{ color: "#096dd9" }}
                prefix="৳"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Transactions" value={incomes.length} />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Card
          style={{ padding: " 0 10px" }}
          className="report-table-card"
          title="All Income Transactions"
          extra={
            <Dropdown
              menu={{ items: incomeDownloadItems }}
              placement="bottomLeft"
            >
              <Button
                icon={<DownloadOutlined />}
                disabled={isLoading || incomes.length === 0}
              >
                Download
              </Button>
            </Dropdown>
          }
        >
          <div ref={incomePdfRef}>
            <Suspense
              fallback={<Spin size="large" className="table-loading" />}
            >
              <RETable
                loading={isLoading}
                columns={incomeColumns}
                dataSource={incomes}
                pageSize={15}
                total={incomes.length}
              />
            </Suspense>
          </div>
        </Card>

        <Divider />

        <Card
          style={{ padding: " 0 10px" }}
          className="report-table-card"
          title="Category-wise Summary"
          extra={
            <Dropdown
              menu={{ items: categoryDownloadItems }}
              placement="bottomLeft"
            >
              <Button
                icon={<DownloadOutlined />}
                disabled={isLoading || categories.length === 0}
              >
                Download
              </Button>
            </Dropdown>
          }
        >
          <div ref={categoryPdfRef}>
            <Table
              loading={isLoading}
              columns={categoryColumns}
              dataSource={categories}
              pagination={false}
              scroll={{ x: true }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong>Grand Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{incomes.length}</Text>
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
                      <Text strong style={{ color: "#237804" }}>
                        {totalIncome.toLocaleString("en-US", {
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

export default IncomeReportPage;
