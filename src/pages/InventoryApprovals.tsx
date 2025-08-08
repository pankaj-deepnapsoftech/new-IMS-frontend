import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch, FiCheckSquare } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import BOMRawMaterialTable from "../components/Table/BOMRawMaterialTable";
import { colors } from "../theme/colors";

const InventoryApprovals: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);

  const fetchInventoryHandler = async () => {
    try {
      setIsLoadingInventory(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
        "bom/all/inventory/raw-materials",
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
      console.log("Inventory Data:", results);
      setData(results.unapproved);
      setFilteredData(results.unapproved);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const approveRmHandler = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}bom/approve/inventory/raw-materials`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Raw material approved successfully!");

      // ✅ Re-fetch the list to get updated statuses
      fetchInventoryHandler();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };


  useEffect(() => {
    fetchInventoryHandler();
  }, []);

  useEffect(() => {
    if (!searchKey) {
      setFilteredData(data);
      return;
    }

    const searchTxt = searchKey.toLowerCase().trim();

    const results = data.filter((emp: any) => {
      const firstName = emp.first_name?.toString().toLowerCase() || "";
      const lastName = emp.last_name?.toString().toLowerCase() || "";
      const email = emp.email?.toString().toLowerCase() || "";
      const phone = emp.phone?.toString() || "";
      const role = emp?.role?.role?.toString().toLowerCase() || "";
      const createdAt = emp?.createdAt
        ? new Date(emp.createdAt)
          .toISOString()
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("")
        : "";
      const updatedAt = emp?.updatedAt
        ? new Date(emp.updatedAt)
          .toISOString()
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("")
        : "";

      return (
        firstName.includes(searchTxt) ||
        lastName.includes(searchTxt) ||
        email.includes(searchTxt) ||
        phone.includes(searchTxt) ||
        role.includes(searchTxt) ||
        createdAt.includes(searchTxt.replaceAll("/", "")) ||
        updatedAt.includes(searchTxt.replaceAll("/", ""))
      );
    });

    setFilteredData(results);
  }, [searchKey, data]);

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
        {/* Header Section */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <FiCheckSquare className="text-white" size={24} />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Inventory Approvals
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.text.secondary }}
                >
                  Review and approve inventory raw materials
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchInventoryHandler}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.medium,
                  color: colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.card;
                }}
              >
                <MdOutlineRefresh size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search Row */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Search Inventory
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2"
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
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <BOMRawMaterialTable
            products={filteredData}
            isLoadingProducts={isLoadingInventory}
            approveProductHandler={approveRmHandler}
          />

        </div>
      </div>
    </div>
  );
};

export default InventoryApprovals;
