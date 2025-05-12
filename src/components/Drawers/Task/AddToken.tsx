// @ts-nocheck

import { X } from "lucide-react"



const AddToken = ({ showToken, setShowToken }) => {
    return (
        <section className={`fixed ${showToken ? "flex" : "hidden"} inset-0 z-50 h-screen items-center justify-center bg-black bg-opacity-60`}>
        <div className="bg-[#1C3644] text-white w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-6 relative">

          <button
            onClick={() => setShowToken(false)}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center">Add Amount </h2>

          <div>
            <label htmlFor="amount" className="block mb-2 font-medium">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              placeholder="Enter your amount..."
              className="w-full bg-[#5f5f5f88] text-white placeholder-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition"
            >
              Submit
            </button>
           
          </div>
        </div>
      </section>
      
    )
}

export default AddToken