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
// import dayjs from "dayjs";

const UsersPage: React.FC = () => {
  const { data } = useAllUsersQuery(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const totalDataLength = () => data?.length || 0;

  const columns = [
    {
      title: "Image",
      dataIndex: "personal_info",
      render: (info: any) =>
        info?.profile_picture ? (
          <Image
            src={info.profile_picture}
            width={60}
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
      title: "Email",
      dataIndex: "email",
    },
    // {
    //   title: "Joined At",
    //   dataIndex: "date_joined",
    //   render: (date: string) =>
    //     date ? dayjs(date).format("DD MMM YYYY HH:mm:ss") : "Invalid date",
    //   sorter: (a: any, b: any) =>
    //     new Date(a.date_joined).getTime() - new Date(b.date_joined).getTime(),
    // },
    {
      title: "Share Number",
      dataIndex: "member_info",
      render: (info: any) =>
        info ? <span>{Number(info.share)}</span> : "Zero",
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Page:", page, "PageSize:", pageSize);
  };

  const onTableChange = () => {};

  return (
    <div style={{ padding: 16 }}>
      <Carousel autoplay dots={false} style={{ maxWidth: "100%" }}>
        {data?.map((user: any) => (
          <div key={user?.id} style={{ padding: 8 }}>
            <Switch
              checked={!loading}
              onChange={(checked) => setLoading(!checked)}
              style={{ marginBottom: 12 }}
            />
            <Card
              loading={loading}
              style={{
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Card.Meta
                avatar={<Avatar src={user?.personal_info?.profile_picture} />}
                title={`${user?.first_name} ${user?.last_name}`}
                description={
                  <>
                    <h3>{user?.member_info?.appointment}</h3>
                    <p>{user?.member_info?.short_bio}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: 8,
                      }}
                    >
                      <Rate
                        allowHalf
                        disabled
                        defaultValue={user?.member_info?.share}
                      />
                      <span style={{ fontWeight: "bold" }}>
                        {user?.member_info?.share}
                      </span>
                    </div>
                  </>
                }
              />
            </Card>
          </div>
        ))}
      </Carousel>

      <div style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card bordered title="OUR VALUED MEMBERS">
              <Suspense fallback={<Spin />}>
                <div style={{ overflowX: "auto" }}>
                  <RETable
                    loading={false}
                    columns={columns}
                    dataSource={data}
                    pageSize={4}
                    total={totalDataLength()}
                    showSizeChanger={false}
                    onChangeOfPagintion={onPaginationChange}
                    onChangeTable={onTableChange}
                    showPagination={true}
                  />
                </div>
              </Suspense>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UsersPage;
