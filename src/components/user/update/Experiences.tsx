"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Col, Empty, Row } from "antd";
import FormTextArea from "@/components/forms/FormTextArea";

interface Experiences {
  id?: string | null;
  experiences: string;
}

const ExperienceFormDynamicFields = () => {
  const { control, register } = useFormContext<{
    experiences_info: Experiences[];
  }>();

  const { fields, append, remove } = useFieldArray<{
    experiences_info: Experiences[];
  }>({
    control,
    name: "experiences_info",
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
                {...register(`experiences_info.${index}.id`)}
              />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <FormTextArea
                    name={`experiences_info.${index}.experiences` as const}
                    label="Experiences"
                    rows={10}
                    placeholder="Share Your Idea"
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
          <Empty description="No experiences added" />
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Button
          type="primary"
          onClick={() =>
            append({
              id: null,
              experiences: "",
            } as Experiences)
          }
        >
          Add experiences
        </Button>
      </div>
    </>
  );
};

export default ExperienceFormDynamicFields;
