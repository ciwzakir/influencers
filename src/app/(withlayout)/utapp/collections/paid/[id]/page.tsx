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
} from "antd";
import { useGetSingleDataQuery } from "@/redux/api/uttoronapi/colletionsApi";
import {
  UserOutlined,
  TrademarkCircleFilled,
  BankOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useMyProfileQuery } from "@/redux/api/authApi";

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

const PaidDetails = ({ params }: any) => {
  const { token } = useToken();
  const { id } = params;

  const { data: profileDataLoad } = useMyProfileQuery(id);

  const { data, isLoading } = useGetSingleDataQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [isHovering, setIsHovering] = useState({
    userInfo: false,
    paymentSummary: false,
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <Content style={{ padding: "0px", backgroundColor: "#f0f2f5" }}>
      {/* Header Card */}
      <Card
        bordered={false}
        style={{
          marginBottom: "0px",
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
              height="auto"
              style={{
                objectFit: "cover",
                borderRadius: 8,
                maxHeight: 500,
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
                  Tk.
                  <strong>
                    <u>{data?.receivable_month?.contribution_amount}</u>
                  </strong>{" "}
                  has been received for the month of{" "}
                  <strong>
                    {data?.receivable_month?.contribution_month?.name}
                  </strong>
                  (FY:
                  <strong>{data?.receivable_month?.fiscal_year?.name}</strong>
                  ). The valued member has {
                    profileDataLoad?.member_info?.share
                  }{" "}
                  share .So he he has paid{" "}
                  {data?.receivable_month?.contribution_amount} {"x"}{" "}
                  {profileDataLoad?.member_info?.share} = {data?.amount}{" "}
                  {"Taka on "}
                  <strong>
                    <u>{formatDate(data?.transaction_date)}.</u>
                  </strong>
                </small>
              </Text>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  width: "100%",
                }}
              >
                {/* Card 1: User Info */}
                <Card
                  hoverable
                  style={{
                    borderRadius: 0,
                    flex: "1 1 300px",
                    minWidth: 280,
                    maxWidth: 400,
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
                    <Space size="small">
                      <UserOutlined
                        style={{ fontSize: 20, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5} style={{ marginBottom: 4 }}>
                          Received from
                        </Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            margin: 0,
                            fontSize: 13,
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
                              Email:{" "}
                              <strong>{data?.received_from?.email}</strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>

                {/* Card 2: Pay To */}
                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    flex: "1 1 300px",
                    minWidth: 280,
                    maxWidth: 400,
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
                    setIsHovering((prev) => ({ ...prev, paymentSummary: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: false,
                    }))
                  }
                >
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Space size="small">
                      <BankOutlined
                        style={{ fontSize: 20, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5} style={{ marginBottom: 4 }}>
                          Paid To
                        </Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            margin: 0,
                            fontSize: 13,
                          }}
                        >
                          <li>
                            <Text type="secondary">
                              Bank:{" "}
                              <strong>{data?.deposit_to?.bank_name}</strong>
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Branch:{" "}
                              <strong>{data?.deposit_to?.branch_name}</strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>

                {/* Card 3: Payment Info */}
                <Card
                  hoverable
                  style={{
                    borderRadius: 10,
                    flex: "1 1 300px",
                    minWidth: 280,
                    maxWidth: 400,
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
                    setIsHovering((prev) => ({ ...prev, paymentSummary: true }))
                  }
                  onMouseLeave={() =>
                    setIsHovering((prev) => ({
                      ...prev,
                      paymentSummary: false,
                    }))
                  }
                >
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <Space size="small">
                      <TrademarkCircleFilled
                        style={{ fontSize: 20, color: token.colorPrimary }}
                      />
                      <div>
                        <Typography.Title level={5} style={{ marginBottom: 4 }}>
                          Payment Info
                        </Typography.Title>
                        <ul
                          style={{
                            listStyle: "none",
                            paddingLeft: 0,
                            margin: 0,
                            fontSize: 13,
                          }}
                        >
                          <li>
                            <Text type="secondary">
                              Paid Amount: <strong>{data?.amount}</strong>
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Your Current Deposit:{" "}
                              <strong>
                                {parseFloat(data.total_paid_by_user).toFixed(2)}
                              </strong>
                            </Text>
                          </li>
                          <li>
                            <Text strong style={{ fontSize: "16px" }}>
                              All Members Deposit:{" "}
                              {parseFloat(data?.total_deposit_by_all).toFixed(
                                2
                              )}
                            </Text>
                          </li>
                          <li>
                            <Text type="secondary">
                              Status:{" "}
                              <strong
                                style={{ color: "rgba(100, 149, 237, 1)" }}
                              >
                                {data?.current_payment_status_display}
                              </strong>
                            </Text>
                          </li>
                        </ul>
                      </div>
                    </Space>
                  </div>
                </Card>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default PaidDetails;
