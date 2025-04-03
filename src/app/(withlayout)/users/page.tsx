"use client";
import React, { Suspense } from "react";
import { Spin, Col, Row, Image } from "antd";
import dayjs from "dayjs";
import RETable from "@/components/ui/RETable";
import { useAllUsersQuery } from "@/redux/api/usersApi";
import { TrademarkOutlined, VerifiedOutlined } from "@ant-design/icons";

const UsersPage = () => {
  const { data } = useAllUsersQuery(undefined);
  // console.log(data);
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    // {
    //   title: "ID",
    //   dataIndex: "member_info",
    //   key: "id",
    // },
    {
      title: "Image",
      dataIndex: "personal_info",
      render: (data: any) => {
        if (data) {
          return (
            <Image
              src={data?.profile_picture}
              width={100}
              alt="profile Image"
            />
          );
        } else return "No Image Found";
      },
    },

    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Joined At",
      dataIndex: "date_joined",

      render: function (data: any) {
        if (data) {
          return dayjs(data).format("DD MMM YYYY HH:mm:ss");
        } else {
          return "Invalid date";
        }
      },

      sorter: (a: any, b: any) => a.createdAt - b.createdAt,
    },
    {
      title: "Share",
      dataIndex: "member_info",
      render: function (data: any) {
        if (data) {
          return (
            <span>
              <TrademarkOutlined style={{ marginRight: 8 }} />
              {Number(data?.share)}
            </span>
          );
        } else {
          return "Zero";
        }
      },
    },

    {
      title: "Is verified",
      dataIndex: "is_verified",

      render: function (data: any) {
        if (data === true) {
          return (
            <span>
              <VerifiedOutlined /> Verified Member
            </span>
          );
        } else return "Not verified";
      },
    },
    {
      title: "Is superuser",
      dataIndex: "is_superuser",

      render: function (data: any) {
        if (data === true) {
          return "A superuser";
        } else return "Not a superuser";
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Page:", page, "PageSize:", pageSize);
    // setPage(page);
    // setSize(pageSize);
  };

  const onTableChange = () => {};

  return (
    <>
      <div className="main" style={{ margin: "20px" }}>
        <Row>
          <Col flex="1 1 200px" style={{ marginRight: "15px" }}>
            <div className="content-section">
              <Suspense fallback={<Spin />}>
                <RETable
                  loading={false}
                  columns={columns}
                  dataSource={data}
                  pageSize={10}
                  total={20}
                  // total={count}
                  showSizeChanger={false}
                  onChangeOfPagintion={onPaginationChange}
                  onChangeTable={onTableChange}
                  showPagination={false}
                />
              </Suspense>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UsersPage;
