"use client";
import React, { useEffect, Suspense } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Layout,
  Image,
  message,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/services/auth.service";
import { useCollectionsQuery } from "@/redux/api/uttoronapi/colletionsApi";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETUTTable from "@/components/ui/UTTable";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;
const { Content } = Layout;

const PaidCollectionsPage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { user_role } = getUserInfo() as any;

  const router = useRouter();
  const { data, error, isLoading } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const total_paid_by_user = data?.[data.length - 1]?.total_paid_by_user;
  const total_deposit_by_all = data?.[data.length - 1]?.total_deposit_by_all;

  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.current_payment_status === "paid")
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

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error.status === "number";
  };

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Failed to load profile. Please try again later.</p>;
  if (!data) return <p>No profile data found.</p>;
  // console.log(data);
  const columns: ColumnsType<any> = [
    {
      title: "Image",
      dataIndex: "payment_image",
      responsive: ["md"],
      render: (data: any) => {
        if (data) {
          return <Image src={data} width={40} height={"40px"} alt="image" />;
        }
        return "No Image";
      },
    },

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
    {
      title: "Amount",
      key: "amount",
      render: (record: any) => <p>${record.amount}</p>,
    },
    {
      title: "Paid on",
      dataIndex: "entry_date",
      key: "entry_date",
      responsive: ["md"],
    },
    {
      title: "Status",
      key: "current_payment_status",
      responsive: ["sm"],
      render: (record: any) => <p>{record.current_payment_status_display}</p>,
    },

    {
      title: "Actions",
      key: "actions",
      render: (data: any) => (
        <Link href={`/${user_role}/collections/paid/${data.id}`}>
          <Button type="primary" ghost size="small">
            <EyeOutlined /> View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div style={{ padding: "16px" }}>
        <Row>
          <Col span={24}>
            <UMBreadCrumb
              items={[
                { label: "Dues", link: `/${user_role}/collections/dues` },
                {
                  label: "Under verification",
                  link: `/${user_role}/collections/verification`,
                },
              ]}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Layout ref={targetRef} style={{ background: "transparent" }}>
              <Content
                style={{
                  width: "100%",
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <RETUTTable
                  loading={isLoading}
                  columns={columns}
                  dataSource={filteredData}
                  pageSize={10}
                  total={totalDataLength()}
                  showSizeChanger={false}
                  scroll={{ x: "max-content" }}
                />

                <Col>
                  <Text strong style={{ fontSize: "16px" }}>
                    Your Total Deposit:{" "}
                    <Text type="success">
                      {parseFloat(total_paid_by_user).toFixed(2)}
                    </Text>
                  </Text>
                  <span style={{ margin: "5px 20px" }}>
                    {" "}
                    <Text strong style={{ fontSize: "16px" }}>
                      All Members Deposit:{" "}
                      <span style={{ color: "#4d98eeff" }}>
                        {" "}
                        {parseFloat(total_deposit_by_all).toFixed(2)}
                      </span>
                    </Text>
                  </span>
                </Col>
              </Content>
            </Layout>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Space
              direction={window.innerWidth < 768 ? "vertical" : "horizontal"}
              style={{
                width: "100%",
                justifyContent: window.innerWidth < 768 ? "center" : "flex-end",
                padding: "16px 0",
              }}
            >
              <Button
                type="primary"
                ghost
                onClick={() => toPDF()}
                style={{ marginRight: window.innerWidth < 768 ? 0 : "10px" }}
              >
                Download PDF
              </Button>
              <CSVLink
                data={flattenData(filteredData)}
                filename="Paid_Collections.csv"
                onClick={() => message.success("Downloading CSV file")}
              >
                <Button type="primary" ghost>
                  Download Excel
                </Button>
              </CSVLink>
            </Space>
          </Col>
        </Row>
      </div>
    </Suspense>
  );
};

export default PaidCollectionsPage;
