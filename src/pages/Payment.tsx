import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PaymentTable from "../components/Table/PaymentTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closePaymentDetailsDrawer,
  closeUpdatePaymentDrawer,
  openPaymentDetailsDrawer,
  openUpdatePaymentDrawer,
} from "../redux/reducers/drawersSlice";
import PaymentDetails from "../components/Drawers/Payment/PaymentDetails";
import UpdatePayment from "../components/Drawers/Payment/UpdatePayment";
import { FiSearch } from "react-icons/fi";

const Payment: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const { isUpdatePaymentDrawerOpened, isPaymentDetailsDrawerOpened } =
    useSelector((state: any) => state.drawers);
  const [id, setId] = useState<string | undefined>();

  const fetchPaymentsHandler = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "payment/all",
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
      setData(data.payments);
      setFilteredData(data.payments);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const openPaymentDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openPaymentDetailsDrawer());
  };
  const closePaymentDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(closePaymentDetailsDrawer());
  };

  const openPaymentUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdatePaymentDrawer());
  };
  const closePaymentUpdateDrawerHandler = () => {
    setId(id);
    dispatch(closeUpdatePaymentDrawer());
  };

  useEffect(() => {
    fetchPaymentsHandler();
  }, []);

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (p: any) =>
        p.creator.first_name?.toLowerCase()?.includes(searchText) ||
        p?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        p?.amount?.toString()?.toLowerCase()?.includes(searchText) ||
        p?.mode?.toLowerCase()?.includes(searchText) ||
        p?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        p?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (p?.createdAt &&
          new Date(p?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (p?.updatedAt &&
          new Date(p?.updatedAt)
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
    <div className=" rounded-md  px-4  pb-4 pt-2 ">
      {isPaymentDetailsDrawerOpened && (
        <PaymentDetails
          closeDrawerHandler={closePaymentDetailsDrawerHandler}
          id={id}
        />
      )}
      {isUpdatePaymentDrawerOpened && (
        <UpdatePayment
          closeDrawerHandler={closePaymentUpdateDrawerHandler}
          id={id}
          fetchPaymentsHandler={fetchPaymentsHandler}
        />
      )}

      <div>
        <h1 className=" text-[35px] text-center text-white pb-4 font-[700]">Payments</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 w-full px-4 md:px-10 mt-2">
        <FiSearch className="relative left-10 top-2 transform -translate-y-1/2 text-gray-200" />
          <input
            className="pl-10 pr-4 py-2 w-[200px] text-gray-200 text-sm  border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
            placeholder="Search roles..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

          <button
            onClick={fetchPaymentsHandler}
            className="text-white border border-white hover:bg-[#2D3748] hover:text-white text-sm rounded-[6px] px-4 py-2 w-full md:w-[100px] transition-all flex items-center justify-center gap-1"
          >
            <MdOutlineRefresh className="text-base" />
            Refresh
          </button>
        </div>

      </div>

      <div>
        <PaymentTable
          isLoadingPayments={isLoadingPayments}
          payments={filteredData}
          payment={filteredData}
          openPaymentDetailsDrawerHandler={openPaymentDetailsDrawerHandler}
          openUpdatePaymentDrawer={openPaymentUpdateDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Payment;
