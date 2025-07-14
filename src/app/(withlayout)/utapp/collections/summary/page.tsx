"use client";

import React, { Suspense } from "react";
import { Layout, message, Button, Typography } from "antd";
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
      render: (value: number) => <p>{value.toFixed(2)}</p>,
    },
    {
      title: "Paid",
      key: "paid",
      dataIndex: "paid",
      render: (value: number) => <p>{value.toFixed(2)}</p>,
    },
    {
      title: "Verification",
      key: "verification",
      dataIndex: "verification",
      render: (value: number) => <p>{value.toFixed(2)}</p>,
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
      <div className="main-div">
        <div className="bread-cumb">
          <UMBreadCrumb
            items={[
              {
                label: "Dues",
                link: `/${user_role}/collections/dues`,
              },
              {
                label: "Outstanding",
                link: `/${user_role}/collections/verification`,
              },
            ]}
          />
        </div>

        <Layout
          ref={targetRef}
          style={{ background: "#f0f2f5", padding: "20px" }}
        >
          <Content
            style={{
              maxWidth: "1400px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {/* Chart */}
            <div style={{ marginBottom: "40px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>

            <h1 style={{ margin: "50px", textAlign: "center" }}>
              <span style={{ color: "black" }}> COLLECTION </span>{" "}
              <span style={{ color: "#6495ed" }}> SUMMARIES</span>
            </h1>

            {/* Table */}
            <RETable
              loading={false}
              columns={columns}
              dataSource={emailSummaries}
              pageSize={15}
              total={emailSummaries.length}
              showSizeChanger={false}
            />
          </Content>
        </Layout>

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
            data={emailSummaries}
            filename="User_Payment_Summary.csv"
            onClick={() => message.success("The file is downloading")}
          >
            <Button type="primary" ghost>
              Download Excel
            </Button>
          </CSVLink>
        </div>
      </div>
    </Suspense>
  );
};

export default CollectionsSummary;
