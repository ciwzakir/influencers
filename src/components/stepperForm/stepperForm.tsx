// StepperForm Component
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Steps, Button, message } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";

interface ISteps {
  title: string;
  content: React.ReactElement | React.ReactNode;
}

interface IStepperFormProps {
  steps: ISteps[];
  persistKey: string;
  submitHandler: (data: any) => void;
  defaultValues?: Record<string, any>;
  validationSchema?: any;
}

const StepperForm = ({
  steps,
  persistKey,
  submitHandler,
  defaultValues = {},
  validationSchema,
}: IStepperFormProps) => {
  const initialStep = Math.min(
    Math.max(Number(getFromLocalStorage("step") || "0"), 0),
    steps.length - 1
  );

  const [current, setCurrent] = useState<number>(initialStep);

  const persistedValues = useMemo(() => {
    try {
      const storedValues = getFromLocalStorage(persistKey);
      return storedValues ? JSON.parse(storedValues) : defaultValues;
    } catch (e) {
      console.error("Error parsing persisted values:", e);
      return defaultValues;
    }
  }, [persistKey, defaultValues]);

  const methods = useForm({
    defaultValues: persistedValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(persistedValues);
  }, [persistedValues, reset]);

  useEffect(() => {
    const stepValue = JSON.stringify(current);
    if (getFromLocalStorage("step") !== stepValue) {
      setToLocalStorage("step", stepValue);
    }
  }, [current]);

  useEffect(() => {
    const subscription = watch((values) => {
      setToLocalStorage(persistKey, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch, persistKey]);

  const next = () => setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  const handleUserDataOnSubmit = (data: any) => {
    submitHandler(data);
    localStorage.removeItem("step");
    localStorage.removeItem(persistKey);
    reset(defaultValues);
    message.success("Processing complete!");
  };

  return (
    <div>
      <Steps
        current={current}
        items={steps.map((step) => ({ title: step.title }))}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleUserDataOnSubmit)}>
          {steps[current]?.content || <p>No content available</p>}
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
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
    </div>
  );
};

export default StepperForm;
