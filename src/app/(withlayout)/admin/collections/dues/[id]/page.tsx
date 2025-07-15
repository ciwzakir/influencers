"use client";

import React, { useState } from "react";
import {
  Image,
  Typography,
  Spin,
  Col,
  Row,
  Card,
  Space,
  theme,
  Layout,
  Button,
} from "antd";
import { useGetSingleDataQuery } from "@/redux/api/uttoronapi/colletionsApi";
import {
  UserOutlined,
  TrademarkCircleFilled,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import { getUserInfo } from "@/app/services/auth.service";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

const LoadingFallback = () => (
  <div style={{ textAlign: "center", padding: "80px 0" }}>
    <Spin size="large" />
    <Text style={{ display: "block", marginTop: 16 }}>
      Loading payment details...
    </Text>
  </div>
);

const formatDate = (dateString) => {
  return dayjs(dateString).format("DD MMM YYYY");
};

const CollectionDetails = ({ params }: any) => {
  const { user_role } = getUserInfo() as any;

  const { token } = useToken();
  const { id } = params;
  const { data, isLoading } = useGetSingleDataQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [isHovering, setIsHovering] = useState({
    userInfo: false,
    paymentSummary: false,
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      {/* Header Card */}
      <Card
        bordered={false}
        style={{
          marginBottom: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={4}>
              <Title level={3} style={{ margin: 0 }}>
                UTTORON 2005
              </Title>
              <Text type="secondary">Since 2024</Text>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space direction="vertical" size={0}>
              <Text strong>{data?.deposit_to?.account_name || "N/A"}</Text>
              <Text type="secondary">
                {data?.deposit_to?.bank_name || "N/A"}
              </Text>
              <Text type="secondary">
                {data?.deposit_to?.branch_name || "N/A"}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content Card */}
      <Card style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          {/* Image Column */}
          <Col xs={24} md={10}>
            <Image
              src={data?.payment_image}
              alt="Payment Proof"
              width="100%"
              style={{
                objectFit: "cover",
                borderRadius: 8,
              }}
              placeholder
              fallback="https://via.placeholder.com/400x300?text=No+Image"
            />
          </Col>

          {/* Content Column */}
          <Col xs={24} md={14}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={2}>
                Hi, Mr. {data?.received_from?.first_name}{" "}
                {data?.received_from?.last_name}
              </Title>
              <Text style={{ fontSize: 16, color: "#555" }}>
                <small>
                  The amount receivable for the month{" "}
                  <strong>
                    {data?.receivable_month?.contribution_month?.name}
                  </strong>{" "}
                  (FY:{" "}
                  <strong>{data?.receivable_month?.fiscal_year?.name}</strong>
                  ). Total contribution amount is Tk.{" "}
                  <strong>
                    <u>{data?.receivable_month?.contribution_amount}</u>
                  </strong>{" "}
                  per share and it was due on{" "}
                  <strong>
                    <u>{formatDate(data?.due_date)}</u>
                  </strong>
                </small>
                <small>
                  . Please pay your due bill in time. To pay now just click on
                  pay now button.
                </small>
              </Text>

              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    transform: isHovering.userInfo
                      ? "translateX(5px)"
                      : "translateX(0)",
                    boxShadow: isHovering.userInfo
                      ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                  onMouseEnter={() =>
                    setIsHovering((prev) => ({ ...prev, userInfo: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovering((prev) => ({ ...prev, userInfo: false }))
                  }
                >
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Space size="middle">
                      <UserOutlined
                        style={{ fontSize: 24, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5}>
                          Receivable from
                        </Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            marginTop: 8,
                            marginBottom: 8,
                          }}
                        >
                          <li>
                            <Text type="secondary">
                              Name:{" "}
                              <strong>
                                {data?.received_from?.first_name}{" "}
                                {data?.received_from?.last_name}
                              </strong>
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Email address:{" "}
                              <strong>{data?.received_from?.email}</strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>

                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    transform: isHovering.paymentSummary
                      ? "translateX(5px)"
                      : "translateX(0)",
                    boxShadow: isHovering.paymentSummary
                      ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                  onMouseEnter={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: false,
                    }))
                  }
                >
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Space size="middle">
                      <TrademarkCircleFilled
                        style={{ fontSize: 24, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5}>Pay To:</Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            marginTop: 8,
                            marginBottom: 8,
                          }}
                        >
                          <li>
                            <Text type="secondary">
                              Bank Name:{" "}
                              <strong>{data?.deposit_to?.bank_name}</strong>
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Branch Name:{" "}
                              <strong>{data?.deposit_to?.branch_name}</strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>

                <Card
                  hoverable
                  style={{
                    borderRadius: 10,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    transform: isHovering.paymentSummary
                      ? "translateX(5px)"
                      : "translateX(0)",
                    boxShadow: isHovering.paymentSummary
                      ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                  onMouseEnter={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: false,
                    }))
                  }
                >
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Space size="middle">
                      <TrademarkCircleFilled
                        style={{ fontSize: 24, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5}>
                          Payment Info
                        </Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            marginTop: 8,
                            marginBottom: 8,
                          }}
                        >
                          <li>
                            <Text type="secondary">
                              Pay Now: <strong>{data?.amount}</strong>
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Current Balance:{" "}
                              <strong>
                                {data?.deposit_to?.current_balance}
                              </strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row justify="end">
          <Link href={`/${user_role}/collections/dues/edit/${id}`}>
            <Button type="primary" ghost icon={<EditOutlined />}>
              Pay Now
            </Button>
          </Link>
        </Row>
      </Card>
    </Content>
  );
};

export default CollectionDetails;
