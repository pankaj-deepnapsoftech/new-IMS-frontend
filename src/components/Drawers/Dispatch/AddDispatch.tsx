// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BiX } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import { DispatchFormSchema } from "../../../Validation/DispatchFormValidation";
import { colors } from "../../../theme/colors";

interface AddDispatchProps {
  show: boolean;
  setShow: (show: boolean) => void;
  fetchDispatch?: () => void;
}

const AddDispatch: React.FC<AddDispatchProps> = ({
  show,
  setShow,
  fetchDispatch,
  editDispatch,
}) => {
  const [cookies] = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingSalesOrders, setIsLoadingSalesOrders] = useState(false);
  const [productStocks, setProductStocks] = useState({});
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);
  // const [stockError, setStockError] = useState(""); // Commented out - reverting to toast warnings

  const fetchSalesOrders = async () => {
    try {
      setIsLoadingSalesOrders(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}sale/getAll?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const completedOrders =
        response?.data?.data?.filter((order) =>
          order?.assinedto?.every(
            (item) => item?.isCompleted?.toLowerCase() === "completed"
          )
        ) || [];

      setSalesOrders(completedOrders);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      toast.error("Failed to fetch sales orders");
    } finally {
      setIsLoadingSalesOrders(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: editDispatch || {
      sales_order_id: "",
      tracking_id: "",
      tracking_web: "",
      dispatch_date: new Date().toISOString().split("T")[0],
      courier_service: "",
      remarks: "",
      dispatch_qty: "",
    },
    validationSchema: DispatchFormSchema,
    // -----
    enableReinitialize: true,
    // -----
    onSubmit: async (values) => {
      if (isSubmitting) return;

      const dispatchQty = parseInt(values.dispatch_qty) || 0;
      const firstProductId =
        selectedOrder?.product_id?.[0]?._id ||
        selectedOrder?.product_id?.[0]?.product_id;
      const availableStock =
        productStocks[firstProductId]?.current_stock ||
        productStocks[firstProductId]?.stock ||
        productStocks[firstProductId]?.product?.current_stock ||
        productStocks[firstProductId]?.quantity_changed ||
        0;

      if (dispatchQty > availableStock) {
        toast.error(
          `Dispatch quantity (${dispatchQty}) cannot exceed available stock (${availableStock} units)`
        );
        return;
      }

      if (dispatchQty <= 0) {
        toast.error("Please enter a valid dispatch quantity");
        return;
      }

      setIsSubmitting(true);

      try {
        const payload = {
          ...values,
          merchant_name:
            selectedOrder?.party?.consignee_name?.[0] ||
            selectedOrder?.party?.company_name,
          item_name: selectedOrder?.product_id?.[0]?.name,
          quantity: selectedOrder?.product_qty,
          total_amount: selectedOrder?.total_price,
          order_id: selectedOrder?.order_id,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}dispatch/create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cookies?.access_token}`,
            },
          }
        );

        toast.success("Dispatch created successfully");
        resetForm();
        setSelectedOrder(null);
        setShow(false);

        if (fetchDispatch) {
          fetchDispatch();
        }
      } catch (error) {
        console.error("Error creating dispatch:", error);
        toast.error(
          error?.response?.data?.message || "Failed to create dispatch"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchProductStocks = async (productIds) => {
    try {
      setIsLoadingStocks(true);
      const stockPromises = productIds.map(async (productId) => {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies?.access_token}`,
            },
          }
        );

        console.log("Product API Response:", response.data);

        return {
          id: productId,
          data: response.data.data || response.data,
        };
      });

      const stockResults = await Promise.all(stockPromises);
      const stockMap = {};
      stockResults.forEach((result) => {
        stockMap[result.id] = result.data;
      });

      console.log("Final Stock Map:", stockMap);
      setProductStocks(stockMap);
    } catch (error) {
      console.error("Error fetching product stocks:", error);
      toast.error("Failed to fetch product stock information");
    } finally {
      setIsLoadingStocks(false);
    }
  };

  const handleOrderSelection = (orderId) => {
    const order = salesOrders.find((o) => o._id === orderId);
    setSelectedOrder(order);
    setFieldValue("sales_order_id", orderId);
    // setStockError(""); // Commented out - reverting to toast warnings

    if (order?.product_id && order.product_id.length > 0) {
      const productIds = order.product_id.map(
        (product) => product._id || product.product_id
      );
      fetchProductStocks(productIds);
    }
  };

  useEffect(() => {
    if (show) {
      fetchSalesOrders();
      // setStockError(""); // Commented out - reverting to toast warnings
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[50vw] md:w-[40vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <TbTruckDelivery className="text-white" size={20} />
              </div>
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Add New Dispatch
              </h2>
            </div>
            <button
              onClick={() => setShow(false)}
              className="p-2 rounded-lg border transition-colors"
              style={{ borderColor: colors.border.medium }}
            >
              <BiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Sales Order *
                </label>
                <select
                  name="sales_order_id"
                  value={values.sales_order_id}
                  onChange={(e) => handleOrderSelection(e.target.value)}
                  onBlur={handleBlur}
                  disabled={isLoadingSalesOrders}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor:
                      errors.sales_order_id && touched.sales_order_id
                        ? colors.error[500]
                        : colors.input.border,
                    color: colors.text.primary,
                  }}
                >
                  <option value="">
                    {isLoadingSalesOrders ? "Loading..." : "Select Sales Order"}
                  </option>
                  {salesOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.order_id} -{" "}
                      {order?.party?.consignee_name?.[0] ||
                        order?.party?.company_name}
                    </option>
                  ))}
                </select>
                {errors.sales_order_id && touched.sales_order_id && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.error[500] }}
                  >
                    {errors.sales_order_id}
                  </p>
                )}
              </div>

              {selectedOrder && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium text-gray-900">Order Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Merchant Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder?.party?.consignee_name?.[0] ||
                          selectedOrder?.party?.company_name ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Product
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder?.product_id?.[0]?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Quantity
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder?.product_qty || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Total Amount
                      </label>
                      <p className="text-sm text-gray-900">
                        ₹
                        {selectedOrder?.total_price ||
                          selectedOrder?.price ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Tracking ID
                </label>
                <input
                  type="text"
                  name="tracking_id"
                  value={values.tracking_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter tracking ID"
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor:
                      errors.tracking_id && touched.tracking_id
                        ? colors.error[500]
                        : colors.input.border,
                    color: colors.text.primary,
                  }}
                />
                {errors.tracking_id && touched.tracking_id && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.error[500] }}
                  >
                    {errors.tracking_id}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Tracking Website
                </label>
                <input
                  type="url"
                  name="tracking_web"
                  value={values.tracking_web}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://tracking-website.com"
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor:
                      errors.tracking_web && touched.tracking_web
                        ? colors.error[500]
                        : colors.input.border,
                    color: colors.text.primary,
                  }}
                />
                {errors.tracking_web && touched.tracking_web && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.error[500] }}
                  >
                    {errors.tracking_web}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Dispatch Quantity *
                </label>

                {selectedOrder && selectedOrder?.product_id && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Available Stock:
                    </h4>
                    {isLoadingStocks ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-blue-600 text-sm">
                          Loading stock information...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {selectedOrder.product_id.map((product, index) => {
                          const productId = product._id || product.product_id;
                          const stockData = productStocks[productId];

                          // Try multiple possible locations for current stock
                          const currentStock =
                            stockData?.current_stock ||
                            stockData?.stock ||
                            stockData?.product?.current_stock ||
                            stockData?.quantity_changed ||
                            0;

                          console.log("Stock Debug:", {
                            productId,
                            stockData,
                            currentStock,
                            rawCurrentStock: stockData?.current_stock,
                            productStocks,
                          });

                          return (
                            <div
                              key={productId || index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-blue-700 font-medium">
                                {product.name ||
                                  stockData?.name ||
                                  stockData?.product_name ||
                                  "N/A"}
                                :
                              </span>
                              <span className="text-blue-900 font-semibold">
                                {currentStock} units available
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <input
                  type="number"
                  name="dispatch_qty"
                  value={values.dispatch_qty}
                  onChange={(e) => {
                    // Commented out form validation approach - reverting to toast warnings
                    // const value = parseInt(e.target.value) || 0;
                    // const firstProductId =
                    //   selectedOrder?.product_id?.[0]?._id ||
                    //   selectedOrder?.product_id?.[0]?.product_id;
                    // const maxStock =
                    //   productStocks[firstProductId]?.current_stock ||
                    //   productStocks[firstProductId]?.stock ||
                    //   productStocks[firstProductId]?.product?.current_stock ||
                    //   productStocks[firstProductId]?.quantity_changed ||
                    //   0;

                    // if (value > maxStock) {
                    //   setStockError(
                    //     `Dispatch quantity cannot exceed available stock (${maxStock} units)`
                    //   );
                    // } else {
                    //   setStockError("");
                    // }

                    // Original toast warning approach
                    const value = parseInt(e.target.value) || 0;
                    const firstProductId =
                      selectedOrder?.product_id?.[0]?._id ||
                      selectedOrder?.product_id?.[0]?.product_id;
                    const maxStock =
                      productStocks[firstProductId]?.current_stock ||
                      productStocks[firstProductId]?.stock ||
                      productStocks[firstProductId]?.product?.current_stock ||
                      productStocks[firstProductId]?.quantity_changed ||
                      0;

                    if (value > maxStock) {
                      toast.warning(
                        `Dispatch quantity cannot exceed available stock (${maxStock} units)`
                      );
                    }

                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter Dispatch Quantity"
                  min="1"
                  max={(() => {
                    const firstProductId =
                      selectedOrder?.product_id?.[0]?._id ||
                      selectedOrder?.product_id?.[0]?.product_id;
                    return (
                      productStocks[firstProductId]?.current_stock ||
                      productStocks[firstProductId]?.stock ||
                      productStocks[firstProductId]?.product?.current_stock ||
                      productStocks[firstProductId]?.quantity_changed ||
                      999999
                    );
                  })()}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor:
                      errors.dispatch_qty && touched.dispatch_qty
                        ? colors.error[500]
                        : colors.input.border,
                    color: colors.text.primary,
                  }}
                />

                {selectedOrder && values.dispatch_qty && (
                  <div className="mt-1">
                    {(() => {
                      const firstProductId =
                        selectedOrder?.product_id?.[0]?._id ||
                        selectedOrder?.product_id?.[0]?.product_id;
                      const availableStock =
                        productStocks[firstProductId]?.current_stock ||
                        productStocks[firstProductId]?.stock ||
                        productStocks[firstProductId]?.product?.current_stock ||
                        productStocks[firstProductId]?.quantity_changed ||
                        0;
                      const dispatchQty = parseInt(values.dispatch_qty);

                      if (dispatchQty > 0 && dispatchQty <= availableStock) {
                        return (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            Valid quantity - {availableStock - dispatchQty}{" "}
                            units will remain in stock
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {/* Commented out Stock Error Message - reverting to toast warnings */}
                {/* {stockError && (
                  <p
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: colors.error[500] }}
                  >
                    <span>⚠️</span>
                    {stockError}
                  </p>
                )} */}

                {errors.dispatch_qty && touched.dispatch_qty && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.error[500] }}
                  >
                    {errors.dispatch_qty}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Dispatch Date
                </label>
                <input
                  type="date"
                  name="dispatch_date"
                  value={values.dispatch_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={values.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="Additional notes or remarks"
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </form>
          </div>

          <div className="border-t p-6 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="px-4 py-2 border rounded-lg font-medium transition-colors"
                style={{
                  borderColor: colors.border.medium,
                  color: colors.text.secondary,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !selectedOrder ||
                  !values.dispatch_qty ||
                  // stockError || // Commented out - reverting to toast warnings
                  (() => {
                    const firstProductId =
                      selectedOrder?.product_id?.[0]?._id ||
                      selectedOrder?.product_id?.[0]?.product_id;
                    const availableStock =
                      productStocks[firstProductId]?.current_stock ||
                      productStocks[firstProductId]?.stock ||
                      productStocks[firstProductId]?.product?.current_stock ||
                      productStocks[firstProductId]?.quantity_changed ||
                      0;
                    return (
                      parseInt(values.dispatch_qty) > availableStock ||
                      parseInt(values.dispatch_qty) <= 0
                    );
                  })()
                }
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-100 "
                style={{
                  backgroundColor:
                    isSubmitting ||
                    !selectedOrder ||
                    !values.dispatch_qty ||
                    // stockError || // Commented out - reverting to toast warnings
                    (() => {
                      const firstProductId =
                        selectedOrder?.product_id?.[0]?._id ||
                        selectedOrder?.product_id?.[0]?.product_id;
                      const availableStock =
                        productStocks[firstProductId]?.current_stock ||
                        productStocks[firstProductId]?.stock ||
                        productStocks[firstProductId]?.product?.current_stock ||
                        productStocks[firstProductId]?.quantity_changed ||
                        0;
                      return (
                        parseInt(values.dispatch_qty) > availableStock ||
                        parseInt(values.dispatch_qty) <= 0
                      );
                    })()
                      ? colors.gray[400]
                      : colors.button.primary,
                }}
              >
                {isSubmitting ? "Creating..." : "Create Dispatch"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDispatch;
