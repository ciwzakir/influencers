"use client";

import "./Login.module.css";
import { Col, Row, Button, message } from "antd";
import loginImage from "../../assets/images/Reset password-rafiki.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import { SubmitHandler } from "react-hook-form";
import { useUserLoginMutation } from "@/redux/api/authApi";
import Form from "@/components/forms/Form";
import FormInput from "@/components/forms/FormInput";
import { storeUserInfo } from "../services/auth.service";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/constants/storageKey";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/validatorsSchema/signin";

const LoginPage = () => {
  const [userLogin] = useUserLoginMutation();

  const router = useRouter();

  type FormValues = {
    email: string;
    password: string;
  };

  // Handle form submission and login logic
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await userLogin({ ...data }).unwrap();

      // Store access token
      storeUserInfo({ access_token: res?.access_token });

      // Ensure the token is stored before fetching the profile
      const accessToken = getFromLocalStorage(authKey);
      if (accessToken) {
        message.success("Login successful!");

        // Redirect to profiles page after login
        router.push("/profiles");
      } else {
        message.error("Login failed. Unable to retrieve access token.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail || "Login failed. Please check your credentials.";
      message.error(errorMessage);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
      }}
    >
      <Col sm={12} md={16} lg={10}>
        <Image src={loginImage} width={500} alt="login image" />
      </Col>
      <Col sm={12} md={8} lg={8}>
        <h1>Log In</h1>
        <div>
          <Form submitHandler={onSubmit} resolver={yupResolver(signInSchema)}>
            <div className={styles.labelInput}>
              <FormInput name="email" type="text" size="large" label="Email" />
            </div>
            <div className={styles.labelInput}>
              <FormInput
                name="password"
                type="password" // Use "password" type for hidden input
                size="large"
                label="Password"
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                fontSize: "18px",
                marginTop: "10px",
              }}
            >
              Log In
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
