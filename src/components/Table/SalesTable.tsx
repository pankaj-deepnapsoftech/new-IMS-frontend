// @ts-nocheck

import { useState } from "react";
import AssignEmployee from "../Drawers/Sales/AssignEmployee";
import ApproveSample from "../Drawers/Sales/ApproveSample";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import { colors } from "../../theme/colors";

const SalesTable = ({
  filteredPurchases,
  sendDataToParent,
  empData,
  isLoading,
}) => {
  const [show, setShow] = useState(false);
  const [selectedSale, setSelectedSale] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!filteredPurchases || filteredPurchases.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="space-y-4">
      {filteredPurchases?.map((purchase: any, index: number) => (
        <div
          key={purchase?._id}
          className="rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl"
          style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2
                className="font-semibold text-lg mb-2"
                style={{ color: colors.textPrimary }}
              >
                Created By:{" "}
                <span style={{ color: colors.primary }}>
                  {purchase?.user_id[0]?.first_name || "N/A"}
                </span>
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(purchase?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <hr style={{ borderColor: colors.border }} className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Party:
                </span>{" "}
                {purchase?.party_id?.[0]?.full_name || "N/A"}
              </p>
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Product Name:
                </span>{" "}
                {purchase?.product_id[0]?.name || "N/A"}
              </p>
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Product Price:
                </span>{" "}
                ₹{purchase?.price || "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Quantity:
                </span>{" "}
                {purchase?.product_qty}
              </p>
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Subtotal:
                </span>{" "}
                ₹{purchase?.price * purchase?.product_qty}
              </p>
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  GST:
                </span>{" "}
                {purchase?.GST}%
              </p>
            </div>
            <div className="space-y-2">
              <p style={{ color: colors.textSecondary }}>
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Total Price:
                </span>
                <span
                  className="font-bold text-lg ml-2"
                  style={{ color: colors.success }}
                >
                  ₹
                  {calculateTotalPrice(
                    purchase?.price,
                    purchase?.product_qty,
                    purchase?.GST
                  ).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-opacity-90"
              style={{
                backgroundColor: colors.secondary,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
              }}
              onClick={() => sendDataToParent(purchase)}
            >
              Edit
            </button>

            {purchase?.boms &&
              purchase?.boms[0]?.production_processes?.every((processGroup) =>
                processGroup?.processes?.every(
                  (process) => process?.done === true
                )
              ) && (
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-opacity-90"
                  style={{
                    backgroundColor: colors.success,
                    color: "white",
                    border: `1px solid ${colors.success}`,
                  }}
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Approve Sample
                </button>
              )}

            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: "white",
                border: `1px solid ${colors.primary}`,
              }}
              onClick={() => {
                setShow(!show);
                setSelectedSale(purchase);
              }}
            >
              Assign Employee
            </button>
          </div>
        </div>
      ))}

      <AssignEmployee
        show={show}
        setShow={setShow}
        employeeData={empData}
        saleData={selectedSale}
      />
      <ApproveSample isChecked={isChecked} setIsChecked={setIsChecked} />
    </div>
  );
};

export default SalesTable;
