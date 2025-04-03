"use client";

import { Button, Col, Row, Spin, message } from "antd";
import { SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import FormInput from "@/components/forms/FormInput";
import {
  useGetSingleDataQuery,
  useUpdateSingleDataMutation,
} from "@/redux/api/colletionsApi";
import Form from "@/components/forms/Form";

type Inputs = {
  title: string;
  references: string;
  payment_method: string | null;
  // payment_image: File | null;
  transaction_date: string | null;
};

const EditAndPay = () => {
  const params = useParams();
  const id = params?.id;

  // Fetching single data with refetch method
  const {
    data: getSingle,
    isLoading: isFetching,
    refetch, // This method will be used to refetch the data after update
  } = useGetSingleDataQuery(id);

  // Mutation for updating the data
  const [updateSingleData, { isError, isLoading, isSuccess }] =
    useUpdateSingleDataMutation();

  // Use useEffect to trigger the refetch and message on successful update
  useEffect(() => {
    if (isSuccess) {
      message.success("Collection updated successfully!");
      refetch();
    }

    if (isError) {
      message.error("Error updating post.");
    }
  }, [isSuccess, isError, refetch]);

  // Form submission handler
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await updateSingleData({
        id,
        title: formData.title,
        references: formData.references,
        payment_method: formData.payment_method,
        // payment_image: imageUrl,
        transaction_date: formData.transaction_date,
        current_payment_status: "paid",
      }).unwrap();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const defaultValues = {
    title: getSingle?.title || "",
    references: getSingle?.references || "",
    payment_method: getSingle?.payment_method || "",
    payment_image: getSingle?.payment_image || "",
    transaction_date: getSingle?.transaction_date || "",
  };

  return (
    <div className="main">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col sm={12} md={16} lg={10}></Col>
        <Col sm={12} md={8} lg={8}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
            }}
          >
            <h1 style={{ margin: "15px 0px", textAlign: "center" }}>
              Update the Collection ID: {id}
            </h1>

            {/* Loading state while fetching data */}
            {isFetching ? (
              <Spin tip="Loading data..." />
            ) : (
              <div>
                <Form submitHandler={onSubmit} defaultValues={defaultValues}>
                  <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                    <Col span={8} style={{ margin: "10px 0" }}>
                      <FormInput name="title" label="Title" />
                    </Col>
                    <Col span={8} style={{ margin: "10px 0" }}>
                      <FormInput name="references" label="References" />
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                    <Col span={8} style={{ margin: "10px 0" }}>
                      <FormInput name="payment_method" label="payment_method" />
                    </Col>
                    <Col span={8} style={{ margin: "10px 0" }}>
                      <FormInput
                        name="transaction_date"
                        label="transaction_date"
                      />
                    </Col>
                  </Row>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Update
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditAndPay;
