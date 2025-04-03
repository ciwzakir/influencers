import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Col, Empty, Row } from "antd";
import FormTextArea from "./FormTextArea";

const WorkPlanDynamicFields: React.FC = () => {
  const { control, getValues, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences_info",
  });

  const handleAddMore = () => {
    append({ experiences: "", id: null }); // Use null for new entries
  };

  const handleRemove = (index: number) => {
    const experience = getValues(`experiences_info.${index}`);
    if (experience.id) {
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
                  onClick={() => handleRemove(index)} // Updated remove logic
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
