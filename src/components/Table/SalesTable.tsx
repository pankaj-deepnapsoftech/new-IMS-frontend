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

const SalesTable = ({
  filteredPurchases,
  empData,
  isLoading,
  setEditTable,
  setShow,
}) => {
  const [showassign, setShowAssign] = useState(false);
  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };
  // console.log(filteredPurchases)
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

  const handleUpdatedDesign = (purchase) => {
    // Handle updated design logic
    console.log("Updated design for:", purchase);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!filteredPurchases || filteredPurchases.length === 0) {
    return <EmptyData />;
  }

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
                Sale #{purchase?._id?.slice(-6)}
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

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colors.success[100],
                  color: colors.success[800],
                }}
              >
                Active
              </span>
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
                  Party:
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {purchase?.party?.consignee_name || "N/A"}
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
            </div>

            <div className="space-y-3">
              <div>
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
              </div>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap gap-3 pt-4 border-t"
            style={{ borderColor: colors.border.light }}
          >
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
                e.currentTarget.style.backgroundColor = colors.background.card;
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

            <button
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
              onClick={() => handleUpdatedDesign(purchase)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.card;
              }}
            >
              <FaFileImage size="16px" />
              Updated Design
            </button>

            {purchase?.boms[0]?.production_processes?.every((processGroup) =>
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
            )}
          </div>
        </div>
      ))}

      <AssignEmployee
        show={showassign}
        setShow={setShowAssign}
        employeeData={empData}
        saleData={selectedSale}
      />
      <ApproveSample isChecked={isChecked} setIsChecked={setIsChecked} />
    </div>
  );
};

export default SalesTable;
