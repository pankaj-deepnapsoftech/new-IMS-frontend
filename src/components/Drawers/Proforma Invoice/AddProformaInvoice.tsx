import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useCreateProformaInvoiceMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";
import { colors } from "../../../theme/colors";

interface AddProformaInvoiceProps {
  closeDrawerHandler: () => void;
  fetchProformaInvoicesHandler: () => void;
}

const AddProformaInvoice: React.FC<AddProformaInvoiceProps> = ({
  closeDrawerHandler,
  fetchProformaInvoicesHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<
    { value: string; label: string } | undefined
  >();
  const [supplier, setSupplier] = useState<
    { value: string; label: string } | undefined
  >();
  const [proformaInvoiceNo, setProformaInvoiceNo] = useState<
    string | undefined
  >();
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

  const [addProformaInvoice] = useCreateProformaInvoiceMutation();

  const addProformaInvoiceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      proforma_invoice_no: proformaInvoiceNo,
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
      const response = await addProformaInvoice(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProformaInvoicesHandler();
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

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[100vw]  bg-white right-0 top-0 z-50 py-3 border-l border-gray-200"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Add New Proforma Invoice
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

        <div className="mt-8 px-5">
          <form onSubmit={addProformaInvoiceHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Category
              </FormLabel>
              <Select
                value={category}
                options={categoryOptions}
                required={true}
                onChange={(e: any) => setCategory(e)}
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    backgroundColor: "white",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    minHeight: "40px",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#e5e7eb" : "white",
                    color: "#374151",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }),
                  placeholder: (provided: any) => ({
                    ...provided,
                    color: "#9ca3af",
                  }),
                  singleValue: (provided: any) => ({
                    ...provided,
                    color: "#374151",
                  }),
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                  }),
                }}
              />
            </FormControl>
            {category && category.value === "sales" && (
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Buyer
                </FormLabel>
                <Select
                  value={buyer}
                  options={buyerOptions}
                  required={true}
                  onChange={(e: any) => setBuyer(e)}
                  styles={{
                    control: (provided: any) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderColor: "#d1d5db",
                      color: "#374151",
                      minHeight: "40px",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                    }),
                    option: (provided: any, state: any) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
                      color: "#374151",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                    placeholder: (provided: any) => ({
                      ...provided,
                      color: "#9ca3af",
                    }),
                    singleValue: (provided: any) => ({
                      ...provided,
                      color: "#374151",
                    }),
                    menu: (provided: any) => ({
                      ...provided,
                      zIndex: 9999,
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                    }),
                  }}
                />
              </FormControl>
            )}
            {category && category.value === "purchase" && (
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Supplier
                </FormLabel>
                <Select
                  value={supplier}
                  options={supplierOptions}
                  required={true}
                  onChange={(e: any) => setSupplier(e)}
                  styles={{
                    control: (provided: any) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderColor: "#d1d5db",
                      color: "#374151",
                      minHeight: "40px",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                    }),
                    option: (provided: any, state: any) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
                      color: "#374151",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                    placeholder: (provided: any) => ({
                      ...provided,
                      color: "#9ca3af",
                    }),
                    singleValue: (provided: any) => ({
                      ...provided,
                      color: "#374151",
                    }),
                    menu: (provided: any) => ({
                      ...provided,
                      zIndex: 9999,
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                    }),
                  }}
                />
              </FormControl>
            )}
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Proforma Invoice No.
              </FormLabel>
              <Input
                className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={proformaInvoiceNo}
                onChange={(e) => setProformaInvoiceNo(e.target.value)}
                type="text"
                placeholder="Proforma Invoice No."
                bg="white"
                color="gray.700"
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Document Date
              </FormLabel>
              <Input
                value={documentDate}
                className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setDocumentDate(e.target.value)}
                type="date"
                placeholder="Document Date"
                bg="white"
                color="gray.700"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Sales Order Date
              </FormLabel>
              <Input
                value={salesOrderDate}
                className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setSalesOrderDate(e.target.value)}
                type="date"
                placeholder="Sales Order Date"
                bg="white"
                color="gray.700"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Store
              </FormLabel>
              <Select
                value={store}
                options={storeOptions}
                required={true}
                onChange={(e: any) => setStore(e)}
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    backgroundColor: "white",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    minHeight: "40px",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#e5e7eb" : "white",
                    color: "#374151",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }),
                  placeholder: (provided: any) => ({
                    ...provided,
                    color: "#9ca3af",
                  }),
                  singleValue: (provided: any) => ({
                    ...provided,
                    color: "#374151",
                  }),
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                  }),
                }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" color="gray.700">
                Note
              </FormLabel>
              <textarea
                className="border border-gray-300 w-full px-3 py-2 rounded-md bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes..."
                rows={3}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Items
              </FormLabel>
              <AddItems inputs={inputs} setInputs={setInputs} />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Subtotal
              </FormLabel>
              <Input
                value={subtotal}
                isDisabled={true}
                className="border border-gray-300"
                type="number"
                placeholder="Subtotal"
                bg="gray.50"
                color="gray.700"
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Tax
              </FormLabel>
              <Select
                required={true}
                value={tax}
                options={taxOptions}
                onChange={(e: any) => setTax(e)}
                styles={{
                  control: (provided: any) => ({
                    ...provided,
                    backgroundColor: "white",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    minHeight: "40px",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#e5e7eb" : "white",
                    color: "#374151",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }),
                  placeholder: (provided: any) => ({
                    ...provided,
                    color: "#9ca3af",
                  }),
                  singleValue: (provided: any) => ({
                    ...provided,
                    color: "#374151",
                  }),
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                  }),
                }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Total
              </FormLabel>
              <Input
                className="border border-gray-300"
                value={total}
                isDisabled={true}
                bg="gray.50"
                color="gray.700"
              />
            </FormControl>
            <Button
              isLoading={isAdding}
              type="submit"
              className="mt-1 w-full"
              colorScheme="blue"
              size="lg"
              _hover={{ bg: "blue.600" }}
            >
              Create Proforma Invoice
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddProformaInvoice;
