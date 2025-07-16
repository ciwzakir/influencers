"use client";

import { useGetSingleBillQuery } from "@/redux/api/draftApi";
import React, { Suspense, useRef } from "react";
import BillHeader from "./BillHeader";
import BillBody from "./BillBody";
import BillFooter from "./BillFooter";
import { Button, Spin, Alert, Empty } from "antd";
import { useReactToPrint } from "react-to-print";
import "./css/main.bill.css";

export type IDProps = {
  params: any;
};

const SinglePage = ({ params }: IDProps) => {
  const { id } = params;
  const { isError, isLoading, isSuccess, data, error } =
    useGetSingleBillQuery(id);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const renderContent = () => {
    switch (true) {
      case isLoading:
        return <Spin size="large" />;

      case isError:
        return (
          <Alert
            message="Error Loading Bill"
            description={error?.toString()}
            type="error"
            showIcon
          />
        );

      case isSuccess && !data:
        return <Empty description="No bill data found" />;

      case isSuccess:
        return (
          <>
            <div className="no-print" style={{ textAlign: "right" }}>
              <Button
                type="primary"
                onClick={() => reactToPrintFn()}
                style={{ position: "sticky", top: 0 }}
              >
                Print this out!
              </Button>
            </div>
            <div
              style={{
                margin: "50px 50px 50px 70px",
                maxWidth: "700vh",
                minHeight: "100vh",
                fontSize: "16px",
              }}
              ref={contentRef}
            >
              <BillHeader data={data} />
              <BillBody data={data} />
              <BillFooter data={data} />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<Spin />}>
      <div className="main__div-center">{renderContent()}</div>
    </Suspense>
  );
};

export default SinglePage;
