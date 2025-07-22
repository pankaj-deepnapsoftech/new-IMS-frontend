import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useCreateProcessMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { colors } from "../../../theme/colors";
import {
  Package,
  FileText,
  Hash,
  Store,
  Settings,
  Layers,
  Factory,
  Plus,
} from "lucide-react";

interface AddProcess {
  closeDrawerHandler: () => void;
  fetchProcessHandler: () => void;
}

const AddProcess: React.FC<AddProcess> = ({
  closeDrawerHandler,
  fetchProcessHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string | undefined>();
  const [itemName, setItemName] = useState<
    { value: string; label: string } | undefined
  >();
  const [bom, setBom] = useState<
    { value: string; label: string } | undefined
  >();
  const [currentStock, setCurrentStock] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<number | undefined>();
  const [fgStore, setFgStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [rmStore, setRmStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [scrapStore, setScrapStore] = useState<
    { value: string; label: string } | undefined
  >();

  const [itemNameOptions, setItemNameOptions] = useState<
    { value: string; label: string }[] | []
  >();
  const [bomOptions, setBomOptions] = useState<
    { value: string; label: string }[] | []
  >();
  const [fgStoreOptions, setFgStoreOptions] = useState<
    { value: string; label: string }[] | []
  >();
  const [rmStoreOptions, setRmStoreOptions] = useState<
    { value: string; label: string }[] | []
  >();
  const [scrapStoreOptions, setScrapStoreOptions] = useState<
    { value: string; label: string }[] | []
  >();

  const [items, setItems] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  const [addProcess] = useCreateProcessMutation();

  const addProcessHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      item: itemName?.value,
      bom: bom?.value,
      quantity: quantity,
      rm_store: rmStore?.value,
      fg_store: fgStore?.value,
      scrap_store: scrapStore?.value,
    };

    try {
      setIsAdding(true);
      const response = await addProcess(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
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
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setItems(data.products);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const fetchBomsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `bom/bom/${itemName?.value}`,
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
      setBoms(data.boms);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
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
      setStores(data.stores);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const results = items.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    setItemNameOptions(results);
  }, [items]);

  useEffect(() => {
    const item = items.find((item: any) => item._id === itemName?.value);
    setItemId(item?.product_id || "");
    setCurrentStock(item?.current_stock);
    setUom(item?.uom);
  }, [itemName]);

  useEffect(() => {
    if (itemName?.value) {
      fetchBomsHandler();
    }
  }, [itemName]);

  useEffect(() => {
    const results = boms.map((bom: any) => ({
      value: bom._id,
      label: bom.bom_name,
    }));
    setBomOptions(results);
  }, [boms]);

  useEffect(() => {
    if (bom) {
      const result = boms.find((b: any) => b._id === bom?.value);
      setQuantity(result?.finished_good?.quantity);
    }
  }, [bom]);

  useEffect(() => {
    const results = stores.map((store: any) => ({
      value: store._id,
      label: store.name,
    }));
    setRmStoreOptions(results);
    setScrapStoreOptions(results);
    setFgStoreOptions(results);
  }, [stores]);

  useEffect(() => {
    fetchItemsHandler();
    fetchStoresHandler();
  }, []);
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: colors.gray[300],
      color: colors.gray[900],
      minHeight: "42px",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: colors.primary[500],
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? colors.primary[50] : "white",
      color: colors.gray[900],
      cursor: "pointer",
      "&:hover": {
        backgroundColor: colors.primary[100],
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: colors.primary[100],
      color: colors.primary[800],
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: colors.gray[500],
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: colors.gray[900],
    }),
  };
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full  bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 text-black flex border items-center justify-between">
            <h2 className="text-xl font-semibold">Add Production Process</h2>
            <button
              onClick={closeDrawerHandler}
              className="p-1 border rounded transition-colors duration-200"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <form onSubmit={addProcessHandler}>
              {/* Item Information Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Item Information
                  </h3>

                  {/* Table Header for Item Information */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-6 gap-1 px-3 py-2">
                      <div>ITEM ID</div>
                      <div>ITEM NAME</div>
                      <div>BOM</div>
                      <div>CURRENT STOCK</div>
                      <div>QUANTITY</div>
                      <div>UOM</div>
                    </div>
                  </div>

                  {/* Item Information Row */}
                  <div className="border border-t-0 border-gray-300">
                    <div className="grid grid-cols-6 gap-1 px-3 py-2 items-center bg-white">
                      <div>
                        <input
                          type="text"
                          value={itemId || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          value={itemName}
                          options={itemNameOptions}
                          onChange={(d: any) => setItemName(d)}
                          placeholder="Select item"
                          required
                        />
                      </div>
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          value={bom}
                          options={bomOptions}
                          onChange={(d: any) => setBom(d)}
                          placeholder="Select BOM"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={currentStock || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={quantity || ""}
                          onChange={(e) => setQuantity(+e.target.value)}
                          placeholder="Quantity"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={uom || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Store Information
                  </h3>

                  {/* Table Header for Store Information */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-3 gap-1 px-3 py-2">
                      <div>FINISHED GOODS STORE</div>
                      <div>RAW MATERIALS STORE</div>
                      <div>SCRAP STORE</div>
                    </div>
                  </div>

                  {/* Store Information Row */}
                  <div className="border border-t-0 border-gray-300">
                    <div className="grid grid-cols-3 gap-1 px-3 py-2 items-center bg-white">
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          value={fgStore}
                          options={fgStoreOptions}
                          onChange={(d: any) => setFgStore(d)}
                          placeholder="Select FG store"
                          required
                        />
                      </div>
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          value={rmStore}
                          options={rmStoreOptions}
                          onChange={(d: any) => setRmStore(d)}
                          placeholder="Select RM store"
                          required
                        />
                      </div>
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          value={scrapStore}
                          options={scrapStoreOptions}
                          onChange={(d: any) => setScrapStore(d)}
                          placeholder="Select scrap store"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="bg-white">
                <div className="px-6 py-4">
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded transition-colors duration-200 disabled:opacity-50"
                    >
                      {isAdding ? "Creating..." : "Create Process"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProcess;
