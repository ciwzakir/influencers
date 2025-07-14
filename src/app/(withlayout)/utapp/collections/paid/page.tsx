"use client";
import React, { useEffect, Suspense } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Layout, Image, message, Button, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/services/auth.service";
import { useCollectionsQuery } from "@/redux/api/uttoronapi/colletionsApi";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";
const { Paragraph } = Typography;
const { Content } = Layout;

const PaidCollectionsPage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { user_role } = getUserInfo() as any;

  const router = useRouter();
  const { data, error, isLoading } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

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
          return <Image src={data} width={40} height={"40px"} alt="image" />;
        } else return "No Image Found";
      },
    },

    {
      title: "Received From",
      key: "received_from",
      render: (record: any) => (
        <Paragraph>{record.received_from?.email || "N/A"}</Paragraph>
      ),
      sorter: (a: any, b: any) =>
        (a.received_from?.email || "")
          .toLowerCase()
          .localeCompare((b.received_from?.email || "").toLowerCase()),
      sortDirections: ["ascend", "descend"],
    },

    {
      title: "Deposit To",
      key: "deposit_to",
      render: (record: any) => <p>{record.deposit_to?.bank_name}</p>,
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
    },
    {
      title: "Payment Status",
      key: "current_payment_status",
      render: (record: any) => <p>{record.current_payment_status_display}</p>,
    },
    {
      title: "Your Total Deposits",
      key: "total_paid_by_user",
      render: (record: any) => <p>{record.total_paid_by_user}</p>,
      sorter: (a: any, b: any) =>
        parseFloat(a.total_paid_by_user) - parseFloat(b.total_paid_by_user),
      sortDirections: ["ascend", "descend"],
    },

    {
      title: "Actions",
      render: (data: any) => {
        return (
          <div className="action-div">
            <Link href={`/${user_role}/collections/paid/${data.id}`}>
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
            <RETable
              loading={false}
              columns={columns}
              dataSource={filteredData}
              pageSize={10}
              total={totalDataLength()}
              showSizeChanger={false}
              // onChangeOfPagintion={onPaginationChange}
              // onChangeTable={onTableChange}
              // showPagination={true}
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
            filename="Paid Table.csv"
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

export default PaidCollectionsPage;
