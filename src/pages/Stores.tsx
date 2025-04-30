import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SampleCSV from "../assets/csv/store-sample.csv";
import {
  closeAddStoreDrawer,
  closeStoreDetailsDrawer,
  closeUpdateStoreDrawer,
  openAddStoreDrawer,
  openStoreDetailsDrawer,
  openUpdateStoreDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import StoreTable from "../components/Table/StoreTable";
import AddStore from "../components/Drawers/Store/AddStore";
import StoreDetails from "../components/Drawers/Store/StoreDetails";
import UpdateStore from "../components/Drawers/Store/UpdateStore";
import {
  useDeleteStoresMutation,
  useStoreBulKUploadMutation,
} from "../redux/api/api";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

const Stores: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("store");
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(); // Store Id to be updated or deleted
  const [stores, setStores] = useState<any>([]);
  const [filteredStores, setFilteredStores] = useState<any>([]);
  const {
    isAddStoreDrawerOpened,
    isUpdateStoreDrawerOpened,
    isStoreDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [deleteStore] = useDeleteStoresMutation();
  const [bulkUpload] = useStoreBulKUploadMutation();

  const openAddStoreDrawerHandler = () => {
    dispatch(openAddStoreDrawer());
  };

  const closeAddStoreDrawerHandler = () => {
    dispatch(closeAddStoreDrawer());
  };

  const openUpdateStoreDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openUpdateStoreDrawer());
  };

  const closeUpdateStoreDrawerHandler = () => {
    dispatch(closeUpdateStoreDrawer());
  };

  const openStoreDetailsDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openStoreDetailsDrawer());
  };

  const closeStoreDetailsDrawerHandler = () => {
    dispatch(closeStoreDetailsDrawer());
  };

  const fetchStoresHandler = async () => {
    try {
      setIsLoadingStores(true);
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
      setFilteredStores(data.stores);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const deleteStoreHandler = async (id: string) => {
    try {
      const response = await deleteStore(id).unwrap();
      toast.success(response.message);
      fetchStoresHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
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
    fetchStoresHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = stores.filter(
      (st: any) =>
        st.name?.toLowerCase()?.includes(searchTxt) ||
        st.gst_number?.toLowerCase()?.includes(searchTxt) ||
        st.address_line1
          ?.toString()
          ?.toLowerCase()
          ?.toString()
          .includes(searchTxt) ||
        st.address_line2?.toLowerCase()?.includes(searchTxt) ||
        st.pincode?.toString().toString().includes(searchTxt) ||
        st?.city?.toString()?.includes(searchTxt) ||
        st?.state?.toString()?.includes(searchTxt) ||
        (st?.createdAt &&
          new Date(st?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (st?.updatedAt &&
          new Date(st?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredStores(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div className=" mx-2 rounded-md h-full " >
      <div>
        {/* Add Store Drawer */}
        {isAddStoreDrawerOpened && (
          <AddStore
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeAddStoreDrawerHandler}
          />
        )}
        {/* Update Store Drawer */}
        {isUpdateStoreDrawerOpened && (
          <UpdateStore
            storeId={storeId}
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeUpdateStoreDrawerHandler}
          />
        )}
        {/* Store Details Drawer */}
        {isStoreDetailsDrawerOpened && (
          <StoreDetails
            storeId={storeId}
            closeDrawerHandler={closeStoreDetailsDrawerHandler}
          />
        )}
        {/* Stores Page */}
        <div>
          <h1 className="text-center font-[700] pb-4 text-2xl pt-2">Stores</h1>
          <div className="mt-2 w-full flex flex-col md:flex-row flex-wrap justify-center items-start gap-2 px-4 relative">
            {/* Search */}
            <textarea
              className="rounded-[10px] w-full md:w-auto px-3 py-2 text-sm border resize-none focus:outline-[#2D3748] border-[#bbbbbb] bg-[#f9f9f9]"
              rows={1}
              placeholder="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />

            {/* Refresh */}
            <Button
              fontSize="14px"
              paddingX="12px"
              paddingY="6px"
              width={{ base: "100%", md: "100px" }}  
              onClick={fetchStoresHandler}
              leftIcon={<MdOutlineRefresh />}
              color="#2D3748"
              borderColor="#2D3748"
              variant="outline"
              _hover={{ bg: "#2D3748", color: "white" }}
            >
              Refresh
            </Button>

            {/* Add Store */}
            <Button
              fontSize="14px"
              paddingX="12px"
              paddingY="6px"
              width={{ base: "100%", md: "200px" }}  
              onClick={openAddStoreDrawerHandler}
              color="white"
              backgroundColor="#2D3748"
              _hover={{ bg: "#2D3748ba" }}
            >
              Add New Store
            </Button>

            {/* Bulk Upload Button */}
            <div className="w-full md:w-[200px] relative">
              <Button
                fontSize="14px"
                paddingX="12px"
                paddingY="6px"
                width="100%"
                onClick={() => setShowBulkUploadMenu((prev) => !prev)}
                color="white"
                backgroundColor="#2D3748"
                rightIcon={<AiFillFileExcel size={22} />}
                _hover={{ bg: "#2D3748ba" }}
              >
                Bulk Upload
              </Button>

              {/* Bulk Upload Dropdown */}
              {showBulkUploadMenu && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-[#a9a9a9] shadow-lg rounded p-3">
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
                      <Button
                        type="submit"
                        fontSize="14px"
                        onClick={bulkUploadHandler}
                        isLoading={bulkUploading}
                        color="white"
                        backgroundColor="#2D3748"
                        rightIcon={<AiFillFileExcel size={22} />}
                        _hover={{ bg: "#2D3748ba" }}
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
                        _hover={{ bg: "#2D3748ba" }}
                      >
                        Close
                      </Button>
                    </div>

                    <a href={SampleCSV}>
                      <Button
                        type="button"
                        fontSize="14px"
                        className="mt-2 w-full"
                        color="white"
                        backgroundColor="#2D3748"
                        rightIcon={<AiFillFileExcel size={22} />}
                        _hover={{ bg: "#2D3748ba" }}
                      >
                        Sample CSV
                      </Button>
                    </a>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <StoreTable
            stores={filteredStores}
            isLoadingStores={isLoadingStores}
            deleteStoreHandler={deleteStoreHandler}
            openStoreDetailsDrawerHandler={openStoreDetailsDrawerHandler}
            openUpdateStoreDrawerHandler={openUpdateStoreDrawerHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Stores;
