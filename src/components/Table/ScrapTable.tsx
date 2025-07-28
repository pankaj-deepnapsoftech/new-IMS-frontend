// @ts-nocheck
import React, { useMemo } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
} from "@chakra-ui/react";
import {
  usePagination,
  useSortBy,
  useTable,
  Column,
  TableInstance,
  HeaderGroup,
  Cell,
} from "react-table";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import { colors } from "../../theme/colors";

interface ScrapTableProps {
  scraps: Array<{
    item: { name: string };
    bom: { bom_name: string; finished_good: { item: { name: string } } };
    estimated_quantity: string;
    produced_quantity: string;
    total_part_cost: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingScraps: boolean;
  openScrapDetailsDrawerHandler?: (id: string) => void;
}

const ScrapTable: React.FC<ScrapTableProps> = ({
  scraps,
  isLoadingScraps,
  openScrapDetailsDrawerHandler,
}) => {
  const columns: Column<any>[] = useMemo(
    () => [
      { Header: "Item", accessor: "item" },
      { Header: "BOM", accessor: "bom" },
      { Header: "Finished Good", accessor: "finished_good" },
      { Header: "Estimated Quantity", accessor: "estimated_quantity" },
      { Header: "Produced Quantity", accessor: "produced_quantity" },
      { Header: "Total Part Cost", accessor: "total_part_cost" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

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
    state: { pageIndex },
    setPageSize,
    pageCount,
  }: TableInstance<any> = useTable(
    {
      columns,
      data: scraps,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const dynamicBg = (index: number) =>
    index % 2 !== 0 ? "#ffffff40" : "#ffffff1f";

  if (isLoadingScraps) {
    return <Loading />;
  }

  if (!isLoadingScraps && scraps.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="space-y-4">
      {/* Page Size Selector */}
      <div className="flex justify-end">
        <Select
          onChange={(e) => setPageSize(Number(e.target.value))}
          width="120px"
          size="sm"
          bg={colors.cardBackground}
          color={colors.textPrimary}
          borderColor={colors.border}
          _hover={{ borderColor: colors.primary }}
          _focus={{
            borderColor: colors.primary,
            boxShadow: `0 0 0 1px ${colors.primary}`,
          }}
        >
          {[5,10, 20, 50, 100, 100000].map((size) => (
            <option
              key={size}
              value={size}
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.textPrimary,
              }}
            >
              {size === 100000 ? "All" : size}
            </option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <TableContainer
        bg={colors.cardBackground}
        borderRadius="lg"
        border={`1px solid ${colors.border}`}
        maxHeight="600px"
        overflowY="auto"
        className="shadow-lg"
      >
        <Table variant="simple" {...getTableProps()}>
          <Thead bg={colors.tableHeader} position="sticky" top="0" zIndex="1">
            {headerGroups.map((hg: HeaderGroup<any>) => (
              <Tr {...hg.getHeaderGroupProps()}>
                {hg.headers.map((column: any) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    color={colors.textPrimary}
                    fontSize="sm"
                    fontWeight="semibold"
                    textTransform="none"
                    borderColor={colors.border}
                    py={4}
                    px={4}
                    cursor="pointer"
                    _hover={{ bg: colors.hoverBackground }}
                  >
                    <div className="flex items-center gap-2">
                      {column.render("Header")}
                      {column.isSorted &&
                        (column.isSortedDesc ? (
                          <FaCaretDown className="text-xs" />
                        ) : (
                          <FaCaretUp className="text-xs" />
                        ))}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody {...getTableBodyProps()}>
            {page.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  bg={
                    index % 2 === 0
                      ? colors.cardBackground
                      : colors.alternateRow
                  }
                  _hover={{
                    bg: colors.hoverBackground,
                    cursor: openScrapDetailsDrawerHandler
                      ? "pointer"
                      : "default",
                  }}
                  onClick={() =>
                    openScrapDetailsDrawerHandler?.(row.original.id)
                  }
                >
                  {row.cells.map((cell: Cell) => {
                    const colId = cell.column.id;
                    const original = row.original;

                    let displayValue;
                    if (colId === "item") {
                      displayValue = original.item?.name || "N/A";
                    } else if (colId === "bom") {
                      displayValue = original.bom?.bom_name || "N/A";
                    } else if (colId === "finished_good") {
                      displayValue =
                        original.bom?.finished_good?.item?.name || "N/A";
                    } else if (colId === "estimated_quantity") {
                      displayValue = original.estimated_quantity || "0";
                    } else if (colId === "produced_quantity") {
                      displayValue = original.produced_quantity || "0";
                    } else if (colId === "total_part_cost") {
                      displayValue = original.total_part_cost
                        ? `₹${original.total_part_cost}`
                        : "₹0";
                    } else if (colId === "createdAt") {
                      displayValue = original.createdAt
                        ? moment(original.createdAt).format("DD/MM/YYYY")
                        : "N/A";
                    } else if (colId === "updatedAt") {
                      displayValue = original.updatedAt
                        ? moment(original.updatedAt).format("DD/MM/YYYY")
                        : "N/A";
                    } else {
                      displayValue = cell.render("Cell");
                    }

                    return (
                      <Td
                        {...cell.getCellProps()}
                        color={colors.textSecondary}
                        fontSize="sm"
                        borderColor={colors.border}
                        py={3}
                        px={4}
                        className="whitespace-nowrap truncate max-w-xs"
                        title={
                          typeof displayValue === "string" ? displayValue : ""
                        }
                      >
                        {displayValue}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canPreviousPage
              ? `bg-${colors.primary} text-white hover:bg-opacity-90`
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>

        <span className="text-sm" style={{ color: colors.textSecondary }}>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canNextPage
              ? `bg-${colors.primary} text-white hover:bg-opacity-90`
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ScrapTable;
