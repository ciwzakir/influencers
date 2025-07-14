import { Spin } from "antd";
import React, { Suspense } from "react";
import "../css/footer.css";
import dayjs from "dayjs";

const Accountant = ({ data }: any) => {
  const resultDate = function (data: any) {
    if (data) {
      return dayjs(data).format("MMM YYYY");
    } else {
      return "Invalid date";
    }
  };

  return (
    <>
      <Suspense fallback={<Spin />}>
        <h3 className="sign-margin">
          <u>Accountant Officer</u>
        </h3>
        <ul className="list__style--none">
          <li>{data.on_change_charge?.accountant_info?.name} </li>
          <li>{data.on_change_charge?.accountant_info?.rank} </li>
          <li>{data.on_change_charge?.accountant_info?.appointment} </li>
          <li>{data.on_change_charge?.additional_info?.unit_name} </li>
          <li> {resultDate(data?.updated_at)} </li>

          <li></li>
        </ul>
      </Suspense>
    </>
  );
};

export default Accountant;
