"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Layout, message, Button, Modal, Spin, Space } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useCollectionsQuery,
  useDeleteSingleCollectionMutation,
} from "@/redux/api/uttoronapi/colletionsApi";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";
const { Content } = Layout;

const DuesCollectionsPage = () => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { user_role } = getUserInfo() as any;
  const router = useRouter();

  const { data, error, isLoading, refetch } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteSingleData] = useDeleteSingleCollectionMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error.status === "number";
  };

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.current_payment_status === "due")
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

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (idToDelete) {
      try {
        await deleteSingleData(idToDelete).unwrap();
        message.success("Deleted successfully!");
        setIsModalOpen(false);
        setIdToDelete(null);
        refetch(); // Refresh the table after delete
      } catch (err) {
        console.error(err);
        message.error("Failed to delete the item.");
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIdToDelete(null);
  };

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
    {
      title: "Payable From",
      key: "received_from",
      sorter: (a: any, b: any) => a.received_from - b.received_from,
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">
          {record.received_from?.email} ({record.received_from?.first_name}{" "}
          {record.received_from?.last_name})
        </div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">${record.amount}</div>
      ),
    },
    {
      title: "Payment Due on",
      dataIndex: "entry_date",
      key: "entry_date",
      align: "center" as const,
    },
    {
      title: "Status",
      key: "current_payment_status_display",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">
          {record.current_payment_status_display}
        </div>
      ),
    },
    {
      title: "Actions",
      align: "center" as const,
      render: (record: any) => (
        <Space size="middle">
          <Link href={`/${user_role}/collections/dues/${record.id}`}>
            <Button type="primary" ghost icon={<EyeOutlined />}>
              View
            </Button>
          </Link>
          <Link href={`/${user_role}/collections/dues/edit/${record.id}`}>
            <Button type="primary" ghost icon={<EditOutlined />}>
              Pay Now
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading dues data. Please try again.</p>
      </div>
    );
  }

  if (!filteredData.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h3 style={{ margin: "50px", textAlign: "center" }}>
          <span style={{ color: "black" }}> NO DUES</span>{" "}
          <span style={{ color: "#6495ed" }}> FOUND</span>
        </h3>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Loading..." size="large" />
        </div>
      }
    >
      <Content className="min-h-screen flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <UMBreadCrumb
            items={[
              {
                label: "Outstanding",
                link: `/${user_role}/collections/verification`,
              },
              {
                label: "Paid",
                link: `/${user_role}/collections/paid`,
              },
            ]}
          />

          <div ref={targetRef} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-center my-6">
              Dues List
            </h2>
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
          </div>
        </div>

        <Modal
          title="Confirm Deletion"
          open={isModalOpen}
          onOk={handleConfirmDelete}
          onCancel={handleCancel}
          okText="Delete"
          okButtonProps={{ danger: true }}
          centered
        >
          <p className="text-center">
            Are you sure you want to delete this item?
          </p>
        </Modal>
      </Content>
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
          filename="Dues Table.csv"
          onClick={() => message.success("The file is downloading")}
        >
          <Button type="primary" ghost>
            Download Excel
          </Button>
        </CSVLink>
      </div>
    </Suspense>
  );
};

export default DuesCollectionsPage;
