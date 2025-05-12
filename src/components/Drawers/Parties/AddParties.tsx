// @ts-nocheck 

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { PartiesFromValidation } from "../../../Validation/PartiesFromValidation";


const AddParties = ({ showData, setshowData, setCounter }) => {
    const [cookies] = useCookies();

    const {values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm} = useFormik({
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
        onSubmit: async (value) => {

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
                    resetForm({
                        full_name: '',
                        email: '',
                        phone: '',
                        company_name: '',
                        GST_NO: '',
                        type: '',
                        parties_type: '',
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
        <section className={`${showData ? "block" : "hidden"} fixed top-0 right-0 h-full w-[70vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] z-50 bg-[#57657f] overflow-y-auto`}>
        <div className="flex flex-col min-h-full">

            <div className="px-4 flex justify-between items-center text-white py-3">
                <BiX onClick={() => setshowData(!showData)} size="30px" className="cursor-pointer" />
            </div>

            <div className="text-center text-white py-3 px-2 mx-4 rounded-md bg-[#ffffff2f] text-lg sm:text-xl font-semibold">
                <h1>Add Parties</h1>
            </div>
    

            <form onSubmit={handleSubmit} className="w-full p-4 sm:p-6 space-y-4 flex-1">
     
                <div>
                    <label className="block font-medium pb-1 text-white text-sm sm:text-md">Type</label>
                    <select
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-50 bg-[#47556913] text-gray-200 rounded px-2 py-2 focus:outline-none"
                        required
                    >
                        <option value="" className="text-black">Select type</option>
                        <option value="Individual" className="text-black">Individual</option>
                        <option value="Company" className="text-black">Company</option>
                    </select>
                </div>
    

                {values.type === "Company" && (
                    <>
                        <label className="block font-medium text-white text-sm sm:text-md">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={values.company_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border border-gray-50 bg-transparent rounded p-2 text-gray-200"
                        />
                        {touched.company_name && errors.company_name && (
                            <p className="text-red-400 text-sm mt-1">{errors.company_name}</p>
                        )}
                    </>
                )}
    
          
                {values.type === "Individual" && (
                    <>
                        <label className="block font-medium text-white text-sm sm:text-md">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={values.full_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border border-gray-50 bg-transparent rounded p-2 text-gray-200"
                        />
                        {touched.full_name && errors.full_name && (
                            <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>
                        )}
                    </>
                )}
    
                {/* Email */}
                <div>
                    <label className="block font-medium text-white text-sm sm:text-md">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-50 bg-transparent rounded p-2 text-gray-200"
                        required
                    />
                    {touched.email && errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
    
                {/* Phone */}
                <div>
                    <label className="block font-medium text-white text-sm sm:text-md">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-50 bg-transparent rounded p-2 text-gray-200"
                        required
                    />
                    {touched.phone && errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>
    
                {/* GST No */}
                {values.type !== "Individual" && (
                    <div>
                        <label className="block font-medium text-white text-sm sm:text-md">GST No</label>
                        <input
                            type="text"
                            name="GST_NO"
                            value={values.GST_NO}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border border-gray-50 bg-transparent rounded p-2 text-gray-200"
                        />
                        {touched.GST_NO && errors.GST_NO && (
                            <p className="text-red-400 text-sm mt-1">{errors.GST_NO}</p>
                        )}
                    </div>
                )}
    
                {/* Parties Type Dropdown */}
                <div>
                    <label className="block font-medium text-white text-sm sm:text-md">Parties Type</label>
                    <select
                        name="parties_type"
                        value={values.parties_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-50 bg-[#47556913] text-gray-200 rounded px-2 py-2 focus:outline-none"
                        required
                    >
                        <option value="" className="text-black">Select type</option>
                        <option value="Buyer" className="text-black">Buyer</option>
                        <option value="Seller" className="text-black">Seller</option>
                    </select>
                    {touched.parties_type && errors.parties_type && (
                        <p className="text-red-400 text-sm mt-1">{errors.parties_type}</p>
                    )}
                </div>
    
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#ffffff38] text-white text-lg sm:text-xl py-2 rounded hover:bg-[#ffffff65] transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    </section>
    
    )
}

export default AddParties