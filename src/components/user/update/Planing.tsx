"use client";
import WorkPlanDynamicFields from "@/components/forms/FormWorkPlanDynamicFields";
import { Col, Row } from "antd";
import React from "react";

const NextPlan = () => {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col
        className="gutter-row"
        span={24}
        style={{
          marginBottom: "10px",
        }}
      >
        <WorkPlanDynamicFields />
      </Col>
    </Row>
  );
};

export default NextPlan;
