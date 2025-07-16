// @ts-nocheck
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import AgentTable from "../components/Table/AgentTable";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../theme/colors";
import {
  closeAddBuyerDrawer,
  closeBuyerDetailsDrawer,
  closeUpdateBuyerDrawer,
  openAddBuyerDrawer,
  openBuyerDetailsDrawer,
  openUpdateBuyerDrawer,
} from "../redux/reducers/drawersSlice";
import SampleCSV from "../assets/csv/agent-sample.csv";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddBuyer from "../components/Drawers/Buyer/AddBuyer";
import UpdateBuyer from "../components/Drawers/Buyer/UpdateBuyer";
import {
  useAgentBulKUploadMutation,
  useDeleteAgentMutation,
} from "../redux/api/api";
import BuyerDetails from "../components/Drawers/Buyer/BuyerDetails";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";

const Buyers: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("agent");
  const [cookies] = useCookies();
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [buyerId, setBuyerId] = useState<string | undefined>();
  const [isLoadingBuyers, setIsLoadingBuyers] = useState<boolean>(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<any[]>([]);

  const {
    isAddBuyerDrawerOpened,
    isUpdateBuyerDrawerOpened,
    isBuyerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteBuyer] = useDeleteAgentMutation();
  const [bulkUpload] = useAgentBulKUploadMutation();

  const openAddBuyerDrawerHandler = () => {
    dispatch(openAddBuyerDrawer());
  };
  const closeAddBuyerDrawerHandler = () => {
    dispatch(closeAddBuyerDrawer());
  };
  const openUpdateBuyerDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openUpdateBuyerDrawer());
  };
  const closeUpdateBuyerDrawerHandler = () => {
    dispatch(closeUpdateBuyerDrawer());
  };
  const openBuyerDetailsDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openBuyerDetailsDrawer());
  };
  const closeBuyerDetailsDrawerHandler = () => {
    dispatch(closeBuyerDetailsDrawer());
  };

  const fetchBuyersHandler = async () => {
    try {
      setIsLoadingBuyers(true);
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
      setBuyers(data.agents);
      setFilteredBuyers(data.agents);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const deleteBuyerHandler = async (id: string) => {
    try {
      const response = await deleteBuyer(id).unwrap();
      toast.success(response.message);
      fetchBuyersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
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
    fetchBuyersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = buyers.filter(
      (buyer: any) =>
        buyer.name?.toLowerCase()?.includes(searchTxt) ||
        buyer.email?.toLowerCase()?.includes(searchTxt) ||
        buyer.phone?.toLowerCase()?.includes(searchTxt) ||
        buyer?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        buyer.company_name.toLowerCase().includes(searchTxt) ||
        buyer.company_email.toLowerCase().includes(searchTxt) ||
        buyer.company_phone.toLowerCase().includes(searchTxt) ||
        buyer.address_line1.toLowerCase().includes(searchTxt) ||
        buyer?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        buyer?.pincode?.toLowerCase()?.includes(searchTxt) ||
        buyer.city.toLowerCase().includes(searchTxt) ||
        buyer.state.toLowerCase().includes(searchTxt) ||
        (buyer?.createdAt &&
          new Date(buyer?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (buyer?.updatedAt &&
          new Date(buyer?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBuyers(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.page }}
    >
      <div className="p-2 lg:p-3">
        {/* Add Buyer Drawer */}
        {isAddBuyerDrawerOpened && (
          <AddBuyer
            fetchBuyersHandler={fetchBuyersHandler}
            closeDrawerHandler={closeAddBuyerDrawerHandler}
          />
        )}
        {/* Update Buyer Drawer */}
        {isUpdateBuyerDrawerOpened && (
          <UpdateBuyer
            buyerId={buyerId}
            closeDrawerHandler={closeUpdateBuyerDrawerHandler}
            fetchBuyersHandler={fetchBuyersHandler}
          />
        )}
        {/* Buyer Details Drawer */}
        {isBuyerDetailsDrawerOpened && (
          <BuyerDetails
            buyerId={buyerId}
            closeDrawerHandler={closeBuyerDetailsDrawerHandler}
          />
        )}

        {/* Main Header */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <div className="text-center">
            <h1
              className="text-2xl lg:text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Buyer Management
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: colors.text.secondary }}
            >
              Manage customer and buyer information
            </p>
          </div>
        </div>

        {/* Actions and Search */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                />
                <input
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                  placeholder="Search buyers..."
                  value={searchKey || ""}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchBuyersHandler}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                style={{
                  borderColor: colors.border.medium,
                  color: colors.text.primary,
                  backgroundColor: colors.background.card,
                }}
              >
                <MdOutlineRefresh size="16px" />
                Refresh
              </button>

              <button
                onClick={openAddBuyerDrawerHandler}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.text.inverse,
                }}
              >
                Add New Buyer
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowBulkUploadMenu((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: colors.secondary[500],
                    color: colors.text.inverse,
                  }}
                >
                  <AiFillFileExcel size="16px" />
                  Bulk Upload
                </button>

                {/* Bulk Upload Dropdown */}
                {showBulkUploadMenu && (
                  <div
                    className="absolute z-50 mt-2 w-80 shadow-lg rounded-xl p-4"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.light,
                    }}
                  >
                    <form>
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.text.primary }}
                        >
                          Choose File (.csv)
                        </label>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".csv, .xlsx"
                          className="w-full text-sm p-2 border rounded-lg"
                          style={{
                            backgroundColor: colors.input.background,
                            borderColor: colors.input.border,
                            color: colors.text.primary,
                          }}
                        />
                      </div>

                      <div className="flex gap-3 mb-3">
                        <button
                          type="button"
                          onClick={bulkUploadHandler}
                          disabled={bulkUploading}
                          className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                          style={{
                            backgroundColor: colors.success[500],
                            color: colors.text.inverse,
                          }}
                        >
                          {bulkUploading ? "Uploading..." : "Upload"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowBulkUploadMenu(false)}
                          className="flex-1 px-4 py-2 rounded-lg font-medium border transition-colors"
                          style={{
                            borderColor: colors.border.medium,
                            color: colors.text.primary,
                            backgroundColor: colors.background.card,
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      <a
                        href={SampleCSV}
                        className="text-sm underline"
                        style={{ color: colors.primary[500] }}
                      >
                        Download Sample CSV
                      </a>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Table */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <AgentTable
            agents={filteredBuyers}
            openUpdateAgentDrawerHandler={openUpdateBuyerDrawerHandler}
            openAgentDetailsDrawerHandler={openBuyerDetailsDrawerHandler}
            isLoadingAgents={isLoadingBuyers}
            deleteAgentHandler={deleteBuyerHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Buyers;
