"use client";
import FormInput from "@/components/forms/FormInput";
import FormTextArea from "@/components/forms/FormTextArea";
import { Col, Row } from "antd";
import React from "react";

const MemberInformation = () => {
  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "5px",
        padding: "15px",
        marginBottom: "25px",
      }}
    >
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        Member Information
      </p>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={24} style={{ marginBottom: "10px" }}>
          <FormTextArea
            name="member_info.short_bio"
            label="Short Bio"
            rows={10}
            placeholder="Enter short bio"
          />
        </Col>
        <Col className="gutter-row" span={8} style={{ marginBottom: "10px" }}>
          <FormInput
            type="text"
            name="member_info.share"
            size="large"
            label="Share"
          />
        </Col>
      </Row>
    </div>
  );
};

export default MemberInformation;
