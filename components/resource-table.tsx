"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

const resourceColumns = [
  { header: "NAME", accessor: "name" },
  { header: "ORGANIZATION", accessor: "organization" },
  { header: "RESOURCE", accessor: "resource" },
];
const resourceRows = [
  { name: "node1", organization: "Org A", resource: "CPU: 4, GPU: 1, RAM: 16" },
  { name: "node2", organization: "Org B", resource: "CPU: 8, GPU: 2, RAM: 32" },
  { name: "node3", organization: "Org C", resource: "CPU: 2, GPU: 2, RAM: 8" },
];

const ResourceTable = () => {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        {resourceColumns.map((column) => (
          <TableColumn key={column.accessor}>{column.header}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {resourceRows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {resourceColumns.map((column) => (
              <TableCell key={column.accessor}>
                {row[column.accessor as keyof typeof row]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ResourceTable;
