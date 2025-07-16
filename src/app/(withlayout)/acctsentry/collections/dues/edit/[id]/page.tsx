"use client";

import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  message,
  Typography,
  Divider,
} from "antd";
import { SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import FormInput from "@/components/forms/FormInput";
import { getUserInfo } from "@/app/services/auth.service";
import ImageUploaderPage from "@/components/ui/uploadImage";
import Form from "@/components/forms/Form";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useGetSingleDataQuery,
  useUpdateSingleCollectionMutation,
} from "@/redux/api/uttoronapi/colletionsApi";
import FormDatePicker from "@/components/forms/FormDatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import updateDuesSchema from "@/validatorsSchema/collections/collectionsdues";

const { Title, Text } = Typography;

type Inputs = {
  title: string;
  references: string;
  payment_method: string | null;
  payment_image: File | null;
  transaction_date: string | null;
};

const SentToVerify = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user_role } = getUserInfo() as any;

  const {
    data: getSingle,
    isLoading: isFetching,
    refetch,
  } = useGetSingleDataQuery(id);

  const [updateSingleCollection, { isError, isLoading, isSuccess }] =
    useUpdateSingleCollectionMutation();

  const defaultValues = {
    title: getSingle?.title || "",
    references: getSingle?.references || "",
    payment_method: getSingle?.payment_method || "",
    transaction_date: getSingle?.transaction_date || "",
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Your collection is sent for verification");
      router.push(`/${user_role}/collections/verification`);
      refetch();
    }

    if (isError) {
      message.error("Error updating for Confirm Payment.");
    }
  }, [isSuccess, isError, refetch, router, user_role]);

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("references", values.references);
    formData.append("payment_method", values.payment_method || "");
    formData.append("transaction_date", values.transaction_date || "");

    // Key line for backend to set current_payment_status to "paid"
    formData.append("action", "confirm_payment");

    if (values.payment_image instanceof File) {
      formData.append("payment_image", values.payment_image);
    }

    try {
      await updateSingleCollection({
        id,
        data: formData,
      }).unwrap();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3} style={{ color: "#1890ff" }}>
            Confirm Your Payment
          </Title>
          <Text type="secondary">You can edit details before Payment</Text>
          <Divider />
        </div>

        {isFetching ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              tip="Loading payment data..."
            />
          </div>
        ) : (
          <Form
            submitHandler={onSubmit}
            defaultValues={defaultValues}
            resolver={yupResolver(updateDuesSchema)}
          >
            <Row gutter={[32, 16]}>
              {/* Left Column - Image Upload */}
              <Col xs={24} md={10} lg={8} xl={6}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "8px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                  bodyStyle={{ padding: "16px", flex: 1 }}
                >
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Payment Receipt Image
                    </Text>
                    <ImageUploaderPage
                      name="payment_image"
                      defaultImageUrl={getSingle?.payment_image}
                    />
                  </div>
                </Card>
              </Col>

              {/* Right Column - Form Fields */}
              <Col xs={24} md={14} lg={16} xl={18}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <FormInput name="title" label="Title" size="large" />
                  </Col>

                  <Col xs={24} md={12}>
                    <FormInput
                      name="references"
                      label="References"
                      size="large"
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <FormInput
                      name="payment_method"
                      label="Payment Method"
                      size="large"
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <FormDatePicker
                      name="transaction_date"
                      label="Transaction Date"
                      size="large"
                    />
                  </Col>

                  <Col span={24}>
                    <div style={{ textAlign: "right", marginTop: "22px" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        style={{
                          width: "200px",
                          height: "40px",
                          borderRadius: "4px",
                          fontWeight: "500",
                        }}
                      >
                        {isLoading ? "Updating..." : "Confirm Payment"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default SentToVerify;
