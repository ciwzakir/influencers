"use client";
import { Spin } from "antd";
import React, { Suspense } from "react";
import "./css/bill.table.css";
import { convertNumberToWordsEN } from "@/utils/converters/convertNumberToWords";

const BillBody = ({ data }: any) => {
  function toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const {
    expenditure_code,
    item_supplier,
    get_totals,
    get_paid_amount,
    get_children_length,
    taxrate,
    get_income_tax,
    vatrate,
    get_value_added_tax,
    get_serial_no,
    get_page_no,
    transactions,
  } = data || {};

  return (
    <Suspense fallback={<Spin />}>
      <div style={{ margin: "10px 0" }}>
        <table className="table w-full">
          <thead className="text-center">
            <tr>
              <th> Bill No </th>
              <th> Bill Date </th>
              <th> LP No </th>
              <th> Ext RV/SIB </th>
              <th> Amount(Tk) </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5} className="text-center">
                Expenditure incured on account of
                <span style={{ margin: "0 3px" }}>
                  <strong>{expenditure_code?.heading}</strong>
                </span>
                in respect of
                <strong>
                  <br />
                  {item_supplier?.name}
                </strong>
                . Necessary documents attached .Details info of the
                <span style={{ margin: "0 3px" }}>
                  {get_children_length > 1 ? "bills" : "bill"}
                </span>
                <span style={{ margin: "0 3px" }}>
                  {get_children_length > 1 ? "are" : "is"}
                </span>
                as bellow :
              </td>
            </tr>
            {transactions?.map((elements: any) => (
              <tr
                // elements={elements}
                key={elements?.id}
                className="text-center"
              >
                <td>{elements?.invoice_no}</td>
                <td>{elements?.invoice_date}</td>
                <td>{elements?.receivevoucher_no}</td>
                <td>{elements?.lp_no}</td>
                <td className="text-right pr-10" style={{ textAlign: "right" }}>
                  {elements?.amount}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} style={{ textAlign: "right" }}>
                Total =
              </td>
              <td className="text-right pr-10" style={{ textAlign: "right" }}>
                {get_totals?.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td style={{ textAlign: "left" }}>
                Page No: {item_supplier?.regpage_no} {get_page_no}
              </td>

              <td colSpan={3} style={{ textAlign: "left" }}>
                - Income TAX @
                {taxrate > 0 ? (
                  <span>{taxrate}</span>
                ) : (
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                )}
                %
              </td>
              <td className="text-right pr-10" style={{ textAlign: "right" }}>
                {get_income_tax?.toFixed(2)}
              </td>
            </tr>

            <tr className="text-start ">
              <td style={{ textAlign: "left" }}> Ser No {get_serial_no} </td>
              <td colSpan={3} style={{ textAlign: "left" }}>
                - VAT @
                {vatrate > 0 ? (
                  <span>{vatrate}</span>
                ) : (
                  <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                )}
                %
              </td>
              <td className="text-right pr-10" style={{ textAlign: "right" }}>
                {get_value_added_tax?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                className="text-right pr-2"
                colSpan={4}
                style={{ textAlign: "right" }}
              >
                Paid Amount
              </td>
              <td className="text-right pr-10" style={{ textAlign: "right" }}>
                {get_paid_amount?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ padding: "5px 0px" }}>
          In words:
          <span style={{ padding: "0 2px" }}>
            {toSentenceCase(convertNumberToWordsEN(get_paid_amount))}
          </span>
          only.
        </p>
      </div>
    </Suspense>
  );
};

export default BillBody;
