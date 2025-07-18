"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Layout, Table, message, Button, Modal, Spin, Space } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";

import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useDeleteSingleCashBookMutation,
  useGetcashbookQuery,
} from "@/redux/api/uttoronapi/cashbook";

const { Content } = Layout;

const AllCashBookPage = () => {
  const { user_role } = getUserInfo() as any;

  const router = useRouter();

  const { data, error, isLoading, refetch } = useGetcashbookQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteSingleData] = useDeleteSingleCashBookMutation();
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
        refetch();
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
      title: "Month",
      key: "cash_book_month",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">
          {record.cash_book_month?.name || "N/A"}
        </div>
      ),
    },

    {
      title: "Opening Cash",
      key: "opening_cash",
      align: "center" as const,
      render: (record: any) => (
        <div>{parseFloat(record.opening_balance?.cash || "0").toFixed(2)}</div>
      ),
    },
    {
      title: "Opening Bank",
      key: "opening_bank",
      align: "center" as const,
      render: (record: any) => (
        <div>{parseFloat(record.opening_balance?.bank || "0").toFixed(2)}</div>
      ),
    },

    {
      title: "Closing Cash",
      key: "closing_cash",
      align: "center" as const,
      render: (record: any) => (
        <div>
          {Number(record.get_monthly_closing_balance_cash || 0).toFixed(2)}
        </div>
      ),
    },
    {
      title: "Closing Bank",
      key: "closing_bank",
      align: "center" as const,
      render: (record: any) => (
        <div>
          {Number(record.get_monthly_closing_balance_bank || 0).toFixed(2)}
        </div>
      ),
    },
    {
      title: "Actions",
      align: "center" as const,
      render: (record: any) => (
        <Space size="middle">
          <Link href={`/${user_role}/cashbook/${record.id}`}>
            <Button type="primary" ghost icon={<EyeOutlined />}>
              View
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
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  const cashbookData = Array.isArray(data) ? data : [];

  if (!cashbookData.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No cash book entries found.</p>
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
          <div className="">
            <UMBreadCrumb
              items={[
                {
                  label: "Cash Book",
                  link: `/${user_role}/cashbook`,
                },
              ]}
            />
          </div>

          <h2 className="text-2xl font-semibold text-center my-6">
            All Cash Book Entries
          </h2>

          <div className="bg-white rounded-lg shadow p-6">
            <Table
              dataSource={cashbookData}
              columns={columns}
              rowKey="id"
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                position: ["bottomCenter"],
              }}
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
    </Suspense>
  );
};

export default AllCashBookPage;
