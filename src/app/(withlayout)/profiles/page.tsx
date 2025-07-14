"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Layout,
  Row,
  Col,
  Descriptions,
  Divider,
  message,
  Card,
  Switch,
  Typography,
  Avatar,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  FacebookOutlined,
  BankOutlined,
} from "@ant-design/icons";

import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";
import { useMyProfileQuery } from "@/redux/api/authApi";
// import { ExperienceProvider } from "./misc/contexts/ExperienceContext";
// import MyPlan from "./misc/myPlan";
// import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Content } = Layout;

const MyProfilePage = () => {
  // type Qualification = {
  //   id: number;
  //   certification: string;
  //   institute_name: string;
  //   graduation_year: number;
  // };
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { user_id: id } = getUserInfo() as any;

  const { data, error, isLoading } = useMyProfileQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  console.log(data);
  const imageUrl = data?.personal_info?.profile_picture || "";
  const {
    personal_info = {},
    member_info = {},
    // qualifications = [],
    // experiences_info = [],
  } = data || {};

  // const columns: ColumnsType<Qualification> = [
  //   {
  //     title: "Certification",
  //     dataIndex: "certification",
  //     key: "certification",
  //     responsive: ["xs", "sm", "md"],
  //   },
  //   {
  //     title: "Institute Name",
  //     dataIndex: "institute_name",
  //     key: "institute_name",
  //     responsive: ["xs", "sm", "md"],
  //   },
  //   {
  //     title: "Passing Year",
  //     dataIndex: "graduation_year",
  //     key: "graduation_year",
  //     responsive: ["xs", "sm", "md"],
  //   },
  // ];

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
    error && typeof error.status === "number";

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  if (isLoading) return <p>Loading profile...</p>;
  // if (!data) return <p>No profile data found.</p>;
  if (error) return <p>Failed to load profile. Please try again later.</p>;

  return (
    <Suspense fallback="Loading">
      <div style={{ padding: "16px" }}>
        <UMBreadCrumb
          items={[{ label: "Edit Profile", link: `profiles/edit/${data.id}` }]}
        />

        <Layout style={{ background: "#f0f2f5", padding: "20px" }}>
          <Content
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              background: "#fff",
              padding: "24px",
              borderRadius: "10px",
            }}
          >
            <Row gutter={[16, 16]} align="top">
              {/* Left section: User Name */}
              <Col xs={24} md={12}>
                <div style={{ textAlign: "left" }}>
                  <Typography.Text strong style={{ fontSize: "18px" }}>
                    {data?.full_name || "User Name"}
                  </Typography.Text>
                  <p style={{ margin: "4px 0" }}>Member of Uttoron 2005</p>
                </div>
              </Col>

              {/* Right section: Contact Info */}
              <Col
                xs={24}
                md={12}
                style={{
                  textAlign: "left", // default left
                }}
              >
                <div
                  style={{
                    textAlign: "right",
                  }}
                  className="contact-section"
                >
                  <Typography.Text>
                    <MailOutlined />
                    <span style={{ paddingLeft: "6px" }}>
                      {data?.email || "Not Available"}
                    </span>
                    <br />
                    <PhoneOutlined />
                    <span style={{ paddingLeft: "6px" }}>
                      {personal_info?.phone_number || "Not Available"}
                    </span>
                    <br />
                    <BankOutlined />
                    <span style={{ paddingLeft: "6px" }}>
                      {personal_info?.employment_address || "Not Available"}
                    </span>
                  </Typography.Text>

                  <div style={{ marginTop: "8px" }}>
                    <Typography.Link
                      href="https://whatsapp.com"
                      target="_blank"
                      style={{ marginRight: "12px" }}
                    >
                      <WhatsAppOutlined /> WhatsApp
                    </Typography.Link>
                    <Typography.Link
                      href="https://facebook.com"
                      target="_blank"
                    >
                      <FacebookOutlined /> Facebook
                    </Typography.Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            <Card loading={loading} style={{ width: "100%" }}>
              <Card.Meta
                avatar={<Avatar src={imageUrl} size={64} />}
                title={`This is ${data.first_name}`}
                description={
                  <p style={{ textAlign: "justify" }}>
                    {member_info?.short_bio || "No bio available"}
                  </p>
                }
              />
            </Card>

            <Switch
              checked={!loading}
              onChange={(checked) => setLoading(!checked)}
              style={{ marginTop: "10px" }}
            />

            <Divider />

            <Title level={4}>PERSONAL INFORMATION :</Title>
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2 }}
              bordered={false}
              layout="vertical"
            >
              <Descriptions.Item label="Father's Name">
                {personal_info?.father_name || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Mother's Name">
                {personal_info?.mother_name || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {personal_info?.dob || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {personal_info?.gender
                  ? personal_info.gender.charAt(0).toUpperCase() +
                    personal_info.gender.slice(1)
                  : "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Marital Status">
                {personal_info?.marital_status
                  ? personal_info.marital_status.charAt(0).toUpperCase() +
                    personal_info.marital_status.slice(1)
                  : "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Nationality">
                {personal_info?.nationality || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {personal_info?.phone_number || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Employed in">
                {personal_info?.employment_address || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Present Address">
                {personal_info?.present_address || "Not Available"}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent Address">
                {personal_info?.permanent_address || "Not Available"}
              </Descriptions.Item>
            </Descriptions>

            {/* <Divider />
          <Title level={4}>ACADEMIC HISTORY (Under constructions)</Title>

          <Table
            dataSource={qualifications}
            columns={columns}
            pagination={false}
            rowKey={(record) => record.id}
            scroll={{ x: "100%" }}
          />

          <Divider />

          <ExperienceProvider experiences={experiences_info}>
            <Title level={4}>Under Constructions</Title>
            <MyPlan />
          </ExperienceProvider>

          <Divider />

          <Title level={4}>More Info</Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Number of Share">
              {member_info?.share || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Your Role">
              {member_info?.user_role || member_info?.id}
            </Descriptions.Item>
            <Descriptions.Item label="Joined On">
              {data?.date_joined || "Not Available"}
            </Descriptions.Item>
          </Descriptions> */}
          </Content>
        </Layout>
      </div>
    </Suspense>
  );
};

export default MyProfilePage;
