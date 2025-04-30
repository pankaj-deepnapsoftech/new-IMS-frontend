import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SampleCSV from '../assets/csv/product-sample.csv';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useLazyFetchProductsQuery,
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

const Products: React.FC = () => {
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
        process.env.REACT_APP_BACKEND_URL + "product/all?category=direct",
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
    <div className=" p-4 rounded-md ">
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
        <h1 className="text-center pb-4 text-[25px] font-[600] ">
          Inventory
        </h1>

        {/* Main Row */}
        <div className="mt-2 w-full flex flex-col md:flex-row md:flex-wrap justify-center gap-3 px-4 pb-4">
          {/* Search */}
          <textarea
            className="rounded-[10px] w-full md:w-auto px-3 py-2 text-sm focus:outline-[#2D3748] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          {/* Add Product */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            width={{ base: "100%", md: "200px" }}
            onClick={openAddProductDrawerHandler}
            color="white"
            backgroundColor="#2D3748"
            _hover={{ bg: "#2e2e4f" }}
          >
            Add New Product
          </Button>

          {/* Refresh */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            width={{ base: "100%", md: "100px" }}
            onClick={fetchProductsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#2D3748"
            borderColor="#2D3748"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
          >
            Refresh
          </Button>

          {/* Bulk Upload Button */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            width={{ base: "100%", md: "200px" }}
            onClick={() => setShowBulkUploadMenu(true)}
            color="white"
            backgroundColor="#2D3748"
            _hover={{ bg: "#2e2e4f" }}
            rightIcon={<AiFillFileExcel size={22} />}
          >
            Bulk Upload
          </Button>
        </div>

        {/* Bulk Upload Section (outside of main row) */}
        {showBulkUploadMenu && (
          <div className="mt-2 w-full max-w-[350px] mx-auto border border-[#a9a9a9] rounded p-3 bg-white shadow-md">
            <form>
              <FormControl>
                <FormLabel fontWeight="bold">Choose File (.csv)</FormLabel>
                <Input
                  ref={fileRef}
                  type="file"
                  accept=".csv, .xlsx"
                  borderWidth={1}
                  borderColor="#a9a9a9"
                  paddingTop={1}
                />
              </FormControl>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button
                  type="submit"
                  fontSize="14px"
                  onClick={bulkUploadHandler}
                  isLoading={bulkUploading}
                  color="white"
                  backgroundColor="#2D3748"
                  rightIcon={<AiFillFileExcel size={22} />}
                  _hover={{ bg: "#2e2e4f" }}
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  fontSize="14px"
                  onClick={() => setShowBulkUploadMenu(false)}
                  color="white"
                  backgroundColor="#2D3748"
                  rightIcon={<RxCross2 size={22} />}
                  _hover={{ bg: "#2e2e4f" }}
                >
                  Close
                </Button>
              </div>

              <a href={SampleCSV}>
                <Button
                  type="button"
                  fontSize="14px"
                  width="100%"
                  className="mt-2"
                  color="white"
                  backgroundColor="#2D3748"
                  rightIcon={<AiFillFileExcel size={22} />}
                  _hover={{ bg: "#2e2e4f" }}
                >
                  Sample CSV
                </Button>
              </a>
            </form>
          </div>
        )}

      </div>
      <div className="flex justify-start items-center gap-2 mb-2">
        <FormControl width={"-webkit-max-content"}>
          <FormLabel fontWeight="bold" marginBottom={0}>
            Products/Services
          </FormLabel>
          <select
            value={productServiceFilter}
            onChange={(e: any) => setProductServiceFilter(e.target.value)}
            className="w-[200px] mt-2 rounded border border-[#a9a9a9] py-2 px-2"
          >
            <option value="">All</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
        </FormControl>
        <FormControl width={"-webkit-max-content"}>
          <FormLabel fontWeight="bold">Store</FormLabel>
          <Select
            className="w-[200px] rounded mt-2 border border-[#a9a9a9]"
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

export default Products;
