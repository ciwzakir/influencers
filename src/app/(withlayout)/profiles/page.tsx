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
import styles from "./profile.module.css";
import "./profile.module.css";

const { Title } = Typography;
const { Content } = Layout;

const MyProfilePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { user_id: id } = getUserInfo() as any;

  const { data, error, isLoading } = useMyProfileQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const imageUrl = data?.personal_info?.profile_picture || "";
  const { personal_info = {}, member_info = {} } = data || {};

  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
    error && typeof error.status === "number";

  useEffect(() => {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      message.error("Unauthorized access. Please log in.");
      router.push("/profiles");
    }
  }, [error, router]);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Failed to load profile. Please try again later.</p>;

  return (
    <Suspense fallback="Loading">
      <div className={styles.pageContainer}>
        <UMBreadCrumb
          items={[{ label: "Edit Profile", link: `profiles/edit/${data.id}` }]}
        />

        <Layout className={styles.layout}>
          <Content className={styles.content}>
            {/* Top Section */}
            <Row gutter={[16, 16]} align="top">
              <Col xs={24} md={12}>
                <div className={styles.userInfo}>
                  <Typography.Text strong className={styles.userName}>
                    {data?.full_name || "User Name"}
                  </Typography.Text>
                  <p className={styles.userMeta}>{member_info.appointment}</p>
                  <p className={styles.userMeta}>Member of Uttoron 2005</p>
                </div>
              </Col>

              <Col xs={24} md={12} className="contact-section">
                <div className={styles.contactInfo}>
                  <Typography.Text>
                    <MailOutlined />
                    <span className={styles.contactItem}>
                      {data?.email || "Not Available"}
                    </span>
                    <br />
                    <PhoneOutlined />
                    <span className={styles.contactItem}>
                      {personal_info?.phone_number || "Not Available"}
                    </span>
                    <br />
                    <BankOutlined />
                    <span className={styles.contactItem}>
                      {personal_info?.employment_address || "Not Available"}
                    </span>
                  </Typography.Text>

                  <div className={styles.socialLinks}>
                    <Typography.Link
                      href="https://whatsapp.com"
                      target="_blank"
                      className={styles.socialLink}
                    >
                      <WhatsAppOutlined /> WhatsApp
                    </Typography.Link>
                    <Typography.Link
                      href="https://facebook.com"
                      target="_blank"
                      className={styles.socialLink}
                    >
                      <FacebookOutlined /> Facebook
                    </Typography.Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider className={styles.divider} />

            {/* Profile Card */}
            <Card loading={loading} className={styles.profileCard} hoverable>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6} md={4} lg={3} xl={2}>
                  <Avatar
                    src={imageUrl}
                    size={{
                      xs: 64,
                      md: 64,
                      lg: 72,
                      xl: 80,
                    }}
                    className={styles.profileAvatar}
                  />
                </Col>

                <Col xs={24} sm={18} md={20} lg={21} xl={22}>
                  <div className={styles.profileContent}>
                    <h3 className={styles.profileTitle}>
                      Hi {data.first_name}
                    </h3>
                    <p className={styles.profileBio}>
                      {member_info?.short_bio || "No bio available"}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>

            <Switch
              checked={!loading}
              onChange={(checked) => setLoading(!checked)}
              className={styles.toggleSwitch}
              style={{ marginBottom: "20px" }}
            />

            {/* Personal Information Section */}
            <div className={styles.sectionContainer}>
              <Title level={4} className={styles.sectionTitle}>
                Personal Information
              </Title>

              <Descriptions
                layout="horizontal"
                bordered={false}
                column={{
                  xs: 1, // Always 1 column on extra small devices
                  sm: 1, // 1 column on small devices
                  md: 2, // 2 columns on medium and larger
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                colon={false}
                labelStyle={{
                  fontWeight: 500,
                  minWidth: "120px",
                  wordBreak: "break-word",
                  paddingBottom: "8px", // Added spacing for vertical layout
                }}
                contentStyle={{
                  color: "#444",
                  wordBreak: "break-word",
                  paddingBottom: "16px", // Added spacing between items
                }}
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
              </Descriptions>
            </div>
            {/* Address Section */}

            {data && (
              <div className={styles.addressSection}>
                <Title level={4} className={styles.sectionTitle}>
                  Address
                </Title>
                <Row gutter={[16, 16]}>
                  {[
                    {
                      title: "Present Address",
                      value: personal_info?.present_address,
                    },
                    {
                      title: "Permanent Address",
                      value: personal_info?.permanent_address,
                    },
                    {
                      title: "Employment Address",
                      value: personal_info?.employment_address,
                    },
                  ].map((item, index) => (
                    <Col key={index} xs={24} sm={12} md={8}>
                      <div className={styles.addressCard}>
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <p className={styles.addressText}>
                          {item.value || "Not Available"}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </Suspense>
  );
};

export default MyProfilePage;
