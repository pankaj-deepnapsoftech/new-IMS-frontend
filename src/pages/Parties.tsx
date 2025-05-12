// @ts-nocheck
import { MdOutlineRefresh } from "react-icons/md";
import AddParties from "../components/Drawers/Parties/AddParties";
import PartiesTable from "../components/Table/PartiesTable";
import { useState } from "react";

const Parties = () => {
    const [showData, setshowData] = useState(false);
    const [counter, setCounter] = useState(0);
    const [trigger, settrigger] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const allparties = () => {
        settrigger(prev => !prev);
        setCounter(prev => prev + 1);
    };

    return (
        <section className="w-full px-4 py-6">
            <h1 className="text-white font-semibold text-2xl md:text-3xl text-center mb-6">
                Parties
            </h1>

            {/* Filter Inputs */}
            <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search party..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-60 px-4 py-2 text-sm border-b bg-[#475569] rounded-sm focus:outline-none text-gray-200 placeholder:text-gray-200"
                />

                <select
                    className="w-full md:w-52 px-4 py-2 bg-[#475569] text-gray-200 rounded-sm focus:outline-none"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                </select>

                <select
                    className="w-full md:w-52 px-4 py-2 bg-[#475569] text-gray-200 rounded-sm focus:outline-none"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Select Role</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <button
                    onClick={() => setshowData(!showData)}
                    className="w-full md:w-auto px-6 py-2  text-white rounded-md shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-300"
                >
                    Add New Parties
                </button>
                <button
                    onClick={allparties}
                    className="w-full md:w-auto px-4 py-2 text-white border border-white flex items-center justify-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-300"
                >
                    <MdOutlineRefresh />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <PartiesTable
                counter={counter}
                trigger={trigger}
                searchTerm={searchTerm}
                selectedType={selectedType}
                selectedRole={selectedRole}
            />

            {/* Drawer */}
            <AddParties showData={showData} setshowData={setshowData} setCounter={setCounter} />
        </section>
    );
};

export default Parties;
