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
import { useMemo, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { FcApproval, FcDatabase } from "react-icons/fc";
import {
  usePagination,
  useSortBy,
  useTable,
  Column,
  TableState,
  TableInstance,
  HeaderGroup,
  Row,
  Cell,
} from "react-table";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

interface StoreTableProps {
  stores: Array<{
    name: string;
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingStores: boolean;
  openUpdateStoreDrawerHandler?: (id: string) => void;
  openStoreDetailsDrawerHandler?: (id: string) => void;
  deleteStoreHandler?: (id: string) => void;
  approveStoreHandler?: (id: string) => void;
}

const StoreTable: React.FC<StoreTableProps> = ({
  stores,
  isLoadingStores,
  openUpdateStoreDrawerHandler,
  openStoreDetailsDrawerHandler,
  deleteStoreHandler,
  approveStoreHandler,
}) => {

  const [showDeletePage, setshowDeletePage] = useState(false);
  const [deleteId, setdeleteId] = useState('')
  
  const columns: Column<{
    name: string;
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "GST No.",
        accessor: "gst_number",
      },
      {
        Header: "Address Line 1",
        accessor: "address_line1",
      },
      {
        Header: "Address Line 2",
        accessor: "address_line2",
      },
      {
        Header: "Pincode",
        accessor: "pincode",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Created On",
        accessor: "createdAt",
      },
      {
        Header: "Last Updated",
        accessor: "updatedAt",
      },
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
    name: string;
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: stores,
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
      {isLoadingStores && <Loading />}
      {stores.length === 0 && !isLoadingStores && <EmptyData />}
      {!isLoadingStores && stores.length > 0 && (
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
          <TableContainer maxHeight="600px" overflowY="auto" className="bg-[#14243452] rounded-md shadow-2xl ">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold" bg="#14243452" >
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      name: string;
                      gst_number: string;
                      address_line1: string;
                      address_line2?: string;
                      pincode?: string;
                      city: string;
                      state: string;
                      createdAt: string;
                      updatedAt: string;
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()} >
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
                      className="relative text-gray-200 text-[14px] hover:cursor-pointer"
                      {...row.getRowProps()}
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",

                        transition: "all 0.2s",
                      }}
                      bg={dynamicBg(index)}
                    >
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td fontWeight="500" border="none" {...cell.getCellProps()}>
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
                      <Td className="flex gap-x-2" border="none">
                        {openStoreDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openStoreDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateStoreDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateStoreDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteStoreHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              
                              {  setdeleteId(row.original._id);
                                setshowDeletePage(true)}
                              }
                            
                          />
                        )}
                        {approveStoreHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveStoreHandler(row.original?._id)
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
                                onClick={() =>{ deleteStoreHandler(deleteId);
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

export default StoreTable;
