// @ts-nocheck

import { useState, useEffect } from "react"
import AssignEmployee from "../Drawers/Sales/AssignEmployee";
import UploadInvoice from "../Drawers/Sales/UploadInvoice";
import ViewPayment from "../Drawers/Sales/ViewPayment";
import ViewDesign from "../Drawers/Sales/ViewDesign";
import ApproveSample from "../Drawers/Sales/ApproveSample";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
const SalesTable = ({ filteredPurchases, sendDataToParent, empData,isLoading }) => {
    const [show, setShow] = useState(false);

    const calculateTotalPrice = (price: number, qty: number, gst: number) => {
        const basePrice = price * qty;
        const gstVal = (basePrice * gst) / 100;
        const totalPrice = basePrice + gstVal;
        return totalPrice;
    };
    console.log(filteredPurchases)
    const [selectedSale, setSelectedSale] = useState([]);
    const [showinvoice, setShowInvoice] = useState(false)
    const [paymentshow, setPaymentshow] = useState(false)
    const [isOpen, setViewDesign] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    
  if (isLoading) {
    return <Loading />;
  }

  if (!filteredPurchases || filteredPurchases.length === 0) {
    return <EmptyData />;
  }

    return (
        <>
            {filteredPurchases?.map((purchase: any) => (
                <section className="relative" key={purchase?._id} >

                    <div className="rounded-xl shadow-lg text-white p-6 bg-[#1e1e2f4f] mb-4">
                        <div className="flex justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="font-semibold text-lg text-white">Created By: <span className="text-blue-400">{purchase?.user_id[0]?.first_name || "N/A"}</span></h2>
                                <p className="text-sm text-gray-300 ">
                                    <span className="font-semibold">Date:</span> {new Date(purchase?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm bg-gradient-to-r to-green-600 from-green-700 px-4 py-1.5 shadow-md rounded-md">SALE APPROVE : <span className="text-sm uppercase"> {purchase.Status} </span></p>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-600" />

                        <div className="space-y-2 text-sm text-gray-200">
                            <p className="text-gray-300"><span className="font-semibold text-white">Party:</span>  {purchase?.party_id?.[0]?.full_name || "N/A"}</p>
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

                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <button className="px-4 py-2 border border-gray-500 rounded-md text-sm hover:bg-gray-700" onClick={() => sendDataToParent(purchase)}>Edit</button>

                            {/* {purchase?.token_ss &&
                                purchase?.boms[0]?.production_processes?.every(
                                    (processGroup) =>
                                        processGroup?.processes?.every(
                                            (process) => process?.done === true
                                        )
                                ) ? ( */}

                            { purchase?.boms[0]?.production_processes?.every(
                                    (processGroup) =>
                                        processGroup?.processes?.every(
                                            (process) => process?.done === true
                                        )
                                ) ? (
                                <button className="px-4 py-2 border border-green-500 text-green-400 rounded-md text-sm hover:bg-green-600 hover:text-white" onClick={()=>setIsChecked(!isChecked)}>Approve Sample</button>
                            ) : null}

                            {/* <button className="px-4 py-2 border border-orange-500 text-orange-400 rounded-md text-sm hover:bg-orange-600 hover:text-white" onClick={()=>setViewDesign(!isOpen)}>View Design</button> */}
                            {/* <button className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-md text-sm hover:bg-yellow-600 hover:text-white"><a href="https://images.unsplash.com/photo-1746483966639-b8dafcd05f5b?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" target="_blank" >View Delivery Proof</a></button> */}

                            {/* {purchase?.isTokenVerify && ( */}

                            <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black" onClick={() => setShowInvoice(!showinvoice)}>Upload Invoice</button>

                            {/* )} */}

                            {/* <button className="px-4 py-2 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black" onClick={() => setPaymentshow(!paymentshow)}>View Payment</button> */}

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" onClick={() => {
                                setShow(!show);
                                setSelectedSale(purchase);
                            }}>Assign</button>

                        </div>
                    </div>
                </section>
            ))}
            <AssignEmployee show={show} setShow={setShow} employeeData={empData}
                saleData={selectedSale} />
            {/* <ViewPayment paymentshow={paymentshow} setPaymentshow={setPaymentshow} /> */}
            <UploadInvoice showinvoice={showinvoice} setShowInvoice={setShowInvoice} />
            {/* <ViewDesign isOpen={isOpen}  setViewDesign={setViewDesign}/> */}
            <ApproveSample  isChecked={isChecked} setIsChecked={setIsChecked}/>
        </>

    )
}

export default SalesTable