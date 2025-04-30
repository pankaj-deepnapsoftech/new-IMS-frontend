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
  TableInstance,
  HeaderGroup,
  Row,
  Cell,
} from "react-table";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";

interface BOMRawMaterialTableProps {
  products: Array<{
    name: string;
    product_id: string;
    uom: string;
    category: string;
    sub_category?: string;
    item_type: string;
    product_or_service: string;
    current_stock: number;
    price: number;
    min_stock?: number;
    max_stock?: number;
    hsn_code?: number;
    inventory_category?: string;
    createdAt: string;
    updatedAt: string;
    change_type?: string;
    quantity_changed?: number;
    _id: string;
  }>;
  isLoadingProducts: boolean;
  openUpdateProductDrawerHandler?: (id: string) => void;
  openProductDetailsDrawerHandler?: (id: string) => void;
  deleteProductHandler?: (id: string) => void;
  approveProductHandler?: (id: string) => void;
}

const BOMRawMaterialTable: React.FC<BOMRawMaterialTableProps> = ({
  products,
  isLoadingProducts,
  openUpdateProductDrawerHandler,
  openProductDetailsDrawerHandler,
  deleteProductHandler,
  approveProductHandler,
}) => {
  const columns: Column<any>[] = useMemo(
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
    indirect: {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    direct: {
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
      data: products,
      initialState: { pageIndex: 0 },
    },
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
            <Select onChange={(e) => setPageSize(Number(e.target.value))} width="80px">
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
                    {hg.headers.map((column: any) => (
                      <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        textTransform="capitalize"
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.200"
                      >
                        <p className="flex items-center gap-1">
                          {column.render("Header")}
                          {column.isSorted &&
                            (column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />)}
                        </p>
                      </Th>
                    ))}
                    <Th
                      textTransform="capitalize"
                      fontSize="14px"
                      fontWeight="600"
                      color="white"
                      textAlign="center"
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
                      bg={dynamicBg(index)}
                      _hover={{
                        bg: "gray.50",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      className="text-[15px] font-[700]"
                    >
                      {row.cells.map((cell: Cell) => (
                        <Td
                          fontWeight="500"
                          color="gray.200"
                          {...cell.getCellProps()}
                        >
                          {cell.column.id === "createdAt"
                            ? moment(row.original?.createdAt).format("DD/MM/YYYY")
                            : cell.column.id === "updatedAt"
                            ? moment(row.original?.updatedAt).format("DD/MM/YYYY")
                            : cell.column.id === "inventory_category"
                            ? row.original.inventory_category && (
                                <span
                                  className="px-2 py-1 rounded-md"
                                  style={{
                                    backgroundColor:
                                      inventoryCategoryStyles[row.original.inventory_category]?.bg,
                                    color:
                                      inventoryCategoryStyles[row.original.inventory_category]?.text,
                                  }}
                                >
                                  {row.original.inventory_category[0].toUpperCase() +
                                    row.original.inventory_category.slice(1)}
                                </span>
                              )
                            : cell.column.id === "change"
                            ? row.original.change_type && (
                                <span className="flex items-center gap-1">
                                  {row.original.change_type === "increase" ? (
                                    <FaArrowUpLong size={20} color="#0dac51" />
                                  ) : (
                                    <FaArrowDownLong size={20} color="#c70505" />
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
                                </span>
                              )
                            : cell.render("Cell")}
                        </Td>
                      ))}
                      <Td className="flex items-center justify-center gap-2 text-white">
                        {openProductDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => openProductDetailsDrawerHandler(row.original?._id)}
                          />
                        )}
                        {openUpdateProductDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => openUpdateProductDrawerHandler(row.original?._id)}
                          />
                        )}
                        {deleteProductHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => deleteProductHandler(row.original?._id)}
                          />
                        )}
                        {approveProductHandler && (
                          <FcApproval
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => approveProductHandler(row.original?._id)}
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
              className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm text-gray-300">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed"
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
