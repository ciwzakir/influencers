"use client";

import React, { useEffect, Suspense } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Layout, message, Button, Typography } from "antd";
import { BackwardOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/services/auth.service";
import { useCollectionsQuery } from "@/redux/api/uttoronapi/colletionsApi";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";

const { Content } = Layout;
const { Paragraph } = Typography;

const CollectionsVerificationPage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const userInfo = getUserInfo() as any;
  const role = userInfo?.user_role ?? "utapp";

  const router = useRouter();

  const { data, error, isLoading } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.current_payment_status === "verification")
    : [];

  const totalDataLength = () => filteredData?.length || 0;

  const flattenData = (data: any[]) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      total_paid_by_user: item.total_paid_by_user,
      total_deposit_by_all: item.total_deposit_by_all,
      current_payment_status: item.current_payment_status_display,
      references: item.references,
      payment_method: item.payment_method,
      entry_date: item.entry_date,
      due_date: item.due_date,
      transaction_date: item.transaction_date,
      received_from: item.received_from?.email || "",
      deposit_to: item.deposit_to?.bank_name || "",
      receivable_month: item.receivable_month?.name || "",
    }));

  // Helper to check error
  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
    error && typeof error.status === "number";

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Failed to load profile. Please try again later.</p>;
  if (!data) return <p>No profile data found.</p>;

  const columns = [
    {
      title: "For Month",
      key: "receivable_month",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">
          {record.receivable_month?.contribution_month?.name} {"|| "}
          {record.receivable_month?.fiscal_year?.name}
        </div>
      ),
    },
    // {
    //   title: "Received From",
    //   key: "received_from",
    //   render: (record: any) => (
    //     <Paragraph>{record.received_from?.email || "N/A"}</Paragraph>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     (a.received_from?.email || "")
    //       .toLowerCase()
    //       .localeCompare((b.received_from?.email || "").toLowerCase()),
    //   sortDirections: ["ascend", "descend"],
    // },

    {
      title: "Amount",
      key: "amount",
      render: (record: any) => <Paragraph>${record.amount}</Paragraph>,
    },
    {
      title: "Paid on",
      dataIndex: "transaction_date",
      key: "transaction_date",
    },

    {
      title: "Actions",
      align: "center" as const,
      render: (data: any) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href={`/${role}/collections/verification/${data.id}`}>
            <Button type="primary" ghost icon={<EyeOutlined />}>
              View
            </Button>
          </Link>
          <Link href={`/${role}/collections/verification/edit/${data.id}`}>
            <Button type="primary" ghost icon={<EditOutlined />}>
              Verify
            </Button>
          </Link>
          <Link href={`/${role}/collections/verification/sendback/${data.id}`}>
            <Button type="primary" ghost icon={<BackwardOutlined />}>
              Send Back
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <div style={{ padding: "5px" }}>
        <div style={{ marginBottom: "16px" }}>
          <UMBreadCrumb
            items={[
              { label: "Dues", link: `/${role}/collections/dues` },
              { label: "Paid", link: `/${role}/collections/paid` },
            ]}
          />
        </div>

        <Layout
          ref={targetRef}
          style={{ background: "#f0f2f5", padding: "5px" }}
        >
          <Content
            style={{
              maxWidth: "100%",
              background: "#fff",
              padding: "5px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            <RETable
              loading={false}
              columns={columns}
              dataSource={filteredData}
              pageSize={10}
              total={totalDataLength()}
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
            data={flattenData(filteredData)}
            filename="Verify req Table.csv"
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

export default CollectionsVerificationPage;
