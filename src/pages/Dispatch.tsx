

//@ts-nocheck
import { useState, useRef, useEffect } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlinePaperClip } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { DispatchFormSchema } from "../Validation/DispatchFormValidation";
import { useFormik } from "formik";
const Dispatch = () => {
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [siteLink, setSiteLink] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [selectedProductStatus, setSelectedProductStatus] = useState("");

  const [showattachment, setShowAttachment] = useState(false)
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const role = cookies?.role;
  const { handleBlur, handleChange, handleSubmit, resetForm, values, errors, touched } = useFormik({
    initialValues: {
      tracking_id: "",
      tracking_web: ""
    },
    validationSchema: DispatchFormSchema,
    onSubmit: async (values) => {
      console.log(values)
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}dispatch/createDispatch`, values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        })

        console.log(response)
        resetForm()
        setShowModal(false)
      } catch (error) {
        console.log(error)
      }
      //   console.log(response)
      //   resetForm()
      //   setShowModal(false)
      // } catch (error) {
      //   console.log(error)
      // }

    }
  })

 

  const GetDispatch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}dispatch/get-Dispatch`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      })
      setData(response?.data?.data)
      // console.log(data.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    GetDispatch()
  }, [])

  const fileInputRef = useRef(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {

    }
  };

  const calculateTotal = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstval = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstval;
    return totalPrice;
  };

  return (
    <>
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-10 text-white">
        Dispatch
      </h2>

      <div className="flex flex-wrap justify-between items-end mb-6">
        {/* Filters */}
        <div className="flex gap-6 flex-wrap">
          {/* Payment Status */}
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1">Payment Status</label>
            <select
              className="w-48 bg-[#1e293b86] border border-gray-600 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>

          {/* Product Status */}
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1">Product Status</label>
            <select
              className="w-48 bg-[#1e293b8c] border rounded-lg border-gray-600 text-white text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option>All</option>
              <option>Dispatch</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-4 md:mt-0">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => {
              setPaymentFilter("All");
              setProductFilter("All");
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0 1 14-14l1 1"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

        {/* Display Filtered Products */}
        {data?.map((acc: any) => (
          <>
            <div
              key={acc?._id}
              className="border-l-4 border-green-600 shadow-sm p-4 mb-4 rounded-md text-white"
              style={{ backgroundColor: "#1e1e2f4f" }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {/* <p className="font-semibold">Sale By: {acc?.sale_id[0]?.user_id[0]?.first_name || "N/A"}</p> */}
                  <p className="text-sm text-white underline">Date: {new Date(
                    acc?.Sale_id[0]?.createdAt
                  ).toLocaleDateString()}</p>
                  <p>
                    <span className="font-semibold">Party:</span> {acc?.Sale_id[0]?.customer_id[0]?.full_name || "N/A"}
                  </p>
                  {/* <p>
                  <span className="font-semibold">Product Name:</span> {acc?.sale_id[0]?.product_id[0]?.name || "N/A"}
                </p> */}
                  <p>
                    <span className="font-semibold">Quantity:</span> {acc?.Sale_id[0]?.product_qty || "N/A"}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  {acc?.Sale_id[0]?.paymet_status && (
                    <span className="block bg-sky-800/60 text-white text-xs px-2 py-1 rounded">
                      PAYMENT STATUS : {acc?.Sale_id[0]?.paymet_status === "Paied"
                        ? "Paid"
                        : acc?.Sale_id[0]?.paymet_status}
                    </span>
                  )}
                  {acc?.Sale_id[0]?.product_status && (
                    <span className="block bg-sky-800/60 text-white text-xs px-2 py-1 rounded">
                      PRODUCT STATUS: {acc?.bom?.Sale_id[0]?.product_status}
                    </span>
                  )}
                  {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                    <p>
                      <span className="font-semibold">Price:</span> {acc?.Sale_id[0]?.price *
                        acc?.Sale_id[0]?.product_qty || "N/A"}
                    </p>
                  ) : null}
                  <p>
                    <span className="font-semibold">GST:</span> {acc?.Sale_id[0]?.GST}%
                  </p>
                  {(acc?.Sale_id[0]?.delivery_status_by_customer) ? (
                    <p>
                      <span className="font-semibold">Delivery Status:</span> {acc?.Sale_id[0]?.delivery_status_comment_by_customer}
                    </p>
                  ) : null}
                  {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                    <p>
                      <span className="font-semibold">Total Price:</span> {calculateTotal(
                        acc?.Sale_id[0]?.price,
                        acc?.Sale_id[0]?.product_qty,
                        acc?.Sale_id[0]?.GST
                      )}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-4 mt-4 justify-center">
                {acc?.Sale_id[0]?.payment_verify === true && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition-all duration-300"
                    onClick={() => setShowModal(true)}
                  >
                    <TbTruckDelivery /> Dispatch
                  </button>
                )}
                {(acc?.Sale_id[0]?.customer_order_ss || acc?.Sale_id[0]?.dispatcher_order_ss) && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition-all duration-300">
                    <a
                      href="https://rtpasbackend.deepmart.shop/images/delivery-74712863-4179-4830-bdc0-9c60f8b31fbd.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <FiEye /> View Delivery Proof
                    </a>
                  </button>
                )}
                {acc?.Sale_id[0]?.tracking_id && acc?.Sale_id[0]?.tracking_web && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      className="flex items-center gap-2 px-4 py-2 border border-sky-600 text-sky-500 rounded hover:bg-sky-600 hover:text-white transition-all duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <HiOutlinePaperClip /> Attach Delivery Proof
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
          
        ))}

        {/* Modal */}
        {showModal && (
          <form onSubmit={handleSubmit}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003f] bg-opacity-50">
              <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">Dispatch</h2>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Delivery Site Link:
                  </label>
                  <input
                    value={values.tracking_web}
                    type="text"
                    onBlur={handleBlur}
                    name="tracking_web"
                    onChange={handleChange}
                    className="w-full text-gray-200 border bg-transparent focus:outline border-gray-300 px-3 py-2 rounded"
                  />
                  {touched.tracking_web && errors.tracking_web && (
                    <div className="text-red-500 text-sm ">{errors.tracking_web}</div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-1">
                    Tracking ID:
                  </label>
                  <input
                    value={values.tracking_id}
                    name="tracking_id"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="w-full border text-gray-200 bg-transparent focus:outline border-gray-300 px-3 py-2 rounded"
                  />
                  {touched.tracking_id && errors.tracking_id && (
                    <div className="text-red-500 text-sm ">{errors.tracking_id}</div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Submit & Save
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-white hover:text-gray-400"
                >
                  ✕
                </button>
              </div>
            </div>
          </form>
        )}

        {showattachment && (
          <div
            className={`fixed  inset-0 h-screen items-center justify-center bg-[#00000065] bg-opacity-40 z-50 flex`}
          >
            <div className="bg-[#1C3644] rounded-2xl shadow-xl p-6 w-full max-w-md relative text-white">
              <button
                onClick={() => {
                  setShowAttachment(!showattachment); setPreview(null);
                  setFileName('')
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold mb-4">Upload Attach</h2>

              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  Upload File
                </label>

                <div className="group border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all hover:shadow-md hover:border-blue-400 hover:bg-[#142731] relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                    ) : (
                      <svg
                        className="w-12 h-12 text-gray-400 group-hover:text-blue-400 transition"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m4 4H4a1 1 0 01-1-1v-3h18v3a1 1 0 01-1 1z"
                        />
                      </svg>
                    )}
                    <p className="text-sm text-gray-400">
                      {fileName
                        ? `Selected: ${fileName}`
                        : <>Drag and drop your file here, or{' '}
                          <span className="text-blue-400 hover:underline">browse</span></>
                      }
                    </p>
                    <p className="text-xs text-gray-400">Supported formats: PDF, DOCX, PNG</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setPreview(null);
                    setFileName('');
                    setShowAttachment(false);
                  }}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dispatch;
