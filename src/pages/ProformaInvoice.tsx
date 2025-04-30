import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProformaInvoiceTable from "../components/Table/ProformaInvoiceTable";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { closeAddProformaInvoiceDrawer, closeProformaInvoiceDetailsDrawer, closeUpdateProformaInvoiceDrawer, openAddProformaInvoiceDrawer, openProformaInvoiceDetailsDrawer, openUpdateProformaInvoiceDrawer } from "../redux/reducers/drawersSlice";
import AddProformaInvoice from "../components/Drawers/Proforma Invoice/AddProformaInvoice";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDeleteProformaInvoiceMutation } from "../redux/api/api";
import ProformaInvoiceDetails from "../components/Drawers/Proforma Invoice/ProformaInvoiceDetails";
import UpdateProformaInvoice from "../components/Drawers/Proforma Invoice/UpdateProformaInvoice";

const ProformaInvoice: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingProformaInvoices] = useState<boolean>(false);
  const { isAddProformaInvoiceDrawerOpened, isUpdateProformaInvoiceDrawerOpened, isProformaInvoiceDetailsDrawerOpened } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [id, setId] = useState<string | undefined>();

  const [deleteProformaInvoice] = useDeleteProformaInvoiceMutation();

  const openAddProformaInvoiceDrawerHandler = () => {
    dispatch(openAddProformaInvoiceDrawer());
  }
  const closeAddProformaInvoiceDrawerHandler = () => {
    dispatch(closeAddProformaInvoiceDrawer());
  }

  const openProformaInvoiceDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProformaInvoiceDetailsDrawer());
  }
  const closeProformaInvoiceDetailsDrawerHandler = () => {
    dispatch(closeProformaInvoiceDetailsDrawer());
  }

  const openProformaInvoiceUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProformaInvoiceDrawer());
  }
  const closeProformaInvoiceUpdateDrawerHandler = () => {
    dispatch(closeUpdateProformaInvoiceDrawer());
  }

  const fetchProformaInvoiceHandler = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'proforma-invoice/all', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setData(data.proforma_invoices);
      setFilteredData(data.proforma_invoices);
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    }
  }

  const deleteProformaInvoiceHandler = async (id: string) => {
    try {
      const response = await deleteProformaInvoice(id).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      fetchProformaInvoiceHandler();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    fetchProformaInvoiceHandler();
  }, [])

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (pi: any) =>
        pi.creator.first_name?.toLowerCase()?.includes(searchText) ||
        pi?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        pi?.subtotal?.toString()?.toLowerCase()?.includes(searchText) ||
        pi?.total?.toString()?.toLowerCase()?.includes(searchText) ||
        pi?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        pi?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (pi?.createdAt &&
          new Date(pi?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (pi?.updatedAt &&
          new Date(pi?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey])

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className=" bg-white shadow-sm pb-4  rounded-md h-full">

      {isAddProformaInvoiceDrawerOpened && <AddProformaInvoice closeDrawerHandler={closeAddProformaInvoiceDrawerHandler} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}
      {isProformaInvoiceDetailsDrawerOpened && <ProformaInvoiceDetails closeDrawerHandler={closeProformaInvoiceDetailsDrawerHandler} id={id} />}
      {isUpdateProformaInvoiceDrawerOpened && <UpdateProformaInvoice closeDrawerHandler={closeProformaInvoiceUpdateDrawerHandler} id={id} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}

      <div>

        <h1 className=" text-center font-[700] pb-4 text-2xl pt-2"> Proforma Invoices</h1>

        <div className="mt-2 w-full flex flex-col md:flex-row md:items-center md:justify-center gap-2 px-4 md:px-10">
          <textarea
            className="rounded-[10px] w-full md:w-auto px-3 py-2 text-sm border resize-none bg-white"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          <button
            className="text-white bg-[#2D3748] hover:bg-[#2d3748c9] hover:text-white text-sm rounded-[6px] px-4 py-2 w-full md:w-[210px] transition-all"
            onClick={openAddProformaInvoiceDrawerHandler}
          >
            Add New Proforma Invoice
          </button>

          <button
            className="text-[#2D3748] border border-[#2D3748] hover:bg-[#2D3748] hover:text-white text-sm rounded-[6px] px-4 py-2 w-full md:w-[100px] transition-all flex items-center justify-center gap-1"
            onClick={fetchProformaInvoiceHandler}
          >
            <MdOutlineRefresh className="text-base" />
            Refresh
          </button>
        </div>

      </div>

      <div>
        <ProformaInvoiceTable isLoadingProformaInvoices={isLoadingProformaInvoices} proformaInvoices={filteredData} deleteProformaInvoiceHandler={deleteProformaInvoiceHandler} openProformaInvoiceDetailsHandler={openProformaInvoiceDetailsDrawerHandler} openUpdateProformaInvoiceDrawer={openProformaInvoiceUpdateDrawerHandler} />
      </div>
    </div>
  );
};

export default ProformaInvoice;
