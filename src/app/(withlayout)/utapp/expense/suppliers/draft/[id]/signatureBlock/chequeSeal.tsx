import React from "react";

const ChequeSeal = ({ data }: any) => {
  return (
    <>
      <h3 className="sign-margin">
        <u> PAID BY CHEQUE</u>
      </h3>
      <ul className="list__style--none">
        <li>Sign : ............................</li>
        <li>
          {data.on_change_charge?.additional_info?.cheque_series} :
          ............................
        </li>
        <li>Date : ............................</li>
      </ul>
    </>
  );
};

export default ChequeSeal;
