"use client";

import { Button, Card, Col, Row, Spin, message, Typography } from "antd";
import { SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import Form from "@/components/forms/Form";
import FormInput from "@/components/forms/FormInput";
import FormDatePicker from "@/components/forms/FormDatePicker";
import ImageUploaderPage from "@/components/ui/uploadImage";

import { getUserInfo } from "@/app/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import updateDuesSchema from "@/validatorsSchema/collections/collectionsdues";
import {
  useGetSingleDataQuery,
  useUpdateSingleCollectionMutation,
} from "@/redux/api/uttoronapi/colletionsApi";

const { Title } = Typography;

type Inputs = {
  title: string;
  references: string;
  payment_method: string | null;
  payment_image: File | null;
  transaction_date: string | null;
};

const SendBackCollections = () => {
  const { id } = useParams();
  const router = useRouter();
  const userInfo = getUserInfo() as any;
  const role = userInfo?.user_role ?? "superuser";

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
      message.success("Collection sent back as due.");
      router.push(`/${role}/collections/dues`);
      refetch();
    }

    if (isError) {
      message.error("Error updating collection.");
    }
  }, [isSuccess, isError, refetch, router, role]);

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("references", values.references);
    formData.append("payment_method", values.payment_method || "");
    formData.append("transaction_date", values.transaction_date || "");
    formData.append("action", "confirm_as_due");

    if (values.payment_image instanceof File) {
      formData.append("payment_image", values.payment_image);
    }

    try {
      await updateSingleCollection({ id, data: formData }).unwrap();
    } catch (error) {
      console.error("Error updating collection:", error);
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
          <Title level={3} style={{ color: "#fa8c16" }}>
            Review & Send Back Collection as Due
          </Title>
        </div>

        {isFetching ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              tip="Loading collection data..."
            />
          </div>
        ) : (
          <Form
            submitHandler={onSubmit}
            defaultValues={defaultValues}
            resolver={yupResolver(updateDuesSchema)}
          >
            <Row gutter={[32, 16]}>
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
                    <ImageUploaderPage
                      name="payment_image"
                      defaultImageUrl={getSingle?.payment_image}
                    />
                  </div>
                </Card>
              </Col>

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

                  <Col xs={24} style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      danger
                      size="large"
                      style={{
                        marginTop: "22px",
                        width: "220px",
                        height: "45px",
                        borderRadius: "6px",
                        fontWeight: "600",
                      }}
                    >
                      {isLoading ? "Processing..." : "Send Back as Due"}
                    </Button>
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

export default SendBackCollections;
