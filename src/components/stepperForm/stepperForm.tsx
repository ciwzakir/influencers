"use client";

import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import { Button, message, Steps } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IStep {
  title: string;
  content: React.ReactNode;
}

interface IStepperFormProps {
  steps: IStep[];
  submitHandler: (values: any) => void;
  defaultValues?: any;
  persistKey: string;
  validationSchema?: yup.AnyObjectSchema;
}

const StepperForm = ({
  steps,
  submitHandler,
  defaultValues = {},
  persistKey,
  validationSchema,
}: IStepperFormProps) => {
  // Step state
  const storedStep = parseInt(getFromLocalStorage("step") || "0", 10);
  const [current, setCurrent] = useState<number>(
    Math.min(Math.max(storedStep, 0), steps.length - 1)
  );

  // Form default values (from localStorage or props)
  const storedValues = getFromLocalStorage(persistKey);
  const initialValues = storedValues ? JSON.parse(storedValues) : defaultValues;

  const methods = useForm({
    defaultValues: initialValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  // Refill form when defaultValues change (for updates)
  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  // Persist current step
  useEffect(() => {
    setToLocalStorage("step", current.toString());
  }, [current]);

  // Persist form data
  useEffect(() => {
    const subscription = methods.watch((values) => {
      const timeout = setTimeout(() => {
        setToLocalStorage(persistKey, JSON.stringify(values));
      }, 500);
      return () => clearTimeout(timeout);
    });
    return () => subscription.unsubscribe();
  }, [methods, persistKey]);

  const next = () => {
    methods.trigger().then((isValid) => {
      if (isValid) {
        setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        message.error("Please fill out all required fields correctly");
      }
    });
  };

  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: any) => {
    submitHandler(data);
    methods.reset(defaultValues); // Reset to updated default values
    setToLocalStorage(persistKey, JSON.stringify(defaultValues || {}));
    setToLocalStorage("step", "0");
    setCurrent(0); // Reset to step 0 after submit
  };

  return (
    <div>
      <Steps
        current={current}
        items={steps.map((step) => ({ title: step.title }))}
      />

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (current === steps.length - 1) {
              methods.handleSubmit(onSubmit)();
            } else {
              next();
            }
          }}
        >
          <div style={{ margin: "24px 0" }}>
            {steps[current]?.content || "No content available"}
          </div>

          <div style={{ marginTop: 24 }}>
            {current > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prev}>
                Previous
              </Button>
            )}

            <Button type="primary" htmlType="submit">
              {current < steps.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default StepperForm;
