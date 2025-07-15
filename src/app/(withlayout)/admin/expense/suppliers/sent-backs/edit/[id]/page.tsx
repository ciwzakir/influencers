"use client";
import { Button, Col, Row, message, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Form from "@/components/forms/Form";
import { getUserInfo } from "@/app/services/auth.service";
import {
  useGetSingleBillQuery,
  useUpdateDraftBillMutation,
} from "@/redux/api/draftApi";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTextArea from "@/components/forms/FormTextArea";
import { sentBackSchema } from "@/validatorsSchema/bills/sentback";

type FormValues = {
  title: string;
  bills_status: string;
};

const SentBackstBill = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data: getSingleData, isLoading } = useGetSingleBillQuery(id);

  const userInfo = getUserInfo() as any;
  const role = userInfo?.user_role ?? "admin";
  const router = useRouter();
  console.log("getSingleData", getSingleData?.title);

  const initialValues = {
    title: getSingleData?.title || "",
    bills_status: getSingleData?.bills_status || "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: {}, // Removed unused errors destructuring
  } = useForm<FormValues>();

  const [updateDraftBill, { isLoading: isUpdating }] =
    useUpdateDraftBillMutation();

  const onSubmit = async (formData: FormValues) => {
    try {
      await updateDraftBill({
        id,
        data: {
          title: formData.title,
          bills_status: formData.bills_status,
        },
      }).unwrap();
      message.success("Updated successfully");
      if (role) {
        router.push(`/${role}/expense/suppliers/draft`);
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update");
    }
  };

  useEffect(() => {
    if (getSingleData) {
      reset({
        bills_status: getSingleData?.bills_status || "",
      });
    }
  }, [getSingleData, reset]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="main">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
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
              Update Bill ID: {id}
            </h1>
            <div>
              <Form
                submitHandler={handleSubmit(onSubmit)}
                defaultValues={initialValues}
                resolver={yupResolver(sentBackSchema)}
              >
                <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                  <Col span={24} style={{ margin: "10px 0" }}>
                    <Controller
                      name="bills_status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          style={{ width: "100%" }}
                          options={[
                            { value: "PAID", label: "Paid" },
                            { value: "AWAITING", label: "Awaiting Payment" },
                            { value: "PENDING", label: "Pending" },
                            {
                              value: "SENT_BACK",
                              label: "Sent Back for correction",
                            },
                          ]}
                        />
                      )}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col span={24} style={{ margin: "10px 0" }}>
                    <FormTextArea
                      name="title"
                      label="Title"
                      placeholder="Title"
                    />
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit" loading={isUpdating}>
                  Update
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SentBackstBill;
