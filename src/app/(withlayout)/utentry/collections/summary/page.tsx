"use client";

import React, { Suspense } from "react";
import { Layout, message, Button, Typography, Row, Col } from "antd";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useCollectionSummariesQuery } from "@/redux/api/uttoronapi/collectionSummary";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Paragraph } = Typography;
const { Content } = Layout;

const CollectionsSummary = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { user_role } = getUserInfo() as any;
  const { data } = useCollectionSummariesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  type PaymentStatus = "paid" | "due" | "verification";

  interface UserSummary {
    email: string;
    paid: number;
    due: number;
    verification: number;
    total: number;
  }

  const calculateSummary = (data: any[]): UserSummary[] => {
    const summaryMap: Record<string, UserSummary> = {};

    data?.forEach((entry) => {
      const email = entry.received_from?.email || "Unknown";
      const status = entry.current_payment_status as PaymentStatus;
      const amount = parseFloat(entry.amount || "0");

      if (!summaryMap[email]) {
        summaryMap[email] = {
          email,
          paid: 0,
          due: 0,
          verification: 0,
          total: 0,
        };
      }

      if (status === "paid") summaryMap[email].paid += amount;
      else if (status === "due") summaryMap[email].due += amount;
      else if (status === "verification")
        summaryMap[email].verification += amount;

      summaryMap[email].total += amount;
    });

    return Object.values(summaryMap);
  };

  const emailSummaries = calculateSummary(data || []);

  // Chart Data
  const chartData = {
    labels: emailSummaries.map((entry) => entry.email),
    datasets: [
      {
        label: "Paid",
        data: emailSummaries.map((entry) => entry.paid),
        backgroundColor: "#4caf50",
      },
      {
        label: "Due",
        data: emailSummaries.map((entry) => entry.due),
        backgroundColor: "#f44336",
      },
      {
        label: "Verification",
        data: emailSummaries.map((entry) => entry.verification),
        backgroundColor: "#ff9800",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Subscriptions Summary",
      },
    },
  };

  const columns = [
    {
      title: "Received From",
      key: "email",
      dataIndex: "email",
      render: (email: string) => <Paragraph>{email}</Paragraph>,
      sorter: (a: UserSummary, b: UserSummary) =>
        a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
      sortDirections: ["ascend", "descend"],
    },

    {
      title: "Due",
      key: "due",
      dataIndex: "due",
      render: (value: number) => (
        <Typography.Text type="danger">{value.toFixed(2)}</Typography.Text>
      ),
    },
    {
      title: "Paid",
      key: "paid",
      dataIndex: "paid",
      render: (value: number) => (
        <Typography.Text type="success">{value.toFixed(2)}</Typography.Text>
      ),
    },
    {
      title: "Verification",
      key: "verification",
      dataIndex: "verification",
      render: (value: number) => (
        <Typography.Text type="warning">{value.toFixed(2)}</Typography.Text>
      ),
    },

    {
      title: "Total",
      key: "total",
      dataIndex: "total",
      render: (value: number) => <p>{value.toFixed(2)}</p>,
    },
  ];

  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <div className="main-div" style={{ padding: "10px" }}>
        {/* Breadcrumb */}
        <div className="bread-cumb" style={{ marginBottom: "16px" }}>
          <UMBreadCrumb
            items={[
              { label: "Dues", link: `/${user_role}/collections/dues` },
              {
                label: "Outstanding",
                link: `/${user_role}/collections/verification`,
              },
            ]}
          />
        </div>

        <Layout
          ref={targetRef}
          style={{ background: "#f0f2f5", padding: "10px" }}
        >
          <Content
            style={{
              maxWidth: "100%",
              background: "#fff",
              padding: "16px",
              borderRadius: "10px",
            }}
          >
            {/* Chart Section */}
            <div style={{ marginBottom: "24px", overflowX: "auto" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Title */}
            <h1
              style={{
                margin: "24px 0",
                textAlign: "center",
                fontSize: "20px",
                lineHeight: "1.4",
              }}
            >
              <span style={{ color: "black" }}> COLLECTION </span>
              <span style={{ color: "#6495ed" }}> SUMMARIES</span>
            </h1>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <RETable
                loading={false}
                columns={columns}
                dataSource={emailSummaries}
                pageSize={15}
                total={emailSummaries.length}
                showSizeChanger={false}
              />
            </div>
          </Content>
        </Layout>

        {/* Buttons: PDF and CSV */}
        <Row
          gutter={[16, 16]}
          justify="end"
          style={{ marginTop: "24px", flexWrap: "wrap" }}
        >
          <Col xs={24} sm={12} md={8} style={{ textAlign: "center" }}>
            <Button
              type="primary"
              ghost
              onClick={() => toPDF()}
              style={{ width: "100%" }}
            >
              Download PDF
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} style={{ textAlign: "center" }}>
            <CSVLink
              data={emailSummaries}
              filename="User_Payment_Summary.csv"
              onClick={() => message.success("The file is downloading")}
              style={{ display: "block", width: "100%" }}
            >
              <Button type="primary" ghost style={{ width: "100%" }}>
                Download Excel
              </Button>
            </CSVLink>
          </Col>
        </Row>
      </div>
    </Suspense>
  );
};

export default CollectionsSummary;
