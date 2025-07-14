"use client";
import React, { Suspense } from "react";
import SingnatureBlock from "./singnature/SingnatureBlock";
import { Spin } from "antd";
import "./css/footer.css";
const BillFooter = ({ data }: any) => {
  if (!data) {
    return <div>Loading...</div>;
  }
  const { created_by, on_change_charge } = data;
  return (
    <Suspense fallback={<Spin />}>
      <div className="">
        <p>
          Prepared By :
          <span style={{ margin: "0 3px" }}>{created_by?.first_name}</span>
          {created_by?.last_name}
        </p>
        <p>
          Checked By :
          <span style={{ margin: "0 3px" }}>
            {on_change_charge?.supervisor_info?.rank}
          </span>
          {on_change_charge?.supervisor_info?.name}
        </p>
      </div>
      <div className="sign__styles--action">
        <SingnatureBlock data={data} key={data?.id}></SingnatureBlock>
      </div>
    </Suspense>
  );
};

export default BillFooter;
