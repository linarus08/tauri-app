import React from "react";
import { useTable } from "react-table";
import { useMemo } from "react";
import "../css/table.css"
const BasicTable = () => {
  const data = useMemo(
    () => [
      { col1: "1", col2: "World" },
      { col1: "2", col2: "Table" },
      { col1: "3", col2: "Table2" },
    ],
    []
  );
  const columns = useMemo(
    () => [
      { Header: "№", accessor: "col1"},
      { Header: "Файл", accessor: "col2"},
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  return (
    <table {...getTableProps()}>
      <thead>
        { headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default BasicTable;