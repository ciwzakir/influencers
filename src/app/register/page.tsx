"use client";

import { SubmitHandler } from "react-hook-form";
import { Row, Col, Button, message, Typography } from "antd";
import FormInput from "@/components/forms/FormInput";
import styles from "./register.module.css";

import { useRegisterNewUserMutation } from "@/redux/api/registerUser";
import Form from "@/components/forms/Form";
import { useRouter } from "next/navigation";

const { Title } = Typography;

type FormValues = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
};

const RegisterUserPage = () => {
  const router = useRouter();
  const [registerNewUser] = useRegisterNewUserMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await registerNewUser({ ...data }).unwrap();
      message.success("User registered successfully!");
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail || "Registration failed. Please try again.";
      message.error(errorMessage);
    }
  };
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <Col xs={24} sm={20} md={12} lg={8}>
        <div className={styles.registerContainer}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            Register
          </Title>
          <Form
            submitHandler={onSubmit}
            // resolver={yupResolver(registerUserSchema)}
          >
            <div className={styles.labelInput}>
              <FormInput name="email" type="email" size="large" label="Email" />
            </div>
            <div className={styles.labelInput}>
              <FormInput
                name="first_name"
                type="text"
                size="large"
                label="First Name"
              />
            </div>
            <div className={styles.labelInput}>
              <FormInput
                name="last_name"
                type="text"
                size="large"
                label="Last Name"
              />
            </div>
            <div className={styles.labelInput}>
              <FormInput
                name="password"
                type="password"
                size="large"
                label="Password"
              />
            </div>
            <div className={styles.labelInput}>
              <FormInput
                name="password2"
                type="password"
                size="large"
                label="Confirm Password"
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ fontSize: "16px", marginTop: "16px" }}
            >
              Register
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterUserPage;
