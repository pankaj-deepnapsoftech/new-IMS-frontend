// @ts-nocheck

import { useEffect, useMemo } from "react";
import {
  Cell,
  Column,
  HeaderGroup,
  TableInstance,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Loading from "../../ui/Loading";
import { FcApproval, FcDatabase } from "react-icons/fc";
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
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import EmptyData from "../../ui/emptyData";

interface BOMTableProps {
  boms: Array<{
    bom_name: string;
    parts_count: string;
    total_cost: string;
    approval_date?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingBoms: boolean;
  openUpdateBomDrawerHandler?: (id: string) => void;
  openBomDetailsDrawerHandler?: (id: string) => void;
  deleteBomHandler?: (id: string) => void;
  approveBomHandler?: (id: string) => void;
}

const BOMTable: React.FC<BOMTableProps> = ({
  boms,
  isLoadingBoms,
  openUpdateBomDrawerHandler,
  openBomDetailsDrawerHandler,
  deleteBomHandler,
  approveBomHandler,
}) => {
  const columns = useMemo(
    () => [
      { Header: "BOM Name", accessor: "bom_name" },
      { Header: "Parts Count", accessor: "parts_count" },
      { Header: "Total Cost", accessor: "total_cost" },
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
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  }: TableInstance<{
    bom_name: string;
    parts_count: string;
    total_cost: string;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: boms,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );
  const dynamicBg = (index) => {
    return index % 2 !== 0 ? "#ffffff40" : "#ffffff1f";
  };
  return (
    <div>
      {isLoadingBoms && <Loading />}
      {boms.length === 0 && !isLoadingBoms && <EmptyData />}
      {!isLoadingBoms && boms.length > 0 && (
        <div>
          <div className="flex justify-end mb-2 mt-2">
            <Select
              onChange={(e) => setPageSize(e.target.value)}
              color="white"
              width="80px"
              size="sm"
              borderRadius="md"
              border="1px solid white"
              sx={{
                option: {
                  backgroundColor: "#444e5b", // Default background
                  color: "white",
                },
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={100000}>All</option>
            </Select>
          </div>

          <TableContainer
            maxHeight="600px"
            overflowY="auto"
            className="  rounded-md bg-[#14243452]"
          >
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-[14px] font-[600]" bg="#14243452">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      bom_name: string;
                      parts_count: string;
                      total_cost: string;
                      approved_by: string;
                      createdAt: string;
                      updatedAt: string;
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()}>
                        {hg.headers.map((column: any) => {
                          return (
                            <Th
                              textTransform="capitalize"
                              fontSize="14px"
                              fontWeight="600"
                              color="white"
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <p className="flex">
                                {column.render("Header")}
                                {column.isSorted && (
                                  <span>
                                    {column.isSortedDesc ? (
                                      <FaCaretDown />
                                    ) : (
                                      <FaCaretUp />
                                    )}
                                  </span>
                                )}
                              </p>
                            </Th>
                          );
                        })}
                        <Th
                          textTransform="capitalize"
                          fontSize="14px"
                          fontWeight="600"
                          color="white"
                        >
                          Actions
                        </Th>
                      </Tr>
                    );
                  }
                )}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row: any, index) => {
                  prepareRow(row);

                  return (
                    <Tr
                      className="relative text-gray-200  text-[15px] font-[700]"
                      {...row.getRowProps()}
                      bg={dynamicBg(index)}
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",
                      }}
                     
                    >
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td fontWeight="500" {...cell.getCellProps()}  border="none">
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
                              cell.render("Cell")}

                            {cell.column.id === "createdAt" &&
                              row.original?.createdAt && (
                                <span>
                                  {moment(row.original?.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                            {cell.column.id === "updatedAt" &&
                              row.original?.updatedAt && (
                                <span>
                                  {moment(row.original?.updatedAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2 text-gray-200"  border="none">
                        {openBomDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openBomDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateBomDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateBomDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteBomHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() => deleteBomHandler(row.original?._id)}
                          />
                        )}
                        {approveBomHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() => approveBomHandler(row.original?._id)}
                          />
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <div className="w-[max-content] m-auto my-7">
            <button
              className="text-sm mt-2 bg-[#2D3748] py-1 px-4 text-white border-[1px] border-[#2D3748] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm text-gray-200 md:text-lg lg:text-xl xl:text-base">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-[#2D3748] py-1 px-4 text-white border-[1px] border-[#2D3748] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canNextPage}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMTable;
