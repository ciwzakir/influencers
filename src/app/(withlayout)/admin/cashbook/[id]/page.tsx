"use client";

import React, { useRef } from "react";
import { Button, Col, Row, Splitter } from "antd";
import { useParams } from "next/navigation";
import { useGetSingleCashBookQuery } from "@/redux/api/uttoronapi/cashbook";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { convertNumberToWordsEN } from "@/utils/converters/convertNumberToWords";

function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ccc",
};

const thTdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontSize: "14px",
};

const SingleCashBookEntryPage = () => {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading } = useGetSingleCashBookQuery(id);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  if (isLoading) return <h5>Loading .............</h5>;

  const openingCash = parseFloat(data?.opening_balance?.cash || 0);
  const openingBank = parseFloat(data?.opening_balance?.bank || 0);

  const totalCashInflow = parseFloat(data?.get_inflow_totals_cash || 0);
  const totalBankInflow = parseFloat(data?.get_inflow_totals_bank || 0);

  const totalCashOutflow = parseFloat(data?.get_outflow_totals_cash || 0);
  const totalBankOutflow = parseFloat(data?.get_outflow_totals_bank || 0);

  const totalInflowWithOpeningCash = parseFloat(
    data?.get_monthly_inflow_total_with_opening_cash || 0
  );
  const totalInflowWithOpeningBank = parseFloat(
    data?.get_monthly_inflow_total_with_opening_bank || 0
  );

  const closingCash = parseFloat(data?.get_monthly_closing_balance_cash || 0);
  const closingBank = parseFloat(data?.get_monthly_closing_balance_bank || 0);

  return (
    <>
      <div
        className="main-content"
        ref={contentRef}
        style={{ padding: "50px" }}
      >
        <div className="no-print" style={{ textAlign: "right" }}></div>
        <Row gutter={[16, 16]} align="top" style={{ padding: "20px" }}>
          <Col xs={24} md={12}>
            <div style={{ textAlign: "left" }}>
              <p>For the Month of: {data?.cash_book_month?.name}</p>
              <p>Fiscal Year: {data?.fiscal_year?.name}</p>
              <p>Present Balance: {data?.account_info?.current_balance}</p>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ textAlign: "right" }}>
              <p>{data?.account_info?.account_name} </p>
              <p>{data?.account_info?.bank_name}</p>
            </div>
          </Col>
        </Row>

        <Splitter
          style={{
            height: "auto",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "15px",
          }}
        >
          {/* Inflow Panel */}
          <Splitter.Panel defaultSize="50%" min="40%" max="60%">
            <h4 style={{ textAlign: "left" }}>Inflow</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Date</th>
                    <th style={thTdStyle}>Description</th>
                    <th style={thTdStyle}>Vrs No</th>
                    <th style={thTdStyle}>Cash (Tk.)</th>
                    <th style={thTdStyle}>Bank (Tk.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={thTdStyle}>
                      {dayjs(data?.opening_balance?.opening_balance_on).format(
                        "DD-MM-YY"
                      )}
                    </td>
                    <td colSpan={2} style={{ ...thTdStyle, textAlign: "left" }}>
                      Opening Balance
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {openingCash.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {openingBank.toFixed(2)}
                    </td>
                  </tr>

                  {data?.uttoron_earnings?.map((el: any) => (
                    <tr key={el?.id}>
                      <td style={thTdStyle}>
                        {dayjs(el?.earn_on).format("DD-MM-YY")}
                      </td>
                      <td style={{ ...thTdStyle, textAlign: "left" }}>
                        {el?.short_description} {"||"}{" "}
                        {el?.income_codes?.income_code_heading}
                      </td>
                      <td style={thTdStyle}>{el?.voucher_reference}</td>
                      <td style={{ ...thTdStyle, textAlign: "right" }}>
                        {el?.cash_amount_credit}
                      </td>
                      <td style={{ ...thTdStyle, textAlign: "right" }}>
                        {el?.bank_amount_credit}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...thTdStyle, textAlign: "right" }}
                    >
                      Total Inflow =
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalCashInflow.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalBankInflow.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...thTdStyle, textAlign: "right" }}
                    >
                      Grand Total =
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalInflowWithOpeningCash.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalInflowWithOpeningBank.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Splitter.Panel>

          {/* Outflow Panel */}
          <Splitter.Panel>
            <h4 style={{ textAlign: "right" }}>Outflow</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Date</th>
                    <th style={thTdStyle}>Description</th>
                    <th style={thTdStyle}>Vrs No</th>
                    <th style={thTdStyle}>Cash (Tk.)</th>
                    <th style={thTdStyle}>Bank (Tk.)</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.uttoron_outflow?.map((el: any) => (
                    <tr key={el?.id}>
                      <td style={thTdStyle}>
                        {dayjs(el?.expense_on).format("DD-MM-YY")}
                      </td>
                      <td style={{ ...thTdStyle, textAlign: "left" }}>
                        {el?.short_description} {"||"}{" "}
                        {el?.expense_codes?.expense_code_heading}
                      </td>
                      <td style={thTdStyle}>{el?.voucher_reference}</td>
                      <td style={{ ...thTdStyle, textAlign: "right" }}>
                        {el?.cash_amount_debit}
                      </td>
                      <td style={{ ...thTdStyle, textAlign: "right" }}>
                        {el?.bank_amount_debit}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...thTdStyle, textAlign: "right" }}
                    >
                      Total Outflow =
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalCashOutflow.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalBankOutflow.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...thTdStyle, textAlign: "right" }}
                    >
                      Closing Balance =
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {closingCash.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {closingBank.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{ ...thTdStyle, textAlign: "right" }}
                    >
                      Grand Total =
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalInflowWithOpeningCash.toFixed(2)}
                    </td>
                    <td style={{ ...thTdStyle, textAlign: "right" }}>
                      {totalInflowWithOpeningBank.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Splitter.Panel>
        </Splitter>
        <Row justify="center">
          <Col span={24}>
            <h2 style={{ textAlign: "center", margin: "25px 0" }}>
              <strong>
                <u>CLOSED ON MONTHLY CHECK</u>
              </strong>
            </h2>
            <p> I have check and found the amount as under :</p> <br />
            <ul
              style={{
                listStylePosition: "inside",
                listStyleType: "none",
              }}
            >
              <li style={{ paddingLeft: "20px" }}>
                Cash in Hand:
                <span style={{ paddingLeft: "20px" }}>
                  {toSentenceCase(convertNumberToWordsEN(closingCash))}
                </span>{" "}
                only.
              </li>
              <li style={{ paddingLeft: "20px" }}>
                Cash at Bank:
                <span style={{ paddingLeft: "20px" }}>
                  {toSentenceCase(convertNumberToWordsEN(closingBank))}
                </span>{" "}
                only.
              </li>
            </ul>
            <br />
          </Col>
        </Row>
      </div>
      <div
        style={{
          textAlign: "right",
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "0 50px 50px 0",
        }}
      >
        <Button type="primary" onClick={() => reactToPrintFn()}>
          Print this out!
        </Button>
      </div>
    </>
  );
};

export default SingleCashBookEntryPage;
