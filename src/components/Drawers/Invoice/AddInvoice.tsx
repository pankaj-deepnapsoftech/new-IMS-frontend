import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useCreateInvoiceMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";
import { colors } from "../../../theme/colors";

interface AddInvoiceProps {
  closeDrawerHandler: () => void;
  fetchInvoicesHandler: () => void;
}

const AddInvoice: React.FC<AddInvoiceProps> = ({
  closeDrawerHandler,
  fetchInvoicesHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<
    { value: string; label: string } | undefined
  >();
  const [supplier, setSupplier] = useState<
    { value: string; label: string } | undefined
  >();
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [allItems, setAllItems] = useState<any[] | []>([]);
  const [itemOptions, setItemOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [buyers, setBuyers] = useState<any[] | []>([]);
  const [buyerOptions, setBuyerOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [suppliers, setSuppliers] = useState<any[] | []>([]);
  const [supplierOptions, setSupplierOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [store, setStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [tax, setTax] = useState<
    { value: number; label: string } | undefined
  >();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];
  const [category, setCategory] = useState<
    { value: string; label: string } | undefined
  >();
  const categoryOptions = [
    { value: "sale", label: "Sales" },
    { value: "purchase", label: "Purchase" },
  ];

  const [inputs, setInputs] = useState<
    {
      item: { value: string; label: string };
      quantity: number;
      price: number;
    }[]
  >([{ item: { value: "", label: "" }, quantity: 0, price: 0 }]);

  const [addInvoice] = useCreateInvoiceMutation();

  const addInvoiceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      invoice_no: invoiceNo,
      document_date: documentDate,
      sales_order_date: salesOrderDate,
      note: note,
      tax: { tax_amount: tax?.value, tax_name: tax?.label },
      subtotal: subtotal,
      total: total,
      store: store?.value,
      items: inputs.map((item: any) => ({
        item: item.item.value,
        quantity: item.quantity,
        amount: item.price,
      })),
      category: category?.value,
      buyer: buyer?.value,
      supplier: supplier?.value,
    };

    try {
      setIsAdding(true);
      const response = await addInvoice(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchInvoicesHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const fetchBuyersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/buyers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      const buyers = data.agents.map((buyer: any) => ({
        value: buyer._id,
        label: buyer.name,
      }));
      setBuyerOptions(buyers);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchSuppliersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      const suppliers = data.agents.map((supplier: any) => ({
        value: supplier._id,
        label: supplier.name,
      }));
      setSupplierOptions(suppliers);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchItemsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      const products = results.products.map((product: any) => ({
        value: product._id,
        label: product.name,
      }));
      setItemOptions(products);
      setAllItems(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchStoresHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "store/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      const stores = data.stores.map((store: any) => ({
        value: store._id,
        label: store.name,
      }));
      setStoreOptions(stores);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (tax && subtotal) {
      setTotal(subtotal + tax?.value * subtotal);
    }
  }, [tax, subtotal]);

  useEffect(() => {
    const price = inputs.reduce((acc: number, curr: any) => {
      return acc + (curr?.price * curr?.quantity || 0);
    }, 0);
    setSubtotal(price);
  }, [inputs]);

  useEffect(() => {
    fetchBuyersHandler();
    fetchItemsHandler();
    fetchStoresHandler();
    fetchSuppliersHandler();
  }, []);

  // Custom styles for react-select to match theme
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: colors.input.background,
      borderColor: state.isFocused
        ? colors.input.borderFocus
        : colors.input.border,
      borderRadius: "8px",
      minHeight: "44px",
      boxShadow: state.isFocused ? `0 0 0 3px ${colors.primary[100]}` : "none",
      "&:hover": {
        borderColor: colors.input.borderHover,
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? colors.primary[500]
        : state.isFocused
        ? colors.primary[50]
        : colors.input.background,
      color: state.isSelected ? colors.text.inverse : colors.text.primary,
      padding: "12px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: colors.text.primary,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: colors.text.muted,
    }),
  };

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        // className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[500px] right-0 top-0  z-10"
        className="absolute overflow-auto h-[100vh] w-[100vw]  bg-white right-0 top-0 z-50 py-3 border-l border-gray-200"
        style={{
          backgroundColor: colors.background.drawer,
          boxShadow: colors.shadow.xl,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Add New Invoice
          </h1>
          <button
            onClick={closeDrawerHandler}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.gray[100],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
          >
            <BiX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={addInvoiceHandler} className="space-y-6">
            {/* Category */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Category
              </FormLabel>
              <Select
                value={category}
                options={categoryOptions}
                onChange={(e: any) => setCategory(e)}
                styles={customSelectStyles}
                placeholder="Select category"
              />
            </FormControl>

            {/* Buyer (for sale) */}
            {category && category.value === "sale" && (
              <FormControl isRequired>
                <FormLabel
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Buyer
                </FormLabel>
                <Select
                  value={buyer}
                  options={buyerOptions}
                  onChange={(e: any) => setBuyer(e)}
                  styles={customSelectStyles}
                  placeholder="Select buyer"
                />
              </FormControl>
            )}

            {/* Supplier (for purchase) */}
            {category && category.value === "purchase" && (
              <FormControl isRequired>
                <FormLabel
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Supplier
                </FormLabel>
                <Select
                  value={supplier}
                  options={supplierOptions}
                  onChange={(e: any) => setSupplier(e)}
                  styles={customSelectStyles}
                  placeholder="Select supplier"
                />
              </FormControl>
            )}

            {/* Invoice Number */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Invoice Number
              </FormLabel>
              <Input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                type="text"
                placeholder="Enter invoice number"
                className="w-full"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  height: "44px",
                }}
                _focus={{
                  borderColor: colors.input.borderFocus,
                  boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                }}
                _hover={{
                  borderColor: colors.input.borderHover,
                }}
              />
            </FormControl>

            {/* Document Date */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Document Date
              </FormLabel>
              <Input
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                type="date"
                className="w-full"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  height: "44px",
                }}
                _focus={{
                  borderColor: colors.input.borderFocus,
                  boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                }}
                _hover={{
                  borderColor: colors.input.borderHover,
                }}
              />
            </FormControl>

            {/* Sales Order Date */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Sales Order Date
              </FormLabel>
              <Input
                value={salesOrderDate}
                onChange={(e) => setSalesOrderDate(e.target.value)}
                type="date"
                className="w-full"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  height: "44px",
                }}
                _focus={{
                  borderColor: colors.input.borderFocus,
                  boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                }}
                _hover={{
                  borderColor: colors.input.borderHover,
                }}
              />
            </FormControl>

            {/* Store */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Store
              </FormLabel>
              <Select
                value={store}
                options={storeOptions}
                onChange={(e: any) => setStore(e)}
                styles={customSelectStyles}
                placeholder="Select store"
              />
            </FormControl>

            {/* Note */}
            <FormControl>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Note
              </FormLabel>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter any additional notes..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none transition-all duration-200"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.input.borderFocus;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.input.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormControl>

            {/* Items */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Items
              </FormLabel>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.gray[50],
                  borderColor: colors.border.light,
                }}
              >
                <AddItems inputs={inputs} setInputs={setInputs} />
              </div>
            </FormControl>

            {/* Subtotal */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Subtotal
              </FormLabel>
              <Input
                value={subtotal}
                isDisabled={true}
                type="number"
                placeholder="Calculated automatically"
                className="w-full"
                style={{
                  backgroundColor: colors.gray[100],
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  height: "44px",
                }}
              />
            </FormControl>

            {/* Tax */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Tax
              </FormLabel>
              <Select
                value={tax}
                options={taxOptions}
                onChange={(e: any) => setTax(e)}
                styles={customSelectStyles}
                placeholder="Select tax rate"
              />
            </FormControl>

            {/* Total */}
            <FormControl isRequired>
              <FormLabel
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Total
              </FormLabel>
              <Input
                value={total}
                isDisabled={true}
                type="number"
                placeholder="Calculated automatically"
                className="w-full"
                style={{
                  backgroundColor: colors.gray[100],
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  height: "44px",
                }}
              />
            </FormControl>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeDrawerHandler}
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: colors.text.secondary,
                  backgroundColor: colors.gray[100],
                  border: `1px solid ${colors.border.light}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[200];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[100];
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isAdding
                    ? colors.gray[400]
                    : colors.primary[600],
                }}
                onMouseEnter={(e) => {
                  if (!isAdding) {
                    e.currentTarget.style.backgroundColor = colors.primary[700];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAdding) {
                    e.currentTarget.style.backgroundColor = colors.primary[600];
                  }
                }}
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <MdAdd size={18} />
                    Create Invoice
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddInvoice;
