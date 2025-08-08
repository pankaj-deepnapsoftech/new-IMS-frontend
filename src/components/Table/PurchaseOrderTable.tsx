import React, { useState, useEffect } from "react";
import {
  MdDeleteOutline,
  MdEdit,
  MdOutlineVisibility,
  MdPictureAsPdf,
} from "react-icons/md";
import { colors } from "../../theme/colors";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PurchaseOrderPDF from "../PDF/PurchaseOrderPDF";

interface PurchaseOrder {
  _id: string;
  poOrder: string;
  date: string;
  itemName: string;
  supplierName: string;
  supplierEmail: string;
  supplierShippedGSTIN: string;
  supplierBillGSTIN: string;
  supplierShippedTo: string;
  supplierBillTo: string;
  modeOfPayment: string;
  GSTApply: string;
  billingAddress: string;
  additionalImportant?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PurchaseOrderTableProps {
  refreshTrigger?: number;
  onEdit?: (order: PurchaseOrder) => void;
  filteredPurchaseOrders: PurchaseOrder[];
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  refreshTrigger,
  onEdit,
  filteredPurchaseOrders,
  onDelete,
  onRefresh,
}) => {
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Auto-refresh setup
  useEffect(() => {
    setLoading(false);
    const intervalId = setInterval(() => {
      if (onRefresh) {
        onRefresh();
        console.log(
          "Auto-refresh triggered at",
          new Date().toLocaleTimeString()
        );
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [onRefresh]);

  // Handle delete purchase order
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this purchase order?"
    );
    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}purchase-order/${id}`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );

      if (response.data.success) {
        toast.success("Purchase order deleted successfully!");
        if (onDelete) {
          onDelete(id);
        }
      } else {
        throw new Error(
          response.data.message || "Failed to delete purchase order"
        );
      }
    } catch (error: any) {
      console.error("Error deleting purchase order:", error);
      toast.error(error.message || "Failed to delete purchase order");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle view purchase order
  const handleView = (order: PurchaseOrder) => {
    setViewOrder(order);
    setIsViewModalOpen(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewOrder(null);
  };

  // Handle PDF download - Removed as we'll use PDFDownloadLink component instead

  // Sort purchase orders by createdAt in descending order
  const sortedPurchaseOrders = [...filteredPurchaseOrders].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="p-6">
      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              {filteredPurchaseOrders.length} Purchase Order
              {filteredPurchaseOrders.length !== 1 ? "s" : ""} Found
            </h3>
          </div>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ color: colors.text.secondary }}
          >
            Show:
          </span>
          <select
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.input.background,
              borderColor: colors.border.light,
              color: colors.text.primary,
            }}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size === 100 ? "All" : size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg"
            style={{ border: `1px solid ${colors.border.light}` }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Purchase Order Details
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  P.O. Number
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.poOrder || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Order Date
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.date
                    ? new Date(viewOrder.date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Item Name
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.itemName || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Supplier Name
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierName || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Supplier Email
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierEmail || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Shipped GSTIN
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierShippedGSTIN || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Bill GSTIN
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierBillGSTIN || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Shipped To
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierShippedTo || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Bill To
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.supplierBillTo || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Mode of Payment
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.modeOfPayment || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  GST Apply
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.GSTApply || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Billing Address
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.billingAddress || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Additional Information
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.additionalImportant || "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Created At
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.createdAt
                    ? new Date(viewOrder.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  Updated At
                </label>
                <p
                  className="mt-1 text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {viewOrder.updatedAt
                    ? new Date(viewOrder.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: colors.primary[50],
                  color: colors.primary[600],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[100];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[50];
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl shadow-sm overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.table.header }}>
              <tr style={{ borderBottom: `1px solid ${colors.table.border}` }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  P.O. Number
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Order Date
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Item Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Supplier Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Supplier Email
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Shipped GSTIN
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Bill GSTIN
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Shipped To
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Bill To
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Mode of Payment
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  GST Apply
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Billing Address
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedPurchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center">
                    <span style={{ color: colors.text.secondary }}>
                      No purchase orders found
                    </span>
                  </td>
                </tr>
              ) : (
                sortedPurchaseOrders
                  .slice(0, limit)
                  .map((order: PurchaseOrder, index: number) => (
                    <tr
                      key={order._id || index}
                      className="transition-colors hover:shadow-sm"
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? colors.background.card
                            : colors.table.stripe,
                        borderBottom: `1px solid ${colors.table.border}`,
                        opacity: deletingId === order._id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== order._id) {
                          e.currentTarget.style.backgroundColor =
                            colors.table.hover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== order._id) {
                          e.currentTarget.style.backgroundColor =
                            index % 2 === 0
                              ? colors.background.card
                              : colors.table.stripe;
                        }
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm whitespace-nowrap"
                        style={{ color: colors.text.secondary }}
                      >
                        {order.poOrder || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm whitespace-nowrap"
                        style={{ color: colors.text.secondary }}
                      >
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-medium whitespace-nowrap truncate max-w-xs"
                        style={{ color: colors.text.primary }}
                        title={order.itemName || "N/A"}
                      >
                        {order.itemName || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-medium whitespace-nowrap truncate max-w-xs"
                        style={{ color: colors.text.primary }}
                        title={order.supplierName || "N/A"}
                      >
                        {order.supplierName || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm whitespace-nowrap truncate max-w-xs"
                        style={{ color: colors.text.secondary }}
                        title={order.supplierEmail || "N/A"}
                      >
                        {order.supplierEmail || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm whitespace-nowrap truncate max-w-xs"
                        style={{ color: colors.text.secondary }}
                        title={order.supplierShippedGSTIN || "N/A"}
                      >
                        {order.supplierShippedGSTIN || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm whitespace-nowrap truncate max-w-xs"
                        style={{ color: colors.text.secondary }}
                        title={order.supplierBillGSTIN || "N/A"}
                      >
                        {order.supplierBillGSTIN || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                        style={{ color: colors.text.secondary }}
                        title={order.supplierShippedTo || "N/A"}
                      >
                        {order.supplierShippedTo || "N/A"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                        style={{ color: colors.text.secondary }}
                        title={order.supplierBillTo || "N/A"}
                      >
                        {order.supplierBillTo || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: colors.primary[100],
                            color: colors.primary[700],
                          }}
                        >
                          {order.modeOfPayment || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: colors.success[100],
                            color: colors.success[700],
                          }}
                        >
                          {order.GSTApply || "N/A"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                        style={{ color: colors.text.secondary }}
                        title={order.billingAddress || "N/A"}
                      >
                        {order.billingAddress || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(order)}
                            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                            style={{
                              color: colors.primary[600],
                              backgroundColor: colors.primary[50],
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.primary[100];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.primary[50];
                            }}
                            title="View purchase order"
                            disabled={deletingId === order._id}
                          >
                            <MdOutlineVisibility size={16} />
                          </button>
                          <button
                            onClick={() => {
                              console.log("Edit order:", order._id);
                              if (onEdit) {
                                onEdit(order);
                              }
                            }}
                            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                            style={{
                              color: colors.primary[600],
                              backgroundColor: colors.primary[50],
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.primary[100];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.primary[50];
                            }}
                            title="Edit purchase order"
                            disabled={deletingId === order._id}
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                            style={{
                              color: colors.error[600],
                              backgroundColor: colors.error[50],
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.error[100];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.error[50];
                            }}
                            title="Delete purchase order"
                            disabled={deletingId === order._id}
                          >
                            {deletingId === order._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            ) : (
                              <MdDeleteOutline size={16} />
                            )}
                          </button>
                          <PDFDownloadLink
                            document={
                              <PurchaseOrderPDF purchaseOrder={order} />
                            }
                            fileName={`purchase_order_${
                              order.poOrder || order._id
                            }.pdf`}
                            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md inline-flex items-center"
                            style={{
                              color: colors.success[600],
                              backgroundColor: colors.success[50],
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.success[100];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.success[50];
                            }}
                          >
                            {({ loading }) =>
                              loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                              ) : (
                                <MdPictureAsPdf size={16} />
                              )
                            }
                          </PDFDownloadLink>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderTable;
