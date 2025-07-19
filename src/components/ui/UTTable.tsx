"use client";
import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";

type ScrollType = {
  x?: number | string | true;
  y?: number | string;
};

// Extract ColumnsType from TableProps
type ColumnsType<T> = NonNullable<TableProps<T>["columns"]>;

type ReuseableTableProps<T> = {
  loading?: boolean;
  columns: ColumnsType<T>;
  dataSource: T[];
  pageSize?: number;
  total?: number;
  showPagination?: boolean;
  showSizeChanger?: boolean;
  onChangeOfPagintion?: (page: number, pageSize: number) => void;
  onChangeTable?: TableProps<T>["onChange"];
  scroll?: ScrollType;
};

function RETUTTable<T>({
  loading = false,
  columns,
  dataSource,
  pageSize,
  total,
  showPagination = true,
  showSizeChanger,
  onChangeOfPagintion,
  onChangeTable,
  scroll,
}: ReuseableTableProps<T>) {
  const paginationConfig = showPagination
    ? {
        pageSize,
        total,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger,
        onChange: onChangeOfPagintion,
      }
    : false;

  return (
    <Table<T>
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={paginationConfig}
      onChange={onChangeTable}
      scroll={scroll}
    />
  );
}

export default RETUTTable;
