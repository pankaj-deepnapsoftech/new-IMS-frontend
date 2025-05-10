//@ts-check  



const Task = () => {
  return (
   <section>
   <div className="min-h-screen p-6 text-gray-100">
  <h1 className="text-3xl font-bold mb-6">Tasks</h1>

  {/* Filter Bar */}
  <div className="flex flex-wrap items-center gap-4 mb-8">
    <select className=" rounded px-4 py-2 bg-gray-600 text-gray-100">
      <option>Select Status</option>
      <option>Under Processing</option>
      <option>Completed</option>
    </select>
    <input type="date" className=" styled-date rounded px-4 py-2 bg-gray-600 text-gray-100" />
    <input
      type="text"
      placeholder="Search by Product or Manager"
      className=" rounded px-4 py-2 flex-grow bg-gray-600 text-gray-100"
    />
    <button className="border border-blue-400 text-blue-400 px-4 py-2 rounded hover:bg-gray-700">
      ⟳ Refresh
    </button>
  </div>

  {/* Task Card */}
  <div className=" rounded shadow p-6 bg-gray-600">
    <div className="flex justify-between items-start">
      <h2 className="text-xl font-semibold">tag</h2>
      <div className="flex flex-col gap-2 text-sm text-right">
        <span className="bg-green-300 text-green-900 px-2 py-1 rounded font-medium">
          TASK: UNDERPROCESSINGD
        </span>
        <span className="bg-yellow-300 text-yellow-900 px-2 py-1 rounded font-medium">
          TOKEN AMOUNT : PENDING
        </span>
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
      <button className="border border-purple-400 text-purple-400 px-4 py-2 rounded hover:bg-purple-400 hover:text-white transition-all  duration-300">
        Add Token Amount
      </button>
      <span className="text-sm text-gray-400">Date: 5/8/2025</span>
    </div>
  </div>
</div>

   </section>
  )
}

export default Task