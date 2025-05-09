import React from "react";

const Dispatch = () => {
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
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
    {
      id: 2,
      date: "4/23/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 200,
      price: 20000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
    {
      id: 3,
      date: "4/23/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 200,
      price: 20000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
    {
      id: 4,
      date: "4/23/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 200,
      price: 20000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
    {
      id: 5,
      date: "4/23/2025",
      customer: "Neeraj",
      productName: "tag",
      quantity: 200,
      price: 20000,
      gst: "0%",
      deliveryStatus: "yes",
      paymentStatus: "PAID",
      productStatus: "DELIVERED",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Completed Products</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select className="border rounded p-2">
          <option>All</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>
        <select className="border rounded p-2">
          <option>All</option>
          <option>Delivered</option>
          <option>Pending</option>
        </select>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Refresh
        </button>
      </div>

      {/* Product Cards */}
      {products.map((product) => (
        <div
          key={product.id}
          className="border-l-4 border-green-600 shadow-sm p-4 mb-4 rounded-md"
          style={{ backgroundColor: "#1e1e2f4f" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Sale By: RUCHI</p>
              <p className="text-sm text-blue-600 underline">
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
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                PAYMENT STATUS: {product.paymentStatus}
              </span>
              <br />
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                PRODUCT STATUS: {product.productStatus}
              </span>
              <br />
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

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50">
              🚚 Dispatch
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-yellow-600 text-yellow-700 rounded hover:bg-yellow-50">
              📄 View Delivery Proof
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dispatch;
