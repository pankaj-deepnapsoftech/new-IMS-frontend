// @ts-nocheck
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BiSolidTrash, BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../ui/Loading";
import EmptyData from "../../ui/emptyData";
import Parties from "../../pages/Parties";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useTable } from "react-table";
import axios from "axios";
import { colors } from "../../theme/colors";

const PartiesTable = ({
  fetchPartiesData,
  searchTerm,
  selectedType,
  partiesData,
  setPartiesData,
  isLoading,
  setLimit,
  selectedRole,
  setEditTable,
  setshowData,
}) => {
  // const [deleteId, setdeleteId] = useState('')
  const [deleteId, setDeleteId] = useState("");
  const [cookies] = useCookies();
  const [showDeletePage, setshowDeletePage] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const columns = useMemo(() => [
  //     { Header: "Full name", accessor: "full_name" },
  //     { Header: "Email", accessor: "email" },
  //     { Header: "Phone No.", accessor: "phone" },
  //     { Header: "Type", accessor: "type" },
  //     { Header: "Company Name", accessor: "company_name" },
  //     { Header: "Parties Type", accessor: "parties_type" },
  //     { Header: "", accessor: "type" },
  //   ], []);

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  //   page, // instead of rows, use page for pagination
  //   setPageSize, // <-- this is what you need
  //   state: { pageSize },
  // } = useTable(
  //   {
  //     columns,
  //     data,
  //     initialState: { pageSize: 10 }, // optional default
  //   },
  //   usePagination
  // );
  console.log(partiesData)
  const filteredParties = partiesData.filter((party) => {
    const searchLower = searchTerm.toLowerCase();

    const matchSearch =
      (party?.consignee_name?.[0]?.toLowerCase?.() || "").includes(
        searchLower
      ) ||
      (party?.email_id?.[0]?.toLowerCase?.() || "").includes(searchLower) ||
      (party?.contact_number?.[0]?.toLowerCase?.() || "").includes(
        searchLower
      ) ||
      (party?.type?.toLowerCase?.() || "").includes(searchLower) ||
      (party?.company_name?.toLowerCase?.() || "").includes(searchLower);

    const matchType = selectedType ? party?.type === selectedType : true;
    const matchRole = selectedRole
      ? party?.parties_type === selectedRole
      : true;

    return matchSearch && matchType && matchRole;
  });
  

  const handleDelete = async (partyId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}parties/delete/${partyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );

      if (res?.ok) {
        setPartiesData((prev) => prev.filter((party) => party._id !== partyId));
      } else {
        console.error(error?.message);
      }
      setshowDeletePage(false);
      setIsConfirmed(false);
    } catch (error) {
      console.error("Error deleting party:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (isLoading) {
  //   return (
  //       <section className="h-full w-full text-white ">
  //               <div className="flex justify-end mb-2 mt-2 bg-transparent">
  //                   <select
  //                       onChange={(e) => setLimit(Number(e.target.value))}
  //                       className="border bg-transparent px-3 rounded-md py-1 focus:outline-none"
  //                   >
  //                       {[10, 20, 50, 100].map((size) => (
  //                           <option className="text-white bg-[#444e5b]" key={size} value={size}>
  //                               {size === 100 ? "All" : size}
  //                           </option>
  //                       ))}
  //                   </select>
  //               </div>
  //           <div className="overflow-x-auto w-full">

  //               <table className="w-full text-sm rounded-lg whitespace-nowrap overflow-hidden">
  //                   <thead className="bg-[#14243452] text-white border-b">
  //                       <tr>
  //                           <th className="px-2 py-3"> Cust Id</th>
  //                           <th className="px-2 py-3"> Date Added</th>
  //                           <th className="px-2 py-3">Consignee Name</th>
  //                           <th className="px-2 py-3"> Company Name</th>
  //                           <th className="px-2 py-3">Email</th>
  //                           <th className="px-2 py-3">Phone No.</th>
  //                           <th className="px-2 py-3">Type</th>
  //                           <th className="px-2 py-3">Parties Type</th>
  //                           <th className="px-2 py-3">GST No.</th>
  //                           <th className="px-2 py-3">GST Address</th>
  //                           <th className="px-2 py-3">Delivery Address</th>
  //                           <th className="px-2 py-3">Shipped To</th>
  //                           <th className="px-2 py-3">Bill To</th>
  //                           <th className="px-2 py-3">Action</th>
  //                       </tr>
  //                   </thead>
  //                   <tbody>
  //                       {filteredParties.map((party, index) => (
  //                           <tr
  //                               key={index}
  //                               className={`${index % 2 === 0 ? "bg-[#ffffff40]" : "bg-[#ffffff1f]"
  //                                   } hover:bg-[#ffffff78] transition-colors`}
  //                           >
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.cust_id || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{new Date(party.createdAt).toLocaleDateString() || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.consignee_name || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.company_name || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.email_id || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.contact_number || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.type || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.parties_type || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.gst_in || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.gst_add || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.delivery_address || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.shipped_to || "N/A"}</td>
  //                               <td className="py-4 pl-3 text-center text-gray-200">{party.bill_to || "N/A"}</td>
  //                               <td className="py-4 text-center flex items-center gap-3 justify-center text-gray-200">
  //                                   <button
  //                                       onClick={() => {
  //                                           setEditTable(party)
  //                                           setshowData(true)
  //                                       }}
  //                                   >
  //                                       <MdEdit size={18} className="cursor-pointer text-gray-300 hover:text-red-500 transition-transform hover:scale-110" />
  //                                   </button>
  //                                   <button
  //                                       onClick={() => {
  //                                           setshowDeletePage(true);
  //                                           setDeleteId(party._id);
  //                                       }}
  //                                   >
  //                                       <MdDeleteOutline size={18} className="cursor-pointer text-gray-300 hover:text-red-600 transition-transform hover:scale-110" />
  //                                   </button>
  //                               </td>
  //                           </tr>
  //                       ))}
  //                   </tbody>
  //               </table>
  //           </div>



  //           {showDeletePage && (
  //               <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center">
  //                   <div className="bg-[#1C3644] rounded-lg shadow-xl p-6 w-full max-w-md">
  //                       <h2 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h2>
  //                       <p className="text-sm text-white mb-6">Are you sure you want to delete this item ?</p>
  //                       <div className="mt-6 flex justify-end space-x-3">
  //                           <button
  //                               onClick={() => setshowDeletePage(!showDeletePage)}
  //                               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
  //                           >
  //                               Cancel
  //                           </button>
  //                           <button
  //                               onClick={() => handleDelete(deleteId)}
  //                               disabled={isSubmitting}
  //                               className={` ${isSubmitting ? "cursor-not-allowed" : " "} px-4 py-2 text-sm font-medium text-white rounded transition  bg-red-600 hover:bg-red-700 `}
  //                           >
  //                               Delete
  //                           </button>
  //                       </div>
  //                   </div>
  //               </div>


  //           )}

  //       </section>
  //   );
  // }

  if (!filteredParties || filteredParties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="rounded-full p-6 mb-4"
          style={{ backgroundColor: colors.gray[100] }}
        >
          <svg
            className="w-12 h-12"
            style={{ color: colors.gray[400] }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: colors.text.primary }}
        >
          No parties found
        </h3>
        <p className="max-w-md" style={{ color: colors.text.muted }}>
          {searchTerm || selectedType || selectedRole
            ? "No parties match your current filters. Try adjusting your search criteria."
            : "Get started by adding your first party to manage your business relationships."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with count and page size selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              {filteredParties.length} Part
              {filteredParties.length !== 1 ? "ies" : "y"} Found
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ color: colors.text.secondary }}
          >
            Show:
          </span>
          <select
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.input.background,
              borderColor: colors.border.light,
              color: colors.text.primary,
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size === 100 ? "All" : size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Table */}
      <div
        className="rounded-xl shadow-sm overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.table.header }}>
              <tr style={{ borderBottom: `1px solid ${colors.table.border}` }}>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Cust Id
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Date Added
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{
                    color: colors.table.headerText,
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    backgroundColor: colors.table.header,
                  }}
                >
                  Consignee Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Company Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Email
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Phone No.
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Type
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Merchant Type
                </th>
                {/* <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  GST No.
                </th> */}
                {/* <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  GST Address
                </th> */}
                {/* <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Delivery Address
                </th> */}
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Shipped To
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Bill To
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Shipped GST To
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Bill GST To
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.map((party, index) => (
                <tr
                  key={party._id || index}
                  className="transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? colors.background.card
                        : colors.table.stripe,
                    borderBottom: `1px solid ${colors.table.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.table.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0
                        ? colors.background.card
                        : colors.table.stripe;
                  }}
                >
                  <td
                    className="px-4 py-3 text-sm whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                  >
                    {party.cust_id}
                  </td>
                  <td
                    className="px-4 py-3 text-sm whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                  >
                    {party.createdAt
                      ? new Date(party.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium whitespace-nowrap truncate max-w-xs"
                    style={{
                      color: colors.text.primary,
                      position: "sticky",
                      left: 0,
                      backgroundColor:
                        index % 2 === 0
                          ? colors.background.card
                          : colors.table.stripe,
                      zIndex: 1,
                    }}
                    title={party?.consignee_name?.[0] || "N/A"}
                  >
                    {party?.consignee_name?.[0] || "N/A"}
                  </td>

                  <td
                    className="px-4 py-3 text-sm whitespace-nowrap truncate max-w-xs"
                    style={{ color: colors.text.secondary }}
                    title={party.company_name}
                  >
                    {party.company_name || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm whitespace-nowrap truncate max-w-xs"
                    style={{ color: colors.text.secondary }}
                    title={party.email_id}
                  >
                    {Array.isArray(party.email_id) && party.email_id.length > 0
                      ? party.email_id.join(", ")
                      : "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                  >
                    {Array.isArray(party.contact_number) &&
                    party.contact_number.length > 0
                      ? party.contact_number.join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor:
                          party.type === "Customer"
                            ? colors.success[100]
                            : party.type === "Supplier"
                            ? colors.primary[100]
                            : colors.gray[100],
                        color:
                          party.type === "Customer"
                            ? colors.success[700]
                            : party.type === "Supplier"
                            ? colors.primary[700]
                            : colors.gray[700],
                      }}
                    >
                      {party.type || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: colors.secondary[100],
                        color: colors.secondary[700],
                      }}
                    >
                      {party.parties_type || "N/A"}
                    </span>
                  </td>
                  {/* <td
                    className="px-4 py-3 text-sm font-mono whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                  >
                    {party.gst_in || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.gst_add}
                  >
                    {party.gst_add || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.delivery_address}
                  >
                    {party.delivery_address || "N/A"}
                  </td> */}
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.shipped_to}
                  >
                    {party.shipped_to || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.bill_to}
                  >
                    {party.bill_to || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.shipped_gst_to}
                  >
                    {party.shipped_gst_to || "N/A"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm max-w-xs truncate whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    title={party.bill_gst_to}
                  >
                    {party.bill_gst_to || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditTable(party);
                          setshowData(true);
                        }}
                        className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                        style={{
                          color: colors.primary[600],
                          backgroundColor: colors.primary[50],
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.primary[100];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.primary[50];
                        }}
                        title="Edit party"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setshowDeletePage(true);
                          setDeleteId(party._id);
                        }}
                        className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                        style={{
                          color: colors.error[600],
                          backgroundColor: colors.error[50],
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.error[100];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.error[50];
                        }}
                        title="Delete party"
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Delete Modal */}
      {showDeletePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="w-full max-w-md mx-4 rounded-xl shadow-xl"
            style={{ backgroundColor: colors.background.card }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Confirm Deletion
                </h2>
              </div>

              <div className="mb-6">
                <div
                  className="rounded-lg p-4 mb-4"
                  style={{ backgroundColor: colors.error[50] }}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: colors.error[500] }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.error[800] }}
                      >
                        Delete Party
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.error[600] }}
                      >
                        This action cannot be undone. All party data will be
                        permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setshowDeletePage(false)}
                  className="flex-1 px-4 py-2 rounded-lg border transition-all duration-200"
                  style={{
                    borderColor: colors.border.medium,
                    color: colors.text.secondary,
                    backgroundColor: colors.background.card,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.error[500],
                    color: colors.text.inverse,
                  }}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartiesTable;
