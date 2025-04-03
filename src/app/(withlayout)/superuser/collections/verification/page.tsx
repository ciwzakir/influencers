"use client";

import React, { useEffect, Suspense } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Layout, Table, Image, message, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCollectionsQuery } from "@/redux/api/colletionsApi";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/services/auth.service";

const { Content } = Layout;

const PaidCollectionsPage = () => {
  const { user_role } = getUserInfo() as any;

  const router = useRouter();
  const { data, error, isLoading } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.current_payment_status === "verification")
    : [];
  console.log("useCollectionsQuery", data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error.status === "number";
  };

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Failed to load profile. Please try again later.</p>;
  }

  if (!data) {
    return <p>No profile data found.</p>;
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "payment_image",
      render: (data: any) => {
        if (data) {
          return <Image src={data} width={100} height={100} alt="image" />;
        } else return "No Image Found";
      },
    },
    {
      title: "Deposit To",
      key: "deposit_to",
      render: (record: any) => (
        <>
          <p>
            <strong>{record.deposit_to?.account_name}</strong>
          </p>
          <p>{record.deposit_to?.bank_name}</p>
        </>
      ),
    },
    {
      title: "Received From",
      key: "received_from",
      render: (record: any) => <p>Email: {record.received_from?.email}</p>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (record: any) => <p>${record.amount}</p>,
    },
    {
      title: "Payment on",
      dataIndex: "entry_date",
      key: "entry_date",
    },
    {
      title: "Payment Status",
      key: "current_payment_status",
      render: (record: any) => <p>{record.current_payment_status}</p>,
    },
    {
      title: "Your Total Deposits",
      key: "total_paid_by_user",
      render: (record: any) => <p>{record.total_paid_by_user}</p>,
    },
    {
      title: "All Deposits",
      key: "total_deposit_by_all",
      render: (record: any) => <p>{record.total_deposit_by_all}</p>,
    },
    {
      title: "Actions",
      render: (data: any) => {
        return (
          <div className="action-div">
            <Link href={`/${user_role}/collections/verification/${data.id}`}>
              <Button type="primary" ghost style={{ marginRight: "10px" }}>
                <EyeOutlined /> View
              </Button>
            </Link>
          </div>
        );
      },
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
                label: "Paid",
                link: `/${user_role}/collections/paid`,
              },
            ]}
          />
        </div>

        <Layout style={{ background: "#f0f2f5", padding: "20px" }}>
          <Content
            style={{
              maxWidth: "1400px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
          </Content>
        </Layout>
      </div>
    </Suspense>
  );
};

export default PaidCollectionsPage;
