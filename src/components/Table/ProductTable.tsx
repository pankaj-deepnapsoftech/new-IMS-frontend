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
import { usePagination, useSortBy, useTable, Column } from "react-table";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

interface ProductTableProps {
  products: Array<any>;
  isLoadingProducts: boolean;
  openUpdateProductDrawerHandler?: (id: string) => void;
  openProductDetailsDrawerHandler?: (id: string) => void;
  deleteProductHandler?: (id: string) => void;
  approveProductHandler?: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoadingProducts,
  openUpdateProductDrawerHandler,
  openProductDetailsDrawerHandler,
  deleteProductHandler,
  approveProductHandler,
}) => {
  const columns: Column<any>[] = useMemo(
    () => [
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
    indirect: { text: "#e70000" },
    direct: { text: "#25d98b" },
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
    <div>
      {isLoadingProducts && <Loading />}
      {!isLoadingProducts && products.length === 0 && <EmptyData />}
      {!isLoadingProducts && products.length > 0 && (
        <div>
          <div className="flex justify-end mb-2">
            <Select onChange={(e) => setPageSize(Number(e.target.value))} width="80px" color="white "
              size="sm"
              borderRadius="md"
              border="1px solid gray" sx={{
                option: {
                  backgroundColor: "#444e5b", // Default background
                  color: "white",
                },
              }}>

              {[10, 20, 50, 100, 100000].map((n) => (
                <option key={n} value={n}>
                  {n === 100000 ? "All" : n}
                </option>
              ))}
            </Select>


          </div>

          <TableContainer
            overflowY="auto"
            borderRadius="md"
            className="mx-3 bg-[#14243452]"
          >
            <Table variant="unstyled" {...getTableProps()}>
              <Thead className="text-sm font-semibold bg-[#14243452]">
                {headerGroups.map((hg) => (
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
                        <p className="flex items-center gap-1">
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
                    <Th
                      textTransform="capitalize"
                      fontSize="14px"
                      fontWeight="600"
                      color="white"
                    // bg="#14243452"
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
                      bgColor={dynamicBg(index)}
                      className="font-[600] hover:cursor-pointer text-gray-200 text-[14px]"
                      _hover={{
                        bg: "#ffffff78",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {row.cells.map((cell) => {
                        const colId = cell.column.id;
                        const original = row.original;
                        return (
                          <Td fontWeight="500" {...cell.getCellProps()} border="none">
                            {colId === "createdAt" && original?.createdAt
                              ? moment(original?.createdAt).format("DD/MM/YYYY")
                              : colId === "updatedAt" && original?.updatedAt
                                ? moment(original?.updatedAt).format("DD/MM/YYYY")
                                : colId === "inventory_category" && original.inventory_category
                                  ? (
                                    <span
                                      className="px-2 py-1 rounded-md font-[600]"
                                      style={{
                                        backgroundColor:
                                          inventoryCategoryStyles[original.inventory_category]?.bg,
                                        color:
                                          inventoryCategoryStyles[original.inventory_category]?.text,
                                      }}
                                    >
                                      {original.inventory_category[0].toUpperCase() +
                                        original.inventory_category.slice(1)}
                                    </span>
                                  )
                                  : colId === "change" && original.change_type
                                    ? (
                                      <p className="flex gap-1 items-center">
                                        {original.change_type === "increase" ? (
                                          <FaArrowUpLong color="#0dac51" size={20} />
                                        ) : (
                                          <FaArrowDownLong color="#c70505" size={20} />
                                        )}
                                        <span
                                          style={{
                                            color:
                                              original.change_type === "increase"
                                                ? "#0dac51"
                                                : "#c70505",
                                          }}
                                        >
                                          {original.quantity_changed}
                                        </span>
                                      </p>
                                    )
                                    : cell.render("Cell")}
                          </Td>
                        );
                      })}
                      <Td border="none" className="flex gap-x-2 items-center">
                        {openProductDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openProductDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateProductDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateProductDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteProductHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteProductHandler(row.original?._id)
                            }
                          />
                        )}
                        {approveProductHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveProductHandler(row.original?._id)
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
              className="text-sm mt-2 bg-[#2D3748] py-1 px-4 text-white border-[1px] border-[#2D3748] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-gray-200 text-sm">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-[#2D3748] py-1 px-4 text-white border-[1px] border-[#2D3748] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
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

export default ProductTable;
