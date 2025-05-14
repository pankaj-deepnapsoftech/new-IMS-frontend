// @ts-nocheck
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BiSolidTrash, BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { Console } from "console";
import { useCookies } from "react-cookie";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import Parties from "../../pages/Parties";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useTable } from "react-table";


const PartiesTable = ({ fetchPartiesData, searchTerm, selectedType, partiesData, setPartiesData, isLoading }) => {
    const [editId, setEditId] = useState("");
    const [deleteId, setdeleteId] = useState('')
    const [cookies] = useCookies()
    const [showData, setShowData] = useState(false);
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




    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        type: "",
        company_name: "",
        GST_NO: "",
    });


    const filteredParties = partiesData.filter((party) => {
        const matchSearch =
            party.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            party.GST_NO?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchType = selectedType ? party.company_name === selectedType : true;

        return matchSearch && matchType;
    });

    const handleDelete = async (partyId) => {
        // console.log(partyId);

        if(isSubmitting) return ;
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

            if (res.ok) {
                setPartiesData((prev) =>
                    prev.filter((party) => party._id !== partyId)
                );
            } else {
                console.error("Failed to delete:", await res.text());
            }
            setshowDeletePage(false)
            setIsConfirmed(false)
        } catch (error) {
            console.error("Error deleting party:", error);
        }finally{
            setIsSubmitting(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSubmitting) return;
            setIsSubmitting(true)
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}parties/put/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowData(false);
                fetchPartiesData();
                toast.success("Parties Data Updated")
            } else {
                console.error("Failed to update party");
            }
        } catch (error) {
            console.error("Error updating party:", error);
        } finally {
            setIsSubmitting(false);
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
            <div className="overflow-x-auto w-full">

                <div className="flex justify-end mb-2 mt-2 bg-transparent">
                    <select
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className=" border bg-transparent px-3 rounded-md py-1 focus:outline-none"
                    >
                        {[10, 20, 50, 100, 100000].map((size) => (
                            <option className="text-white bg-[#444e5b]" key={size} value={size} >
                                {size === 100000 ? "All" : size}
                            </option>
                        ))}
                    </select>
                </div>
                <table className="w-full text-sm rounded-lg overflow-hidden">
                    <thead className="bg-[#14243452] text-white border-b">
                        <tr>
                            <th className="px-2 py-3">Full Name</th>
                            <th className="px-2 py-3">Email</th>
                            <th className="px-2 py-3">Phone No.</th>
                            <th className="px-2 py-3">Type</th>
                            <th className="px-2 py-3">Company Name</th>
                            <th className="px-1 py-3">Parties Type</th>
                            <th className="px-2 py-3">GST No.</th>
                            <th className="px-2 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParties.map((party, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-[#ffffff40]" : "bg-[#ffffff1f]"} hover:bg-[#ffffff78] transition-colors`}
                            >
                                <td className=" py-4 relative pl-3 text-center  text-gray-200">{party.full_name || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.email || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.phone || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.type || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.company_name || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.parties_type || " __ "}</td>
                                <td className=" py-4 relative pl-3 text-center text-gray-200">{party.GST_NO || " __ "}</td>
                                <td className=" py-4 relative  text-center flex items-center gap-3 text-gray-200">
                                    <button
                                        onClick={() => {

                                            setFormData(party);
                                            setEditId(party._id);
                                            setShowData(true);
                                        }}
                                    >
                                        <MdEdit size={18} className="cursor-pointer text-gray-300 hover:text-red-500 transition-transform hover:scale-110" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setshowDeletePage(true);
                                            setEditId(party._id);
                                        }}
                                    >
                                        <MdDeleteOutline size={18} className="cursor-pointer text-gray-300 hover:text-red-600 transition-transform hover:scale-110"
                                        />
                                    </button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
            {showData && (
                <div className="flex flex-col absolute top-0 right-0 bg-[#57657f] w-[35vw] h-full shadow-lg z-50">
                    <div className="px-4 flex gap-x-2 items-center font-bold text-[22px] text-white py-3">
                        <BiX onClick={() => setShowData(!showData)} size="30px" />
                    </div>
                    <div className="text-xl mt-8 text-center font-semibold m-auto py-3 px-2 w-[400px] bg-[#ffffff4f] rounded-md text-white mb-6">
                        <h1>Updated Parties</h1>
                    </div>

                    <form
                        className="flex-1 overflow-y-auto p-6 space-y-5"
                        onSubmit={handleSubmit}
                    >
                        {/* Full Name (disabled if company_name is filled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                disabled={!!formData.company_name}
                                className={`w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${formData.company_name ? "cursor-not-allowed opacity-60" : ""
                                    }`}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Company Name (disabled if full_name is filled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Company Type
                            </label>
                            <select
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                disabled={!!formData.full_name}
                                className={`w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none ${formData.full_name ? "cursor-not-allowed opacity-60" : ""
                                    }`}
                            >
                                <option value="Individual" className="text-black">Individual</option>
                                <option value="Company" className="text-black">Company</option>
                            </select>
                        </div>

                        {/* GST No (disabled if full_name is filled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                GST No
                            </label>
                            <input
                                type="text"
                                name="GST_NO"
                                value={formData.GST_NO}
                                onChange={handleChange}
                                placeholder="Enter GST number"
                                disabled={!!formData.full_name}
                                className={`w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none ${formData.full_name ? "cursor-not-allowed opacity-60" : ""
                                    }`}
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-transparent border border-gray-100 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Buyer" className="text-black">Buyer</option>
                                <option value="Seller" className="text-black">Seller</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 rounded text-white transition-all duration-300 ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#ffffff41] hover:bg-[#ffffff6b]"
                                }`}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

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
                                onClick={() => handleDelete(editId)}
                                disabled={isSubmitting}
                                className={` ${ isSubmitting ? "cursor-not-allowed" : " "} px-4 py-2 text-sm font-medium text-white rounded transition  bg-red-600 hover:bg-red-700 `}
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
