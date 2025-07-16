"use client";
import { Col, Row, Spin } from "antd";
import React, { Suspense } from "react";

const BillHeader = ({ data }: any) => {
  return (
    <Suspense fallback={<Spin />}>
      <h3 style={{ textAlign: "right" }}>AF F.115</h3>
      <h4 style={{ textAlign: "center" }}>
        <strong>
          <u>CONTINGENT BILL</u>
        </strong>
      </h4>

      <Row gutter={16} style={{ marginTop: "15px" }}>
        <Col span={12}>
          <Row>
            <Col span={8}>Reg Ser No </Col>
            <Col span={1}>:</Col>
            <Col span={15}>........./{data?.fiscal_year?.fiscal_year}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={8}> Voucher No</Col>
            <Col span={1}>:</Col>
            <Col span={15}>
              ................../{data?.expenditure_code?.voucher_head}
              /........../{data?.fiscal_year?.fiscal_year}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Second Row */}
      <Row gutter={16} style={{ marginTop: "15px" }}>
        <Col span={12}>
          <Row>
            <Col span={8}>Allotment </Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.get_prog_alts}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={8}>Budget Code</Col>
            <Col span={1}>:</Col>
            <Col span={15}>
              {data?.expenditure_code?.seven_digit_code}
              <span style={{ margin: "0 3px" }}>
                {data?.expenditure_code?.is_general === false ? (
                  <> &#40; Special Activities &#41;</>
                ) : (
                  <> &#40; General Activities &#41;</>
                )}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Third Row */}
      <Row gutter={16} style={{ marginTop: "15px" }}>
        <Col span={12}>
          <Row>
            <Col span={8}>Expenditure </Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.expenditure_code?.economic_segment}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={8}>Heading</Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.expenditure_code?.heading}</Col>
          </Row>
        </Col>
      </Row>
      {/* Third Row */}
      <Row gutter={16} style={{ marginTop: "15px" }}>
        <Col span={12}>
          <Row>
            <Col span={8}>Financial Year </Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.fiscal_year?.fiscal_year}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={8}>Balance</Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.expenditure_code?.your_current_balance}</Col>
          </Row>
        </Col>
      </Row>
      {/* last Row */}
      <Row gutter={16} style={{ marginTop: "15px" }}>
        <Col span={12}>
          <Row>
            <Col span={8}>Auth</Col>
            <Col span={1}>:</Col>
            <Col span={15}>{data?.expenditure_code?.lp_auth}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={8}>Office Name</Col>
            <Col span={1}>:</Col>
            <Col span={15}>
              <span>{data?.consumer_unit?.name}</span>
              <span style={{ margin: "0 3px" }}>
                &#40; {data?.consumer_unit?.parent_office} &#41;
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Suspense>
  );
};

export default BillHeader;
