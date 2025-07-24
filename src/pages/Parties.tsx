/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch, FiPlus, FiUsers } from "react-icons/fi";
import AddParties from "../components/Drawers/Parties/AddParties";
import PartiesTable from "../components/Table/PartiesTable";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Pagination from "./Pagination";
import { colors } from "../theme/colors";

const Parties = () => {
  const [showData, setshowData] = useState(false);
  const [counter, setCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [partiesData, setPartiesData] = useState([]);
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [edittable, setEditTable] = useState(null);
  const [limit, setLimit] = useState(10);

  const fetchPartiesData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}parties/get?page=${page}&&limit={limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await res.json();
      setPartiesData(data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartiesData(page);
  }, [counter, page]);

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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <FiUsers className="text-white" size={24} />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Merchant Management
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: colors.text.secondary }}
                >
                  Manage your buyers and sellers
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setshowData(!showData);
                  setEditTable(null);
                }}
                className="flex items-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: colors.primary[600],
                  focusRingColor: colors.primary[500],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[700];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary[600];
                }}
              >
                <FiPlus size={16} />
                Add New Merchant
              </button>

              <button
                onClick={fetchPartiesData}
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

          {/* Search and Filters Row */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Search Merchant
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search party..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Type Filter */}
            <div className="w-full lg:w-48">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Type
              </label>
              <select
                className="w-full px-4 py-3 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
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
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="w-full lg:w-48">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Merchant Role
              </label>
              <select
                className="w-full px-4 py-3 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
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
              >
                <option value="">Select Role</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
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
          <PartiesTable
            setshowData={setshowData}
            setEditTable={setEditTable}
            counter={counter}
            searchTerm={searchTerm}
            selectedType={selectedType}
            selectedRole={selectedRole}
            partiesData={partiesData}
            setPartiesData={setPartiesData}
            isLoading={isLoading}
            fetchPartiesData={fetchPartiesData}
            setLimit={setLimit}
          />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            page={page}
            setPage={setPage}
            hasNextPage={partiesData?.length === limit}
          />
        </div>
      </div>

      {/* Add Parties Drawer */}
      <AddParties
        fetchPartiesData={fetchPartiesData}
        setEditTable={setEditTable}
        edittable={edittable}
        showData={showData}
        setshowData={setshowData}
        setCounter={setCounter}
      />
    </div>
  );
};

export default Parties;
