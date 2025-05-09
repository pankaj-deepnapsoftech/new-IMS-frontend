
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

    const allparties = () => {
        settrigger(prev => !prev); 
        setCounter(prev => prev + 1);
    };

    return (
        <section>
            <div className="w-full p-4">
                <h1 className="text-white font-[600] text-3xl mb-4 text-center">Parties</h1>
                <div className="flex justify-center">
                    <input
                        type="text"
                        placeholder="Search party..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 mr-4 w-fit text-sm border-b bg-[#475569] rounded-sm focus:outline-none text-gray-200 placeholder:text-gray-200"
                    />
                    <select
                        className="px-6 pl-4 py-1 rounded-sm ml-4 bg-[#475569] text-gray-200 focus:outline-none"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                    </select>
                </div>
                <div className="text-white flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setshowData(!showData)}
                        className="px-6 py-2 rounded-md shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-500"
                    >
                        Add New Parties
                    </button>
                    <button
                        onClick={allparties}
                        className="px-4 py-1 border border-white flex items-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-500"
                    >
                        <MdOutlineRefresh className="flex" />
                        Refresh
                    </button>
                </div>
            </div>

            <PartiesTable
                counter={counter}
                trigger={trigger}
                searchTerm={searchTerm}
                selectedType={selectedType}
            />

            <AddParties showData={showData} setshowData={setshowData} setCounter={setCounter} />
        </section>
    );
};

export default Parties;
