// @ts-nocheck

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import { PartiesFromValidation } from "../../../Validation/PartiesFromValidation";

const AddParties = ({ showData, setshowData, setCounter, edittable, setEditTable, fetchPartiesData }) => {
    const [consigneeNames, setConsigneeNames] = useState([""]);
    const [gstIns, setGstIns] = useState([""]);
    const [contactNumbers, setContactNumbers] = useState([""]);
    const [deliveryAddresses, setDeliveryAddresses] = useState([""]);
    const [emailIds, setEmailIds] = useState([""]);
    const [cookies] = useCookies();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (edittable) {
            setConsigneeNames(edittable.consignee_name || [""]);
            setGstIns(edittable.gst_in || [""]);
            setContactNumbers(edittable.contact_number || [""]);
            setDeliveryAddresses(edittable.delivery_address || [""]);
            setEmailIds(edittable.email_id || [""]);
        } else {
            setConsigneeNames([""]);
            setGstIns([""]);
            setContactNumbers([""]);
            setDeliveryAddresses([""]);
            setEmailIds([""]);
        }
    }, [edittable]);

    const formik = useFormik({
        initialValues: {
            type: edittable?.type || "",
            parties_type: edittable?.parties_type || "",
            gst_add: edittable?.gst_add || "",
            shipped_to: edittable?.shipped_to || "",
            bill_to: edittable?.bill_to || "",
            company_name: edittable?.company_name
        },
        enableReinitialize: true,
        validationSchema:PartiesFromValidation,
        onSubmit: async (values, { resetForm }) => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            const payload = {
                ...values,
                consignee_name: consigneeNames,
                gst_in: gstIns,
                contact_number: contactNumbers,
                delivery_address: deliveryAddresses,
                email_id: emailIds,
            };

            try {
                let res;

                if (edittable?._id) {
                    res = await axios.put(
                        `${process.env.REACT_APP_BACKEND_URL}parties/put/${edittable._id}`,
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies?.access_token}`,
                            },
                        }
                    );
                } else {
                    res = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}parties/create`,
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies?.access_token}`,
                            },
                        }
                    );
                }

                toast.success(res?.data?.message);
                fetchPartiesData();
                resetForm();
                setshowData(false);
                setEditTable(null);
            } catch (error) {
                console.error(error);
                toast.error(error?.message || "Something went wrong!");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const renderFieldList = (label, values, setValues) => (
        <div className="space-y-2">
            <label className="block font-medium text-sm sm:text-md text-white">{label}</label>
            {values.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    value={value}
                    onChange={(e) => {
                        const newValues = [...values];
                        newValues[index] = e.target.value;
                        setValues(newValues);
                    }}
                    className="w-full border border-gray-100 bg-white/10 text-white rounded p-2"
                />
            ))}
            <button
                type="button"
                onClick={() => setValues([...values, ""])}
                className="mt-1 inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add More
            </button>
        </div>
    );

    return (
        <section className={`${showData ? "block" : "hidden"} fixed top-0 right-0 h-full w-[70vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] z-50 bg-[#2f3642] overflow-y-auto`}>
            <div className="flex flex-col min-h-full text-white">
              
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
                    <h1 className="text-lg font-semibold">Add Parties</h1>
                    <BiX onClick={() => setshowData(false)} size="30px" className="cursor-pointer" />
                </div>

                
                <form onSubmit={formik.handleSubmit} className="space-y-6 p-4 sm:p-6">
                 
                    <div className="space-y-4 bg-white/5 p-4 rounded-md shadow-sm">
                        <h2 className="text-md font-semibold border-b border-white/20 pb-2">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium">Type</label>
                            <select
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border bg-white/10 text-white rounded p-2"
                            >
                                <option  className="text-black" value="">Select type</option>
                                <option  className="text-black" value="Individual">Individual</option>
                                <option  className="text-black" value="Company">Company</option>
                            </select>
                            {formik.touched.type && formik.errors.type && (
                                <p className="text-sm text-red-400 mt-1">{formik.errors.type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Party Type</label>
                            <select
                                name="parties_type"
                                value={formik.values.parties_type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border bg-white/10 text-white rounded p-2"
                            >
                                <option className="text-black" value="">Select party type</option>
                                <option className="text-black" value="Buyer">Buyer</option>
                                <option className="text-black" value="Seller">Seller</option>
                            </select>
                            {formik.touched.parties_type && formik.errors.parties_type && (
                                <p className="text-sm text-red-400 mt-1">{formik.errors.parties_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">GST Address</label>
                            <input
                                type="text"
                                name="gst_add"
                                value={formik.values.gst_add}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border bg-white/10 text-white rounded p-2"
                            />
                            {formik.touched.gst_add && formik.errors.gst_add && (
                                <p className="text-sm text-red-400 mt-1">{formik.errors.gst_add}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Shipped To</label>
                            <input
                                type="text"
                                name="shipped_to"
                                value={formik.values.shipped_to}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border bg-white/10 text-white rounded p-2"
                            />
                            {formik.touched.shipped_to && formik.errors.shipped_to && (
                                <p className="text-sm text-red-400 mt-1">{formik.errors.shipped_to}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Bill To</label>
                            <input
                                type="text"
                                name="bill_to"
                                value={formik.values.bill_to}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full border bg-white/10 text-white rounded p-2"
                            />
                            {formik.touched.bill_to && formik.errors.bill_to && (
                                <p className="text-sm text-red-400 mt-1">{formik.errors.bill_to}</p>
                            )}
                        </div>

                        {formik.values.type === "Company" && (
                            <div>
                                <label className="block text-sm font-medium">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formik.values.company_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full border bg-white/10 text-white rounded p-2"
                                />
                                {formik.touched.company_name && formik.errors.company_name && (
                                    <p className="text-sm text-red-400 mt-1">{formik.errors.company_name}</p>
                                )}
                            </div>
                        )}
                    </div>

                    
                    <div className="space-y-6 bg-white/5 p-4 rounded-md shadow-sm">
                        <h2 className="text-md font-semibold border-b border-white/20 pb-2">Additional Details</h2>

                        {renderFieldList("Consignee Name", consigneeNames, setConsigneeNames)}
                        {renderFieldList("GST IN", gstIns, setGstIns)}
                        {renderFieldList("Contact Number", contactNumbers, setContactNumbers)}
                        {renderFieldList("Delivery Address", deliveryAddresses, setDeliveryAddresses)}
                        {renderFieldList("Email ID", emailIds, setEmailIds)}
                    </div>

                  
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded bg-white/30 hover:bg-white/50 transition-colors text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddParties;
