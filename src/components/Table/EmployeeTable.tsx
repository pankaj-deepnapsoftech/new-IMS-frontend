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

interface EmployeeTableProps {
  employees: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
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
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  }: TableInstance<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: employees,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );
  const dynamicBg = (index) => {
    return index % 2 !== 0 ? "gray.100" : "white";
  };
  return (
    <div>
      {isLoadingEmployees && <Loading />}
      {employees.length === 0 && !isLoadingEmployees && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingEmployees && employees.length > 0 && (
        <div>
          <div className="flex justify-end mb-2">
            <Select
              onChange={(e) => setPageSize(e.target.value)}
              width="80px"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={100000}>All</option>
            </Select>
          </div>
          <TableContainer overflowY="auto" className=" mx-3  bg-white rounded-md">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold bg-[#2D3748]">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      first_name: string;
                      last_name: string;
                      email: string;
                      phone: string;
                      role: string;
                      isVerified: boolean;
                      createdAt: string;
                      updatedAt: string;
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()} borderBottom="1px solid #e2e8f0" >
                        {hg.headers.map((column: any) => {
                          return (
                            <Th
                              textTransform="capitalize"
                              fontSize="12px"
                              fontWeight="700"
                              color="white"

                              borderLeft="1px solid #d7d7d7"
                              borderRight="1px solid #d7d7d7"
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <p className="flex font-light text-[15px]">
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
                          fontSize="12px"
                          fontWeight="700"
                          color="white"
                          backgroundColor="#2D3748"
                          borderLeft="1px solid #d7d7d7"
                          borderRight="1px solid #d7d7d7"
                        >
                          Actions
                        </Th>
                      </Tr>
                    );
                  }
                )}
              </Thead>
              <Tbody {...getTableBodyProps()} >
                {page.map((row: any,index) => {
                  prepareRow(row)
                 
                  return (
                    <Tr
                      className="relative  hover:cursor-pointer  lg:text-sm"
                      {...row.getRowProps()}
                      style={{ borderBottom: "1px solid #e2e8f0", }}
                      bgColor={dynamicBg(index)}
                      _hover={{
                        bg: "gray.50",
                        cursor: "pointer",
                       
                        transition: "all 0.2s",
                      }}
                    >
                      {row.cells.map((cell: Cell, index: number) => {
                        const isFirst = index === 0;
                        const isLast = index === row.cells.length - 1;

                        return (
                          <Td
                            fontWeight="600"
                            {...cell.getCellProps()}
                            fontSize="sm"
                            style={{
                              borderRadius: isFirst ? "6px 0 0 6px" : isLast ? "0 6px 6px 0" : "0",
                              // backgroundColor: "#ffffff",
                            }}
                          >
                            {/* Custom cell rendering (dates, role, verification) */}
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
                              cell.column.id !== "isVerified" &&
                              cell.column.id !== "role" &&
                              cell.render("Cell")}

                            {cell.column.id === "createdAt" && row.original?.createdAt && (
                              <span>
                                {moment(row.original?.createdAt).format("DD/MM/YYYY")}
                              </span>
                            )}
                            {cell.column.id === "updatedAt" && row.original?.updatedAt && (
                              <span>
                                {moment(row.original?.updatedAt).format("DD/MM/YYYY")}
                              </span>
                            )}
                            {cell.column.id === "isVerified" && (
                              <span
                                className="px-2 py-1 rounded-md"
                                style={{
                                  backgroundColor: verificationStyles[
                                    row.original.isVerified ? "verified" : "not verified"
                                  ].bg,
                                  color: verificationStyles[
                                    row.original.isVerified ? "verified" : "not verified"
                                  ].text,
                                }}
                              >
                                {row.original.isVerified ? "Verified" : "Not Verified"}
                              </span>
                            )}
                            {cell.column.id === "role" && (
                              <span>
                                {(row.original?.role && row.original.role.role) ||
                                  (row.original.isSuper && "Super Admin") ||
                                  ""}
                              </span>
                            )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openEmployeeDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openEmployeeDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateEmployeeDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateEmployeeDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteEmployeeHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteEmployeeHandler(row.original?._id)
                            }
                          />
                        )}
                        {approveEmployeeHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveEmployeeHandler(row.original?._id)
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
            <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
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

export default EmployeeTable;
