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
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import {
  usePagination,
  useSortBy,
  useTable,
  Column,
} from "react-table";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

const BOMRawMaterialTable = ({
  products,
  isLoadingProducts,
  openUpdateProductDrawerHandler,
  openProductDetailsDrawerHandler,
  deleteProductHandler,
  approveProductHandler,
}) => {
  const columns = useMemo(
    () => [
      { Header: "BOM", accessor: "bom_name" },
      { Header: "ID", accessor: "product_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Inventory Category", accessor: "inventory_category" },
      { Header: "Category", accessor: "category" },
      { Header: "Sub Category", accessor: "sub_category" },
      { Header: "Type", accessor: "item_type" },
      { Header: "Product/Service", accessor: "product_or_service" },
      { Header: "UOM", accessor: "uom" },
      { Header: "Price", accessor: "price" },
      { Header: "Current stock", accessor: "current_stock" },
      { Header: "Last Change", accessor: "change" },
      { Header: "Min stock", accessor: "min_stock" },
      { Header: "Max stock", accessor: "max_stock" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const inventoryCategoryStyles = {
    indirect: { bg: "#F03E3E", text: "#ffffff" },
    direct: { bg: "#409503", text: "#ffffff" },
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
  } = useTable(
    { columns, data: products, initialState: { pageIndex: 0 } },
    useSortBy,
    usePagination
  );

  const dynamicBg = (index) => (index % 2 !== 0 ? "#ffffff40" : "#ffffff1f");

  return (
    <div className="text-gray-200">
      {isLoadingProducts && <Loading />}
      {products.length === 0 && !isLoadingProducts && <EmptyData />}
      {!isLoadingProducts && products.length > 0 && (
        <div>
          <div className="flex justify-end mb-2">
            <Select onChange={(e) => setPageSize(e.target.value)} width="80px">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={100000}>All</option>
            </Select>
          </div>
          <TableContainer maxHeight="600px" overflowY="auto" className="bg-[#ffffff26] rounded-md">
            <Table variant="simple" {...getTableProps()} bg="#ffffff26">
              <Thead className="text-sm font-semibold" bg="#ffffff26">
                {headerGroups.map((hg) => (
                  <Tr {...hg.getHeaderGroupProps()} borderBottom="1px solid #e2e8f0">
                    {hg.headers.map((column) => (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        textTransform="capitalize"
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.200"
                      >
                        <div className="flex items-center gap-1">
                          {column.render("Header")}
                          {column.isSorted && (
                            <span>{column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />}</span>
                          )}
                        </div>
                      </Th>
                    ))}
                    <Th fontSize="14px" fontWeight="600" color="gray.200">
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
                      bg={dynamicBg(index)}
                      className="hover:bg-gray-700 transition-all"
                    >
                      {row.cells.map((cell) => (
                        <Td {...cell.getCellProps()} className="font-medium text-gray-200">
                          {cell.column.id === "createdAt" && row.original?.createdAt
                            ? moment(row.original?.createdAt).format("DD/MM/YYYY")
                            : cell.column.id === "updatedAt" && row.original?.updatedAt
                            ? moment(row.original?.updatedAt).format("DD/MM/YYYY")
                            : cell.column.id === "inventory_category" && row.original.inventory_category
                            ? (
                                <span
                                  className="px-2 py-1 rounded-md"
                                  style={{
                                    backgroundColor:
                                      inventoryCategoryStyles[row.original.inventory_category]?.bg,
                                    color:
                                      inventoryCategoryStyles[row.original.inventory_category]?.text,
                                  }}
                                >
                                  {row.original.inventory_category.charAt(0).toUpperCase() 
                                    row.original.inventory_category.slice(1)}
                                </span>
                              )
                            : cell.column.id === "change" && row.original.change_type
                            ? (
                                <div className="flex items-center gap-1">
                                  {row.original.change_type === "increase" ? (
                                    <FaArrowUpLong color="#0dac51" size={18} />
                                  ) : (
                                    <FaArrowDownLong color="#c70505" size={18} />
                                  )}
                                  <span
                                    style={{
                                      color:
                                        row.original.change_type === "increase"
                                          ? "#0dac51"
                                          : "#c70505",
                                    }}
                                  >
                                    {row.original.quantity_changed}
                                  </span>
                                </div>
                              )
                            : cell.render("Cell")}
                        </Td>
                      ))}
                      <Td>
                        <div className="flex items-center gap-2">
                          {openProductDetailsDrawerHandler && (
                            <MdOutlineVisibility
                              size={18}
                              className="cursor-pointer hover:scale-110"
                              onClick={() =>
                                openProductDetailsDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {openUpdateProductDrawerHandler && (
                            <MdEdit
                              size={18}
                              className="cursor-pointer hover:scale-110"
                              onClick={() =>
                                openUpdateProductDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {deleteProductHandler && (
                            <MdDeleteOutline
                              size={18}
                              className="cursor-pointer hover:scale-110"
                              onClick={() => deleteProductHandler(row.original?._id)}
                            />
                          )}
                          {approveProductHandler && (
                            <FcApproval
                              size={18}
                              className="cursor-pointer hover:scale-110"
                              onClick={() => approveProductHandler(row.original?._id)}
                            />
                          )}
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <div className="w-[max-content] m-auto my-7">
            <button
              className="text-sm bg-[#1640d6] py-1 px-4 text-white border border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-gray-200">{pageIndex + 1} of {pageCount}</span>
            <button
              className="text-sm bg-[#1640d6] py-1 px-4 text-white border border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
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

export default BOMRawMaterialTable;
