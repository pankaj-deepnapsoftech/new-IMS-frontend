// @ts-nocheck


const AssignEmployee = ({ show, setShow }) => {
    return (
        <section>
            <div className={` ${show ? "block" : "hidden"} bg-[#0c0c0c79] fixed h-[100%]  inset-0 w-full flex items-center justify-center z-50`}>
                <div className=" text-white bg-[#1c3644] rounded-2xl w-96 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Assign Employee</h2>
                        <button className="text-gray-400 hover:text-white text-xl transition" onClick={() => setShow(!show)}>✕</button>
                    </div>
                    <div className=" overflow-auto h-[100px] mb-4">
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                    </div>
                    <div className="bg-[#ffffff23] shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-teal-400 mb-4">Assign Task</h3>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Select Employee<span className="text-red-500">*</span></label>
                        <select className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600  px-3 py-2 rounded-lg mb-4" required>
                            <option value="" className="text-black bg-[#ffffff23] ">Select an employee</option>
                            <option value="data1" className="text-black bg-[#ffffff23] ">data1</option>
                            <option value="data2" className="text-black bg-[#ffffff23] ">data2</option>
                            {/* Populate dynamically */}
                        </select>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Define Process<span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4" placeholder="Enter process name" required />
                        <label className="block text-sm font-medium mb-1 text-gray-300">Remarks</label>
                        <textarea className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4" placeholder="Enter further details (if any)" />
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition">Assign</button>
                    </div>
                    <button className="mt-4 w-full border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold" onClick={() => setShow(!show)}>Cancel</button>
                </div>
            </div>

        </section>
    )
}

export default AssignEmployee