//@ts-check  

import axios from "axios"
import { useEffect } from "react"
import { useCookies } from "react-cookie"



const Task = () => {
  const [cookies] = useCookies()
  const FetchAssineData = async () => {
    try {
      const res = await axios.get(` ${process.env.REACT_APP_BACKEND_URL}assined/get-assined`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      )
      console.log(res)
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    FetchAssineData()
  })
  return (
    <section>
      <div className="min-h-screen p-6 text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>


        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select className=" rounded px-4 py-2 bg-[#ffffff2a] text-gray-100">
            <option className="text-black">Select Status</option>
            <option className="text-black">Under Processing</option>
            <option className="text-black">Completed</option>
          </select>
          <input type="date" className=" styled-date rounded px-4 py-2 bg-[#ffffff2a] text-gray-100 placeholder:text-gray-100" />
          <input
            type="text"
            placeholder="Search by Product or Manager"
            className=" rounded px-4 py-2 flex-grow bg-[#ffffff2a] text-gray-100"
          />
          <button className="border border-blue-400 text-blue-400 px-4 py-1.5 rounded hover:bg-blue-400 hover:text-white transition-all duration-300">
            ⟳ Refresh
          </button>
        </div>


        <div className=" rounded-md shadow-md p-6 bg-[#ffffff2a]">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">Tag</h2>
            <div className="flex flex-col gap-2 text-sm text-right">
              <button className="bg-blue-400  text-white shadow-md px-2 py-2 rounded-md font-medium">
                TASK: UNDERPROCESSINGD
              </button>
              <button className="bg-blue-400  text-white shadow-md px-2 py-2 rounded-md font-medium">
                TOKEN AMOUNT : PENDING
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm space-y-1">
            <p><strong>Product Price:</strong> 4.5 /-</p>
            <p><strong>Quantity:</strong> 100</p>
            <p><strong>Customer:</strong> Sonali</p>
            <p><strong>Sale By:</strong> RUCHI</p>
            <p><strong>Assigned By:</strong> RUCHI</p>
            <p><strong>Assigned Process:</strong> Please take 500 rs</p>
            <p><strong>Remarks:</strong> No comment</p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button className=" text-white bg-blue-400 px-3 py-1.5 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition-all  duration-300">
              Add Token Amount
            </button>
            <span className="text-sm text-gray-200">Date: 5/8/2025</span>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Task