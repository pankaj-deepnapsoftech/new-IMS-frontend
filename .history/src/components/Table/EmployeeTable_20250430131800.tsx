// @ts-nocheck

import { useMemo } from "react";
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
  IconButton,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import moment from "moment";
import EmptyData from "../../ui/emptyData";

interface EmployeeTableProps {
  employees: Array<{
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: any;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    isSuper?: boolean;
  }>;
  isLoadingEmployees: boolean;
  openUpdateEmployeeDrawerHandler?: (id: string) => void;
  openEmployeeDetailsDrawerHandler?: (id: string) => void;
  deleteEmployeeHandler?: (id: string) => void;
  approveEmployeeHandler?: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoadingEmployees,
  openUpdateEmployeeDrawerHandler,
  openEmployeeDetailsDrawerHandler,
  deleteEmployeeHandler,
  approveEmployeeHandler,
}) => {
  const columns = useMemo(
    () => [
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Role", accessor: "role" },
      { Header: "isVerified", accessor: "isVerified" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const verificationStyles = {
    "not verified": {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    verified: {
      bg: "#409503",
      text: "#ffffff",
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
    state: { pageIndex },
    pageCount,
    setPageSize,
  }: TableInstance<any> = useTable(
    {
      columns,
      data: employees,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const dynamicBg = (index: number) => (index % 2 === 0 ? "#1A202C" : "#2D3748");

  return (
    <Box>
      {isLoadingEmployees && <Loading />}
      {!isLoadingEmployees && employees.length === 0 && <EmptyData />}
      {!isLoadingEmployees && employees.length > 0 && (
        <>
          <Flex justify="end" mb={3}>
            <Select
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="100px"
              size="sm"
              bg="whiteAlpha.100"
              borderColor="gray.500"
              color="white"
              _hover={{ borderColor: "whiteAlpha.500" }}
            >
              {[10, 20, 50, 100, 100000].map((val) => (
                <option key={val} value={val} style={{ color: "#000" }}>
                  {val === 100000 ? "All" : val}
                </option>
              ))}
            </Select>
          </Flex>

          <TableContainer borderRadius="lg" bg="#ffffff1a" px={2}>
            <Table variant="simple" size="sm" {...getTableProps()}>
              <Thead>
                {headerGroups.map((hg: HeaderGroup<any>) => (
                  <Tr {...hg.getHeaderGroupProps()} bg="#ffffff26">
                    {hg.headers.map((column: any) => (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        color="gray.200"
                        textTransform="capitalize"
                        fontSize="sm"
                      >
                        <Flex align="center" gap={1}>
                          {column.render("Header")}
                          {column.isSorted && (
                            <span>
                              {column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />}
                            </span>
                          )}
                        </Flex>
                      </Th>
                    ))}
                    <Th color="gray.200" fontSize="sm">
                      Actions
                    </Th>
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row: any, index) => {
                  prepareRow(row);
                  return (
                    <Tr
                      {...row.getRowProps()}
                      bg={dynamicBg(index)}
                      _hover={{ bg: "#4A5568" }}
                    >
                      {row.cells.map((cell: Cell<any>) => {
                        const { id } = cell.column;

                        return (
                          <Td {...cell.getCellProps()} color="gray.100">
                            {id === "createdAt" || id === "updatedAt" ? (
                              moment(row.original?.[id]).format("DD/MM/YYYY")
                            ) : id === "isVerified" ? (
                              <Box
                                as="span"
                                px={2}
                                py={1}
                                borderRadius="md"
                                bgColor={
                                  row.original.isVerified
                                    ? verificationStyles.verified.bg
                                    : verificationStyles["not verified"].bg
                                }
                                color={
                                  row.original.isVerified
                                    ? verificationStyles.verified.text
                                    : verificationStyles["not verified"].text
                                }
                              >
                                {row.original.isVerified ? "Verified" : "Not Verified"}
                              </Box>
                            ) : id === "role" ? (
                              row.original?.role?.role || (row.original.isSuper && "Super Admin") || "-"
                            ) : (
                              cell.render("Cell")
                            )}
                          </Td>
                        );
                      })}
                      <Td>
                        <Flex gap={2}>
                          {openEmployeeDetailsDrawerHandler && (
                            <Tooltip label="View">
                              <IconButton
                                icon={<MdOutlineVisibility />}
                                size="sm"
                                onClick={() =>
                                  openEmployeeDetailsDrawerHandler(row.original?._id)
                                }
                                aria-label="View"
                              />
                            </Tooltip>
                          )}
                          {openUpdateEmployeeDrawerHandler && (
                            <Tooltip label="Edit">
                              <IconButton
                                icon={<MdEdit />}
                                size="sm"
                                onClick={() =>
                                  openUpdateEmployeeDrawerHandler(row.original?._id)
                                }
                                aria-label="Edit"
                              />
                            </Tooltip>
                          )}
                          {deleteEmployeeHandler && (
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<MdDeleteOutline />}
                                size="sm"
                                onClick={() =>
                                  deleteEmployeeHandler(row.original?._id)
                                }
                                aria-label="Delete"
                              />
                            </Tooltip>
                          )}
                          {approveEmployeeHandler && (
                            <Tooltip label="Approve">
                              <IconButton
                                icon={<FcApproval />}
                                size="sm"
                                onClick={() =>
                                  approveEmployeeHandler(row.original?._id)
                                }
                                aria-label="Approve"
                              />
                            </Tooltip>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <Flex justify="center" align="center" mt={6} gap={4}>
            <button
              className="text-sm bg-[#2D3748] text-white py-1 px-4 rounded-full disabled:bg-gray-400"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <Text color="gray.100" fontSize="sm">
              Page {pageIndex + 1} of {pageCount}
            </Text>
            <button
              className="text-sm bg-[#2D3748] text-white py-1 px-4 rounded-full disabled:bg-gray-400"
              disabled={!canNextPage}
              onClick={nextPage}
            >
              Next
            </button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default EmployeeTable;
