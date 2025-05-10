// @ts-nocheck
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BiSolidTrash, BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const PartiesTable = ({ counter, trigger, searchTerm, selectedType }) => {
    const [editId, setEditId] = useState(null);
    const [partiesData, setPartiesData] = useState([]);
    const [cookies] = useCookies();
    const [showData, setShowData] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        type: "",
        company_name: "",
        GST_NO: "",
    });



    const fetchPartiesData = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}parties/get`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                }
            );
            const data = await res.json();
            setPartiesData(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPartiesData();

    }, [counter, trigger]);


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
        } catch (error) {
            console.error("Error deleting party:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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
        }
    };

    return (
        <section className="h-full w-full text-white ">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm rounded-lg overflow-hidden">
                    <thead className="bg-[#14243452] text-white">
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
                                <td className="px-4 py-4 relative pl-6 text-center  text-gray-200">{party.full_name || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.email || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.phone || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.type || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.company_name || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.parties_type || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center text-gray-200">{party.GST_NO || " __ "}</td>
                                <td className="px-4 py-4 relative pl-6 text-center flex items-center gap-3 text-gray-200">
                                    <button onClick={() => {
                                        setFormData(party);
                                        setEditId(party._id);
                                        setShowData(true);
                                    }}>
                                        <FiEdit className="text-blue-400 hover:text-blue-600 cursor-pointer" />
                                    </button>

                                    <button onClick={() => handleDelete(party._id)}>
                                        <BiSolidTrash className="text-[#ee5555] hover:text-red-800 cursor-pointer" />
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
                        <h1>Updated Data</h1>
                    </div>


                    <form
                        className="flex-1 overflow-y-auto p-6 space-y-5"
                        onSubmit={handleSubmit}
                    >

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
                                className="w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>


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

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Company Type
                            </label>
                            <select
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none"
                            >
                                <option value="Individual" className="text-black">Individual</option>
                                <option value="Company" className="text-black">Company</option>
                            </select>
                        </div>


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
                                className="w-full bg-transparent border border-gray-100 rounded px-3 py-2 text-white focus:outline-none"
                            />
                        </div>
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

                        <button
                            type="submit"
                            className="w-full bg-[#ffffff41] hover:bg-[#ffffff6b] text-white font-medium py-2 rounded transition-all duration-300"
                        >
                            Update data
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
};

export default PartiesTable;
