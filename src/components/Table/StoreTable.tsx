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
  Button,
  useDisclosure,
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
import { FaCaretDown, FaCaretUp, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import moment from "moment";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import { colors } from "../../theme/colors";

interface StoreTableProps {
  stores: Array<{
    _id: string;
    name: string;
    location: string;
    manager: string;
    capacity: number;
    current_stock: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingStores: boolean;
  openUpdateStoreDrawerHandler?: (id: string) => void;
  openStoreDetailsDrawerHandler?: (id: string) => void;
  deleteStoreHandler?: (id: string) => void;
}

const StoreTable: React.FC<StoreTableProps> = ({
  stores,
  isLoadingStores,
  openUpdateStoreDrawerHandler,
  openStoreDetailsDrawerHandler,
  deleteStoreHandler,
}) => {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const [storeToDelete, setStoreToDelete] = React.useState<string | null>(null);

  const columns: Column<any>[] = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Location", accessor: "location" },
      { Header: "Manager", accessor: "manager" },
      { Header: "Capacity", accessor: "capacity" },
      { Header: "Current Stock", accessor: "current_stock" },
      { Header: "Status", accessor: "status" },
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
      data: stores,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const handleDeleteClick = (id: string) => {
    setStoreToDelete(id);
    onDeleteModalOpen();
  };

  const handleDeleteConfirm = () => {
    if (storeToDelete && deleteStoreHandler) {
      deleteStoreHandler(storeToDelete);
    }
    setStoreToDelete(null);
    onDeleteModalClose();
  };

  if (isLoadingStores) {
    return <Loading />;
  }

  if (!isLoadingStores && stores.length === 0) {
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
          {[10, 20, 50, 100, 100000].map((size) => (
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
                <Th
                  color={colors.textPrimary}
                  fontSize="sm"
                  fontWeight="semibold"
                  textTransform="none"
                  borderColor={colors.border}
                  py={4}
                  px={4}
                >
                  Actions
                </Th>
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
                  _hover={{ bg: colors.hoverBackground }}
                >
                  {row.cells.map((cell: Cell) => {
                    const colId = cell.column.id;
                    const original = row.original;

                    let displayValue;
                    if (colId === "name") {
                      displayValue = original.name || "N/A";
                    } else if (colId === "location") {
                      displayValue = original.location || "N/A";
                    } else if (colId === "manager") {
                      displayValue = original.manager || "N/A";
                    } else if (colId === "capacity") {
                      displayValue = original.capacity || "N/A";
                    } else if (colId === "current_stock") {
                      displayValue = original.current_stock || "0";
                    } else if (colId === "status") {
                      displayValue = (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              original.status === "Active"
                                ? colors.success + "20"
                                : colors.error + "20",
                            color:
                              original.status === "Active"
                                ? colors.success
                                : colors.error,
                          }}
                        >
                          {original.status || "N/A"}
                        </span>
                      );
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

                  {/* Actions */}
                  <Td borderColor={colors.border} py={3} px={4}>
                    <div className="flex items-center gap-2">
                      {openStoreDetailsDrawerHandler && (
                        <Button
                          size="sm"
                          bg={colors.primary}
                          color="white"
                          _hover={{ bg: colors.primary + "CC" }}
                          onClick={() =>
                            openStoreDetailsDrawerHandler(row.original._id)
                          }
                          leftIcon={<FaEye />}
                        >
                          View
                        </Button>
                      )}

                      {openUpdateStoreDrawerHandler && (
                        <Button
                          size="sm"
                          bg={colors.secondary}
                          color={colors.textPrimary}
                          _hover={{ bg: colors.secondary + "CC" }}
                          onClick={() =>
                            openUpdateStoreDrawerHandler(row.original._id)
                          }
                          leftIcon={<FaEdit />}
                        >
                          Edit
                        </Button>
                      )}

                      {deleteStoreHandler && (
                        <Button
                          size="sm"
                          bg={colors.error}
                          color="white"
                          _hover={{ bg: colors.error + "CC" }}
                          onClick={() => handleDeleteClick(row.original._id)}
                          leftIcon={<FaTrash />}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </Td>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.textPrimary }}
            >
              Confirm Delete
            </h3>
            <p style={{ color: colors.textSecondary }} className="mb-6">
              Are you sure you want to delete this store? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                size="sm"
                bg={colors.secondary}
                color={colors.textPrimary}
                onClick={onDeleteModalClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                bg={colors.error}
                color="white"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreTable;
