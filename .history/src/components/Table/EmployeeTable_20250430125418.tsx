import React, { useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Spinner,
  Text,
  chakra,
} from "@chakra-ui/react";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  Column,
  Row,
} from "react-table";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
}

interface EmployeeTableProps {
  data: Employee[];
  columns: Column<Employee>[];
  isLoading: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, columns, isLoading }) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Employee List</Text>
        <Select
          onChange={(e) => setPageSize(Number(e.target.value))}
          value={pageSize}
          width="100px"
          size="sm"
          bg="whiteAlpha.200"
          color="white"
          borderRadius="lg"
          border="1px solid white"
          _hover={{ bg: "whiteAlpha.300" }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner size="xl" color="white" />
        </div>
      ) : (
        <Table {...getTableProps()} variant="unstyled" className="min-w-full">
          <Thead className="bg-white/10 text-white rounded-t-xl">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, colIdx) => (
                  <Th
                    {...column.getHeaderProps()}
                    className={`py-3 px-4 text-left text-sm font-semibold ${
                      colIdx === 0 ? "rounded-l-xl" : colIdx === headerGroup.headers.length - 1 ? "rounded-r-xl" : ""
                    }`}
                  >
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} className="text-white text-sm">
            {page.map((row: Row<Employee>) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  className="hover:bg-white/20 transition duration-200"
                >
                  {row.cells.map((cell, cellIdx) => (
                    <Td
                      {...cell.getCellProps()}
                      className={`py-2 px-4 font-medium ${
                        cellIdx === 0
                          ? "rounded-l-xl"
                          : cellIdx === row.cells.length - 1
                          ? "rounded-r-xl"
                          : ""
                      }`}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          className="bg-white/20 px-4 py-2 rounded-full text-white hover:bg-white/30 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-white text-sm">
          Page {pageIndex + 1}
        </span>
        <button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          className="bg-white/20 px-4 py-2 rounded-full text-white hover:bg-white/30 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
