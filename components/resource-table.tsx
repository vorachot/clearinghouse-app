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
  { header: "NODE", accessor: "node" },
  { header: "ORGANIZATION", accessor: "organization" },
  { header: "RESOURCE", accessor: "resource" },
];
const resourceRows = [
  {
    name: "pool-1",
    node: "Node 1",
    organization: "Org A",
    resource: "CPU: 4, GPU: 1, RAM: 16",
  },
  {
    name: "pool-2",
    node: "Node 2",
    organization: "Org B",
    resource: "CPU: 8, GPU: 2, RAM: 32",
  },
  {
    name: "pool-3",
    node: "Node 3",
    organization: "Org C",
    resource: "CPU: 2, GPU: 2, RAM: 8",
  },
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
