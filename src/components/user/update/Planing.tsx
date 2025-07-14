"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Col, Empty, Row } from "antd";
import FormTextArea from "@/components/forms/FormTextArea";

interface Experience {
  id?: string | null;
  experiences: string;
  status?: string;
}

const WorkPlanDynamicFields = () => {
  const { control, getValues, setValue } = useFormContext<{
    experiences_info: Experience[];
  }>();

  const { fields, append, remove } = useFieldArray<{
    experiences_info: Experience[];
  }>({
    control,
    name: "experiences_info",
  });

  const handleAddMore = () => {
    append({ experiences: "", id: null } as Experience);
  };

  const handleRemove = (index: number) => {
    const experience = getValues(`experiences_info.${index}`);
    if (experience?.id) {
      // Mark as deleted if it has an ID
      setValue(`experiences_info.${index}.status`, "deleted");
    } else {
      // Remove directly if it's a new entry
      remove(index);
    }
  };

  return (
    <>
      <div>
        {fields.length > 0 ? (
          fields.map((item, index) => {
            // Skip deleted items
            if (item.status === "deleted") return null;

            return (
              <div
                key={item.id}
                style={{
                  marginBottom: "5px",
                  padding: "20px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "5px",
                }}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col
                    className="gutter-row"
                    span={20}
                    style={{ marginBottom: "10px" }}
                  >
                    <FormTextArea
                      name={`experiences_info.${index}.experiences`}
                      rows={8}
                      label="Your Experience"
                      placeholder="Describe your experience..."
                    />
                  </Col>
                </Row>

                <Button
                  type="primary"
                  onClick={() => handleRemove(index)}
                  danger
                  style={{ margin: "5px 0px" }}
                >
                  Delete
                </Button>
              </div>
            );
          })
        ) : (
          <Empty description="No experiences found. Add new experiences!" />
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <Button type="primary" onClick={handleAddMore}>
          Add More
        </Button>
      </div>
    </>
  );
};

export default WorkPlanDynamicFields;
