"use client";

import React, { useState, Suspense } from "react";
import { Layout, message, Button, Modal, Spin, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";
import RETable from "@/components/ui/RETable";
import {
  useDeleteSingleMonthlyRatesMutation,
  useMonthlyContributeRatesQuery,
} from "@/redux/api/uttoronapi/contribution-rates";

const { Content } = Layout;

const ContributionsPage = () => {
  const userInfo = getUserInfo() as any;
  const role = userInfo?.user_role ?? "acctentry";
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const { data, error, isLoading, refetch } = useMonthlyContributeRatesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [deleteSingleData] = useDeleteSingleMonthlyRatesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const totalDataLength = () => data?.length || 0;

  const flattenData = (data: any[]) =>
    data.map((item) => ({
      id: item.id,
      title: item.name,
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
      title: "Name of Month",
      key: "name",
      align: "center" as const,
      render: (record: any) => <div className="text-center">{record.name}</div>,
    },
    {
      title: "Financial Year",
      key: "fiscal_year",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">{record.fiscal_year.name}</div>
      ),
    },
    {
      title: "Monthly Rate Per Share",
      key: "contribution_amount",
      align: "center" as const,
      render: (record: any) => (
        <div className="text-center">{record.contribution_amount}</div>
      ),
    },
    {
      title: "Actions",
      align: "center" as const,
      render: (record: any) => (
        <Space
          size={[8, 8]}
          wrap
          className="flex flex-col sm:flex-row justify-center items-center"
        >
          <Link href={`/${role}/contributions/${record.id}`}>
            <Button type="primary" ghost icon={<EditOutlined />}>
              Update Now
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

  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No data found.</p>
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
      <Content
        className="min-h-screen flex flex-col"
        style={{ margin: "0 50px" }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <UMBreadCrumb
            items={[
              {
                label: "Create New Contribution",
                link: `/${role}/contributions/create`,
              },
            ]}
          />

          <div ref={targetRef} className="bg-white rounded-lg shadow p-6">
            <h2 style={{ textAlign: "center", margin: "50px" }}>
              Monthly subscriptions List
            </h2>

            {/* Responsive table wrapper */}
            <div className="overflow-x-auto">
              <RETable
                loading={false}
                columns={columns}
                dataSource={data}
                pageSize={14}
                total={totalDataLength()}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </Content>
      {/* Delete Confirmation Modal */}
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

      <div
        className="w-full mt-6 flex flex-col sm:flex-row justify-end gap-3"
        style={{ textAlign: "right", marginRight: "50px" }}
      >
        <Button
          type="primary"
          ghost
          onClick={() => toPDF()}
          style={{ marginRight: "14px" }}
        >
          Download PDF
        </Button>
        <CSVLink
          data={flattenData(data)}
          filename="Contribution.csv"
          onClick={() => message.success("The file is downloading")}
        >
          <Button type="primary" ghost>
            Download Excel
          </Button>
        </CSVLink>
      </div>
      <div style={{ marginBottom: "50px" }}>
        <h1></h1>
      </div>
    </Suspense>
  );
};

export default ContributionsPage;
