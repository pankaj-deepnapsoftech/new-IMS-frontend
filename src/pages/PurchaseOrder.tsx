import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddPurchaseOrderDrawer,
  openAddPurchaseOrderDrawer,
} from "../redux/reducers/drawersSlice";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import AddPurchaseOrder from "../components/Drawers/Purchase Order/AddPurchaseOrder";
import PurchaseOrderTable from "../components/Table/PurchaseOrderTable";
import { useCookies } from "react-cookie";
import axios from "axios";

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

const PurchaseOrder: React.FC = () => {
  const [cookies] = useCookies();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchKey, setSearchKey] = useState("");

  const { isAddPurchaseOrderDrawerOpened } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase-order/all`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );
      if (response.data.success) {
        setPurchaseOrders(response.data.purchase_orders || []);
        setFilteredPurchaseOrders(response.data.purchase_orders || []);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [refreshTrigger]);

  // Filter purchase orders based on search key
  useEffect(() => {
    const searchLower = searchKey.toLowerCase();
    const results = purchaseOrders.filter((order: PurchaseOrder) =>
      (
        (order?.poOrder?.toLowerCase() || "").includes(searchLower) ||
        (order?.supplierName?.toLowerCase() || "").includes(searchLower) ||
        (order?.itemName?.toLowerCase() || "").includes(searchLower)
      )
    );
    setFilteredPurchaseOrders(results);
  }, [searchKey, purchaseOrders]);

  // Handle delete purchase order
  const handleDeletePurchaseOrder = (id: string) => {
    setPurchaseOrders((prev) => prev.filter((order) => order._id !== id));
    setFilteredPurchaseOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const openAddPurchaseOrderDrawerHandler = () => {
    dispatch(openAddPurchaseOrderDrawer());
  };

  const closeAddPurchaseOrderDrawerHandler = () => {
    dispatch(closeAddPurchaseOrderDrawer());
    setEditingOrder(null);
  };

  // Handle edit purchase order
  const handleEditPurchaseOrder = (order: PurchaseOrder) => {
    console.log("Edit purchase order clicked:", order);
    setEditingOrder(order);
    dispatch(openAddPurchaseOrderDrawer());
  };

  // Function to refresh table data
  const refreshTableData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Function to handle purchase order creation/update
  const handlePurchaseOrderDataChange = () => {
    refreshTableData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 lg:p-3">
      {isAddPurchaseOrderDrawerOpened && (
        <AddPurchaseOrder
          isOpen={isAddPurchaseOrderDrawerOpened}
          closeDrawerHandler={closeAddPurchaseOrderDrawerHandler}
          edittable={editingOrder}
          fetchPurchaseOrderData={handlePurchaseOrderDataChange}
        />
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Purchase Order
              </h1>
              <p className="text-gray-600 mt-1">Manage purchase orders</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
              onClick={openAddPurchaseOrderDrawerHandler}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Purchase
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
              onClick={refreshTableData}
            >
              <MdOutlineRefresh className="text-base" />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              placeholder="Search by PO Number, Supplier Name, or Item Name..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PurchaseOrderTable
          refreshTrigger={refreshTrigger}
          onEdit={handleEditPurchaseOrder}
          filteredPurchaseOrders={filteredPurchaseOrders}
          onDelete={handleDeletePurchaseOrder} // Pass the onDelete handler
        />
      </div>
    </div>
  );
};

export default PurchaseOrder;