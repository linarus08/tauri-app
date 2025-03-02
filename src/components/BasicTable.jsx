import React from "react";
import { useTable } from "react-table";
import { useMemo } from "react";
import "../css/table.css";

const BasicTable = ({ data }) => {
  const tableData = useMemo(() => {
    return Object.entries(data).map(([key, value]) => ({
      col1: key,
      col2: value,
    }));
  }, [data]);
  const columns = useMemo(
    () => [
      { Header: "№", accessor: "col1" },
      { Header: "Файл", accessor: "col2" },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => {
              const props = {
                colSpan: column.colSpan,
                role: "columnheader",
              };
              return (
                <th {...props} key={column.id}>
                  {column.render("Header")}
                </th>
              ); // Передаем key отдельно
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {" "}
              {/* Передаем key отдельно */}
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default BasicTable;
