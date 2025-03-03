import React from "react";
import { useTable } from "react-table";
import { useMemo } from "react";
import "../css/table.css";

const BasicTable = ({ data }) => {
  const tableData = Object.entries(data).map(([id, filePath]) => ({
    id: parseInt(id), // Преобразуем id из строки в число
    filePath: filePath,
  }));
  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Файл</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map(item => (
          <tr className="row" key={item.id}>
            <td className="fl-id">{item.id}</td>
            <td className="fl-nm">{item.filePath}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default BasicTable;
