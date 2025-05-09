// @ts-nocheck

import { useState } from "react"
import AssignEmployee from "../Drawers/Sales/AssignEmployee"
import UploadInvoice from "../Drawers/Sales/UploadInvoice"



const SalesTable = () => {
    const [show, setShow] = useState(false)
    const [showinvoice, setShowInvoice] = useState(false)

    return (
        <section className="relative " >
            <AssignEmployee show={show} setShow={setShow} />
            <UploadInvoice showinvoice={showinvoice} setShowInvoice={setShowInvoice} />
            <div className="rounded-xl shadow-lg text-white p-6 bg-[#0000004f] mb-4">
                <div className="flex justify-between flex-wrap gap-4 w-full">
                    <div >
                        <h2 className="font-semibold text-lg text-white">Created By: <span className="text-blue-400">RUCHI</span></h2>

                    </div>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Date:</span> 5/7/2025
                    </p>
                </div>

                <hr className="my-6 border-gray-600" />
                <div className="flex justify-between">
                    <div className="space-y-2 text-sm text-gray-200">
                        <p className="text-gray-300"><span className="font-semibold text-white">Customer:</span> Neeraj</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Product Name:</span> tag</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Product Price:</span> ₹100</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Quantity:</span> 1000</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Price:</span> ₹100000</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">GST:</span> 0%</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Total Price:</span> ₹100000.00</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Delivery Status:</span> Yes</p>
                        <p className="text-blue-400 underline cursor-pointer">Uploaded Design File</p>
                        <p className="text-blue-400 underline cursor-pointer">View Token Proof</p>
                    </div>
                    <div className="text-right space-y-1 text-sm font-medium">
                        {[
                            "SALE APPROVAL",
                            "DESIGN APPROVAL",
                            "HALF PAYMENT",
                            "TOKEN AMOUNT",
                            "SAMPLE STATUS",
                            "PAYMENT",
                            "PRODUCT STATUS"
                        ].map((label, i) => (
                            <p key={i} className="text-green-400">
                                {label}: APPROVED
                            </p>
                        ))}

                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                    <button className="px-4 py-2 border border-gray-500 rounded-md text-sm hover:bg-gray-700">Edit</button>
                    <button className="px-4 py-2 border border-green-500 text-green-400 rounded-md text-sm hover:bg-green-600 hover:text-white">Approve Sample</button>
                    <button className="px-4 py-2 border border-orange-500 text-orange-400 rounded-md text-sm hover:bg-orange-600 hover:text-white">View Design</button>
                    <button className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md text-sm hover:bg-yellow-600 hover:text-white">View Delivery Proof</button>
                    <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black" onClick={() => setShowInvoice(!showinvoice)}>Upload Invoice</button>
                    <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black">View Payment</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" onClick={() => setShow(!show)}>Assign</button>
                </div>
            </div>
            <div className="rounded-xl shadow-lg text-white p-6 bg-[#0000004f]">
                <div className="flex justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="font-semibold text-lg text-white">Created By: <span className="text-blue-400">Deepak</span></h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Date:</span> 5/7/2025
                    </p>
                </div>

                <hr className="my-6 border-gray-600" />
                <div className="flex justify-between">
                    <div className="space-y-2 text-sm text-gray-200">
                        <p><span className="font-semibold text-white">Customer:</span> Manish</p>
                        <p><span className="font-semibold text-white">Product Name:</span> tag</p>
                        <p><span className="font-semibold text-white">Product Price:</span> ₹100</p>
                        <p><span className="font-semibold text-white">Quantity:</span> 1000</p>
                        <p><span className="font-semibold text-white">Price:</span> ₹100000</p>
                        <p><span className="font-semibold text-white">GST:</span> 0%</p>
                        <p><span className="font-semibold text-white">Total Price:</span> ₹100000.00</p>
                        <p><span className="font-semibold text-white">Delivery Status:</span> Yes</p>
                        <p className="text-blue-400 underline cursor-pointer">Uploaded Design File</p>
                        <p className="text-blue-400 underline cursor-pointer">View Token Proof</p>
                    </div>
                    <div className="text-right space-y-1 text-sm font-medium">
                        {[
                            "SALE APPROVAL",
                            "DESIGN APPROVAL",
                            "HALF PAYMENT",
                            "TOKEN AMOUNT",
                            "SAMPLE STATUS",
                            "PAYMENT",
                            "PRODUCT STATUS"
                        ].map((label, i) => (
                            <p key={i} className="text-green-400">
                                {label}: APPROVED
                            </p>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                    <button className="px-4 py-2 border border-gray-500 rounded-md text-sm hover:bg-gray-700">Edit</button>
                    <button className="px-4 py-2 border border-green-500 text-green-400 rounded-md text-sm hover:bg-green-600 hover:text-white">Approve Sample</button>
                    <button className="px-4 py-2 border border-orange-500 text-orange-400 rounded-md text-sm hover:bg-orange-600 hover:text-white">View Design</button>
                    <button className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md text-sm hover:bg-yellow-600 hover:text-white">View Delivery Proof</button>
                    <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black" onClick={() => setShowInvoice(!showinvoice)}>Upload Invoice</button>
                    <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black">View Payment</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" onClick={() => setShow(!show)}>Assign</button>
                </div>
            </div>
        </section>

    )
}

export default SalesTable