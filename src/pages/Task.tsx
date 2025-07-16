/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { colors } from "../theme/colors";

import {
  FaCheck,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaDollarSign,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { VStack, HStack, Text, Button, Badge, Icon } from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import AddToken from "../components/Drawers/Task/AddToken";
import AddhalfToken from "../components/Drawers/Task/AddhalfToken";

import UploadInvoice from "../components/Drawers/Task/UploadInvoice";
import Loading from "../ui/Loading";
import EmptyData from "../ui/emptyData";
const Task = () => {
  const [cookies] = useCookies();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [showToken, setShowToken] = useState(false);
  const [showhalfToken, setShowhalfToken] = useState(false);
  const [saleId, setSaleId] = useState("");
  const [tokenAmount, setTokenAmount] = useState();
  const [invoicefile, setInvoiceFile] = useState("");
  const [limit, setlimit] = useState(10);
  const [TotalPage, setTotalPage] = useState(0);

  const role = cookies?.role;

  const [halfAmountId, sethalfAmountId] = useState("");
  const [halfAmount, sethalfAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}assined/get-assined?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const tasks = response.data.data.map((task: any) => {
        const sale = task?.sale_id?.length ? task.sale_id[0] : null;
        const product = sale?.product_id?.length ? sale.product_id[0] : null;
        const assign = task?.assined_by?.length ? task.assined_by[0] : null;
        const customer = task?.sale_id[0]?.party_id
          ? task?.sale_id[0]?.party_id[0]
          : null;
        const user = task?.sale_id[0]?.user_id
          ? task?.sale_id[0]?.user_id[0]
          : null;

        return {
          id: task?._id,
          date: new Date(task.createdAt).toLocaleDateString(),
          productName: product?.name || "No product name",
          productQuantity: sale?.product_qty || 0,
          productPrice: `${sale?.price || 0} /-`,
          assignedBy: assign?.first_name || "Unknown",
          role: assign?.role || "No role",
          design_status: task?.isCompleted || "N/A",
          customer_design_comment:
            sale?.customer_design_comment || "No comment",
          sale_id: sale?._id || "No sale ID",
          assinedby_comment: task?.assinedby_comment || "No comment",
          assined_process: task?.assined_process || "No process",
          bom: sale?.bom || [],
          customer_name: customer?.full_name,
          company_name: customer?.company_name,
          sale_by: user?.first_name,
          invoice: sale?.invoice,
          payment_verify: sale?.payment_verify,
          paymet_status: sale?.paymet_status,
          customer_pyement_ss: sale?.customer_pyement_ss,
          token_amt: sale?.token_amt,
          token_status: sale?.token_status,
          token_ss: sale?.token_ss,
          isTokenVerify: sale?.isTokenVerify,
          sample_bom_name: sale?.bom[0]?.bom_name,
          bom_name: sale?.bom[1]?.bom_name,
          sale_design_comment: sale?.sale_design_comment,
          sample_image: sale?.sample_image,
          allsale: sale,
          isSampleApprove: sale?.isSampleApprove,
        };
      });
      setTasks(tasks);
      let totalData = response?.data?.totalData || 0;
      let totalPages = Math.ceil(totalData / limit);
      setTotalPage(totalPages);

      console.log(totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleAccept = async (id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}assined/update-status/${id}`,
        { isCompleted: "UnderProcessing" },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      toast.success(response.data.message);
      fetchTasks();
    } catch (error) {
      console.log(error);

      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorChange = (color) => {
    if (color === "Pending") {
      return "orange";
    } else if (color === "Reject" || color === "Design Rejected") {
      return "red";
    } else if (color === false) {
      return "orange";
    } else {
      return "green";
    }
  };

  const handleDone = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}assined/update-status/${id}`,
        { isCompleted: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchTasks();
    } catch (error) {
      console.log(error);

      toast.error(error);
    }
  };

  const handleBOM = (id) => {
    //console.log(id);
    navigate("/production/bom", { state: { id } });
  };

  const handleSampleImage = (file: any) => {
    setsampleFile(file);
    sampleimageDisclosure.onOpen();
  };

  const handlePayment = (
    id: any,
    payment: string,
    verify: boolean,
    assignId: any,
    payfor: string
  ) => {
    setSaleId(id);
    setPaymentFile(payment);
    setVerifyStatus(verify);
    setAssignId(assignId);
    setPaymentFor(payfor);
    paymentDisclosure.onOpen();
  };

  const handleTokenClick = (id: any, amount: number) => {
    setSaleId(id);
    setTokenAmount(amount);
    tokenDisclosure.onOpen();
  };

  // const openAccountModal = (
  //   designFile: string,
  //   purchase: object,
  //   approve: string
  // ) => {
  //   setSelectedData(purchase);
  //   onAccountpreviewOpen();
  // };

  const handleVerifyImage = async () => {
    const data = {
      half_payment_status: "Paid",
      half_payment_approve: true,
    };
    onViewHalfPaymentssClose();
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}purchase/update/${halfAmountId.sale_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      toast.success("Half amount Verify");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [cookies?.access_token, page, limit]);

  if (isLoading) {
    return <Loading />;
  }
  if (!tasks || tasks.length === 0) {
    return <EmptyData />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.page }}
    >
      <div className="p-2 lg:p-3">
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
              Task Management
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: colors.text.secondary }}
            >
              Manage and track assigned tasks
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div
          className="rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          style={{
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
              >
                <option>Select Status</option>
                <option>Under Processing</option>
                <option>Completed</option>
              </select>

              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                style={{
                  backgroundColor: colors.input.background,
                  borderColor: colors.input.border,
                  color: colors.text.primary,
                }}
              />

              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                />
                <input
                  type="text"
                  placeholder="Search by Product or Manager"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-3 transition-colors"
                  style={{
                    backgroundColor: colors.input.background,
                    borderColor: colors.input.border,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>

            <button
              onClick={fetchTasks}
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
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <div
              key={task?._id}
              className="rounded-xl shadow-sm border border-gray-100 p-6"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.light,
              }}
            >
              {/* Task Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {task?.productName}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Task ID: {task?.id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        colorChange(task?.design_status) === "orange"
                          ? colors.warning[100]
                          : colorChange(task?.design_status) === "red"
                          ? colors.error[100]
                          : colors.success[100],
                      color:
                        colorChange(task?.design_status) === "orange"
                          ? colors.warning[700]
                          : colorChange(task?.design_status) === "red"
                          ? colors.error[700]
                          : colors.success[700],
                    }}
                  >
                    {task?.design_status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    Quantity
                  </p>
                  <p className="text-sm" style={{ color: colors.text.primary }}>
                    {task?.productQuantity}
                  </p>
                </div>

                {(role === "Accountant" ||
                  role === "Sales" ||
                  role === "admin") && (
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Product Price
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {task?.productPrice}
                    </p>
                  </div>
                )}

                {["acc", "account", "accountant", "dispatch", "dis"].includes(
                  role?.toLowerCase()
                ) && (
                  <>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Party
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task?.customer_name}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Sale By
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task?.sale_by}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Assigned By
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task?.assignedBy}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.text.secondary }}
                  >
                    Date
                  </p>
                  <p className="text-sm" style={{ color: colors.text.primary }}>
                    {task?.date}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex flex-wrap gap-3 pt-4 border-t"
                style={{ borderColor: colors.border.light }}
              >
                {role?.toLowerCase().includes("prod") ? (
                  <>
                    {task?.design_status === "Pending" && (
                      <button
                        onClick={() => handleAccept(task.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: colors.success[500],
                          color: colors.text.inverse,
                        }}
                      >
                        <FaCheck size="14px" />
                        Accept Task
                      </button>
                    )}

                    {task?.bom?.length === 2 && (
                      <button
                        onClick={() => handleBOM(task.sale_id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                        style={{
                          borderColor: colors.border.medium,
                          color: colors.text.primary,
                          backgroundColor: colors.background.card,
                        }}
                      >
                        View BOM
                      </button>
                    )}

                    {task?.design_status !== "Completed" && (
                      <button
                        onClick={() => handleDone(task.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: colors.primary[500],
                          color: colors.text.inverse,
                        }}
                      >
                        <FaCheckCircle size="14px" />
                        Mark Complete
                      </button>
                    )}
                  </>
                ) : ["accountant", "acc"].includes(role?.toLowerCase()) ? (
                  <>
                    {task?.design_status === "Pending" && (
                      <button
                        onClick={() => handleAccept(task.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: colors.success[500],
                          color: colors.text.inverse,
                        }}
                      >
                        <FaCheck size="14px" />
                        Accept Task
                      </button>
                    )}
                  </>
                ) : (
                  task?.design_status === "Pending" && (
                    <button
                      onClick={() => handleAccept(task.id)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: colors.success[500],
                        color: colors.text.inverse,
                      }}
                    >
                      <FaCheck size="14px" />
                      Accept Task
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination page={page} setPage={setPage} TotalPage={TotalPage} />
        </div>
      </div>

      {/* Modals */}
      {/* <AddToken showToken={showToken} setShowToken={setShowToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} />
      <UploadInvoice showUploadInvoice={showUploadInvoice} setShowUploadInvoice={setShowUploadInvoice} sale={saleId} invoicefile={invoicefile} />
      <AddhalfToken showhalfToken={showhalfToken} setShowhalfToken={setShowhalfToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} /> */}
    </div>
  );
};

export default Task;

