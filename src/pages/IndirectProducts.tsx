import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SampleCSV from '../assets/csv/product-sample.csv';
import React, { useEffect, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useProductBulKUploadMutation,
} from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import ProductTable from "../components/Table/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProductDrawer,
  closeProductDetailsDrawer,
  closeUpdateProductDrawer,
  openAddProductDrawer,
  openProductDetailsDrawer,
  openUpdateProductDrawer,
} from "../redux/reducers/drawersSlice";
import AddProduct from "../components/Drawers/Product/AddProduct";
import UpdateProduct from "../components/Drawers/Product/UpdateProduct";
import ProductDetails from "../components/Drawers/Product/ProductDetails";
import { FiSearch } from "react-icons/fi";

const IndirectProducts: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState<string | undefined>(); // Product Id to be updated or deleted
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  // Bulk upload menu
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);

  // Filters
  const [productServiceFilter, setProductServiceFilter] = useState<string>("");
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [storeFilter, setStoreFilter] = useState<
    { value: string; label: string } | undefined
  >();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);

  const [bulkUpload] = useProductBulKUploadMutation();

  const {
    isAddProductDrawerOpened,
    isUpdateProductDrawerOpened,
    isProductDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProduct] = useDeleteProductMutation();

  const openAddProductDrawerHandler = () => {
    dispatch(openAddProductDrawer());
  };

  const closeProductDrawerHandler = () => {
    dispatch(closeAddProductDrawer());
  };

  const openUpdateProductDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openUpdateProductDrawer());
  };

  const closeUpdateProductDrawerHandler = () => {
    dispatch(closeUpdateProductDrawer());
  };

  const openProductDetailsDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openProductDetailsDrawer());
  };

  const closeProductDetailsDrawerHandler = () => {
    dispatch(closeProductDetailsDrawer());
  };

  const deleteProductHandler = async (id: string) => {
    try {
      const response: any = await deleteProduct({ _id: id }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all?category=indirect",
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
      setData(results.products);
      setFilteredData(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAllStores = async () => {
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
      let modifiedStores = [{ value: "", label: "All" }];
      modifiedStores.push(
        ...data.stores.map((store: any) => ({
          value: store._id,
          label: store.name,
        }))
      );
      setStoreOptions(modifiedStores);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const bulkUploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileRef?.current?.files?.[0];
    if (!file) {
      toast.error("CSV file not selected");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      formData.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "#ffffff3b",
      border: "none",
      color: "#444e5b",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#444e5b",
      color: "white",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "white",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#236fd9" : "#444e5b",
      color: "white",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "white", // 👈 set placeholder text color to gray
    }),
  };

  useEffect(() => {
    fetchProductsHandler();
    fetchAllStores();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    // // @ts-ignore
    const results = data.filter(
      (prod: any) =>
        (prod.product_or_service?.toLowerCase().includes(productServiceFilter) &&
          (storeFilter &&
            (storeFilter?.value === "" ||
              prod?.store?._id === storeFilter?.value))) &&
        (prod.name?.toLowerCase()?.includes(searchTxt) ||
          prod.product_id?.toLowerCase()?.includes(searchTxt) ||
          prod.category?.toLowerCase()?.includes(searchTxt) ||
          prod.price
            ?.toString()
            ?.toLowerCase()
            ?.toString()
            .includes(searchTxt) ||
          prod.uom?.toLowerCase()?.includes(searchTxt) ||
          prod.current_stock?.toString().toString().includes(searchTxt) ||
          prod?.min_stock?.toString()?.includes(searchTxt) ||
          prod?.max_stock?.toString()?.includes(searchTxt) ||
          prod?.hsn?.includes(searchTxt) ||
          (prod?.createdAt &&
            new Date(prod?.createdAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              .reverse()
              .join("")
              ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
          (prod?.updatedAt &&
            new Date(prod?.updatedAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              ?.reverse()
              ?.join("")
              ?.includes(searchTxt?.replaceAll("/", "") || "")))
    );
    setFilteredData(results);
  }, [searchKey, productServiceFilter, storeFilter]);

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className="  p-4 rounded-md ">
      {/* Add Product Drawer */}
      {isAddProductDrawerOpened && (
        <AddProduct
          closeDrawerHandler={closeProductDrawerHandler}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Update Product Drawer */}
      {isUpdateProductDrawerOpened && (
        <UpdateProduct
          closeDrawerHandler={closeUpdateProductDrawerHandler}
          productId={productId}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Product Details Drawer */}
      {isProductDetailsDrawerOpened && (
        <ProductDetails
          closeDrawerHandler={closeProductDetailsDrawerHandler}
          productId={productId}
        />
      )}

      {/* Products Page */}
      <div>
        <h1 className="text-center font-[700] text-white text-[30px] pb-4">
          Inventory
        </h1>
        {/* Main Button Row */}
        <div className="mt-2 w-full flex flex-col md:flex-wrap md:flex-row gap-2 md:gap-4 justify-center px-4 pb-4">
          {/* Search */}
          <FiSearch className="relative left-10 top-5 transform -translate-y-1/2 text-gray-200" />
          <input
            className="pl-10 pr-4 py-2 w-[200px] text-gray-200 text-sm  border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
            placeholder="Search roles..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          {/* Add Product */}
          <button
            onClick={openAddProductDrawerHandler}
            className="text-white bg-[#4b87a0d9] hover:bg-[#fff] hover:text-black text-sm rounded-[6px] px-4 py-2 w-full md:w-[200px] transition-all"
          >
            Add New Product
          </button>

          {/* Refresh */}
          <button
            onClick={fetchProductsHandler}
            className="text-[#fff] border border-[#fff] hover:bg-[#2D3748] hover:text-white text-sm rounded-[6px] px-4 py-2 w-full md:w-[100px] transition-all flex items-center justify-center gap-1"
          >
            <MdOutlineRefresh className="text-base" />
            Refresh
          </button>

          {/* Bulk Upload Button */}
          <button
            onClick={() => setShowBulkUploadMenu(true)}
            className="text-white bg-[#4b87a0d9] hover:bg-[#fff] hover:text-black text-sm rounded-[6px] px-4 py-2 w-full md:w-[200px] flex justify-between items-center gap-2 transition-all"
          >
            Bulk Upload
            <AiFillFileExcel size={22} />
          </button>
        </div>

        {/* Bulk Upload Form (placed below the row) */}
        {showBulkUploadMenu && (
          <div className="mt-2 border border-[#a9a9a9] rounded p-3 bg-white shadow-md w-full max-w-[300px] mx-auto">
            <form>
              <div className="mb-2">
                <label className="font-bold block mb-1">Choose File (.csv)</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv, .xlsx"
                  className="w-full border border-[#a9a9a9] text-sm p-1 rounded"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  onClick={bulkUploadHandler}
                  disabled={bulkUploading}
                  className="text-white bg-[#2D3748] hover:bg-[#2e2e4f] text-sm rounded-[6px] px-4 py-2 flex items-center justify-between gap-2 w-full"
                >
                  Upload
                  <AiFillFileExcel size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkUploadMenu(false)}
                  className="text-white bg-[#2D3748] hover:bg-[#2e2e4f] text-sm rounded-[6px] px-4 py-2 flex items-center justify-between gap-2 w-full"
                >
                  Close
                  <RxCross2 size={22} />
                </button>
              </div>

              <a href={SampleCSV}>
                <button
                  type="button"
                  className="mt-2 text-white bg-[#2D3748] hover:bg-[#2e2e4f] text-sm rounded-[6px] px-4 py-2 flex items-center justify-between gap-2 w-full"
                >
                  Sample CSV
                  <AiFillFileExcel size={22} />
                </button>
              </a>
            </form>
          </div>
        )}


      </div>

         <div className="flex justify-start items-center gap-2 mb-2">
                <FormControl width={"-webkit-max-content"}>
                  <FormLabel fontWeight="bold" marginBottom={0} textColor="#fbfbfb">
                    Products/Services
                  </FormLabel>
                  <select
                    value={productServiceFilter}
                    onChange={(e) => setProductServiceFilter(e.target.value)}
                    className="w-[200px] mt-2 rounded border text-white bg-[#ffffff3b] border-none py-2 px-2"
                  >
                    <option
                      style={{ backgroundColor: "#444e5b", color: "white" }}
                      value=""
                    >
                      All
                    </option>
                    <option
                      style={{ backgroundColor: "#444e5b", color: "white" }}
                      value="product"
                    >
                      Products
                    </option>
                    <option
                      style={{ backgroundColor: "#444e5b", color: "white" }}
                      value="service"
                    >
                      Services
                    </option>
                  </select>
                </FormControl>
                <FormControl width={"-webkit-max-content"}>
                  <FormLabel textColor="#fbfbfb" fontWeight="bold">
                    Store
                  </FormLabel>
                  <Select
                    className="w-[200px] mt-2 "
                    styles={customStyles}
                    options={storeOptions}
                    value={storeFilter}
                    onChange={(d: any) => setStoreFilter(d)}
                  />
                </FormControl>
              </div>

     

      <div>
        <ProductTable
          isLoadingProducts={isLoadingProducts}
          products={filteredData}
          openUpdateProductDrawerHandler={openUpdateProductDrawerHandler}
          openProductDetailsDrawerHandler={openProductDetailsDrawerHandler}
          deleteProductHandler={deleteProductHandler}
        />
      </div>
    </div>
  );
};

export default IndirectProducts;
