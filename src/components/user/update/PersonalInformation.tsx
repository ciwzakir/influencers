"use client";

import React from "react";
import { Card, Col, Row } from "antd";

import FormInput from "@/components/forms/FormInput";
import FormTextArea from "@/components/forms/FormTextArea";
import FormSelectField from "@/components/forms/FormSelectFields";
import FormDatePicker from "@/components/forms/FormDatePicker";
import ImageUploaderPage from "@/components/ui/uploadImage";

import {
  bloodGroupOptions,
  genderOptions,
  marriedOptions,
} from "@/constants/selectOptions";

const PersonalInformation = ({
  profile_picture,
}: {
  profile_picture?: string;
}) => {
  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "32px",
        background: "#fff",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <FormInput name="email" label="Email" size="large" disabled />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormInput name="first_name" label="First Name" size="large" />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormInput name="last_name" label="Last Name" size="large" />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <FormInput
            name="personal_info.father_name"
            label="Father's Name"
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormInput
            name="personal_info.mother_name"
            label="Mother's Name"
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormDatePicker
            name="personal_info.dob"
            label="Date of Birth"
            size="large"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <FormSelectField
            name="personal_info.marital_status"
            label="Marital Status"
            options={marriedOptions}
            placeholder="Select"
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormSelectField
            name="personal_info.blood_group"
            label="Blood Group"
            options={bloodGroupOptions}
            placeholder="Select"
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormSelectField
            name="personal_info.gender"
            label="Gender"
            options={genderOptions}
            placeholder="Select"
            size="large"
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <FormInput
            name="personal_info.nationality"
            label="Nationality"
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FormInput
            name="personal_info.phone_number"
            label="Contact Number"
            size="large"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <FormTextArea
            name="personal_info.employment_address"
            label="Employment Address"
            placeholder="Where are you employed?"
            rows={4}
          />
        </Col>
        <Col xs={24} md={12}>
          <FormTextArea
            name="personal_info.present_address"
            label="Present Address"
            placeholder="Enter your present address"
            rows={4}
          />
        </Col>
        <Col xs={24} md={12}>
          <FormTextArea
            name="personal_info.permanent_address"
            label="Permanent Address"
            placeholder="Enter your permanent address"
            rows={4}
          />
        </Col>
        <Col xs={24} md={12}>
          <Card
            title=" Change Profile Picture"
            hoverable
            style={{
              borderRadius: "8px",
              height: "100%",
            }}
            bodyStyle={{ padding: "16px", textAlign: "center" }}
          >
            <ImageUploaderPage
              name="profile_picture"
              defaultImageUrl={profile_picture}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInformation;
