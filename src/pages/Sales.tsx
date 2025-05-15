// @ts-nocheck
import { MdOutlineRefresh } from "react-icons/md";
import AddNewSale from "../components/Drawers/Sales/AddNewSale";
import UpdateSale from "../components/Drawers/Sales/UpdateSale";
import { useState, useEffect } from "react";
import SalesTable from "../components/Table/SalesTable";
import AssignEmployee from "../components/Drawers/Sales/AssignEmployee";
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios from "axios";

const Sales = () => {
    const [pages, setPages] = useState(1);
    const [show, setShow] = useState(false);
    const [editshow, seteditsale] = useState(false);
    const [cookies] = useCookies(["access_token", "role"]);
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const role = cookies?.role;
    const token = cookies.access_token;
    const [filterText, setFilterText] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [selectedSale, setSelectedSale] = useState([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    const handleDataFromChild = (data) => {
        setSelectedSale(data);
        seteditsale(true);
    };

    const fetchPurchases = async () => {
        try {
            setIsLoading(true);
            if (!token) throw new Error("Authentication token not found");

            const url = role === "admin"
                ? `${process.env.REACT_APP_BACKEND_URL}sale/getAll?page=${pages}`
                : `${process.env.REACT_APP_BACKEND_URL}sale/getOne?page=${pages}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPurchases(response.data.data);
               
            const totalItems = response.data.totalData || 0;
            const itemsPerPage = 10;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch sale data";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    

    const fetchEmployees = async () => {
        try {
            if (!token) throw new Error("Authentication token not found");

            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}auth/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const filteredEmployees = (response.data.users || []).filter(user => user.role);
            setEmployees(filteredEmployees);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to fetch employees");
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchEmployees();
    }, [pages]);

    useEffect(() => {
        const filtered = purchases.filter((purchase) => {
            const matchesText = !filterText || [
                purchase?.user_id?.[0]?.first_name,
                purchase?.product_id?.[0]?.name,
                purchase?.party_id?.[0]?.full_name,
            ]
                .filter(Boolean)
                .some(field =>
                    field.toLowerCase().includes(filterText.toLowerCase())
                );

            const matchesDate = !filterDate ||
                new Date(purchase?.createdAt).toISOString().split("T")[0] === filterDate;

            const matchesStatus = !filterStatus ||
                purchase?.Status?.toLowerCase() === filterStatus.toLowerCase();

            return matchesText && matchesDate && matchesStatus;
        });

        setFilteredPurchases(filtered);
    }, [filterText, filterDate, filterStatus, purchases]);

    return (
        <>
            <section className="w-full pb-8 relative px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-white font-semibold text-3xl text-center mb-8">
                        Sales
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search sale..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full md:w-60 px-4 py-2 text-sm border-b bg-[#475569] rounded-sm focus:outline-none text-gray-200 placeholder:text-gray-200"
                        />

                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full md:w-52 styled-date px-4 py-2 bg-[#475569] text-gray-200 rounded-sm focus:outline-none"
                        />

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full md:w-52 px-4 py-2 bg-[#475569] text-gray-200 rounded-sm focus:outline-none"
                        >
                            <option value="">Filter by sale status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approval">Approval</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                        <button
                            onClick={() => setShow(!show)}
                            className="w-full md:w-auto px-6 text-white py-2 rounded-md shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-300"
                        >
                            Add New Sale
                        </button>
                        <button
                            onClick={fetchPurchases}
                            className="w-full md:w-auto px-4 py-2 text-white border border-white flex items-center justify-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-300"
                        >
                            <MdOutlineRefresh />
                            Refresh
                        </button>
                    </div>

       
                    <div className="overflow-x-auto">
                        <SalesTable
                            filteredPurchases={filteredPurchases}
                            sendDataToParent={handleDataFromChild}
                            empData={employees}
                            isLoading={isLoading} 
                        />
                    </div>
                </div>
            </section>


            <AddNewSale show={show} setShow={setShow} refresh={fetchPurchases} />
            <UpdateSale editshow={editshow} sale={selectedSale} seteditsale={seteditsale} refresh={fetchPurchases} />
            <Pagination page={pages} setPage={setPages} TotalPage={totalPages} />

        </>
    );
};

export default Sales;
