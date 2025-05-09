

//@ts-nocheck
import { useState, useRef } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlinePaperClip } from "react-icons/hi";
import { FiEye } from "react-icons/fi";

const Dispatch = () => {
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [siteLink, setSiteLink] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const products = [
    {
      id: 1,
      date: "5/7/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 1000,
      price: 100000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "UNPAID",
      productStatus: "DELIVERED",
    },
    {
      id: 2,
      date: "5/7/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 1000,
      price: 100000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DISPATCH",
    },
    {
      id: 3,
      date: "5/7/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 1000,
      price: 100000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
  ];

  //Filter-Logic
  const filteredProducts = products.filter((product) => {
    const paymentMatch =
      paymentFilter === "All" ||
      product.paymentStatus.toUpperCase() === paymentFilter.toUpperCase();
    const productMatch =
      productFilter === "All" ||
      product.productStatus.toUpperCase() === productFilter.toUpperCase();
    return paymentMatch && productMatch;
  });
  const fileInputRef = useRef(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      // console.log("Selected File:", file.name);
      // TODO: Upload or store file here
    }
  };

  return (
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
              className="w-48 bg-[#1e293b] border border-gray-600 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              className="w-48 bg-[#1e293b] border rounded-lg border-gray-600 text-white text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
      {filteredProducts.length === 0 ? (
        <p className="text-white">No products match the filters.</p>
      ) : (
        filteredProducts.map((product, index) => (
          <div
            key={index}
            className="border-l-4 border-green-600 shadow-sm p-4 mb-4 rounded-md text-white"
            style={{ backgroundColor: "#1e1e2f4f" }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold">Sale By: RUCHI</p>
                <p className="text-sm text-white underline">
                  Date: {product.date}
                </p>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {product.customer}
                </p>
                <p>
                  <span className="font-semibold">Product Name:</span>{" "}
                  {product.productName}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {product.quantity}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="block bg-sky-800/60 text-white text-xs px-2 py-1 rounded">
                  PAYMENT STATUS: {product.paymentStatus}
                </span>
                <span className="block bg-sky-800/60 text-white   text-xs px-2 py-1 rounded">
                  PRODUCT STATUS: {product.productStatus}
                </span>
                <p>
                  <span className="font-semibold">Price:</span> {product.price}
                </p>
                <p>
                  <span className="font-semibold">GST:</span> {product.gst}
                </p>
                <p>
                  <span className="font-semibold">Delivery Status:</span>{" "}
                  {product.deliveryStatus}
                </p>
                <p>
                  <span className="font-semibold">Total Price:</span>{" "}
                  {product.price}
                </p>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <h2 className="text-xl font-semibold mb-4">Dispatch</h2>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Delivery Site Link:
                    </label>
                    <input
                      type="text"
                      value={siteLink}
                      onChange={(e) => setSiteLink(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block font-medium mb-1">
                      Tracking ID:
                    </label>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Handle submit here
                        console.log("Site Link:", siteLink);
                        console.log("Tracking ID:", trackingId);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Submit & Save
                    </button>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-4 justify-center space-between">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition-all duration-300"
                onClick={() => setShowModal(true)}
              >
                <TbTruckDelivery color="green" /> Dispatch
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border border-yellow-600 text-yellow-700 rounded hover:bg-yellow-600 hover:text-white transition-all duration-300">
                <FiEye color="orange" /> View Delivery Proof
              </button>
              <>
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
                  <HiOutlinePaperClip color="skyblue" /> Attach Delivery Proof
                </button>
              </>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dispatch;
