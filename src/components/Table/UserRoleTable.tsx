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
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import moment from "moment";
import { useMemo, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import {
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

interface UserRoleTableProps {
  roles: Array<{
    role: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
  }>;
  isLoadingRoles: boolean;
  openUpdateRoleDrawerHandler?: (id: string) => void;
  openRoleDetailsDrawerHandler?: (id: string) => void;
  deleteRoleHandler?: (id: string) => void;
}

const UserRoleTable: React.FC<UserRoleTableProps> = ({
  roles,
  isLoadingRoles,
  openUpdateRoleDrawerHandler,
  openRoleDetailsDrawerHandler,
  deleteRoleHandler,
}) => {
  const columns = useMemo(() => [
    { Header: "Role", accessor: "role" },
    { Header: "Description", accessor: "description" },
    { Header: "Created On", accessor: "createdAt" },
    { Header: "Last Updated", accessor: "updatedAt" },
  ], []);

  const dynamicBg = (index) => {
    return index % 2 !== 0 ? "#ffffff40" : "#ffffff1f";
  };

  
  const [showDeletePage, setshowDeletePage] = useState(false);
  const [deleteId, setdeleteId] = useState('')


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
    pageCount,
  } = useTable(
    { columns, data: roles, initialState: { pageIndex: 0 } },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {isLoadingRoles && <Loading />}

      {!isLoadingRoles && roles.length === 0 && (
       <EmptyData/>
      )}

      {!isLoadingRoles && roles.length > 0 && (
        <>
          {/* Page Size Selector */}

           <div className="flex justify-end mb-2 mt-2">
                      <Select
                        onChange={(e) => setPageSize(Number(e.target.value))}
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
                       {[10, 20, 50, 100, 100000].map((size) => (
                <option key={size} value={size} >
                  {size === 100000 ? "All" : size}
                </option>
              ))}
                      </Select>
                    </div>

          {/* Table */}
          <TableContainer
            borderRadius="md"
            boxShadow="lg"
            bg="#14243452"
            // p={2.5}
            overflowX="auto"
        
          >
            <Table {...getTableProps()} variant="unstyled" borderRadius="md" size="md" >
              <Thead bg="#14243452"  borderRadius="md">
                {headerGroups.map((hg) => (
                  <Tr {...hg.getHeaderGroupProps()} borderBottom="1px solid #e2e8f0" >
                    {hg.headers.map((column) => (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        fontSize="14px"
                        color="white"
                        fontWeight="600"
                        
                        whiteSpace="nowrap"
                      >
                        <div className="flex items-center  gap-1">
                          {column.render("Header")}
                          {column.isSorted &&
                            (column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />)}
                        </div>
                      </Th>
                    ))}
                    <Th
                      fontSize="14px"
                      fontWeight="600"
                      color="white"
                      whiteSpace="nowrap"
                     
                    >
                      Actions
                    </Th>
                  </Tr>
                ))}
              </Thead>

              <Tbody {...getTableBodyProps()} >
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Tr
                      {...row.getRowProps()}
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",
                        
                        transition: "all 0.2s",
                      }}
                      bgColor={dynamicBg(index)}
                   
                      
                    >
                      {row.cells.map((cell) => (
                        <Td
                          {...cell.getCellProps()}
                          fontSize="14px"
                          color="gray.300"
                          p={3}
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                          overflow="hidden"
                          maxW="150px"
                          textTransform="capitalize"
                          
                        >
                          {cell.column.id === "createdAt" || cell.column.id === "updatedAt"
                            ? moment(row.original[cell.column.id]).format("DD/MM/YYYY")
                            : cell.column.id === "role" ? (
                              <Badge  color="gray.200" fontSize="14px" textTransform="capitalize" fontWeight="600" bg="transparent" >
                                {row.original.role}
                              </Badge>
                            ) : (
                              cell.render("Cell")
                            )}
                        </Td>
                      ))}
                      <Td p={3} >
                        <div className="flex items-center gap-3">
                          {openRoleDetailsDrawerHandler && (
                            <Tooltip label="View Details">
                              <span>
                                <MdOutlineVisibility
                                  className="cursor-pointer text-gray-300 hover:text-blue-500 transition-transform hover:scale-110"
                                  size={18}
                                  onClick={() =>
                                    openRoleDetailsDrawerHandler(row.original._id)
                                  }
                                />
                              </span>
                            </Tooltip>
                          )}
                          {openUpdateRoleDrawerHandler && (
                            <Tooltip label="Edit Role">
                              <span>
                                <MdEdit
                                  className="cursor-pointer text-gray-300 hover:text-red-500 transition-transform hover:scale-110"
                                  size={18}
                                  onClick={() =>
                                    openUpdateRoleDrawerHandler(row.original._id)
                                  }
                                />
                              </span>
                            </Tooltip>
                          )}
                          {deleteRoleHandler && (
                            <Tooltip label="Delete Role">
                              <span>
                                <MdDeleteOutline
                                  className="cursor-pointer text-gray-300 hover:text-red-600 transition-transform hover:scale-110"
                                  size={18}
                                  onClick={() =>
                                    // deleteRoleHandler(row.original._id)
                                  {  setdeleteId(row.original._id);
                                    setshowDeletePage(true)}
                                  }
                                />
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <div className="w-full flex justify-center mt-6 gap-3 flex-wrap">
            <button
              disabled={!canPreviousPage}
              onClick={previousPage}
              className="bg-[#2D3748] text-white px-4 py-1 rounded-full text-sm hover:bg-[#4A5568] transition disabled:bg-gray-400"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-white" >
              Page {pageIndex + 1} of {pageCount}
            </span>
            <button
              disabled={!canNextPage}
              onClick={nextPage}
              className="bg-[#2D3748] text-white px-4 py-1 rounded-full text-sm hover:bg-[#4A5568] transition disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
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
                                onClick={() =>{ deleteRoleHandler(deleteId);
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

export default UserRoleTable;
