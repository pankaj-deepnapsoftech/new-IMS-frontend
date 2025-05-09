// @ts-nocheck 

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { PartiesFromValidation } from "../../../Validation/PartiesFromValidation";


const AddParties = ({ showData, setshowData, setCounter }) => {
    const [cookies] = useCookies();

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset } = useFormik({
        initialValues: {
            full_name: '',
            email: '',
            phone: '',
            company_name: '',
            GST_NO: '',
            type: '',
            parties_type: ""
        },
        validationSchema: PartiesFromValidation,
        onSubmit: async(value) => {
            
            try {
                const res = await fetch(process.env.REACT_APP_BACKEND_URL + "parties/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies?.access_token}`,
                    },
                    body: JSON.stringify(value)
                });

                const data = await res.json();

                if (res.ok) {
                    toast.success("Party saved successfully!");
                    setshowData(false);
                    setFormData({
                        full_name: '',
                        email: '',
                        phone: '',
                        company_name: '',
                        GST_NO: '',
                        type: '',
                    });
                    setCounter((prev) => prev + 1);
                } else {
                    toast.error(data?.message || "Failed to save party.");
                }
            } catch (error) {
                console.error("Error saving party:", error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    })


    return (
        <section className={`${showData ? "block" : "hidden"} absolute top-0 right-0 h-full w-[35vw] z-50 bg-[#57657f]`}>
            <div className="  flex  flex-col  ">
                <div className="px-4 flex gap-x-2 items-center font-bold text-[22px] text-white py-3">
                    <BiX onClick={() => setshowData(!showData)} size="30px" />
                </div>
                <div className="text-xl mt-8 text-center  font-semibold m-auto py-3 px-2 w-[400px] bg-[#ffffff4f]  rounded-md text-white  mb-6  ">
                    <h1>Add Parties</h1>
                </div>
                <form
                    className=" w-full p-6   rounded space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block  font-medium pb-2  text-white text-md">Type</label>
                        <select
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2"
                            required
                        >
                            <option value="" className="text-black bg-[#ffffff41]">Select type</option>
                            <option value="Individual" className="text-black bg-[#ffffff41]">Individual</option>
                            <option value="Company" className="text-black bg-[#ffffff41]">Company</option>
                        </select>
                    </div>
                    <div>
                        {values.type === "Individual" && (
                            <>
                                <label className="block font-medium text-white text-md">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={values.full_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="mt-1 block w-full border border-gray-50 bg-transparent focus:outline rounded p-2 text-gray-200"
                                />
                                {touched.full_name && errors.full_name && (
                                    <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>
                                )}
                            </>
                        )}


                    </div>

                    <div>
                        <label className="block  font-medium  text-white text-md">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 block w-full border border-gray-50 bg-transparent focus:outline rounded p-2 text-gray-200"
                            required
                        />
                        {touched.email && errors.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                )}
                    </div>

                    <div>
                        <label className="block  font-medium  text-white text-md">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 block w-full border border-gray-50 bg-transparent focus:outline rounded p-2 text-gray-200"
                            required
                        />
                        {touched.phone && errors.phone && (
                                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                )}
                    </div>



                    {values.type !== "Individual" && <div>
                        <label className="block  font-medium  text-white text-md">GST No</label>
                        <input
                            type="text"
                            name="GST_NO"
                            value={values.GST_NO}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 block w-full border border-gray-50 bg-transparent focus:outline rounded p-2 text-gray-200"
                        />
                        {touched.GST_NO && errors.GST_NO && (
                                    <p className="text-red-400 text-sm mt-1">{errors.GST_NO}</p>
                                )}
                    </div>}

                    <div>
                        <label className="block  font-medium pb-2  text-white text-md">Parties Type</label>
                        <select
                            name="parties_type"
                            value={values.parties_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2"
                            required
                        >
                            <option value="" className="text-black bg-[#ffffff41]">Select type</option>
                            <option value="customer" className="text-black bg-[#ffffff41]">Customer</option>
                            <option value="vendor" className="text-black bg-[#ffffff41]">Vendor</option>
                            <option value="partner" className="text-black bg-[#ffffff41]">Partner</option>
                        </select>
                        {touched.parties_type && errors.parties_type && (
                                    <p className="text-red-400 text-sm mt-1">{errors.parties_type}</p>
                                )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#ffffff38] text-white text-xl py-2 rounded hover:bg-[#ffffff65] transition-all duration-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddParties