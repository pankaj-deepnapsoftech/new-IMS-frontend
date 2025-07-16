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
    <div className="space-y-6 bg-[#f9fafb]">
      {filteredPurchases?.map((purchase: any, index: number) => (
        <div
          key={purchase?._id}
          className="rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg"
          style={{
            backgroundColor: colors.background?.card || colors.cardBackground,
            borderLeftColor: colors.success?.[500] || colors.success,
            boxShadow: colors.shadow?.sm || "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        color: colors.text?.primary || colors.textPrimary,
                      }}
                    >
                      Sale #{purchase?._id?.slice(-8) || "N/A"}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: colors.text?.secondary || colors.textSecondary,
                      }}
                    >
                      Created by:{" "}
                      <span
                        className="font-medium"
                        style={{
                          color: colors.primary?.[600] || colors.primary,
                        }}
                      >
                        {purchase?.user_id?.[0]?.first_name || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm"
                      style={{
                        color: colors.text?.secondary || colors.textSecondary,
                      }}
                    >
                      Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                    </p>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-1"
                      style={{
                        backgroundColor:
                          purchase?.Status === "Approved"
                            ? colors.success?.[100] || colors.success + "20"
                            : colors.warning?.[100] || colors.warning + "20",
                        color:
                          purchase?.Status === "Approved"
                            ? colors.success?.[700] || colors.success
                            : colors.warning?.[700] || colors.warning,
                      }}
                    >
                      {purchase?.Status || "Pending"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        Party:
                      </span>
                      <span
                        style={{
                          color: colors.text?.secondary || colors.textSecondary,
                        }}
                      >
                        {purchase?.party_id?.[0]?.full_name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        Product:
                      </span>
                      <span
                        style={{
                          color: colors.text?.secondary || colors.textSecondary,
                        }}
                      >
                        {purchase?.product_id?.[0]?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        Unit Price:
                      </span>
                      <span
                        style={{
                          color: colors.text?.secondary || colors.textSecondary,
                        }}
                      >
                        ₹{purchase?.price || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        Quantity:
                      </span>
                      <span
                        style={{
                          color: colors.text?.secondary || colors.textSecondary,
                        }}
                      >
                        {purchase?.product_qty || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className="font-medium"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        GST:
                      </span>
                      <span
                        style={{
                          color: colors.text?.secondary || colors.textSecondary,
                        }}
                      >
                        {purchase?.GST || "0"}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className="font-medium text-lg"
                        style={{
                          color: colors.text?.primary || colors.textPrimary,
                        }}
                      >
                        Total:
                      </span>
                      <span
                        className="font-bold text-lg"
                        style={{
                          color: colors.success?.[600] || colors.success,
                        }}
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
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex gap-3 justify-end pt-4 border-t"
              style={{ borderColor: colors.border?.light || colors.border }}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.border?.medium || colors.border,
                  color: colors.text?.secondary || colors.textSecondary,
                  backgroundColor:
                    colors.background?.card || colors.cardBackground,
                }}
                onClick={() => sendDataToParent(purchase)}
              >
                Edit Sale
              </button>

              {purchase?.boms &&
                purchase?.boms[0]?.production_processes?.every((processGroup) =>
                  processGroup?.processes?.every(
                    (process) => process?.done === true
                  )
                ) && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: colors.success?.[500] || colors.success,
                      color: colors.success?.[600] || colors.success,
                      backgroundColor:
                        colors.success?.[50] || colors.success + "20",
                    }}
                    onClick={() => setIsChecked(!isChecked)}
                  >
                    Approve Sample
                  </button>
                )}

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  borderColor: colors.primary?.[500] || colors.primary,
                  color: colors.primary?.[600] || colors.primary,
                  backgroundColor:
                    colors.primary?.[50] || colors.primary + "20",
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
