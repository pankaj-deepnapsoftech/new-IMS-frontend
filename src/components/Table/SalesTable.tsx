// @ts-nocheck

import { useState, useEffect } from "react";
import AssignEmployee from "../Drawers/Sales/AssignEmployee";
import UploadInvoice from "../Drawers/Sales/UploadInvoice";
import ViewPayment from "../Drawers/Sales/ViewPayment";
import ViewDesign from "../Drawers/Sales/ViewDesign";
import ApproveSample from "../Drawers/Sales/ApproveSample";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import { colors } from "../../theme/colors";
import {
  FaEdit,
  FaUserPlus,
  FaImage,
  FaFileImage,
  FaCheckCircle,
} from "react-icons/fa";
import SalesOrderPDF from "../PDF/SalesOrderPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const SalesTable = ({
  filteredPurchases,
  empData,
  isLoading,
  setEditTable,
  setShow,
  fetchPurchases,
}) => {
  const [showassign, setShowAssign] = useState(false);
  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };
  console.log(filteredPurchases)
  const [selectedSale, setSelectedSale] = useState([]);
  const [paymentshow, setPaymentshow] = useState(false);
  const [isOpen, setViewDesign] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSampleDesign = (designFile) => {
    if (designFile) {
      window.open(designFile, "_blank");
    } else {
      alert("Design file not available.");
    }
  };

  const handleUpdatedDesign = (designFile) => {
    if (designFile) {
      window.open(designFile, "_blank");
    } else {
      alert("Design file not available.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!filteredPurchases || filteredPurchases.length === 0) {
    return <EmptyData />;
  }

  console.log(filteredPurchases);

  return (
    <div className="space-y-4 bg-[#f8f9fa]">
      {filteredPurchases?.map((purchase: any) => (
        <div
          key={purchase?._id}
          className="rounded-xl shadow-sm border border-gray-100 p-6"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          {/* Sale Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                Order Id : {purchase.order_id}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: colors.text.secondary }}
              >
                Created by{" "}
                <span className="font-medium">
                  {purchase?.user_id[0]?.first_name || "N/A"}
                </span>{" "}
                • {new Date(purchase?.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Edit and Assign buttons moved to top right */}
            <div className="flex gap-2">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                style={{
                  borderColor: colors.border.medium,
                  color: colors.text.primary,
                  backgroundColor: colors.background.card,
                }}
                onClick={() => {
                  setShow(true);
                  setEditTable(purchase);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.card;
                }}
              >
                <FaEdit size="16px" />
                Edit
              </button>

              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.button.primary,
                  color: colors.text.inverse,
                }}
                onClick={() => {
                  setShowAssign(!showassign);
                  setSelectedSale(purchase);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.button.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.button.primary;
                }}
              >
                <FaUserPlus size="16px" />
                Assign
              </button>

              <PDFDownloadLink
                document={<SalesOrderPDF sale={purchase} />}
                fileName={`SalesOrder_${purchase.order_id}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    "Preparing PDF..."
                  ) : (
                    <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg">
                      Download PDF
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>

          {/* Sale Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Merchant:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.party?.consignee_name?.length > 0
                    ? purchase?.party?.consignee_name
                    : purchase?.party?.company_name}
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Bill To Address:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.party?.bill_to || "N/A"}
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Product:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.product_id[0]?.name || "N/A"}
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Quantity:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.product_qty}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Unit Price:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  ₹{purchase?.price || "N/A"}
                </span>
              </div>
              {/* <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Subtotal:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  ₹{purchase?.price * purchase?.product_qty}
                </span>
                
              </div> */}
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  GST:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.GST}%
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Total Price:
                </span>
                <span
                  className="ml-2 text-sm font-semibold"
                  style={{ color: colors.success[600] }}
                >
                  ₹
                  {calculateTotalPrice(
                    purchase?.price,
                    purchase?.product_qty,
                    purchase?.GST
                  ).toFixed(2)}
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Mode of Payment:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.mode_of_payment || "N/A"}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2 -mt-3">
            <span
              className="text-sm font-medium w-40"
              style={{ color: colors.text.secondary }}
            >
              Terms of Delivery:
            </span>
            <textarea
              className="mt-1 p-2 w-full rounded-lg border border-gray-200"
              style={{ backgroundColor: colors.background.card }}
              value={purchase?.comment || ""}
              rows={2}
            />
          </div> */}

          {/* Action Buttons */}
          {/* <div
            className="flex flex-wrap gap-3 pt-4 "
            style={{ borderColor: colors.border.light }}
          > */}
          {/* <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
              style={{
                borderColor: colors.warning[300],
                color: colors.warning[700],
                backgroundColor: colors.background.card,
              }}
              onClick={() => handleSampleDesign(purchase?.productFile)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.warning[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.card;
              }}
            >
              <FaImage size="16px" />
              Sample Design
            </button>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
              style={{
                borderColor: colors.secondary[300],
                color: colors.secondary[700],
                backgroundColor: colors.background.card,
              }}
              onClick={() => handleUpdatedDesign(purchase?.designFile)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.card;
              }}
            >
              <FaFileImage size="16px" />
              Updated Design
            </button> */}

          {/* {purchase?.boms[0]?.production_processes?.every((processGroup) =>
              processGroup?.processes?.every(
                (process) => process?.done === true
              )
            ) && (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.success[500],
                  color: colors.text.inverse,
                }}
                onClick={() => setIsChecked(!isChecked)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.success[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.success[500];
                }}
              >
                <FaCheckCircle size="16px" />
                Approve Sample
              </button>
            )} */}
          {/* </div> */}

          {/* Status Footer */}
          <div
            className="flex justify-between items-center pt-3 mt-3 border-t"
            style={{ borderColor: colors.border.light }}
          >
            <span className="text-sm" style={{ color: colors.text.secondary }}>
              Design Approval Status:
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                purchase?.assinedto?.[0]?.isCompleted === "Completed"
                  ? "bg-green-100 text-green-800"
                  : purchase?.assinedto?.[0]?.isCompleted === "UnderProcessing"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {purchase?.assinedto?.[0]?.isCompleted || "Not Assigned"}
            </span>
          </div>
        </div>
      ))}

      <AssignEmployee
        show={showassign}
        setShow={setShowAssign}
        employeeData={empData}
        saleData={selectedSale}
        fetchPurchases={fetchPurchases}
      />
      <ApproveSample isChecked={isChecked} setIsChecked={setIsChecked} />
    </div>
  );
};

export default SalesTable;
