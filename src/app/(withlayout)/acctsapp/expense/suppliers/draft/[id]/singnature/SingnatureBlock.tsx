import { Col, Row, Spin } from "antd";
import React, { Suspense } from "react";
import CashSeal from "../signatureBlock/cashSeal";
import ChequeSeal from "../signatureBlock/chequeSeal";
import Accountant from "../signatureBlock/accountant";
import CounterSign from "../signatureBlock/counterSign";
import "../css/footer.css";

const SingnatureBlock = ({ data }: any) => {
  return (
    <Suspense fallback={<Spin />}>
      <Row
        gutter={16}
        style={{ marginTop: "15px", justifyContent: "space-around" }}
      >
        <Col span={8}>
          <Accountant data={data} key={data?.id}></Accountant>
        </Col>
        <Col span={8} style={{ marginTop: "80px" }}>
          <CounterSign data={data} key={data?.id}></CounterSign>
        </Col>
        <Col span={7} className="payment__method">
          {data?.is_cheque === true ? (
            <ChequeSeal data={data} key={data?.id}></ChequeSeal>
          ) : (
            <CashSeal></CashSeal>
          )}
        </Col>
      </Row>
    </Suspense>
  );
};

export default SingnatureBlock;
