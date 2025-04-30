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

interface ScrapTableProps {
    scraps: Array<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>;
    isLoadingScraps: boolean;
    openScrapDetailsDrawerHandler?: (id: string) => void;
}

const ScrapTable: React.FC<ScrapTableProps> = ({
    scraps,
    isLoadingScraps,
    openScrapDetailsDrawerHandler,
}) => {
    const columns: Column<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>[] = useMemo(
        () => [
            {
                Header: "Item",
                accessor: "item",
            },
            {
                Header: "BOM",
                accessor: "bom",
            },
            {
                Header: "Finished Good",
                accessor: "finished_good",
            },
            {
                Header: "Estimated Quantity",
                accessor: "estimated_quantity",
            },
            {
                Header: "Produced Quantity",
                accessor: "produced_quantity",
            },
            {
                Header: "Total Part Cost",
                accessor: "total_part_cost",
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
        state: { pageIndex, pageSize },
        pageCount,
        setPageSize,
    }: TableInstance<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }> = useTable(
        {
            columns,
            data: scraps,
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
            {isLoadingScraps && <Loading />}
            {scraps.length === 0 && !isLoadingScraps && (
               <EmptyData/>
            )}
            {!isLoadingScraps && scraps.length > 0 && (
                <div>
                    <div className="flex justify-end mb-2">
                        <Select
                            onChange={(e) => setPageSize(e.target.value)}
                            width="80px"
                            color="white"
                            size="sm"
                            borderRadius="md"
                            border="1px solid gray"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={100000}>All</option>
                        </Select>
                    </div>
                    <TableContainer maxHeight="600px" overflowY="auto" className=" bg-[#ffffff26] rounded-md" >
                        <Table variant="simple" {...getTableProps()} bg="#ffffff26" >
                            <Thead className="text-sm font-semibold">
                                {headerGroups.map(
                                    (
                                        hg: HeaderGroup<{
                                            item: string;
                                            bom: string;
                                            estimated_quantity: string;
                                            produced_quantity: string;
                                            total_part_cost: string;
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
                                                            backgroundColor="#2D3748"
                                                            borderLeft="1px solid #2D3748"
                                                            borderRight="1px solid #2D3748"
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
                                            </Tr>
                                        );
                                    }
                                )}
                            </Thead>
                            <Tbody {...getTableBodyProps()}>
                                {page.map((row: any,index) => {
                                    prepareRow(row);

                                    return (
                                        <Tr
                                            className="relative  hover:cursor-pointer text-[16px]"
                                            {...row.getRowProps()}
                                          bg={dynamicBg(index)}
                                          _hover={{
                                            bg: "gray.50",
                                            cursor: "pointer",
                                            
                                            transition: "all 0.2s",
                                          }}
                                        >
                                            {row.cells.map((cell: Cell) => {
                                                return (
                                                    <Td fontWeight="500" {...cell.getCellProps()}>
                                                        {cell.column.id !== "createdAt" &&
                                                            cell.column.id !== "updatedAt" &&
                                                            cell.column.id !== "item" &&
                                                            cell.column.id !== "bom" &&
                                                            cell.column.id !== "finished_good" &&
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
                                                        {cell.column.id === "item" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.item.name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "bom" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.bom.bom_name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "finished_good" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.bom.finished_good.item.name}
                                                            </span>
                                                        )}
                                                    </Td>
                                                );
                                            })}
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

export default ScrapTable;
