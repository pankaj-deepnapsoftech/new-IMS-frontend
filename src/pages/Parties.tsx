// @ts-nocheck

import { MdOutlineRefresh } from "react-icons/md";
import AddParties from "../components/Drawers/Parties/AddParties";
import PartiesTable from "../components/Table/PartiesTable";
import { useState } from "react";

const Parties = () => {
    const [showData, setshowData] = useState(false)
    return (
        <section>
            <div className="  w-full p-4 ">
                <h1 className="text-white font-[600] text-3xl mb-4 text-center">Parties</h1>
                <div className="flex  justify-center">
                    <input type="text" placeholder="Search sale..." className="px-4 py-2 mr-4 w-fit text-sm border-b bg-[#475569] rounded-sm focus:outline-none text-gray-200 placeholder:text-gray-200"
                    />
                    <input type="date" className="styled-date px-4 py-1 rounded-sm bg-[#475569] text-gray-200  " />
                    <select className="px-6 pl-4 py-1 rounded-sm ml-4 bg-[#475569] text-gray-200 focus:outline-none" >
                        <option value="Filter by sale status "> Select  </option>z
                        <option value="Pending "> Individual</option>z
                        <option value=" Approval  "> Company </option>
                    </select>
                </div>
                <div className=" text-white flex justify-center gap-4 mt-6">
                    <button onClick={()=> setshowData(!showData)} className="px-6 py-2  rounded-md  shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-500 " >Add New Parties</button>
                    <button className="px-4 py-1 border border-white flex items-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-500"> <MdOutlineRefresh className="flex" />Refresh</button>
                </div>
            </div>

            <PartiesTable />
            <AddParties showData={showData} setshowData={setshowData} />
        </section>
    );
};

export default Parties;
