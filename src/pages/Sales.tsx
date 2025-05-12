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
    const handleDataFromChild = (data) => {
        console.log('data', data)
        setSelectedSale(data);
        seteditsale(true); // receive and set data from child
    };
    const fetchPurchases = async () => {
        try {
            setIsLoading(true);

            if (!token) {
                throw new Error("Authentication token not found");
            }

            let url = "";
            if (role === "admin") {
                url = `${process.env.REACT_APP_BACKEND_URL}sale/getAll?page=${pages}`;
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}sale/getOne?page=${pages}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPurchases(response.data.data);
            console.log(response.data.data);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch purchase data";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = cookies.access_token;

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const userRes = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}auth/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const filteredEmployees = (userRes.data.users || []).filter(
                (user: any) => user.role
            );

            setEmployees(filteredEmployees); // Set the filtered employees
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch employees";
            toast.error(errorMessage);
            //console.log(error);
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchEmployees();
    }, [pages]);

    useEffect(() => {
        if (!purchases.length) {
            setFilteredPurchases([]);
            return;
        }

        const filteredData = purchases.filter((purchase) => {
            const matchesText =
                !filterText ||
                [
                    purchase?.user_id?.[0]?.first_name,
                    purchase?.product_id?.[0]?.name,
                    purchase?.party_id[0]?.full_name,
                ]
                    .filter(Boolean)
                    .some((field) =>
                        field.toLowerCase().includes(filterText.toLowerCase())
                    );

            const matchesDate =
                !filterDate ||
                new Date(purchase?.createdAt).toISOString().split("T")[0] ===
                filterDate;

            const matchesStatus =
                !filterStatus ||
                purchase?.Status?.toLowerCase() === filterStatus.toLowerCase();

            return matchesText && matchesDate && matchesStatus;
        });

        setFilteredPurchases(filteredData);
    }, [filterText, filterDate, filterStatus, purchases]);

    return (
        <>  
            <section className=" pb-8  w-full   relative ">
                <div className="  w-full p-4 ">
                    <h1 className="text-white font-[600] text-3xl mb-8 text-center">Sales</h1>
                    <div className="flex  justify-center">
                        <input type="text" placeholder="Search sale..." className="px-4 py-2 mr-4 w-fit text-sm border-b bg-[#475569] rounded-sm focus:outline-none text-gray-200 placeholder:text-gray-200"
                        />
                        <input type="date" className="styled-date px-4 py-1 rounded-sm bg-[#475569] text-gray-200  " />
                        <select className="px-4 py-1 rounded-sm ml-4 bg-[#475569] text-gray-200 focus:outline-none" >
                            <option value="Filter by sale status "> Filter by sale status </option>z
                            <option value="Pending "> Pending</option>z
                            <option value=" Approval  "> Approval </option>z
                        </select>
                    </div>
                    <div className=" text-white flex justify-center gap-4 mt-6">
                        <button onClick={()=>setShow(!show)} className="px-6 py-2  rounded-md  shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-500\ " >Add New Sale</button>
                        <button onClick={fetchPurchases} className="px-4 py-1 border border-white flex items-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-500"> <MdOutlineRefresh  className="flex" />Refresh</button>
                    </div>
                </div>
                <SalesTable filteredPurchases={filteredPurchases} sendDataToParent={handleDataFromChild} empData={employees} />
            </section>
            <AddNewSale show={show} setShow={setShow} refresh={fetchPurchases} />
            <UpdateSale editshow={editshow} sale={selectedSale} seteditsale={seteditsale} refresh={fetchPurchases} />
            <Pagination page={pages} setPage={setPages} length={purchases.length} />
        </>
    )
}

export default Sales