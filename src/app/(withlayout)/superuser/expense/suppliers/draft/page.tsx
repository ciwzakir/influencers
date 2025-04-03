"use client";
import React, { Suspense } from "react";
import { Spin, Button, message, Row } from "antd";
import {
  useDeleteDraftBillMutation,
  useOnlyDraftBillQuery,
} from "@/redux/api/draftApi";
import Link from "next/link";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import RETable from "@/components/ui/RETable";
import { getUserInfo } from "@/app/services/auth.service";

const userInfo = getUserInfo() as any;
const role = userInfo?.userRole || "superuser"; // Provide a fallback

const DraftBillListPage = () => {
  const [deleteDraftBill] = useDeleteDraftBillMutation();
  const { data, isError, isLoading } = useOnlyDraftBillQuery(undefined);
  const pageCount = (): number => {
    return data?.length || 0;
  };

  const deleteHandler = async (id: string) => {
    message.loading("Deleting.....");

    try {
      //   console.log(data);
      await deleteDraftBill(id);
      message.success("Bill Deleted successfully");
    } catch (err: any) {
      //   console.error(err.message);
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Expenditure Code",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data) {
          return data.heading;
        } else return "No Code Found";
      },
    },
    {
      title: "Code Full Name",
      dataIndex: "expenditure_code",
      render: function (data: any) {
        if (data) {
          return data.seven_digit_code;
        } else return "No Code Found";
      },
    },

    // {
    //   title: "Type",
    //   dataIndex: "expenditure_code",
    //   render: function (data: any) {
    //     if (data && data.is_general) {
    //       return <span style={{ color: "green" }}>General</span>;
    //     } else {
    //       return <span style={{ color: "red" }}>Special</span>;
    //     }
    //   },
    //   sorter: (a: any, b: any) => {
    //     // Extract the is_general property from the expenditure_code objects
    //     const isGeneralA = a.expenditure_code?.is_general || false;
    //     const isGeneralB = b.expenditure_code?.is_general || false;

    //     // Compare the is_general properties
    //     if (isGeneralA === isGeneralB) {
    //       return 0;
    //     } else if (isGeneralA) {
    //       return 1; // General should appear after Special
    //     } else {
    //       return -1; // Special should appear before General
    //     }
    //   },
    // },

    // {
    //   title: "Supplier",
    //   dataIndex: "item_supplier",
    //   render: function (data: any) {
    //     if (data) {
    //       return data.name;
    //     } else return "No Supplier Found";
    //   },
    // },
    // {
    //   title: "Total Bill",
    //   dataIndex: "get_totals",
    //   key: "getTotals",
    //   sorter: (a: any, b: any) => a.id - b.id,
    // },
    // {
    //   title: "Income Tax",
    //   dataIndex: "get_income_tax",
    //   key: "incomeTax",
    //   sorter: (a: any, b: any) => a.id - b.id,
    // },
    // {
    //   title: "VAT",
    //   dataIndex: "get_value_added_tax",
    //   key: "vat",
    //   sorter: (a: any, b: any) => a.id - b.id,
    // },
    // {
    //   title: "Paid",
    //   dataIndex: "get_paid_amount",
    //   key: "paidAmount",
    //   sorter: (a: any, b: any) => a.id - b.id,
    // },
    // {
    //   title: "Payment Method",
    //   dataIndex: "is_cheque",
    //   render: function (data: any) {
    //     if (data === true) {
    //       return (
    //         <div className="" style={{ color: "green" }}>
    //           Cheque
    //         </div>
    //       );
    //     } else
    //       return (
    //         <div className="" style={{ color: "purple" }}>
    //           Cash
    //         </div>
    //       );
    //   },
    // },
    // {
    //   title: "Published ?",
    //   dataIndex: "is_published",
    //   render: function (data: any) {
    //     if (data === true) {
    //       return (
    //         <div className="" style={{ color: "green" }}>
    //           Published
    //         </div>
    //       );
    //     } else
    //       return (
    //         <div className="" style={{ color: "red" }}>
    //           Draft
    //         </div>
    //       );
    //   },
    // },
    {
      title: "Current Status",
      dataIndex: "bills_status",
      key: "bills_current_status",
    },

    // {
    //   title: "Updated At",
    //   dataIndex: "updated_at",
    //   render: function (data: any) {
    //     if (data) {
    //       return dayjs(data).format("DD MMM YYYY HH:mm:ss");
    //     } else {
    //       return "Invalid date";
    //     }
    //   },
    //   sorter: (a: any, b: any) => a.createdAt - b.createdAt,
    // },
    {
      title: "Actions",
      render: (data: any) => {
        return (
          <div className="action-div">
            <Link href={`/${role}/expense/suppliers/draft/${data.id}`}>
              <Button type="primary" ghost style={{ marginRight: "10px" }}>
                <EyeOutlined /> View
              </Button>
            </Link>

            <Link href={`/${role}/expense/suppliers/draft/edit/${data.id}`}>
              <Button
                className="action__button-style"
                type="primary"
                ghost
                style={{ marginRight: "10px" }}
              >
                <EditOutlined /> Update
              </Button>
            </Link>

            <Button
              danger
              onClick={() => deleteHandler(data?.id)}
              style={{ marginRight: "10px" }}
            >
              <DeleteOutlined /> Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Spin />;

  if (isError) return <p>Error : {isError}</p>;

  return (
    <>
      <div className="main" style={{ margin: "10px" }}>
        <div className="bread-cumb">
          <Suspense fallback={<Spin />}>
            <UMBreadCrumb
              items={[
                {
                  label: "Sent Backs",
                  link: `/${role}/expense/suppliers/sent-backs`,
                },

                {
                  label: "Get Return as per Codes",
                  link: `/${role}/expense/codes`,
                },
              ]}
            />
          </Suspense>
        </div>

        <Row>
          <div className="content-section">
            <h2 style={{ margin: "20px", textAlign: "center" }}>
              Draft Bill List
            </h2>
            <Suspense fallback={<Spin />}>
              <RETable
                loading={false}
                columns={columns}
                dataSource={data ? data : []}
                pageSize={10}
                // total={10}
                total={pageCount()}
                //   showSizeChanger={true}
                //   onChangeOfPagintion={onPaginationChange}
                //   onChangeTable={onTableChange}
                showPagination={true}
              ></RETable>
            </Suspense>
          </div>
        </Row>
      </div>
    </>
  );
};

export default DraftBillListPage;
