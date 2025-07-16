// @ts-nocheck
import { MdOutlineRefresh, MdAdd } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import AddNewSale from "../components/Drawers/Sales/AddNewSale";
import UpdateSale from "../components/Drawers/Sales/UpdateSale";
import { useState, useEffect } from "react";
import SalesTable from "../components/Table/SalesTable";
import AssignEmployee from "../components/Drawers/Sales/AssignEmployee";
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { colors } from "../theme/colors";

const Sales = () => {
  const [pages, setPages] = useState(1);
  const [show, setShow] = useState(false);
  const [editshow, seteditsale] = useState(false);
  const [cookies] = useCookies(["access_token", "role"]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = cookies?.role;
  const token = cookies.access_token;
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [selectedSale, setSelectedSale] = useState([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleDataFromChild = (data) => {
    setSelectedSale(data);
    seteditsale(true);
  };

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      if (!token) throw new Error("Authentication token not found");

      const url =
        role === "admin"
          ? `${process.env.REACT_APP_BACKEND_URL}sale/getAll?page=${pages}`
          : `${process.env.REACT_APP_BACKEND_URL}sale/getOne?page=${pages}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPurchases(response.data.data);

      const totalItems = response.data.totalData || 0;
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch sale data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredEmployees = (response.data.users || []).filter(
        (user) => user.role
      );
      setEmployees(filteredEmployees);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch employees"
      );
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchEmployees();
  }, [pages]);

  useEffect(() => {
    const filtered = purchases.filter((purchase) => {
      const matchesText =
        !filterText ||
        [
          purchase?.user_id?.[0]?.first_name,
          purchase?.product_id?.[0]?.name,
          purchase?.party_id?.[0]?.full_name,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(filterText.toLowerCase())
          );

      const matchesDate =
        !filterDate ||
        new Date(purchase?.createdAt).toISOString().split("T")[0] ===
          filterDate;

      const matchesStatus =
        !filterStatus ||
        purchase?.Status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesText && matchesDate && matchesStatus;
    });

    setFilteredPurchases(filtered);
  }, [filterText, filterDate, filterStatus, purchases]);

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
            <div>
              <h1
                className="text-2xl lg:text-3xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Sales Management
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: colors.text.secondary }}
              >
                Track and manage all sales transactions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShow(!show)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.button.primary,
                  color: colors.text.inverse,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.button.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.button.primary;
                }}
              >
                <MdAdd size="20px" />
                Add Sale
              </button>

              <button
                onClick={fetchPurchases}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                style={{
                  borderColor: colors.border.medium,
                  color: colors.text.primary,
                  backgroundColor: colors.background.card,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.card;
                }}
              >
                <MdOutlineRefresh size="20px" />
                Refresh
              </button>
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Search Sales
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                />
                <input
                  type="text"
                  placeholder="Search sale..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      colors.input.borderFocus;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.input.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Filter by Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.input.borderFocus;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.input.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.input.borderFocus;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.input.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approval">Approval</option>
              </select>
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
          <SalesTable
            filteredPurchases={filteredPurchases}
            sendDataToParent={handleDataFromChild}
            empData={employees}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination page={pages} setPage={setPages} TotalPage={totalPages} />
        </div>
      </div>

      {/* Modals/Drawers */}
      <AddNewSale show={show} setShow={setShow} refresh={fetchPurchases} />
      <UpdateSale
        editshow={editshow}
        sale={selectedSale}
        seteditsale={seteditsale}
        refresh={fetchPurchases}
      />
    </div>
  );
};

export default Sales;
