"use client";

import React, { useEffect, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Layout, Table, Image, message, Button, Modal, Spin } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";

import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import {
  useCollectionsQuery,
  useDeleteSingleDataMutation,
} from "@/redux/api/colletionsApi";
import { getUserInfo } from "@/app/services/auth.service";

const { Content } = Layout;

const DuesCollectionsPage = () => {
  const { user_role } = getUserInfo() as any;
  const router = useRouter();
  const { data, error, isLoading } = useCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.current_payment_status === "due")
    : [];

  const [deleteSingleData] = useDeleteSingleDataMutation();

  // State for controlling the modal and managing the id to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Declare the modal state
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

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
    return <p>Loading Dues...</p>;
  }

  if (error) {
    return <p>Failed to load Dues. Please try again later.</p>;
  }

  if (!data) {
    return <p>No Dues data found.</p>;
  }

  // Handlers for opening, confirming, and canceling the modal
  const deleteHandler = async (id: number) => {
    setIsModalOpen(true); // Open modal
    setIdToDelete(id); // Set the ID to be deleted
  };

  const handleOk = async () => {
    if (idToDelete) {
      try {
        // Make the delete request
        await deleteSingleData({
          variables: {
            id: idToDelete,
          },
        });

        setIsModalOpen(false);
        setIdToDelete(null);
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIdToDelete(null);
  };

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
          <p>Branch: {record.deposit_to?.branch_name}</p>
          <p>Account No: {record.deposit_to?.account_no}</p>
        </>
      ),
    },
    {
      title: "Received From",
      key: "received_from",
      render: (record: any) => (
        <>
          <p>
            <strong>
              {record.received_from?.first_name}{" "}
              {record.received_from?.last_name}
            </strong>
          </p>
          <p>Email: {record.received_from?.email}</p>
        </>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (record: any) => <p>${record.amount}</p>,
    },
    {
      title: "Published on",
      dataIndex: "entry_date",
      key: "entry_date",
    },
    {
      title: "Payment Status",
      key: "current_payment_status",
      render: (record: any) => <p>{record.current_payment_status}</p>,
    },
    {
      title: "Actions",
      render: (data: any) => {
        return (
          <div className="action-div">
            <Link href={`/${user_role}/collections/dues/${data.id}`}>
              <Button type="primary" ghost style={{ marginRight: "10px" }}>
                <EyeOutlined /> View
              </Button>
            </Link>

            <Link href={`/${user_role}/collections/dues/edit/${data.id}`}>
              <Button
                className="action__button-style"
                type="primary"
                ghost
                style={{ marginRight: "10px" }}
              >
                <EditOutlined /> Edit
              </Button>
            </Link>

            <Modal
              title="Deletion Confirmation"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Are you sure you want to delete this item?</p>
            </Modal>

            <Button
              danger
              onClick={() => deleteHandler(data?.id)}
              style={{ marginRight: "10px" }}
            >
              <DeleteOutlined /> Pay Now
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Suspense fallback={<p>Loading Dues...</p>}>
      <div className="main-div">
        <div className="bread-cumb">
          <Suspense fallback={<Spin />}>
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
          </Suspense>
        </div>
        <Layout style={{ background: "#f0f2f5", padding: "20px" }}>
          <Content
            style={{
              maxWidth: "1200px",
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

export default DuesCollectionsPage;
