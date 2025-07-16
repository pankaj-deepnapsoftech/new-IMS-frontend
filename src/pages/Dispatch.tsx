//@ts-nocheck
import { useState, useRef, useEffect } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlinePaperClip } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { RefreshCw, Filter, Search } from "lucide-react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { DispatchFormSchema } from "../Validation/DispatchFormValidation";
import { useFormik } from "formik";
import Loading from "../ui/Loading";
import EmptyData from "../ui/emptyData";
import Pagination from "./Pagination";
import { colors } from "../theme/colors";
const Dispatch = () => {
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [productFilter, setProductFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [siteLink, setSiteLink] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showattachment, setShowAttachment] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const role = cookies?.role;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      tracking_id: "",
      tracking_web: "",
    },
    validationSchema: DispatchFormSchema,
    onSubmit: async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}dispatch/createDispatch`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies?.access_token}`,
            },
          }
        );

    
        resetForm()
        setShowModal(false)
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const GetDispatch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}dispatch/get-Dispatch?page=${page}&&limit=2`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }}
      )

      setData(response?.data?.data); 

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetDispatch(page)
  }, [page])



  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files[0];
  //   if (file) {

  //   }
  // };

  const calculateTotal = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstval = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstval;
    return totalPrice;
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen p-6"
        style={{ backgroundColor: colors.background.page }}
      >
        <Loading />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="min-h-screen p-6"
        style={{ backgroundColor: colors.background.page }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <TbTruckDelivery
                  className="w-6 h-6"
                  style={{ color: colors.primary[600] }}
                />
              </div>
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Dispatch Management
              </h1>
            </div>
            <p className="text-lg" style={{ color: colors.text.secondary }}>
              Manage dispatch operations and track deliveries
            </p>
          </div>
          <EmptyData />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background.page }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <TbTruckDelivery
                className="w-6 h-6"
                style={{ color: colors.primary[600] }}
              />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Dispatch Management
            </h1>
          </div>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Manage dispatch operations and track deliveries
          </p>
        </div>

        {/* Filters and Actions */}
        <div
          className="mb-6 p-6 rounded-xl"
          style={{
            backgroundColor: colors.background.card,
            boxShadow: colors.shadow.md,
          }}
        >
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Search Bar */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.text.muted }}
                />
                <input
                  type="text"
                  placeholder="Search by party name, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter
                  className="w-4 h-4"
                  style={{ color: colors.text.secondary }}
                />
                <select
                  className="px-3 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="All">All Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <select
                className="px-3 py-2 rounded-lg border transition-colors"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              >
                <option value="All">All Product Status</option>
                <option value="Dispatch">Dispatch</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button
                onClick={() => {
                  setPaymentFilter("All");
                  setProductFilter("All");
                  setSearchTerm("");
                  GetDispatch();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.border.medium,
                  color: colors.text.secondary,
                  backgroundColor: colors.background.card,
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Dispatch Cards */}
        <div className="space-y-6">
          {data?.map((acc: any) => (
            <div
              key={acc?._id}
              className="rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.card,
                borderLeftColor: colors.success[500],
                boxShadow: colors.shadow.sm,
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: colors.primary[100],
                          color: colors.primary[800],
                        }}
                      >
                        Order #{acc?._id?.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {new Date(
                          acc?.Sale_id[0]?.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            Party:
                          </span>
                          <span style={{ color: colors.text.secondary }}>
                            {acc?.Sale_id[0]?.customer_id[0]?.full_name ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            Product:
                          </span>
                          <span style={{ color: colors.text.secondary }}>
                            {acc?.Sale_id[0]?.product_id[0]?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            Quantity:
                          </span>
                          <span style={{ color: colors.text.secondary }}>
                            {acc?.Sale_id[0]?.product_qty || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(role === "Accountant" ||
                          role === "Sales" ||
                          role === "admin") && (
                          <>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                Price:
                              </span>
                              <span style={{ color: colors.text.secondary }}>
                                ₹
                                {acc?.Sale_id[0]?.price *
                                  acc?.Sale_id[0]?.product_qty || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                Total (incl. GST):
                              </span>
                              <span
                                className="font-semibold"
                                style={{ color: colors.success[600] }}
                              >
                                ₹
                                {calculateTotal(
                                  acc?.Sale_id[0]?.price,
                                  acc?.Sale_id[0]?.product_qty,
                                  acc?.Sale_id[0]?.GST
                                )}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            GST:
                          </span>
                          <span style={{ color: colors.text.secondary }}>
                            {acc?.Sale_id[0]?.GST}%
                          </span>
                        </div>
                        {acc?.Sale_id[0]?.delivery_status_by_customer && (
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium"
                              style={{ color: colors.text.primary }}
                            >
                              Delivery Status:
                            </span>
                            <span style={{ color: colors.text.secondary }}>
                              {
                                acc?.Sale_id[0]
                                  ?.delivery_status_comment_by_customer
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="flex gap-3 justify-end pt-4 border-t"
                  style={{ borderColor: colors.border.light }}
                >
                  {acc?.Sale_id[0]?.payment_verify === true && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                      style={{
                        borderColor: colors.success[500],
                        color: colors.success[600],
                        backgroundColor: colors.success[50],
                      }}
                    >
                      <TbTruckDelivery className="w-4 h-4" />
                      Dispatch
                    </button>
                  )}

                  {(acc?.Sale_id[0]?.customer_order_ss ||
                    acc?.Sale_id[0]?.dispatcher_order_ss) && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                      style={{
                        borderColor: colors.warning[500],
                        color: colors.warning[600],
                        backgroundColor: colors.warning[50],
                      }}
                    >
                      <a
                        href="https://rtpasbackend.deepmart.shop/images/delivery-74712863-4179-4830-bdc0-9c60f8b31fbd.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        View Delivery Proof
                      </a>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dispatch Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="w-full max-w-md mx-4 rounded-xl shadow-xl"
              style={{ backgroundColor: colors.background.card }}
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      Dispatch Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="p-1 rounded-lg transition-colors"
                      style={{ color: colors.text.muted }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.text.primary }}
                      >
                        Delivery Site Link
                      </label>
                      <input
                        type="text"
                        name="tracking_web"
                        value={values.tracking_web}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: colors.input.background,
                          borderColor:
                            touched.tracking_web && errors.tracking_web
                              ? colors.error[500]
                              : colors.input.border,
                          color: colors.text.primary,
                        }}
                        placeholder="Enter tracking website URL"
                      />
                      {touched.tracking_web && errors.tracking_web && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.error[500] }}
                        >
                          {errors.tracking_web}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.text.primary }}
                      >
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        name="tracking_id"
                        value={values.tracking_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: colors.input.background,
                          borderColor:
                            touched.tracking_id && errors.tracking_id
                              ? colors.error[500]
                              : colors.input.border,
                          color: colors.text.primary,
                        }}
                        placeholder="Enter tracking ID"
                      />
                      {touched.tracking_id && errors.tracking_id && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.error[500] }}
                        >
                          {errors.tracking_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border transition-all duration-200"
                      style={{
                        borderColor: colors.error[500],
                        color: colors.error[600],
                        backgroundColor: colors.error[50],
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                      style={{
                        backgroundColor: colors.success[500],
                        color: colors.text.inverse,
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit & Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* File Upload Modal */}
        {showattachment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="w-full max-w-md mx-4 rounded-xl shadow-xl"
              style={{ backgroundColor: colors.background.card }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Upload Attachment
                  </h2>
                  <button
                    onClick={() => {
                      setShowAttachment(false);
                      setPreview(null);
                      setFileName("");
                    }}
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: colors.text.muted }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:shadow-md relative"
                    style={{ borderColor: colors.border.medium }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.png,.jpg,.jpeg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />

                    <div className="flex flex-col items-center gap-3">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <HiOutlinePaperClip
                          className="w-12 h-12"
                          style={{ color: colors.text.muted }}
                        />
                      )}
                      <div className="text-center">
                        <p
                          className="text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {fileName
                            ? `Selected: ${fileName}`
                            : "Drag and drop your file here, or click to browse"}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text.muted }}
                        >
                          Supported formats: PDF, DOCX, PNG, JPG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                      setShowAttachment(false);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all duration-200"
                    style={{
                      borderColor: colors.error[500],
                      color: colors.error[600],
                      backgroundColor: colors.error[50],
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: colors.primary[500],
                      color: colors.text.inverse,
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Pagination page={page} setPage={setPage} hasNextPage={data.length === 2}/>
      </div>
    </div>
  );
};

export default Dispatch;
