"use client";

import React, { Suspense, useState } from "react";
import {
  Avatar,
  Card,
  Carousel,
  Col,
  Image,
  Rate,
  Row,
  Spin,
  Switch,
} from "antd";
import { useAllUsersQuery } from "@/redux/api/usersApi";
import RETable from "@/components/ui/RETable";
import { TrademarkOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const UsersPage: React.FC = () => {
  const { data } = useAllUsersQuery(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "personal_info",
      render: (info: any) =>
        info?.profile_picture ? (
          <Image
            src={info.profile_picture}
            width={80}
            alt="Profile"
            style={{ borderRadius: "8px" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Joined At",
      dataIndex: "date_joined",
      render: (date: string) =>
        date ? dayjs(date).format("DD MMM YYYY HH:mm:ss") : "Invalid date",
      sorter: (a: any, b: any) =>
        new Date(a.date_joined).getTime() - new Date(b.date_joined).getTime(),
    },
    {
      title: "Share",
      dataIndex: "member_info",
      render: (info: any) =>
        info ? (
          <span>
            <TrademarkOutlined style={{ marginRight: 6 }} />
            {Number(info.share)}
          </span>
        ) : (
          "Zero"
        ),
    },
    {
      title: "Is verified",
      dataIndex: "is_verified",
      render: (val: boolean) => (val ? <span>Verified</span> : "Not verified"),
    },
    {
      title: "Is superuser",
      dataIndex: "is_superuser",
      render: (val: boolean) => (val ? "Superuser" : "Regular"),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Page:", page, "PageSize:", pageSize);
  };

  const onTableChange = () => {};

  return (
    <div style={{ padding: 20 }}>
      <Carousel autoplay dots={false}>
        {data?.map((user: any) => (
          <div key={user?.id}>
            <Switch
              checked={!loading}
              onChange={(checked) => setLoading(!checked)}
            />
            <Card
              loading={loading}
              style={{ minWidth: 500, marginTop: "15px" }}
            >
              <Card.Meta
                avatar={<Avatar src={user?.personal_info?.profile_picture} />}
                title={`${user?.first_name} ${user?.last_name}`}
                description={
                  <>
                    <h3>{user?.member_info?.appointment}</h3>
                    <p>{user?.member_info?.short_bio}</p>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "justify",
                        gap: "15px",
                      }}
                    >
                      <span>
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={user?.member_info?.share}
                        />
                      </span>
                      <span style={{ fontWeight: "bold" }}>
                        || {user?.member_info?.share}
                      </span>
                    </div>
                  </>
                }
              />
            </Card>
          </div>
        ))}
      </Carousel>

      <div className="">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered title="OUR VALUED MEMBERS">
              <Suspense fallback={<Spin />}>
                <RETable
                  loading={false}
                  columns={columns}
                  dataSource={data}
                  pageSize={5}
                  total={15}
                  showSizeChanger={false}
                  onChangeOfPagintion={onPaginationChange}
                  onChangeTable={onTableChange}
                  showPagination={true}
                />
              </Suspense>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UsersPage;
