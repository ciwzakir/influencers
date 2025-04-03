"use client";

import FormDatePicker from "@/components/forms/FormDatePicker";
import FormInput from "@/components/forms/FormInput";
import FormSelectField from "@/components/forms/FormSelectFields";
import FormTextArea from "@/components/forms/FormTextArea";
import ImageUploaderPage from "@/components/ui/uploadImage";

import {
  bloodGroupOptions,
  genderOptions,
  marriedOptions,
} from "@/constants/selectOptions";
import { Col, Row } from "antd";
import React from "react";

const PersonalInformation = () => {
  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "5px",
        padding: "15px",
        marginBottom: "25px",
      }}
    >
      <br />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={8} style={{ marginBottom: "10px" }}>
          <ImageUploaderPage name="file" />
        </Col>
        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            name="email"
            type="text"
            size="large"
            label="Email"
            disabled
          />
        </Col>
        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="first_name"
            size="large"
            label="First Name"
          />
        </Col>
        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="last_name"
            size="large"
            label="Last Name"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="personal_info.father_name"
            size="large"
            label="father_name"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="personal_info.mother_name"
            size="large"
            label="mother_name"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormDatePicker
            name="personal_info.dob"
            label="DOB"
            size="large"
          ></FormDatePicker>
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormSelectField
            size="large"
            name="personal_info.marital_status"
            options={marriedOptions}
            label="Marital Status"
            placeholder="Select"
          />
        </Col>
        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormSelectField
            size="large"
            name="personal_info.blood_group"
            options={bloodGroupOptions}
            label="Blood Group"
            placeholder="Select"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormSelectField
            size="large"
            name="personal_info.gender"
            options={genderOptions}
            label="Gender"
            placeholder="Select"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="personal_info.nationality"
            size="large"
            label="nationality"
          />
        </Col>

        <Col
          className="gutter-row"
          span={8}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormInput
            type="text"
            name="personal_info.phone_number"
            size="large"
            label="Contact Number"
          />
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col
          className="gutter-row"
          span={12}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormTextArea
            name="personal_info.employment_address"
            rows={4}
            label="Employed In"
            placeholder="Where are u"
          />
        </Col>
        <Col
          className="gutter-row"
          span={12}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormTextArea
            name="personal_info.present_address"
            rows={4}
            label="Present Address"
            placeholder="Insert Your Present Address"
          />
        </Col>
        <Col
          className="gutter-row"
          span={12}
          style={{
            marginBottom: "10px",
          }}
        >
          <FormTextArea
            name="personal_info.permanent_address"
            rows={4}
            label="Permanent Address"
            placeholder="Insert Your Permanent Address"
          />
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInformation;
