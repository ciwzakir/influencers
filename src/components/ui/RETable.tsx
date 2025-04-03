"use client";
import React from "react";
import { Table } from "antd";

type ReuseableTableProps = {
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: any;
  pageSize?: number;
  total?: number;
  showPagination?: boolean;
  showSizeChanger?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeOfPagintion?: (page: number, pageSize: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeTable?: (pagination: any, filter: any, sorter: any) => void;
};

const RETable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  total,
  showPagination = true,
  showSizeChanger,
  onChangeOfPagintion,
  onChangeTable,
}: ReuseableTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: total,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: showSizeChanger,
        onChange: onChangeOfPagintion,
      }
    : false;

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={paginationConfig}
      onChange={onChangeTable}
    />
  );
};

export default RETable;
