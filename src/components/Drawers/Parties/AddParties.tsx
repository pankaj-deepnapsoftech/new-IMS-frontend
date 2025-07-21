// @ts-nocheck

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import { PartiesFromValidation } from "../../../Validation/PartiesFromValidation";
import { colors } from "../../../theme/colors";
import {
  Users,
  Building2,
  User,
  MapPin,
  FileText,
  Mail,
  Phone,
  Plus,
  Edit3,
  UserPlus,
} from "lucide-react";

const AddParties = ({
  showData,
  setshowData,
  setCounter,
  edittable,
  setEditTable,
  fetchPartiesData,
}) => {
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
      company_name: edittable?.company_name,
    },
    enableReinitialize: true,
    validationSchema: PartiesFromValidation,
    onSubmit: async (values) => {
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
        formik.resetForm();
        setConsigneeNames([""]);
        setGstIns([""]);
        setContactNumbers([""]);
        setDeliveryAddresses([""]);
        setEmailIds([""]);
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

  const renderFieldList = (label, values, setValues, icon) => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        {label}
      </label>

      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const newValues = [...values];
              newValues[index] = e.target.value;
              setValues(newValues);
            }}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const newValues = values.filter((_, i) => i !== index);
                setValues(newValues.length > 0 ? newValues : [""]);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <BiX size={20} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setValues([...values, ""])}
        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
      >
        <Plus className="h-4 w-4" />
        Add More {label}
      </button>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      {showData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          showData ? "translate-x-0" : "translate-x-full" 
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg border">
                {edittable ? (
                  <Edit3 className="h-5 w-5 text-black" />
                ) : (
                  <UserPlus className="h-5 w-5 text-black" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-black">
                {edittable ? "Update Merchant" : "Add New Merchant"}
              </h2>
            </div>
            <button
              onClick={() => setshowData(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 border"
            >
              <BiX size={24} className="text-black" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 text-gray-500" />
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Select type</option>
                      <option value="Individual">Individual</option>
                      <option value="Company">Company</option>
                    </select>
                    {formik.touched.type && formik.errors.type && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        {formik.errors.type}
                      </p>
                    )}
                  </div>

                  {/* Party Type */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="h-4 w-4 text-gray-500" />
                      Merchant Type *
                    </label>
                    <select
                      name="parties_type"
                      value={formik.values.parties_type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Select merchant type</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                    </select>
                    {formik.touched.parties_type &&
                      formik.errors.parties_type && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          {formik.errors.parties_type}
                        </p>
                      )}
                  </div>

                  {/* Company Name (conditional) */}
                  {formik.values.type === "Company" && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formik.values.company_name || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      />
                      {formik.touched.company_name &&
                        formik.errors.company_name && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            {formik.errors.company_name}
                          </p>
                        )}
                    </div>
                  )}

                  {/* GST Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      GST Address
                    </label>
                    <input
                      type="text"
                      name="gst_add"
                      value={formik.values.gst_add}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter GST address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                    {formik.touched.gst_add && formik.errors.gst_add && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        {formik.errors.gst_add}
                      </p>
                    )}
                  </div>

                  {/* Shipped To */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Shipped To
                    </label>
                    <input
                      type="text"
                      name="shipped_to"
                      value={formik.values.shipped_to}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter shipping address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                    {formik.touched.shipped_to && formik.errors.shipped_to && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        {formik.errors.shipped_to}
                      </p>
                    )}
                  </div>

                  {/* Bill To */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="h-4 w-4 text-gray-500" />
                      Bill To
                    </label>
                    <input
                      type="text"
                      name="bill_to"
                      value={formik.values.bill_to}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter billing address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                    {formik.touched.bill_to && formik.errors.bill_to && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        {formik.errors.bill_to}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Additional Contact Details
                </h3>

                <div className="space-y-6">
                  {renderFieldList(
                    "Consignee Name",
                    consigneeNames,
                    setConsigneeNames,
                    <User className="h-4 w-4 text-gray-500" />
                  )}

                  {renderFieldList(
                    "GST IN",
                    gstIns,
                    setGstIns,
                    <FileText className="h-4 w-4 text-gray-500" />
                  )}

                  {renderFieldList(
                    "Contact Number",
                    contactNumbers,
                    setContactNumbers,
                    <Phone className="h-4 w-4 text-gray-500" />
                  )}

                  {renderFieldList(
                    "Delivery Address",
                    deliveryAddresses,
                    setDeliveryAddresses,
                    <MapPin className="h-4 w-4 text-gray-500" />
                  )}

                  {renderFieldList(
                    "Email ID",
                    emailIds,
                    setEmailIds,
                    <Mail className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setshowData(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {edittable ? "Updating..." : "Creating..."}
                    </>
                  ) : edittable ? (
                    "Update Party"
                  ) : (
                    "Create Party"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddParties;
