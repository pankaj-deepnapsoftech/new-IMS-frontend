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
import { usePagination, useSortBy, useTable } from "react-table";
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
  const columns = useMemo(
    () => [
      { Header: "Role", accessor: "role" },
      { Header: "Description", accessor: "description" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const dynamicBg = (index) => {
    return index % 2 !== 0 ? "gray.50" : "white";
  };

  const [showDeletePage, setshowDeletePage] = useState(false);
  const [deleteId, setdeleteId] = useState("");

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
    <div className="p-6">
      {isLoadingRoles && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600 font-medium">Loading roles...</span>
          </div>
        </div>
      )}

      {!isLoadingRoles && roles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No roles found
          </h3>
          <p className="text-gray-500 max-w-md">
            Get started by creating your first user role to manage permissions
            and access levels.
          </p>
        </div>
      )}

      {!isLoadingRoles && roles.length > 0 && (
        <>
          {/* Table Header with Stats and Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {roles.length} Role{roles.length !== 1 ? "s" : ""} Found
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Show:</span>
              <Select
                onChange={(e) => setPageSize(Number(e.target.value))}
                value={pageSize}
                size="sm"
                width="auto"
                borderRadius="lg"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              >
                {[10, 20, 50, 100, 100000].map((size) => (
                  <option key={size} value={size}>
                    {size === 100000 ? "All" : size}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table
                {...getTableProps()}
                variant="simple"
                size="md"
                minWidth="800px"
              >
                <Thead bg="gray.50">
                  {headerGroups.map((hg) => (
                    <Tr
                      {...hg.getHeaderGroupProps()}
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      {hg.headers.map((column) => (
                        <Th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          fontSize="14px"
                          color="gray.700"
                          fontWeight="600"
                          whiteSpace="nowrap"
                        >
                          <div className="flex items-center  gap-1">
                            {column.render("Header")}
                            {column.isSorted &&
                              (column.isSortedDesc ? (
                                <FaCaretDown />
                              ) : (
                                <FaCaretUp />
                              ))}
                          </div>
                        </Th>
                      ))}
                      <Th
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.700"
                        whiteSpace="nowrap"
                      >
                        Actions
                      </Th>
                    </Tr>
                  ))}
                </Thead>

                <Tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <Tr
                        {...row.getRowProps()}
                        _hover={{
                          bg: "blue.50",
                          transform: "translateY(-1px)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          shadow: "md",
                        }}
                        bgColor={dynamicBg(index)}
                        transition="all 0.2s ease"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                      >
                        {row.cells.map((cell) => (
                          <Td
                            {...cell.getCellProps()}
                            fontSize="14px"
                            color="gray.700"
                            p={3}
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            overflow="hidden"
                            maxW="150px"
                            textTransform="capitalize"
                          >
                            {cell.column.id === "createdAt" ||
                            cell.column.id === "updatedAt" ? (
                              moment(row.original[cell.column.id]).format(
                                "DD/MM/YYYY"
                              )
                            ) : cell.column.id === "role" ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                                <svg
                                  className="w-4 h-4 mr-1.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {row.original.role}
                              </span>
                            ) : (
                              cell.render("Cell")
                            )}
                          </Td>
                        ))}
                        <Td p={3}>
                          <div className="flex items-center gap-2">
                            {openRoleDetailsDrawerHandler && (
                              <Tooltip label="View Details" placement="top">
                                <button
                                  onClick={() =>
                                    openRoleDetailsDrawerHandler(
                                      row.original._id
                                    )
                                  }
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                                >
                                  <svg
                                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                            {openUpdateRoleDrawerHandler && (
                              <Tooltip label="Edit Role" placement="top">
                                <button
                                  onClick={() =>
                                    openUpdateRoleDrawerHandler(
                                      row.original._id
                                    )
                                  }
                                  className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
                                >
                                  <svg
                                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                            {deleteRoleHandler && (
                              <Tooltip label="Delete Role" placement="top">
                                <button
                                  onClick={() => {
                                    setdeleteId(row.original._id);
                                    setshowDeletePage(true);
                                  }}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                                >
                                  <svg
                                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-center px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                disabled={!canPreviousPage}
                onClick={previousPage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageIndex + 1 === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        /* Add page navigation logic if needed */
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-500 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!canNextPage}
                onClick={nextPage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
      {showDeletePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete this role? This action cannot be
              undone and will permanently remove the role from the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setshowDeletePage(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRoleHandler(deleteId);
                  setshowDeletePage(false);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleTable;
