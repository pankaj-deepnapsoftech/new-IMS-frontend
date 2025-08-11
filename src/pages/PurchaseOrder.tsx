import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddPurchaseOrderDrawer,
  openAddPurchaseOrderDrawer,
} from "../redux/reducers/drawersSlice";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
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

interface InventoryShortage {
  bom_name: string;
  item_name: string;
  item: string;
  shortage_quantity: number;
  current_stock: number;
  current_price: number;
  updated_price?: number;
  price_change?: number;
  price_change_percentage?: number;
  updated_at: string;
  priceUpdateTimeout?: NodeJS.Timeout;
  stockUpdateTimeout?: NodeJS.Timeout;
}

interface ProductInventory {
  _id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
}

interface InventoryUpdateForm {
  itemName: string;
  shortageQuantity: number;
  currentStock: number;
  currentPrice: number;
  updatedPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  buyQuantity: number;
  priceDifference: number;
}

// Product Inventory Row Component
const ProductInventoryRow: React.FC<{
  product: ProductInventory;
  onUpdate: (productId: string, newStock: number) => void;
  isUpdating: boolean;
}> = ({ product, onUpdate, isUpdating }) => {
  const [newStock, setNewStock] = useState(product.currentStock);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (newStock !== product.currentStock) {
      onUpdate(product._id, newStock);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewStock(product.currentStock);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.currentStock}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.minStockLevel}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.maxStockLevel}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.unit}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              min="0"
            />
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
          >
            Edit Stock
          </button>
        )}
      </td>
    </tr>
  );
};

const PurchaseOrder: React.FC = () => {
  const [cookies] = useCookies();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchKey, setSearchKey] = useState("");
  
  // New state for inventory management
  const [activeTab, setActiveTab] = useState<'purchase-orders' | 'inventory-shortages' | 'update-inventory'>('purchase-orders');
  const [inventoryShortages, setInventoryShortages] = useState<InventoryShortage[]>([]);
  const [products, setProducts] = useState<ProductInventory[]>([]);
  const [isLoadingShortages, setIsLoadingShortages] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  
  // Modal states
  const [showInventoryShortagesModal, setShowInventoryShortagesModal] = useState(false);
  const [showUpdateInventoryModal, setShowUpdateInventoryModal] = useState(false);
  
  // Update Inventory Form state
  const [updateInventoryForm, setUpdateInventoryForm] = useState<InventoryUpdateForm[]>([]);
  const [isLoadingUpdateForm, setIsLoadingUpdateForm] = useState(false);

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

  // Fetch inventory shortages (raw materials only)
  const fetchInventoryShortages = async () => {
    setIsLoadingShortages(true);
    try {
      // First fetch all products to get raw materials
      const productsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}product/all`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );

      if (!productsResponse.data.success) {
        toast.error("Failed to fetch products");
        return;
      }

      // Filter for raw materials only
      const rawMaterials = productsResponse.data.products.filter((product: any) => 
        product.category && product.category.toLowerCase().includes('raw material')
      );

      console.log("Raw materials found:", rawMaterials.length);

      // Now fetch inventory shortages
      const shortagesResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}bom/inventory-shortages`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );

      if (shortagesResponse.data.success) {
        const allShortages = shortagesResponse.data.shortages || [];
        
        // Filter shortages to only include raw materials
        const rawMaterialShortages = allShortages.filter((shortage: any) => {
          // Check if the shortage item is in our raw materials list
          return rawMaterials.some((rawMaterial: any) => 
            rawMaterial.name.toLowerCase() === shortage.item_name?.toLowerCase() ||
            rawMaterial._id === shortage.item
          );
        });

        console.log("Total shortages:", allShortages.length);
        console.log("Raw material shortages:", rawMaterialShortages.length);
        
        setInventoryShortages(rawMaterialShortages);
      } else {
        toast.error(shortagesResponse.data.message || "Failed to fetch inventory shortages");
      }
    } catch (error: any) {
      console.error("Error fetching inventory shortages:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch inventory shortages");
    } finally {
      setIsLoadingShortages(false);
    }
  };

  // Fetch products for inventory update
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}product/all`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch update inventory form data
  const fetchUpdateInventoryForm = async () => {
    setIsLoadingUpdateForm(true);
    try {
      console.log("Fetching inventory data...");
      console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
      console.log("Token:", cookies?.access_token ? "Present" : "Missing");
      
      // Fetch both inventory shortages and products
      const [shortagesResponse, productsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}bom/inventory-shortages`, {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}product/all`, {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        })
      ]);

      console.log("Shortages response:", shortagesResponse.data);
      console.log("Products response:", productsResponse.data);

      // Check if at least shortages API is working
      if (shortagesResponse.data.success) {
        const shortages = shortagesResponse.data.shortages || [];
        const products = productsResponse.data.success ? (productsResponse.data.products || []) : [];
        
        console.log("Shortages found:", shortages.length);
        console.log("Products found:", products.length);
        
                 // Filter for raw materials only
         const rawMaterials = products.filter((product: any) => 
           product.category && product.category.toLowerCase().includes('raw material')
         );
         
         // Filter shortages to only include raw materials
         const rawMaterialShortages = shortages.filter((shortage: any) => {
           return rawMaterials.some((rawMaterial: any) => 
             rawMaterial.name.toLowerCase() === shortage.item_name?.toLowerCase() ||
             rawMaterial._id === shortage.item
           );
         });
         
         console.log("Total shortages:", shortages.length);
         console.log("Raw material shortages:", rawMaterialShortages.length);
         
                   // Create form data by combining shortages with product info
          const formData = rawMaterialShortages.map((shortage: InventoryShortage) => {
            const product = rawMaterials.find((p: ProductInventory) => 
              p.name.toLowerCase() === shortage.item_name.toLowerCase()
            );
            
            return {
              itemName: shortage.item_name,
              shortageQuantity: shortage.shortage_quantity,
              currentStock: product ? product.currentStock : shortage.current_stock,
              currentPrice: shortage.current_price,
              updatedPrice: shortage.current_price,
              priceChange: 0,
              priceChangePercentage: 0,
              buyQuantity: 0, // User will input this
              priceDifference: 0 // User will input this
            };
          });
        
        console.log("Form data created:", formData);
        setUpdateInventoryForm(formData);
        
        if (!productsResponse.data.success) {
          toast.warning("Products data not available, but shortages data loaded successfully");
        }
      } else {
        console.error("API responses not successful:", {
          shortages: shortagesResponse.data,
          products: productsResponse.data
        });
        toast.error("Failed to fetch inventory data - API response not successful");
      }
    } catch (error: any) {
      console.error("Error fetching inventory data:", error);
      console.error("Error response:", error?.response);
      console.error("Error message:", error?.message);
      
      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 404) {
        toast.error("API endpoints not found. Please check the backend URL.");
      } else if (error?.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Failed to fetch inventory data");
      }
    } finally {
      setIsLoadingUpdateForm(false);
    }
  };

  // Update product inventory
  const updateProductInventory = async (productId: string, newStock: number) => {
    setUpdatingProductId(productId);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}product/update-inventory`,
        {
          productId,
          newStock
        },
        {
          headers: { Authorization: `Bearer ${cookies?.access_token}` },
        }
      );
      if (response.data.success) {
        toast.success("Inventory updated successfully");
        // Refresh all data to sync across components
        await Promise.all([
          fetchInventoryShortages(),
          fetchProducts(),
          fetchUpdateInventoryForm()
        ]);
      } else {
        toast.error(response.data.message || "Failed to update inventory");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update inventory");
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Handle form input changes
  const handleFormInputChange = (index: number, field: keyof InventoryUpdateForm, value: number) => {
    const updatedForm = [...updateInventoryForm];
    updatedForm[index] = { ...updatedForm[index], [field]: value };
    setUpdateInventoryForm(updatedForm);
  };

  // Handle price updates in Update Inventory form (local only - no API call)
  const handleUpdateInventoryPriceChange = (index: number, newPrice: number) => {
    const updatedForm = [...updateInventoryForm];
    const item = updatedForm[index];
    
    updatedForm[index] = {
      ...item,
      updatedPrice: newPrice,
      priceChange: newPrice - item.currentPrice,
      priceChangePercentage: ((newPrice - item.currentPrice) / item.currentPrice) * 100
    };
    setUpdateInventoryForm(updatedForm);
  };

  // Handle stock updates in shortages table with debouncing
  const handleStockUpdate = async (index: number, newStock: number) => {
    const updatedShortages = [...inventoryShortages];
    const item = updatedShortages[index];
    
    // Update UI immediately for better user experience
    updatedShortages[index] = {
      ...item,
      current_stock: newStock
    };
    setInventoryShortages(updatedShortages);

    // Debounce the API call - only update backend after user stops typing for 1 second
    clearTimeout(item.stockUpdateTimeout);
    
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}product/update-stock`,
          {
            productId: item.item,
            newStock: newStock
          },
          {
            headers: { Authorization: `Bearer ${cookies?.access_token}` },
          }
        );
        
        if (response.data.success) {
          toast.success(`Stock updated for ${item.item_name}`);
          // Refresh all data to sync across components
          await Promise.all([
            fetchInventoryShortages(),
            fetchProducts(),
            fetchUpdateInventoryForm()
          ]);
        } else {
          toast.error("Failed to update stock in backend");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to update stock");
      }
    }, 1000); // 1 second delay

    // Store the timeout ID in the item for cleanup
    updatedShortages[index].stockUpdateTimeout = timeoutId;
  };

  // Handle price updates in shortages table with debouncing
  const handlePriceUpdate = async (index: number, newPrice: number) => {
    const updatedShortages = [...inventoryShortages];
    const item = updatedShortages[index];
    
    // Update UI immediately for better user experience
    updatedShortages[index] = {
      ...item,
      updated_price: newPrice,
      price_change: newPrice - item.current_price,
      price_change_percentage: ((newPrice - item.current_price) / item.current_price) * 100
    };
    setInventoryShortages(updatedShortages);

    // Debounce the API call - only update backend after user stops typing for 1 second
    clearTimeout(item.priceUpdateTimeout);
    
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}product/update-price`,
          {
            productId: item.item,
            newPrice: newPrice
          },
          {
            headers: { Authorization: `Bearer ${cookies?.access_token}` },
          }
        );
        
        if (response.data.success) {
          toast.success(`Price updated for ${item.item_name}`);
          // Refresh all data to sync across components
          await Promise.all([
            fetchInventoryShortages(),
            fetchProducts(),
            fetchUpdateInventoryForm()
          ]);
        } else {
          toast.error("Failed to update price in backend");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to update price");
      }
    }, 1000); // 1 second delay

    // Store the timeout ID in the item for cleanup
    updatedShortages[index].priceUpdateTimeout = timeoutId;
  };

  // Submit update inventory form
  const submitUpdateInventoryForm = async () => {
    try {
      // Here you would typically send the form data to your backend
      console.log("Submitting form data:", updateInventoryForm);
      toast.success("Inventory update form submitted successfully");
      setShowUpdateInventoryModal(false);
    } catch (error: any) {
      toast.error("Failed to submit inventory update form");
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [refreshTrigger]);

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Clear all pending timeouts
      inventoryShortages.forEach(item => {
        if (item.priceUpdateTimeout) {
          clearTimeout(item.priceUpdateTimeout);
        }
        if (item.stockUpdateTimeout) {
          clearTimeout(item.stockUpdateTimeout);
        }
      });
    };
  }, [inventoryShortages]);

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
                Purchase Order & Inventory Management
              </h1>
              <p className="text-gray-600 mt-1">Manage purchase orders and inventory</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {activeTab === 'purchase-orders' && (
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
            )}
            
                         {/* Raw Material Shortages Button */}
             <button
               className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
               onClick={() => {
                 setShowInventoryShortagesModal(true);
                 fetchInventoryShortages();
               }}
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
                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                 />
               </svg>
               Raw Material Shortages
             </button>
            
            {/* Update Inventory Button */}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
              onClick={() => {
                setShowUpdateInventoryModal(true);
                // Add a small delay to ensure modal is open before fetching
                setTimeout(() => {
                  fetchUpdateInventoryForm();
                }, 100);
              }}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Update Inventory
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

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PurchaseOrderTable
          refreshTrigger={refreshTrigger}
          onEdit={handleEditPurchaseOrder}
          filteredPurchaseOrders={filteredPurchaseOrders}
          onDelete={handleDeletePurchaseOrder}
        />
      </div>

      {/* Inventory Shortages Modal */}
      {showInventoryShortagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                         <div className="flex justify-between items-center p-6 border-b border-gray-200">
               <h2 className="text-2xl font-bold text-gray-900">Raw Material Stock Shortages</h2>
              <div className="flex items-center gap-3">
                                 <button
                   onClick={fetchInventoryShortages}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                   disabled={isLoadingShortages}
                 >
                   <MdOutlineRefresh className={`text-base ${isLoadingShortages ? 'animate-spin' : ''}`} />
                   Refresh
                 </button>
                 <button
                   onClick={async () => {
                     await Promise.all([
                       fetchInventoryShortages(),
                       fetchProducts(),
                       fetchUpdateInventoryForm()
                     ]);
                     toast.success("All data synchronized successfully!");
                   }}
                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   Sync All
                 </button>
                <button
                  onClick={() => setShowInventoryShortagesModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoadingShortages ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                             ) : inventoryShortages.length === 0 ? (
                 <div className="text-center py-8 text-gray-500">
                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                   <h3 className="mt-2 text-sm font-medium text-gray-900">No raw material shortages found</h3>
                   <p className="mt-1 text-sm text-gray-500">All raw material inventory levels are sufficient.</p>
                 </div>
                             ) : (
                 <div className="space-y-4">
                   {/* Price Impact Summary */}
                                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Price Impact Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Total Items:</span>
                          <span className="ml-2 text-blue-900">{inventoryShortages.length}</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Price Changes:</span>
                          <span className="ml-2 text-blue-900">
                            {inventoryShortages.filter(item => item.updated_price && item.updated_price !== item.current_price).length}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Total Impact:</span>
                          <span className={`ml-2 font-semibold ${
                            inventoryShortages.reduce((total, item) => {
                              const change = item.price_change || 0;
                              return total + (change * item.shortage_quantity);
                            }, 0) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₹{inventoryShortages.reduce((total, item) => {
                              const change = item.price_change || 0;
                              return total + (change * item.shortage_quantity);
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <p className="text-blue-700 text-xs mt-3">
                        💡 <strong>Tip:</strong> Price and stock updates are automatically saved 1 second after you stop typing. 
                        Look for the yellow indicator dot when updates are pending.
                      </p>
                    </div>
                   
                   <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                                         <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOM Name</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortage Quantity</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated Price</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {inventoryShortages.map((item, idx) => (
                         <tr key={idx} className="hover:bg-gray-50">
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bom_name || "-"}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item_name || "-"}</td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.current_stock}
                                  onChange={(e) => handleStockUpdate(idx, Number(e.target.value))}
                                  className={`w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    item.current_stock < 0 ? "text-red-600 font-semibold" : "text-gray-900"
                                  } ${
                                    item.stockUpdateTimeout ? 'border-yellow-400 bg-yellow-50' : ''
                                  }`}
                                  min="-999999"
                                  step="1"
                                />
                                {item.stockUpdateTimeout && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{item.shortage_quantity}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.current_price}</td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.updated_price || item.current_price}
                                  onChange={(e) => handlePriceUpdate(idx, Number(e.target.value))}
                                  className={`w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    item.priceUpdateTimeout ? 'border-yellow-400 bg-yellow-50' : ''
                                  }`}
                                  placeholder={item.current_price.toString()}
                                  min="0"
                                  step="0.01"
                                />
                                {item.priceUpdateTimeout && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm">
                             {item.updated_price && item.updated_price !== item.current_price ? (
                               <div className="flex flex-col">
                                 <span className={`font-semibold ${item.updated_price > item.current_price ? 'text-red-600' : 'text-green-600'}`}>
                                   ₹{Math.abs(item.updated_price - item.current_price).toFixed(2)}
                                 </span>
                                 <span className={`text-xs ${item.updated_price > item.current_price ? 'text-red-500' : 'text-green-500'}`}>
                                   {((item.updated_price - item.current_price) / item.current_price * 100).toFixed(1)}%
                                 </span>
                               </div>
                             ) : (
                               <span className="text-gray-400">-</span>
                             )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {new Date(item.updated_at).toLocaleDateString()}
                           </td>
                         </tr>
                       ))}
                                          </tbody>
                   </table>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Update Inventory Modal */}
      {showUpdateInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Update Inventory - Purchase Form</h2>
              <div className="flex items-center gap-3">
                                 <button
                   onClick={fetchUpdateInventoryForm}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                   disabled={isLoadingUpdateForm}
                 >
                   <MdOutlineRefresh className={`text-base ${isLoadingUpdateForm ? 'animate-spin' : ''}`} />
                   Refresh
                 </button>
                 <button
                   onClick={async () => {
                     await Promise.all([
                       fetchInventoryShortages(),
                       fetchProducts(),
                       fetchUpdateInventoryForm()
                     ]);
                     toast.success("All data synchronized successfully!");
                   }}
                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   Sync All
                 </button>
                <button
                  onClick={() => setShowUpdateInventoryModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoadingUpdateForm ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : updateInventoryForm.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory shortages found</h3>
                  <p className="mt-1 text-sm text-gray-500">All inventory levels are sufficient.</p>
                  <div className="mt-4">
                    <button
                      onClick={fetchUpdateInventoryForm}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                                 <div className="space-y-6">
                   {/* Price Impact Summary */}
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <h3 className="text-lg font-semibold text-blue-900 mb-2">Price Impact Summary</h3>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                       <div>
                         <span className="text-blue-700 font-medium">Total Items:</span>
                         <span className="ml-2 text-blue-900">{updateInventoryForm.length}</span>
                       </div>
                       <div>
                         <span className="text-blue-700 font-medium">Price Changes:</span>
                         <span className="ml-2 text-blue-900">
                           {updateInventoryForm.filter(item => item.updatedPrice && item.updatedPrice !== item.currentPrice).length}
                         </span>
                       </div>
                       <div>
                         <span className="text-blue-700 font-medium">Total Impact:</span>
                         <span className={`ml-2 font-semibold ${
                           updateInventoryForm.reduce((total, item) => {
                             const change = item.priceChange || 0;
                             return total + (change * item.shortageQuantity);
                           }, 0) > 0 ? 'text-red-600' : 'text-green-600'
                         }`}>
                           ₹{updateInventoryForm.reduce((total, item) => {
                             const change = item.priceChange || 0;
                             return total + (change * item.shortageQuantity);
                           }, 0).toFixed(2)}
                         </span>
                       </div>
                       <div>
                         <span className="text-blue-700 font-medium">Total Buy Value:</span>
                         <span className="ml-2 font-semibold text-blue-900">
                           ₹{updateInventoryForm.reduce((total, item) => {
                             return total + (item.buyQuantity * item.updatedPrice);
                           }, 0).toFixed(2)}
                         </span>
                       </div>
                     </div>
                   </div>

                                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
                      <p className="text-blue-800 text-sm">
                        Update prices, fill in Buy Quantity and Price Difference for items with shortages. 
                        This form will help you plan your inventory purchases.
                      </p>
                      <p className="text-blue-700 text-xs mt-2">
                        💡 <strong>Tip:</strong> Price and stock updates are automatically saved 1 second after you stop typing. 
                        Look for the yellow indicator dot when updates are pending.
                      </p>
                    </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                                             <thead className="bg-gray-50">
                         <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortage Quantity</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated Price</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Quantity</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Difference</th>
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                                                 {updateInventoryForm.map((item, index) => (
                           <tr key={index} className="hover:bg-gray-50">
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                               {item.itemName}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                               {item.shortageQuantity}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               {item.currentStock}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               ₹{item.currentPrice}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <input
                                 type="number"
                                 value={item.updatedPrice}
                                 onChange={(e) => handleUpdateInventoryPriceChange(index, Number(e.target.value))}
                                 className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder={item.currentPrice.toString()}
                                 min="0"
                                 step="0.01"
                               />
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">
                               {item.updatedPrice && item.updatedPrice !== item.currentPrice ? (
                                 <div className="flex flex-col">
                                   <span className={`font-semibold ${item.updatedPrice > item.currentPrice ? 'text-red-600' : 'text-green-600'}`}>
                                     ₹{Math.abs(item.priceChange).toFixed(2)}
                                   </span>
                                   <span className={`text-xs ${item.updatedPrice > item.currentPrice ? 'text-red-500' : 'text-green-500'}`}>
                                     {item.priceChangePercentage.toFixed(1)}%
                                   </span>
                                 </div>
                               ) : (
                                 <span className="text-gray-400">-</span>
                               )}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <input
                                 type="number"
                                 value={item.buyQuantity}
                                 onChange={(e) => handleFormInputChange(index, 'buyQuantity', Number(e.target.value))}
                                 className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="0"
                                 min="0"
                               />
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <input
                                 type="number"
                                 value={item.priceDifference}
                                 onChange={(e) => handleFormInputChange(index, 'priceDifference', Number(e.target.value))}
                                 className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="0.00"
                                 min="0"
                                 step="0.01"
                               />
                             </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowUpdateInventoryModal(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitUpdateInventoryForm}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Submit Purchase Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrder;