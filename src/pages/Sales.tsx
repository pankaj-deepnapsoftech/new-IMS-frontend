// @ts-nocheck
import { MdOutlineRefresh } from "react-icons/md";
import AddNewSale from "../components/Drawers/Sales/AddNewSale";
import { useState } from "react";


const Sales = () => {

    const [show,setShow] = useState(false)
    return (
        <>  
            <section className="h-screen  w-full  relative ">
                <div className=" h-full w-full p-4 ">
                    <h1 className="text-white font-[600] text-2xl mb-8 text-center">Sales</h1>
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
                        <button onClick={()=>setShow(!show)} className="px-4 py-1  rounded-md  shadow-md bg-[#4b87a0d9] hover:bg-[#4b86a083] transition-all duration-500\ " >Add New Sale</button>
                        <button className="px-4 py-1 border border-white flex items-center rounded-md gap-2 hover:bg-white hover:text-black transition-all duration-500"> <MdOutlineRefresh className="flex" />Refresh</button>
                    </div>
                </div>
            <AddNewSale show={show} setShow={setShow} />
            </section>

            {/* create modal */}
        </>
    )
}

export default Sales