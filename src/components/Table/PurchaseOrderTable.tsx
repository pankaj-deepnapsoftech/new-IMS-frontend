// import React from "react";
// import { Badge } from "@chakra-ui/react";

import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { colors } from "../../theme/colors";

// const colors = {
//   table: { header: "#f7fafc", stripe: "#f9fafb" },
//   background: { card: "#fff" },
//   border: { light: "#e2e8f0" },
//   primary: { 500: "#3182ce" },
//   gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 400: "#9ca3af" },
//   text: {
//     primary: "#1a202c",
//     secondary: "#4b5563",
//     muted: "#6b7280",
//     inverse: "#fff",
//   },
// };

// const dummyPurchaseOrders = [
//   {
//     id: "1",
//     companyName: "Acme Corp",
//     companyAddress: "123 Main St, Mumbai",
//     companyGST: "27AAEPM1234C1ZV",
//     poOrder: "PO-00123",
//     supplierName: "John Doe",
//     supplierGST: "27AAEPM5678C1ZV",
//     supplierAddress: "456 Market Rd, Pune",
//     panDetails: "AAEPM1234C",
//     email: "john@acme.com",
//     freightCharges: "5000",
//     packagingAndForwarding: "Inclusive",
//     modeOfPayment: "Bank Transfer",
//     deliveryAddress: "789 Delivery Lane, Nashik",
//     deliveryPeriod: "7-10 days",
//     billingAddress: "Acme Billing, Mumbai",
//     paymentTerms: "Net 30",
//     remarks: "Urgent delivery required.",
//     status: "Approved",
//     createdAt: "2025-07-28",
//   },
//   {
//     id: "2",
//     companyName: "Globex Ltd",
//     companyAddress: "22 Industrial Area, Delhi",
//     companyGST: "07AAEPM4321B1ZV",
//     poOrder: "PO-00124",
//     supplierName: "Jane Smith",
//     supplierGST: "07AAEPM8765B1ZV",
//     supplierAddress: "88 Supplier Park, Delhi",
//     panDetails: "AAEPM4321B",
//     email: "jane@globex.com",
//     freightCharges: "0",
//     packagingAndForwarding: "Exclusive",
//     modeOfPayment: "Cheque",
//     deliveryAddress: "22 Delivery St, Delhi",
//     deliveryPeriod: "5 days",
//     billingAddress: "Globex Billing, Delhi",
//     paymentTerms: "Advance Payment",
//     remarks: "Handle with care.",
//     status: "Pending",
//     createdAt: "2025-07-27",
//   },
//   {
//     id: "3",
//     companyName: "Initech",
//     companyAddress: "Plot 9, IT Park, Bangalore",
//     companyGST: "29AAEPM9999C1ZV",
//     poOrder: "PO-00125",
//     supplierName: "Alice Lee",
//     supplierGST: "29AAEPM8888C1ZV",
//     supplierAddress: "Tech Supplier, Bangalore",
//     panDetails: "AAEPM9999C",
//     email: "alice@initech.com",
//     freightCharges: "2000",
//     packagingAndForwarding: "Inclusive",
//     modeOfPayment: "Credit",
//     deliveryAddress: "Initech Delivery, Bangalore",
//     deliveryPeriod: "15 days",
//     billingAddress: "Initech Billing, Bangalore",
//     paymentTerms: "Net 60",
//     remarks: "",
//     status: "Draft",
//     createdAt: "2025-07-26",
//   },
// ];

// const PurchaseOrderTable = () => {
//   return (
//     <div className="p-6">
//       {/* Header with count and page size selector */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-6">
//           <div>
//             <h3
//               className="text-lg font-semibold"
//               style={{ color: colors.text.primary }}
//             >
//               {dummyPurchaseOrders.length} Purchase Order
//               {dummyPurchaseOrders.length !== 1 ? "s" : ""} Found
//             </h3>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <span
//             className="text-sm font-medium"
//             style={{ color: colors.text.secondary }}
//           >
//             Show:
//           </span>
//           <select
//             className="px-3 py-2 text-sm rounded-lg border transition-colors"
//             style={{
//               backgroundColor: colors.background.card,
//               borderColor: colors.border.light,
//               color: colors.text.primary,
//             }}
//             defaultValue={10}
//           >
//             {[5, 10, 20, 50, 100].map((size) => (
//               <option key={size} value={size}>
//                 {size === 100 ? "All" : size}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Enhanced Table */}
//       <div
//         className="rounded-xl shadow-sm overflow-hidden"
//         style={{
//           backgroundColor: colors.background.card,
//           border: `1px solid ${colors.border.light}`,
//         }}
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1200px] text-xs md:text-sm">
//             <thead style={{ backgroundColor: colors.table.header }}>
//               <tr>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   PO Number
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Company Name
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Company Address
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Company GST
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Supplier Name
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Supplier GST
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Supplier Address
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   PAN Details
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Email
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Freight Charges
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Packaging & Forwarding
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Mode of Payment
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Delivery Address
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Delivery Period
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Billing Address
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Payment Terms
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Remarks
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Created At
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {dummyPurchaseOrders.map((order, index) => (
//                 <tr
//                   key={order.id}
//                   className={
//                     index % 2 === 0
//                       ? "bg-[#ffffff40] hover:bg-[#ffffff78]"
//                       : "bg-[#ffffff1f] hover:bg-[#ffffff78]"
//                   }
//                 >
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.poOrder}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.companyName}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{order.companyAddress}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.companyGST}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.supplierName}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.supplierGST}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{order.supplierAddress}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{order.panDetails}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">{order.email}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{order.freightCharges}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">{order.packagingAndForwarding}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{order.modeOfPayment}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{order.deliveryAddress}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{order.deliveryPeriod}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{order.billingAddress}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{order.paymentTerms}</td>
//                   <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{order.remarks}</td>
//                   <td className="px-4 py-3">
//                     <Badge
//                       colorScheme={
//                         order.status === "Approved"
//                           ? "green"
//                           : order.status === "Pending"
//                           ? "yellow"
//                           : "gray"
//                       }
//                     >
//                       {order.status}
//                     </Badge>
//                   </td>
//                   <td className="px-4 py-3">{order.createdAt}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-2">
//                       <button className="text-blue-600 hover:underline text-xs md:text-sm">
//                         View
//                       </button>
//                       <button className="text-yellow-600 hover:underline text-xs md:text-sm">
//                         Edit
//                       </button>
//                       <button className="text-red-600 hover:underline text-xs md:text-sm">
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrderTable;

const PurchaseOrderTable = (
  {
    // setLimit,
  }
) => {
  const dummyPurchaseOrders = [
    {
      id: "1",
      companyName: "Acme Corp",
      companyAddress: "123 Main St, Mumbai",
      companyGST: "27AAEPM1234C1ZV",
      poOrder: "PO-00123",
      supplierName: "John Doe",
      supplierGST: "27AAEPM5678C1ZV",
      supplierAddress: "456 Market Rd, Pune",
      panDetails: "AAEPM1234C",
      email: "john@acme.com",
      freightCharges: "5000",
      packagingAndForwarding: "Inclusive",
      modeOfPayment: "Bank Transfer",
      deliveryAddress: "789 Delivery Lane, Nashik",
      deliveryPeriod: "7-10 days",
      billingAddress: "Acme Billing, Mumbai",
      paymentTerms: "Net 30",
      remarks: "Urgent delivery required.",
      status: "Approved",
      createdAt: "2025-07-28",
    },
    {
      id: "2",
      companyName: "Globex Ltd",
      companyAddress: "22 Industrial Area, Delhi",
      companyGST: "07AAEPM4321B1ZV",
      poOrder: "PO-00124",
      supplierName: "Jane Smith",
      supplierGST: "07AAEPM8765B1ZV",
      supplierAddress: "88 Supplier Park, Delhi",
      panDetails: "AAEPM4321B",
      email: "jane@globex.com",
      freightCharges: "0",
      packagingAndForwarding: "Exclusive",
      modeOfPayment: "Cheque",
      deliveryAddress: "22 Delivery St, Delhi",
      deliveryPeriod: "5 days",
      billingAddress: "Globex Billing, Delhi",
      paymentTerms: "Advance Payment",
      remarks: "Handle with care.",
      status: "Pending",
      createdAt: "2025-07-27",
    },
    {
      id: "3",
      companyName: "Initech",
      companyAddress: "Plot 9, IT Park, Bangalore",
      companyGST: "29AAEPM9999C1ZV",
      poOrder: "PO-00125",
      supplierName: "Alice Lee",
      supplierGST: "29AAEPM8888C1ZV",
      supplierAddress: "Tech Supplier, Bangalore",
      panDetails: "AAEPM9999C",
      email: "alice@initech.com",
      freightCharges: "2000",
      packagingAndForwarding: "Inclusive",
      modeOfPayment: "Credit",
      deliveryAddress: "Initech Delivery, Bangalore",
      deliveryPeriod: "15 days",
      billingAddress: "Initech Billing, Bangalore",
      paymentTerms: "Net 60",
      remarks: "",
      status: "Draft",
      createdAt: "2025-07-26",
    },
  ];

  // const filteredPurchaseOrder = partiesData.filter((party) => {
  //   const searchLower = searchTerm.toLowerCase();

  //   const matchSearch =
  //     (party?.consignee_name?.[0]?.toLowerCase?.() || "").includes(
  //       searchLower
  //     ) ||
  //     (party?.email_id?.[0]?.toLowerCase?.() || "").includes(searchLower) ||
  //     (party?.contact_number?.[0]?.toLowerCase?.() || "").includes(
  //       searchLower
  //     ) ||
  //     (party?.type?.toLowerCase?.() || "").includes(searchLower) ||
  //     (party?.company_name?.toLowerCase?.() || "").includes(searchLower);

  //   const matchType = selectedType ? party?.type === selectedType : true;
  //   const matchRole = selectedRole
  //     ? party?.parties_type === selectedRole
  //     : true;

  //   return matchSearch && matchType && matchRole;
  // });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              {/* {filteredParties.length} Part
                  {filteredParties.length !== 1 ? "ies" : "y"} Found */}
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
            // onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.input.background,
              borderColor: colors.border.light,
              color: colors.text.primary,
            }}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size === 100 ? "All" : size}
              </option>
            ))}
          </select>
        </div>
      </div>

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
                  P.O. Number
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
                    // position: "sticky",
                    // top: 0,
                    // left: 0,
                    // zIndex: 3,
                    // backgroundColor: colors.table.header,
                  }}
                >
                  Supplier Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.table.headerText }}
                >
                  Supplier GSTIN
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
            {/* <tbody>
              {dummyPurchaseOrders.map((party, index) => (
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
                          // setEditTable(party);
                          // setshowData(true);
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
                          // setshowDeletePage(true);
                          // setDeleteId(party._id);
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
            </tbody> */}
          </table>
        </div>
      </div>

      {/* Enhanced Delete Modal */}
      {/* {showDeletePage && (
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
          )} */}
    </div>
  );
};

export default PurchaseOrderTable;