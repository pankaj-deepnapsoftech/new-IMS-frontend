// @ts-nocheck

import { useMemo, useState } from "react";
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

interface ProcessTableProps {
  process: Array<{
    creator: any;
    item: string;
    rm_store: string;
    fg_store: string;
    scrap_store: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  }>;
  isLoadingProcess: boolean;
  openUpdateProcessDrawerHandler?: (id: string) => void;
  openProcessDetailsDrawerHandler?: (id: string) => void;
  deleteProcessHandler?: (id: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  process,
  isLoadingProcess,
  openUpdateProcessDrawerHandler,
  openProcessDetailsDrawerHandler,
  deleteProcessHandler,
}) => {


  const [showDeletePage, setshowDeletePage] = useState(false);
  const [deleteId, setdeleteId] = useState('')

  const columns = useMemo(
    () => [
      { Header: "Created By", accessor: "creator" },
      { Header: "Status", accessor: "status" },
      { Header: "Item", accessor: "item" },
      { Header: "RM Store", accessor: "rm_store" },
      { Header: "FG Store", accessor: "fg_store" },
      { Header: "Scrap Store", accessor: "scrap_store" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const statusStyles = {
    "raw material approval pending": {

      text: "#F03E3E",
    },
    "raw materials approved": {

      text: "#3392F8",
    },
    "work in progress": {

      text: "#E48C27",
    },
    completed: {

      text: "#409503",
    },
  };

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
    process: string;
    description: string;
    creator: any;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: process,
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
      {isLoadingProcess && <Loading />}
      {process.length === 0 && !isLoadingProcess && <EmptyData />}
      {!isLoadingProcess && process.length > 0 && (
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
            className=" bg-[#14243452] rounded-md"
          >
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold  bg-[#14243452]">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      process: string;
                      description: string;
                      creator: any;
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
                      className="relative  text-gray-200 hover:cursor-pointer text-base lg:text-sm"
                      {...row.getRowProps()}
                      bg={dynamicBg(index)}
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",
                      }}
                    >
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td fontWeight="500" {...cell.getCellProps()} border="none">
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
                              cell.column.id !== "creator" &&
                              cell.column.id !== "rm_store" &&
                              cell.column.id !== "fg_store" &&
                              cell.column.id !== "scrap_store" &&
                              cell.column.id !== "item" &&
                              cell.column.id !== "status" &&
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
                            {cell.column.id === "creator" && (
                              <span>
                                {row.original.creator.first_name +
                                  " " +
                                  row.original.creator.last_name}
                              </span>
                            )}
                            {cell.column.id === "item" && (
                              <span>{row.original.item.name}</span>
                            )}
                            {cell.column.id === "rm_store" && (
                              <span>{row.original.rm_store?.name || "N/A"}</span>
                            )}
                            {cell.column.id === "fg_store" && (
                              <span>{row.original.fg_store?.name || "N/A"}</span>
                            )}
                            {cell.column.id === "scrap_store" && (
                              <span>{row.original.scrap_store.name}</span>
                            )}
                            {cell.column.id === "status" && (
                              <span
                                className="px-2 py-1 rounded-md"
                                style={{
                                  backgroundColor:
                                    statusStyles[row.original.status].bg,
                                  color: statusStyles[row.original.status].text,
                                }}
                              >
                                {row.original.status.toUpperCase()}
                              </span>
                            )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2" border="none">
                        {openProcessDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openProcessDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateProcessDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateProcessDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteProcessHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                            
                            {
                              setdeleteId(row.original._id);
                              setshowDeletePage(true)
                            }
                            }

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
            <span className="mx-3 text-gray-200 text-sm md:text-lg lg:text-xl xl:text-base">
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
          {showDeletePage && (
                <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-[#1C3644] rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h2>
                        <p className="text-sm text-white mb-6">Are you sure you want to delete this item ?</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setshowDeletePage(!showDeletePage)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>{ deleteProcessHandler(deleteId);
                                setshowDeletePage(false)
                                }}

                                className={`px-4 py-2 text-sm font-medium text-white rounded transition  bg-red-600 hover:bg-red-700 `}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>


            )}
    </div>
  );
};

export default ProcessTable;
