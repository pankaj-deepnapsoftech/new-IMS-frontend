// @ts-nocheck

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import { PartiesFromValidation } from "../../../Validation/PartiesFromValidation";
import { colors } from "../../../theme/colors";

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
        <div className="space-y-3">
            <label 
                className="block text-sm font-medium"
                style={{ color: colors.text.secondary }}
            >
                {label}
            </label>
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
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                    style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                    }}
                />
            ))}
            <button
                type="button"
                onClick={() => setValues([...values, ""])}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-all duration-200"
                style={{
                    backgroundColor: colors.primary[100],
                    color: colors.primary[700],
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[200];
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[100];
                }}
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
                Add More {label}
            </button>
        </div>
    );

    return (
        <section 
            className={`${showData ? "block" : "hidden"} fixed top-0 right-0 h-full w-[70vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] z-50 bg-white overflow-y-auto border-l border-gray-200`}
            style={{
                boxShadow: "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px"
            }}
        >
            <div className="flex flex-col min-h-full">
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.border.light }}
                >
                    <h1 
                        className="text-xl font-semibold"
                        style={{ color: colors.text.primary }}
                    >
                        {edittable ? "Edit Party" : "Add New Party"}
                    </h1>
                    <button
                        onClick={() => setshowData(false)}
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{
                            color: colors.text.secondary,
                            backgroundColor: colors.gray[100],
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.gray[200];
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.gray[100];
                        }}
                    >
                        <BiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="flex-1 p-6 space-y-6">
                    {/* Basic Information Section */}
                    <div 
                        className="p-4 rounded-lg border"
                        style={{ 
                            backgroundColor: colors.gray[50],
                            borderColor: colors.border.light 
                        }}
                    >
                        <h2 
                            className="text-lg font-semibold mb-4 pb-2 border-b"
                            style={{ 
                                color: colors.text.primary,
                                borderColor: colors.border.light 
                            }}
                        >
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label 
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: colors.text.secondary }}
                                >
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: colors.input.background,
                                        borderColor: colors.input.border,
                                        color: colors.text.primary,
                                    }}
                                >
                                    <option value="">Select type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Company">Company</option>
                                </select>
                                {formik.touched.type && formik.errors.type && (
                                    <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                        {formik.errors.type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label 
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: colors.text.secondary }}
                                >
                                    Party Type *
                                </label>
                                <select
                                    name="parties_type"
                                    value={formik.values.parties_type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: colors.input.background,
                                        borderColor: colors.input.border,
                                        color: colors.text.primary,
                                    }}
                                >
                                    <option value="">Select party type</option>
                                    <option value="Buyer">Buyer</option>
                                    <option value="Seller">Seller</option>
                                </select>
                                {formik.touched.parties_type && formik.errors.parties_type && (
                                    <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                        {formik.errors.parties_type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label 
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: colors.text.secondary }}
                                >
                                    GST Address
                                </label>
                                <input
                                    type="text"
                                    name="gst_add"
                                    value={formik.values.gst_add}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter GST address"
                                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: colors.input.background,
                                        borderColor: colors.input.border,
                                        color: colors.text.primary,
                                    }}
                                />
                                {formik.touched.gst_add && formik.errors.gst_add && (
                                    <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                        {formik.errors.gst_add}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label 
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: colors.text.secondary }}
                                >
                                    Shipped To
                                </label>
                                <input
                                    type="text"
                                    name="shipped_to"
                                    value={formik.values.shipped_to}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter shipping address"
                                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: colors.input.background,
                                        borderColor: colors.input.border,
                                        color: colors.text.primary,
                                    }}
                                />
                                {formik.touched.shipped_to && formik.errors.shipped_to && (
                                    <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                        {formik.errors.shipped_to}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label 
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: colors.text.secondary }}
                                >
                                    Bill To
                                </label>
                                <input
                                    type="text"
                                    name="bill_to"
                                    value={formik.values.bill_to}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter billing address"
                                    className="w-full px-3 py-2 border rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: colors.input.background,
                                        borderColor: colors.input.border,
                                        color: colors.text.primary,
                                    }}
                                />
                                {formik.touched.bill_to && formik.errors.bill_to && (
                                    <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                        {formik.errors.bill_to}
                                    </p>
                                )}
                            </div>

                            {formik.values.type === "Company" && (
                                <div>
                                    <label 
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: colors.text.secondary }}
                                    >
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formik.values.company_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter company name"
                                        className="w-full px-3 py-2 border rounded-lg transition-colors"
                                        style={{
                                            backgroundColor: colors.input.background,
                                            borderColor: colors.input.border,
                                            color: colors.text.primary,
                                        }}
                                    />
                                    {formik.touched.company_name && formik.errors.company_name && (
                                        <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
                                            {formik.errors.company_name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                                {/* name="bill_to"
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
                    </div> */}

                  
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded bg-black/80 transition-colors text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
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
