// @ts-nocheck

import { useState, useEffect } from "react"
import AssignEmployee from "../Drawers/Sales/AssignEmployee";
const SalesTable = ({ filteredPurchases, sendDataToParent, empData }) => {
    const [show, setShow] = useState(false);
    
    const calculateTotalPrice = (price: number, qty: number, gst: number) => {
        const basePrice = price * qty;
        const gstVal = (basePrice * gst) / 100;
        const totalPrice = basePrice + gstVal;
        return totalPrice;
    };

    const [selectedSale, setSelectedSale] = useState([]);


    return (
        <>
            {filteredPurchases?.map((purchase: any) => (
                <section className="relative" key={purchase?._id} >
                    <div className="rounded-xl shadow-lg text-white p-6 bg-[#1e1e2f4f] mb-4">
                        <div className="flex justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="font-semibold text-lg text-white">Created By: <span className="text-blue-400">{purchase?.user_id[0]?.first_name || "N/A"}</span></h2>
                                <p className="text-sm text-gray-300">
                                            <span className="font-semibold">Date:</span> {new Date(purchase?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right space-y-1 text-sm font-medium">
                                {/* {[
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
                                ))} */}
                            </div>
                        </div>

                        <hr className="my-6 border-gray-600" />

                        <div className="space-y-2 text-sm text-gray-200">
                            <p className="text-gray-300"><span className="font-semibold text-white">Customer:</span> {purchase?.party_id[0]?.full_name || "N/A"}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Product Name:</span> {purchase?.product_id[0]?.name || "N/A"}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Product Price:</span> {purchase?.price || "N/A"}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Quantity:</span> {purchase?.product_qty}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Price:</span> {purchase?.price * purchase?.product_qty}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">GST:</span> {purchase?.GST}%</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Total Price: </span> {calculateTotalPrice(
                                purchase?.price,
                                purchase?.product_qty,
                                purchase?.GST
                            ).toFixed(2)}</p>
                            {/* <p className="text-gray-300"><span className="font-semibold text-white">Delivery Status:</span> Yes</p>
                            <p className="text-blue-400 underline cursor-pointer">Uploaded Design File</p>
                            <p className="text-blue-400 underline cursor-pointer">View Token Proof</p> */}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <button className="px-4 py-2 border border-gray-500 rounded-md text-sm hover:bg-gray-700" onClick={() => sendDataToParent(purchase)}>Edit</button>
                            <button className="px-4 py-2 border border-green-500 text-green-400 rounded-md text-sm hover:bg-green-600 hover:text-white">Approve Sample</button>
                            <button className="px-4 py-2 border border-orange-500 text-orange-400 rounded-md text-sm hover:bg-orange-600 hover:text-white">View Design</button>
                            <button className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md text-sm hover:bg-yellow-600 hover:text-white">View Delivery Proof</button>
                            <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black">Upload Invoice</button>
                            <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black">View Payment</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" onClick={()=> {
                                setShow(!show);
                                setSelectedSale(purchase);
                            }}>Assign</button>
                        </div>
                    </div>
                </section>
            ))}
            <AssignEmployee show={show} setShow={setShow} employeeData={empData}
                saleData={selectedSale} />
        </>

    )
}

export default SalesTable