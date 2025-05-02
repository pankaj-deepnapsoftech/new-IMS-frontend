// @ts-nocheck
import {
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import { useMemo } from "react";
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
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

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

  return (
    <div>
      {isLoadingScraps && <Loading />}
      {!isLoadingScraps && scraps.length === 0 && <EmptyData />}
      {!isLoadingScraps && scraps.length > 0 && (
        <div>
          {/* Page Size Selector */}
          <div className="flex justify-end mb-2 mt-2">
            <Select
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="80px"
              size="sm"
              color="white"
              border="1px solid gray"
              borderRadius="md"
              sx={{
                option: {
                  backgroundColor: "#444e5b", // Default background
                  color: "white",
                },
              }}
            >
              {[10, 20, 50, 100, 100000].map((size) => (
                <option value={size} key={size}>
                  {size === 100000 ? "All" : size}
                </option>
              ))}
            </Select>
          </div>

          {/* Table */}
          <TableContainer
            maxHeight="600px"
            overflowY="auto"
            className="bg-[#14243452] rounded-md"
          >
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold" bg="#14243452">
                {headerGroups.map((hg: HeaderGroup<any>) => (
                  <Tr {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((column: any) => (
                      <Th
                        textTransform="capitalize"
                        fontSize="14px"
                        fontWeight="600"
                        color="white"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <p className="flex items-center gap-1 text-[14px] text-gray-200 font-[600]">
                          {column.render("Header")}
                          {column.isSorted &&
                            (column.isSortedDesc ? (
                              <FaCaretDown />
                            ) : (
                              <FaCaretUp />
                            ))}
                        </p>
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
                      bg={dynamicBg(index)}
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {row.cells.map((cell: Cell) => {
                        const colId = cell.column.id;
                        const original = row.original;

                        let displayValue;
                        if (colId === "item") {
                          displayValue = original.item.name;
                        } else if (colId === "bom") {
                          displayValue = original.bom.bom_name;
                        } else if (colId === "finished_good") {
                          displayValue = original.bom.finished_good.item.name;
                        } else if (colId === "createdAt") {
                          displayValue = moment(original.createdAt).format(
                            "DD/MM/YYYY"
                          );
                        } else if (colId === "updatedAt") {
                          displayValue = moment(original.updatedAt).format(
                            "DD/MM/YYYY"
                          );
                        } else {
                          displayValue = cell.render("Cell");
                        }

                        return (
                          <Td
                            fontWeight="600"
                            fontSize="14px"
                            color="gray.200"
                            border="none"
                            {...cell.getCellProps()}
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
          <div className="w-max mx-auto my-7 flex items-center gap-4">
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className="bg-[#2D3748] text-white text-sm md:text-lg px-4 py-1 rounded-3xl border border-[#2D3748] disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm md:text-lg text-gray-300">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className="bg-[#2D3748] text-white text-sm md:text-lg px-4 py-1 rounded-3xl border border-[#2D3748] disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapTable;
