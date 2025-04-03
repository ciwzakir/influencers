import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import { Button, message, Steps } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface ISteps {
  title?: string;
  content?: React.ReactElement | React.ReactNode;
}

interface IStepsProps {
  steps: ISteps[];
  persistKey: string;
  submitHandler: (el: any) => void;
  defaultValues?: any;
  validationSchema?: any;
}

const StepperForm = ({
  steps,
  submitHandler,
  defaultValues,
  persistKey,
  validationSchema,
}: IStepsProps) => {
  // Initialize step value from localStorage, ensure it's within bounds
  const initialStep = Math.min(
    Math.max(Number(JSON.parse(getFromLocalStorage("step") || "0")), 0),
    steps.length - 1
  );

  const initialValues = JSON.parse(getFromLocalStorage(persistKey) || "{}");

  const [current, setCurrent] = useState<number>(initialStep);
  const [savedValues] = useState(initialValues || defaultValues);

  const methods = useForm({
    defaultValues: savedValues,
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    setToLocalStorage("step", JSON.stringify(current));
  }, [current]);

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const timeoutId = setTimeout(() => {
        setToLocalStorage(persistKey, JSON.stringify(values));
      }, 500); // Save every 500ms after changes stop
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [methods, persistKey]);

  const next = () => setCurrent(Math.min(current + 1, steps.length - 1));
  const prev = () => setCurrent(Math.max(current - 1, 0));

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const { handleSubmit, reset } = methods;

  const handleUserDataOnSubmit = (data: any) => {
    submitHandler(data);
    reset(defaultValues);
    setToLocalStorage("step", "0");
    setToLocalStorage(persistKey, "{}");
  };

  return (
    <>
      <Steps current={current} items={items} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleUserDataOnSubmit)}>
          {steps[current] ? (
            <div>{steps[current].content}</div>
          ) : (
            <p>No content available</p>
          )}
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={prev}>
                Previous
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default StepperForm;
