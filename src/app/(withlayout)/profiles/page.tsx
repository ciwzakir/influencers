"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Layout, Row, Col, message, Typography, Card, Image } from "antd";
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

const { Meta } = Card;

const { Title } = Typography;

const { Content } = Layout;

const MyProfilePage = () => {
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

                  <p className={styles.userMeta}>Member of Uttoron 2005</p>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={styles.contactContainer}>
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
                      <br />
                      <Typography.Link
                        href="https://whatsapp.com"
                        target="_blank"
                        className={styles.contactItem}
                      >
                        <FacebookOutlined /> Facebook
                      </Typography.Link>

                      <Typography.Link
                        href="https://facebook.com"
                        target="_blank"
                        className={styles.contactItem}
                      >
                        <WhatsAppOutlined /> WhatsApp
                      </Typography.Link>
                    </Typography.Text>
                  </div>
                </div>
              </Col>
            </Row>

            <div className={styles.profileSection}>
              <div className={styles.splitterWrapper}>
                {/* Left Panel */}
                <div className={styles.leftPanel}>
                  <h2 style={{ padding: "50px 0 0" }}>
                    <span style={{ color: "#020711ff" }}>My Goal</span>
                  </h2>
                  <p
                    className={styles.profileBio}
                    style={{ marginTop: "20px" }}
                  >
                    {member_info?.short_bio || "No bio available"}
                  </p>
                </div>

                {/* Right Panel */}
                <div className={styles.rightPanel}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      maxWidth: 280,
                      margin: "0 auto",
                      borderRadius: 12,
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                    }}
                    bodyStyle={{ padding: "12px 16px" }}
                    cover={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: 16,
                        }}
                      >
                        <Image
                          alt={data?.name}
                          src={imageUrl}
                          width="100%"
                          style={{
                            maxWidth: 220,
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </div>
                    }
                  >
                    <Meta
                      title={data?.member_info?.appointment || "No appointment"}
                      style={{ textAlign: "center" }}
                    />
                  </Card>
                </div>
              </div>
            </div>

            <div className={styles.portfolioSection}>
              <h3 className={styles.sectionHeader}>Personal Details</h3>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Father Name</span>
                  <span className={styles.detailValue}>
                    {personal_info?.father_name || "—"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mother Name</span>
                  <span className={styles.detailValue}>
                    {personal_info?.mother_name || "—"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date of Birth</span>
                  <span className={styles.detailValue}>
                    {personal_info?.dob || "—"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Gender</span>
                  <span className={styles.detailValue}>
                    {personal_info?.gender
                      ? personal_info.gender.charAt(0).toUpperCase() +
                        personal_info.gender.slice(1)
                      : "—"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Marital Status</span>
                  <span className={styles.detailValue}>
                    {personal_info?.marital_status
                      ? personal_info.marital_status.charAt(0).toUpperCase() +
                        personal_info.marital_status.slice(1)
                      : "—"}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nationality</span>
                  <span className={styles.detailValue}>
                    {personal_info?.nationality || "—"}
                  </span>
                </div>
              </div>
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
