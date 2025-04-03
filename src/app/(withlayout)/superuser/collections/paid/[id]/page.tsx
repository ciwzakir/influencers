"use client";
import React, { Suspense } from "react";
import {
  Image,
  Typography,
  Spin,
  Col,
  Row,
  Layout,
  Card,
  Space,
  Result,
  Watermark,
} from "antd";
import { useGetSingleDataQuery } from "@/redux/api/colletionsApi";

const { Title, Text } = Typography;
const { Content } = Layout;

// Fallback loading component
const LoadingFallback = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <Spin size="large" />
  </div>
);

const CollectionDetails = ({ params }: any) => {
  const { id } = params;
  const { data } = useGetSingleDataQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  // console.log(data);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Layout
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "5px",
        }}
      >
        <Content style={{ width: "720px", margin: "0 auto" }}>
          <Watermark content="👍👍👍👍👍👍 uttoron 2005">
            <div className="ww">
              <Card
                bordered={false}
                style={{
                  backgroundColor: "#ffffff",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <Row justify="space-between" align="middle" gutter={[0, 16]}>
                  <Col xs={24} sm={24} md={12}>
                    <Title
                      level={1}
                      style={{ margin: 0, color: "#1890ff", fontSize: "18px" }}
                    >
                      UTTORON 2005
                    </Title>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      Since 2024
                    </Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} style={{ textAlign: "right" }}>
                    <Space direction="vertical" size={0}>
                      <Text strong>{data?.deposit_to?.account_name}</Text>
                      <Text>{data?.deposit_to?.bank_name}</Text>
                      <Text>{data?.deposit_to?.branch_name}</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Card
                bordered={false}
                style={{
                  backgroundColor: "#ffffff",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <h3
                  style={{
                    margin: "5px 0",
                    padding: "1px",
                    textAlign: "center",
                  }}
                >
                  Payment Information
                </h3>
                <Row justify="space-between" align="middle" gutter={[0, 16]}>
                  <Col xs={24} sm={24} md={16}>
                    <Space direction="vertical" size={0}>
                      <Text strong style={{ fontSize: "16px" }}>
                        ` {data?.received_from?.first_name}{" "}
                        {data?.received_from?.last_name}`
                      </Text>
                      {/* <Text>ID: {data?.received_from?.id}</Text> */}
                      <Text>Email: {data?.received_from?.email}</Text>
                      <Text>
                        Your Current Balance: {data?.total_paid_by_user}
                      </Text>
                      <Text>Email: {data?.received_from?.email}</Text>
                    </Space>
                  </Col>

                  <Col>
                    <Row>
                      <Col>
                        <Text strong>Paid Amount : </Text>
                      </Col>
                      <Col style={{ textAlign: "right", paddingLeft: "10px" }}>
                        <Text strong style={{ fontSize: "16px" }}>
                          Tk. {data?.amount}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Text strong>Per Share Charge : </Text>
                      </Col>
                      <Col style={{ textAlign: "right", paddingLeft: "10px" }}>
                        <Text strong style={{ fontSize: "16px" }}>
                          Tk.{data?.receivable_month?.contribution_amount}
                        </Text>
                      </Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Paid on : </Text>
                      </Col>
                      <Col style={{ textAlign: "right", paddingLeft: "10px" }}>
                        <Text>{data?.entry_date}</Text>
                      </Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Month:</Text>
                      </Col>
                      <Col style={{ textAlign: "right", paddingLeft: "10px" }}>
                        <Text>
                          {data?.receivable_month?.contribution_month?.name}
                        </Text>
                      </Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>Fiscal Year:</Text>
                      </Col>
                      <Col style={{ textAlign: "right", paddingLeft: "10px" }}>
                        <Text>{data?.receivable_month?.fiscal_year?.name}</Text>
                      </Col>
                    </Row>
                    <Row justify="space-between" align="middle"></Row>
                  </Col>
                </Row>
              </Card>

              {/* Footer Section */}
              <Card
                bordered={false}
                style={{ backgroundColor: "#ffffff", padding: "1px" }}
              >
                <Row justify="space-between" align="middle" gutter={[0, 16]}>
                  <Col>
                    {
                      <Image
                        src={data?.payment_image}
                        width="100%"
                        alt="Payment Image"
                        style={{
                          borderRadius: "8px",
                          maxWidth: "400px",
                        }}
                      />
                    }
                  </Col>
                  <Col>
                    <Result
                      status="success"
                      title={data?.current_payment_status}
                      subTitle="Your payment successful."
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </Watermark>
        </Content>
      </Layout>
    </Suspense>
  );
};

export default CollectionDetails;
