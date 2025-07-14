"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Col, Empty, Row } from "antd";
import {
  graduationYearOptions,
  qualificationOptions,
} from "@/constants/selectOptions";
import FormInput from "@/components/forms/FormInput";
import FormSelectField from "@/components/forms/FormSelectFields";

interface Qualification {
  id?: string | null;
  certification: string;
  graduation_year: string;
  institute_name: string;
}

const EdnFormDynamicFields = () => {
  const { control, register } = useFormContext<{
    qualifications: Qualification[];
  }>();

  const { fields, append, remove } = useFieldArray<{
    qualifications: Qualification[];
  }>({
    control,
    name: "qualifications",
  });

  return (
    <>
      <div>
        {fields.length > 0 ? (
          fields.map((item, index) => (
            <div
              key={item.id}
              style={{
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #d9d9d9",
                borderRadius: "5px",
              }}
            >
              <input
                type="hidden"
                {...register(`qualifications.${index}.id`)}
              />

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <FormSelectField
                    size="large"
                    name={`qualifications.${index}.certification` as const}
                    options={qualificationOptions}
                    label="Qualification"
                    placeholder="Select"
                  />
                </Col>
                <Col span={8}>
                  <FormSelectField
                    size="large"
                    name={`qualifications.${index}.graduation_year` as const}
                    options={graduationYearOptions}
                    label="Graduation Year"
                    placeholder="Select"
                  />
                </Col>
                <Col span={8}>
                  <FormInput
                    type="text"
                    name={`qualifications.${index}.institute_name` as const}
                    size="large"
                    label="Institute"
                  />
                </Col>
              </Row>

              <Button
                type="primary"
                danger
                onClick={() => remove(index)}
                style={{ marginTop: "10px" }}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <Empty description="No qualifications added" />
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Button
          type="primary"
          onClick={() =>
            append({
              id: null,
              certification: "",
              graduation_year: "",
              institute_name: "",
            } as Qualification)
          }
        >
          Add Qualification
        </Button>
      </div>
    </>
  );
};

export default EdnFormDynamicFields;
