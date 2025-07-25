"use client";
import React, { Suspense, useState } from "react";
import { Collapse, DatePicker, Space, Spin, Divider, Col, Row } from "antd";
import { useChequeListWithFilterQuery } from "@/redux/api/chequeList";
import RETable from "@/components/ui/RETable";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { getUserInfo } from "@/app/services/auth.service";

const { RangePicker } = DatePicker;
const userInfo = getUserInfo() as any;
const role = userInfo?.user_role ?? "acctentry";

const ChequeListPage = () => {
  const { data, isError, isLoading } = useChequeListWithFilterQuery(undefined);
  const [dateRange, setDateRange] = useState("");
  const handleDateRangeChange = (payload: any) => {
    setDateRange(payload);
  };

  const filteredExpense = data?.filter((element: any) => {
    const dateRangeCondition =
      !dateRange ||
      (element?.updated_at >= dateRange[0]?.valueOf() &&
        element?.updated_at <= dateRange[1]?.valueOf());

    return dateRangeCondition;
  });

  const chequeList: any[] = [];
  filteredExpense?.reduce(function (res: any, value: any) {
    if (!res[value.item_supplier.id]) {
      res[value.item_supplier.id] = {
        id: value.item_supplier.id,
        get_totals: 0, // Initialize to 0
        get_income_tax: 0, // Initialize to 0
        get_value_added_tax: 0, // Initialize to 0
        get_paid_amount: 0, // Initialize to 0
      };
      chequeList.push(res[value.item_supplier.id]);
    }
    res[value.item_supplier.id].item_supplier = value?.item_supplier;
    res[value.item_supplier.id].get_totals += value?.get_totals || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_income_tax += value?.get_income_tax || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_value_added_tax +=
      value?.get_value_added_tax || 0; // Use || 0 to handle undefined
    res[value.item_supplier.id].get_paid_amount += value?.get_paid_amount || 0; // Use || 0 to handle undefined
    return res;
  }, {});

  const pageCount = (): number => {
    return chequeList?.length || 0;
  };
  console.log(filteredExpense);
  if (isLoading) return <Spin />;

  if (isError) return <p>Error : {isError}</p>;

  const filteredColumnForSuppliers = [
    {
      title: "Name",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.name;
        } else return "No Supplier Found";
      },
    },
    {
      title: "Tin No",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.tin_no;
        } else return "No address Found";
      },
    },
    {
      title: "VAT No",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.tin_no;
        } else return "No address Found";
      },
    },
    {
      title: "Address",
      dataIndex: "item_supplier",
      render: function (data: any) {
        if (data) {
          return data.address;
        } else return "No address Found";
      },
    },
    {
      title: "Total Bill",
      dataIndex: "get_totals",
      key: "getTotals",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Income Tax",
      dataIndex: "get_income_tax",
      key: "incomeTax",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "VAT",
      dataIndex: "get_value_added_tax",
      key: "vat",
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Paid",
      dataIndex: "get_paid_amount",
      key: "paidAmount",
      sorter: (a: any, b: any) => a.id - b.id,
    },
  ];

  return (
    <>
      <div className="main" style={{ margin: "20px" }}>
        <div className="bread-cumb">
          <Suspense fallback={<Spin />}>
            <UMBreadCrumb
              items={[
                {
                  label: "Add New",
                  link: `/${role}/expense/create`,
                },
                {
                  label: "Edit",
                  link: `/${role}/expense/edit`,
                },
                {
                  label: "As per Codes",
                  link: `/${role}/expense/codes`,
                },
                {
                  label: "Cash Payment",
                  link: `/${role}/expense/suppliers/cash-payment`,
                },
              ]}
            />
          </Suspense>
        </div>
        <div
          className="sub__div--style"
          style={{ justifyContent: "space-between", display: "flex" }}
        ></div>

        <Row>
          <Col flex="1 1 200px" style={{ marginRight: "15px" }}>
            <div className="content-section">
              <h2 style={{ margin: "20px", textAlign: "center" }}>
                Your Cheque List
              </h2>
              <Suspense fallback={<Spin />}>
                <RETable
                  loading={false}
                  columns={filteredColumnForSuppliers}
                  dataSource={chequeList ? chequeList : []}
                  pageSize={10}
                  total={pageCount()}
                  showPagination={true}
                ></RETable>
              </Suspense>
            </div>
          </Col>

          <Col flex="0 1 300px">
            <h2 style={{ margin: "30px 0" }}> Search and Filter Data</h2>

            <div className="accordions">
              <Divider orientation="left">Default Size</Divider>

              <Collapse
                style={{ marginBottom: "5px" }}
                items={[
                  {
                    key: "6",
                    label: "Filter By Date Range",
                    children: (
                      <Col>
                        <h3 style={{ margin: "30px 0" }}>
                          Filter By Date Range
                        </h3>
                        <Space direction="vertical" size={12}>
                          <RangePicker
                            // showTime
                            onChange={(e) => handleDateRangeChange(e)}
                          />
                        </Space>
                      </Col>
                    ),
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChequeListPage;
