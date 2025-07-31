import { FaQuoteLeft, FaRegCheckCircle } from "react-icons/fa";
import { IoDocumentTextOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineShoppingCart, MdOutlineSpeed, MdOutlineSell, MdOutlineAttachMoney, MdOutlinePayment, MdOutlineProductionQuantityLimits, MdTask } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import { RiBillLine } from "react-icons/ri";
import { TbLockAccess, TbTruckDelivery, TbUsersGroup } from "react-icons/tb";
import { SlDirection } from "react-icons/sl";
import { FaHandsHelping } from "react-icons/fa";
import { SiScrapy } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { VscServerProcess } from "react-icons/vsc";
import { GiProgression } from "react-icons/gi";
import Products from "../pages/Products";
import Approvals from "../pages/Approvals";
import Stores from "../pages/Stores";
import Buyers from "../pages/Buyers";
import Sellers from "../pages/Sellers";
import BOM from "../pages/BOM";  


import UserRole from "../pages/UserRoles";
import Employees from "../pages/Emloyees";
import ProformaInvoice from "../pages/ProformaInvoice";
import Invoice from "../pages/Invoice";
import Payment from "../pages/Payment";
import Process from "../pages/Process";
import IndirectProducts from "../pages/IndirectProducts";
import WIPProducts from "../pages/WIPProducts";
import InventoryApprovals from "../pages/InventoryApprovals";
import Userprofile from "../pages/Userprofile";
import Sales from "../pages/Sales";
import Dispatch from "../pages/Dispatch";
import Parties from "../pages/Parties";
import { IoIosPeople } from "react-icons/io";
import Task from "../pages/Task";
import { Box, Calendar, Component, Construction, Container, HandCoins, Presentation, ScanBarcode, ShieldCheck, TicketPercent, Workflow } from "lucide-react";
import Dashboard from "../pages/Dashboard";
import Planning from "../pages/Planning";
import Designing from "../pages/Designing";
import Supplier from "../pages/Supplier";
import Scheduling from "../pages/Scheduling";
import Quality from "../pages/Quality";
import Maintenance from "../pages/Maintenance";
import Scrap from "../pages/Scrap";
import RawMaterialApprovals from "../pages/RawMaterialApprovals";
import ResourcesApproval from "../pages/ResourcesApproval";
import Packaging from "../pages/Packaging";
import Vouchers from "../pages/Vouchers";
import Integration from "../pages/Integration";
import PurchaseOrder from "../pages/PurchaseOrder";
import Precurement from "../pages/Precurement";

const routes = [
  {
    name: "Dashboard",
    icon: <MdOutlineSpeed />,
    path: "",
    element: <Dashboard />,
    isSublink: false,
  },
  {
    name: "Employees",
    icon: <FaPeopleGroup />,
    path: "employee",
    element: <Employees />,
    isSublink: false,
  },
  {
    name: "User Roles",
    icon: <TbLockAccess />,
    path: "role",
    element: <UserRole />,
    isSublink: false,
  },
  {
    name: "Merchant",
    icon: <IoIosPeople />,
    path: "merchant",
    element: <Parties />,
    isSublink: false,
  },
  {
    name: "Inventory",
    icon: <MdOutlineShoppingCart />,
    path: "inventory",
    sublink: [
      {
        name: "Direct",
        icon: <SlDirection />,
        path: "direct",
        element: <Products />,
      },
      {
        name: "Work In Progress",
        icon: <GiProgression />,
        path: "wip",
        element: <WIPProducts />,
      },
      {
        name: "Indirect",
        icon: <FaHandsHelping />,
        path: "indirect",
        element: <IndirectProducts />,
      },
      {
        name: "Inventory Approvals",
        icon: <FaRegCheckCircle />,
        path: "approval",
        element: <InventoryApprovals />,
      },
    ],
    isSublink: true,
  },
  {
    name: "Sales Order",
    icon: <HandCoins />,
    path: "sales",
    element: <Sales />,  
    isSublink: false,
  },

  {
    name: "Precurement",
    icon: <Box />,
    path: "precurement",
    element: <Precurement />,
    isSublink: false,
  },

  {
    name: "Production",
    path: "production",
    icon: <MdOutlineProductionQuantityLimits />,
    sublink: [
      {
        name: "BOM",
        icon: <RiBillLine />,
        path: "bom",
        element: <BOM />,
      },
      {
        name: "Raw Material Approval",
        icon: <RiBillLine />,
        path: "raw-material-approval",
        element: <RawMaterialApprovals />, 
      },
      {
        name: "Resources Approval",
        icon: <RiBillLine />,
        path: "resources-approval",
        element: <ResourcesApproval />,
      },
      {
        name: "Production Process",
        icon: <VscServerProcess />,
        path: "production-process",
        element: <Process />,
      },
      {
        name: "Quality",
        icon: <ShieldCheck />,
        path: "quality",
        element: <Quality />,
      },
      {
        name: "Packaging",
        icon: <Box />,
        path: "packaging",
        element: <Packaging />,
      },
    ],
    isSublink: true,
  },
  {
    name: "Dispatch",
    icon: <TbTruckDelivery />,
    path: "dispatch",
    element: <Dispatch />,
    isSublink: false,
  },
  {
    name: "Accounts",
    path: "accounts",
    icon: <BiPurchaseTagAlt />,
    sublink: [
      {
        name: "Proforma Invoices",
        icon: <IoDocumentTextOutline />,
        path: "proforma-invoice",
        element: <ProformaInvoice />,
      },
      {
        name: "Tax Invoices",
        icon: <RiBillLine />,
        path: " taxInvoice",
        element: <Invoice />,
      },
      {
        name: "Purchase Order",
        icon: <ScanBarcode />,
        path: "purchase-order",
        element: <PurchaseOrder />,
      },
      {
        name: "Payments",
        icon: <MdOutlinePayment />,
        path: "payment",
        element: <Payment />,
      },
      {
        name: "Vouchers",
        icon: <TicketPercent />,
        path: "voucher",
        element: <Vouchers />,
      },
    ],
    isSublink: true,
  },
  {
    name: "Integration",
    icon: <Workflow />,
    path: "integration",
    element: <Integration />,
  },
  {
    name: "Designing",
    icon: <Component />,
    path: "designing",
    element: <Designing />,
    isSublink: false,
  },
  {
    name: "Planning",
    icon: <Presentation />,
    path: "planning",
    element: <Planning />,
    isSublink: false,
  },
  {
    name: "Supplier",
    icon: <Container />,
    path: "supplier",
    element: <Supplier />,
    isSublink: false,
  },
  {
    name: "Scheduling",
    icon: <Calendar />,
    path: "scheduling",
    element: <Scheduling />,
    isSublink: false,
  },

  {
    name: "Maintenance",
    icon: <Construction />,
    path: "maintenance",
    element: <Maintenance />,
    isSublink: false,
  },

  {
    name: "Task",
    icon: <MdTask />,
    path: "task",
    element: <Task />,
    isSublink: false,
  },

  {
    name: "Scrap Management",
    icon: <SiScrapy />,
    path: "scrap",
    element: <Scrap />,
    isSublink: false,
  },
  {
    name: "Store",
    icon: <IoStorefrontOutline />,
    path: "store",
    element: <Stores />,
    isSublink: false,
  },
  {
    name: "Admin Approval",
    icon: <FaRegCheckCircle />,
    path: "approval",
    element: <Approvals />,
    isSublink: false,
  },
  // {
  //   name: "Merchant",
  //   path: "merchant",
  //   icon: <TbUsersGroup />,
  //   sublink: [
  //     {
  //       name: "Buyer",
  //       icon: <MdOutlineAttachMoney />,
  //       path: "buyer",
  //       element: <Buyers />,
  //     },
  //     {
  //       name: "Supplier",
  //       icon: <MdOutlineSell />,
  //       path: "supplier",
  //       element: <Sellers />,
  //     },
  //   ],
  //   isSublink: true
  // },

  // {
  //   name: "Dispatch",
  //   path: "dispatch",
  //   element: <Dispatch />,
  //   isSublink: false
  // },
  {
    name: "User Profile",
    icon: <CgProfile />,
    path: "userprofile",
    element: <Userprofile />,
    isSublink: false,
  },
];

export default routes;
