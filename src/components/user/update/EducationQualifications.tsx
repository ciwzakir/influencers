"use client";
import EdnFormDynamicFields from "@/components/forms/FormDynamicFields";
import { Row } from "antd";
import React from "react";

const EducationQualifications = () => {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <EdnFormDynamicFields />
    </Row>
  );
};

export default EducationQualifications;
