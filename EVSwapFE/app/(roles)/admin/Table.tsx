"use client";
import { Table as AntTable } from "antd";
import React from "react";

interface TableProps<T> {
  columns: any;
  data: T[];
  loading?: boolean;
  rowKey?: string;
}

export function Table<T>({ columns, data, loading, rowKey }: TableProps<T>) {
  return <AntTable columns={columns} dataSource={data} loading={loading} rowKey={rowKey} bordered />;
}
