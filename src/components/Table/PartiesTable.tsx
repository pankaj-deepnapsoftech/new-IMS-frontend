// @ts-nocheck
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BiSolidTrash, BiX } from "react-icons/bi";
import { toast } from "react-toastify";

import { useCookies } from "react-cookie";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import Parties from "../../pages/Parties";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useTable } from "react-table";
import axios from "axios";


const PartiesTable = ({ fetchPartiesData, searchTerm, selectedType, partiesData, setPartiesData, isLoading, setLimit, selectedRole, setEditTable, setshowData }) => {

    // const [deleteId, setdeleteId] = useState('')
    const [deleteId, setDeleteId] = useState('')
    const [cookies] = useCookies()
    const [showDeletePage, setshowDeletePage] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const columns = useMemo(() => [
    //     { Header: "Full name", accessor: "full_name" },
    //     { Header: "Email", accessor: "email" },
    //     { Header: "Phone No.", accessor: "phone" },
    //     { Header: "Type", accessor: "type" },
    //     { Header: "Company Name", accessor: "company_name" },
    //     { Header: "Parties Type", accessor: "parties_type" },
    //     { Header: "", accessor: "type" },
    //   ], []);

    // const {
    //   getTableProps,
    //   getTableBodyProps,
    //   headerGroups,
    //   rows,
    //   prepareRow,
    //   page, // instead of rows, use page for pagination
    //   setPageSize, // <-- this is what you need
    //   state: { pageSize },
    // } = useTable(
    //   {
    //     columns,
    //     data,
    //     initialState: { pageSize: 10 }, // optional default
    //   },
    //   usePagination
    // );






    const filteredParties = partiesData.filter((party) => {
        const matchSearch =
            party?.consignee_name?.[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            party?.email_id?.[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            party?.contact_number?.[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            party?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchType = selectedType ? party?.type === selectedType : true;
        const matchRole = selectedRole ? party?.parties_type === selectedRole : true

        return matchSearch && matchType && matchRole;
    });




    const handleDelete = async (partyId) => {

        if (isSubmitting) return;
        setIsSubmitting(true)

        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}parties/delete/${partyId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                }
            );

            if (res?.ok) {
                setPartiesData((prev) =>
                    prev.filter((party) => party._id !== partyId)
                );
            } else {
                console.error(error?.message);
            }
            setshowDeletePage(false)
            setIsConfirmed(false)
        } catch (error) {
            console.error("Error deleting party:", error);
        } finally {
            setIsSubmitting(false)
        }
    };





    if (isLoading) {
        return <Loading />
    }
    if (!filteredParties || filteredParties.length === 0) {
        return <EmptyData />
    }



    return (
        <section className="h-full w-full text-white ">
                <div className="flex justify-end mb-2 mt-2 bg-transparent">
                    <select
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="border bg-transparent px-3 rounded-md py-1 focus:outline-none"
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option className="text-white bg-[#444e5b]" key={size} value={size}>
                                {size === 100 ? "All" : size}
                            </option>
                        ))}
                    </select>
                </div>
            <div className="overflow-x-auto w-full">

                <table className="w-full text-sm rounded-lg whitespace-nowrap overflow-hidden">
                    <thead className="bg-[#14243452] text-white border-b">
                        <tr>
                            <th className="px-2 py-3"> Cust Id</th>
                            <th className="px-2 py-3"> Date Added</th>
                            <th className="px-2 py-3">Consignee Name</th>
                            <th className="px-2 py-3"> Company Name</th>
                            <th className="px-2 py-3">Email</th>
                            <th className="px-2 py-3">Phone No.</th>
                            <th className="px-2 py-3">Type</th>
                            <th className="px-2 py-3">Parties Type</th>
                            <th className="px-2 py-3">GST No.</th>
                            <th className="px-2 py-3">GST Address</th>
                            <th className="px-2 py-3">Delivery Address</th>
                            <th className="px-2 py-3">Shipped To</th>
                            <th className="px-2 py-3">Bill To</th>
                            <th className="px-2 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParties.map((party, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-[#ffffff40]" : "bg-[#ffffff1f]"
                                    } hover:bg-[#ffffff78] transition-colors`}
                            >
                                <td className="py-4 pl-3 text-center text-gray-200">{party.cust_id || "__"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{new Date(party.createdAt).toLocaleDateString() || "__"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.consignee_name || "__"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.company_name || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.email_id || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.contact_number || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.type || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.parties_type || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.gst_in || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.gst_add || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.delivery_address || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.shipped_to || "N/A"}</td>
                                <td className="py-4 pl-3 text-center text-gray-200">{party.bill_to || "N/A"}</td>
                                <td className="py-4 text-center flex items-center gap-3 justify-center text-gray-200">
                                    <button
                                        onClick={() => {
                                            setEditTable(party)
                                            setshowData(true)
                                        }}
                                    >
                                        <MdEdit size={18} className="cursor-pointer text-gray-300 hover:text-red-500 transition-transform hover:scale-110" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setshowDeletePage(true);
                                            setDeleteId(party._id);
                                        }}
                                    >
                                        <MdDeleteOutline size={18} className="cursor-pointer text-gray-300 hover:text-red-600 transition-transform hover:scale-110" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            {showDeletePage && (
                <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-[#1C3644] rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h2>
                        <p className="text-sm text-white mb-6">Are you sure you want to delete this item ?</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setshowDeletePage(!showDeletePage)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={isSubmitting}
                                className={` ${isSubmitting ? "cursor-not-allowed" : " "} px-4 py-2 text-sm font-medium text-white rounded transition  bg-red-600 hover:bg-red-700 `}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>


            )}

        </section>
    );
};

export default PartiesTable;
