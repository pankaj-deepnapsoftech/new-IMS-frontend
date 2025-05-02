import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddInvoiceDrawer,
  closeAddPaymentDrawer,
  closeInvoiceDetailsDrawer,
  closeUpdateInvoiceDrawer,
  openAddInvoiceDrawer,
  openAddPaymentDrawer,
  openInvoiceDetailsDrawer,
  openUpdateInvoiceDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDeleteInvoiceMutation } from "../redux/api/api";
import InvoiceTable from "../components/Table/InvoiceTable";
import AddInvoice from "../components/Drawers/Invoice/AddInvoice";
import InvoiceDetails from "../components/Drawers/Invoice/InvoiceDetails";
import UpdateInvoice from "../components/Drawers/Invoice/UpdateInvoice";
import AddPayment from "../components/Drawers/Payment/AddPayment";
import { FiSearch } from "react-icons/fi";

const Invoice: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState<boolean>(false);
  const {
    isAddInvoiceDrawerOpened,
    isUpdateInvoiceDrawerOpened,
    isInvoiceDetailsDrawerOpened,
    isAddPaymentDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [id, setId] = useState<string | undefined>();

  const [deleteInvoice] = useDeleteInvoiceMutation();

  const openAddInvoiceDrawerHandler = () => {
    dispatch(openAddInvoiceDrawer());
  };
  const closeAddInvoiceDrawerHandler = () => {
    dispatch(closeAddInvoiceDrawer());
  };

  const openInvoiceDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openInvoiceDetailsDrawer());
  };
  const closeInvoiceDetailsDrawerHandler = () => {
    dispatch(closeInvoiceDetailsDrawer());
  };

  const openInvoiceUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateInvoiceDrawer());
  };
  const closeInvoiceUpdateDrawerHandler = () => {
    dispatch(closeUpdateInvoiceDrawer());
  };

  const openAddPaymentHandler = (id: string) => {
    setId(id);
    dispatch(openAddPaymentDrawer());
  };
  const closePaymentDrawerHandler = () => {
    dispatch(closeAddPaymentDrawer());
  };

  const fetchInvoiceHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "invoice/all",
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

      setData(data.invoices);
      setFilteredData(data.invoices);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const deleteInvoiceHandler = async (id: string) => {
    try {
      const response = await deleteInvoice(id).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      fetchInvoiceHandler();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInvoiceHandler();
  }, []);

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (i: any) =>
        i.creator.first_name?.toLowerCase()?.includes(searchText) ||
        i?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        i?.subtotal?.toString()?.toLowerCase()?.includes(searchText) ||
        i?.total?.toString()?.toLowerCase()?.includes(searchText) ||
        i?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        i?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (i?.createdAt &&
          new Date(i?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (i?.updatedAt &&
          new Date(i?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className=" rounded-md  px-4  pb-4 ">
      {isAddInvoiceDrawerOpened && (
        <AddInvoice
          closeDrawerHandler={closeAddInvoiceDrawerHandler}
          fetchInvoicesHandler={fetchInvoiceHandler}
        />
      )}
      {isInvoiceDetailsDrawerOpened && (
        <InvoiceDetails
          closeDrawerHandler={closeInvoiceDetailsDrawerHandler}
          id={id}
        />
      )}
      {isUpdateInvoiceDrawerOpened && (
        <UpdateInvoice
          closeDrawerHandler={closeInvoiceUpdateDrawerHandler}
          id={id}
          fetchInvoicesHandler={fetchInvoiceHandler}
        />
      )}
      {isAddPaymentDrawerOpened && (
        <AddPayment id={id} closeDrawerHandler={closePaymentDrawerHandler} />
      )}

      <div className="">
        <h1 className=" text-[35px] text-center text-white pb-6 font-[700]">Invoices</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 w-full px-4 md:px-10 mt-2">
        <FiSearch className="relative left-10 top-2 transform -translate-y-1/2 text-gray-200" />
          <input
            className="pl-10 pr-4 py-2 w-[200px] text-gray-200 text-sm  border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
            placeholder="Search roles..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button
            onClick={openAddInvoiceDrawerHandler}
            className="text-white bg-[#4b87a0d9] hover:bg-[#ffff] hover:text-black text-sm rounded-[6px] px-4 py-2 w-full md:w-[200px] transition-all"
          >
            Add New Invoice
          </button>

          <button
            onClick={fetchInvoiceHandler}
            className="text-[#fff] border border-[#fff] hover:bg-[#2D3748] hover:text-white text-sm rounded-[6px] px-4 py-2 w-full md:w-[100px] transition-all flex items-center justify-center gap-1"
          >
            <MdOutlineRefresh className="text-base" />
            Refresh
          </button>


        </div>

      </div>

      <div>
        <InvoiceTable
          isLoadingInvoices={isLoadingInvoices}
          invoices={filteredData}
          deleteInvoiceHandler={deleteInvoiceHandler}
          openInvoiceDetailsHandler={openInvoiceDetailsDrawerHandler}
          openUpdateInvoiceDrawer={openInvoiceUpdateDrawerHandler}
          openPaymentDrawer={openAddPaymentHandler}
        />
      </div>
    </div>
  );
};

export default Invoice;
