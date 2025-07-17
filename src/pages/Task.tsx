/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
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
import { MdOutlineRefresh, MdAdd } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { VStack, HStack, Text, Button, Badge, Icon } from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import AddToken from "../components/Drawers/Task/AddToken";
import AddhalfToken from "../components/Drawers/Task/AddhalfToken";
// import UploadInvoice from "../components/Drawers/Task/UploadInvoice";
import Loading from "../ui/Loading";
import EmptyData from "../ui/emptyData";
import { colors } from "../theme/colors";
import { CheckSquare } from "lucide-react";
const Task = () => {
  const [cookies] = useCookies();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [showToken, setShowToken] = useState(false);
  const [showhalfToken, setShowhalfToken] = useState(false);
  const [saleId, setSaleId] = useState("");
  const [tokenAmount, setTokenAmount] = useState();
  const [invoicefile, setInvoiceFile] = useState("");
  const [limit, setlimit] = useState(10);
  const [TotalPage, setTotalPage] = useState(0);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [processFilter, setProcessFilter] = useState<string>("");

  const role = cookies?.role;

  const [halfAmountId, sethalfAmountId] = useState("");
  const [halfAmount, sethalfAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [showUploadInvoice, setShowUploadInvoice] = useState(false);

  // Additional state variables for missing functionality
  const [selectedData, setSelectedData] = useState(null);
  const [sampleFile, setsampleFile] = useState("");
  const [paymentFile, setPaymentFile] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [assignId, setAssignId] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
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
      // console.log("testing", response);
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
      setFilteredTasks(tasks);
      let totalData = response?.data?.totalData || 0;
      let totalPages = Math.ceil(totalData / limit);
      setTotalPage(totalPages);

      // console.log(totalPage)
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
    // onViewHalfPaymentssClose()
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

  // Additional missing functions
  const sampleimageDisclosure = {
    onOpen: () => {},
    onClose: () => {},
  };

  const paymentDisclosure = {
    onOpen: () => {},
    onClose: () => {},
  };

  const tokenDisclosure = {
    onOpen: () => {},
    onClose: () => {},
  };

  const onViewHalfPaymentssClose = () => {};

  useEffect(() => {
    fetchTasks();
  }, [cookies?.access_token, page, limit]);

  // Filter tasks based on search and filters
  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = tasks.filter((task: any) => {
      const matchesSearch =
        !searchTxt ||
        task.productName?.toLowerCase()?.includes(searchTxt) ||
        task.assignedBy?.toLowerCase()?.includes(searchTxt) ||
        task.customer_name?.toLowerCase()?.includes(searchTxt) ||
        task.company_name?.toLowerCase()?.includes(searchTxt) ||
        task.assined_process?.toLowerCase()?.includes(searchTxt);

      const matchesStatus =
        !statusFilter || task.design_status === statusFilter;
      const matchesProcess =
        !processFilter || task.assined_process === processFilter;

      return matchesSearch && matchesStatus && matchesProcess;
    });
    setFilteredTasks(results);
  }, [searchKey, statusFilter, processFilter, tasks]);

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
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <CheckSquare className="text-white" size={24} />
              </div>
              <div>
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
                  Manage and track assigned tasks and processes
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchTasks}
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
          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Search Tasks
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.text.secondary }}
                />
                <input
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
                  placeholder="Search by product, manager, customer..."
                  value={searchKey || ""}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="UnderProcessing">Under Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Process Filter */}
            <div className="w-full lg:w-48">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Process
              </label>
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
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
                <option value="">All Processes</option>
                <option value="Design">Design</option>
                <option value="Production">Production</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4 mb-6">
          {filteredTasks.map((task: any) => (
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
                    className="text-sm mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {task?.date} • Assigned by {task?.assignedBy}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        task?.design_status === "Completed"
                          ? colors.success[100]
                          : task?.design_status === "UnderProcessing"
                          ? colors.warning[100]
                          : colors.gray[100],
                      color:
                        task?.design_status === "Completed"
                          ? colors.success[800]
                          : task?.design_status === "UnderProcessing"
                          ? colors.warning[800]
                          : colors.gray[800],
                    }}
                  >
                    {task?.design_status}
                  </span>
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  {(role === "Accountant" ||
                    role === "Sales" ||
                    role === "admin") && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Product Price:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task?.productPrice}
                      </span>
                    </div>
                  )}
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Quantity:
                    </span>
                    <span
                      className="ml-2 text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {task?.productQuantity}
                    </span>
                  </div>
                  {["acc", "account", "accountant", "dispatch", "dis"].includes(
                    role?.toLowerCase()
                  ) && (
                    <>
                      <div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          Party:
                        </span>
                        <span
                          className="ml-2 text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {task?.customer_name}
                        </span>
                      </div>
                      <div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          Sale By:
                        </span>
                        <span
                          className="ml-2 text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {task?.sale_by}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Assigned Process:
                    </span>
                    <span
                      className="ml-2 text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {task?.assined_process}
                    </span>
                  </div>
                  {task?.assinedby_comment && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Remarks:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task.assinedby_comment}
                      </span>
                    </div>
                  )}
                  {task?.sample_bom_name && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Sample BOM:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task.sample_bom_name}
                      </span>
                    </div>
                  )}
                  {task?.bom_name && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        BOM Name:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {task.bom_name}
                      </span>
                    </div>
                  )}
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: colors.button.primary,
                          color: colors.text.inverse,
                        }}
                        onClick={() => handleAccept(task.id)}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor =
                              colors.button.primaryHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor =
                              colors.button.primary;
                          }
                        }}
                      >
                        Accept Task
                      </button>
                    )}
                    {task?.bom?.length === 2 ? (
                      <span
                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: colors.success[100],
                          color: colors.success[800],
                        }}
                      >
                        BOM: Created
                      </span>
                    ) : (
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                        style={{
                          borderColor: colors.border.medium,
                          color: colors.text.primary,
                          backgroundColor: colors.background.card,
                        }}
                        onClick={() => handleBOM(task.sale_id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.gray[50];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.background.card;
                        }}
                      >
                        Create BOM
                      </button>
                    )}
                    {task?.design_status !== "Completed" && (
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: colors.button.secondary,
                          color: colors.text.inverse,
                        }}
                        onClick={() => handleDone(task.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.button.secondaryHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.button.secondary;
                        }}
                      >
                        <FaCheck size="16px" />
                        Task Done
                      </button>
                    )}
                  </>
                ) : ["accountant", "acc"].includes(role?.toLowerCase()) ? (
                  <>
                    {task?.design_status === "Pending" && (
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: colors.button.primary,
                          color: colors.text.inverse,
                        }}
                        onClick={() => handleAccept(task.id)}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor =
                              colors.button.primaryHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor =
                              colors.button.primary;
                          }
                        }}
                      >
                        Accept Task
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} TotalPage={TotalPage} />

        {/* Modals */}
        <AddToken
          showToken={showToken}
          setShowToken={setShowToken}
          tokenAmount={tokenAmount}
          sale={saleId}
          refresh={fetchTasks}
        />
        {/* <UploadInvoice
          showUploadInvoice={showUploadInvoice}
          setShowUploadInvoice={setShowUploadInvoice}
          sale={saleId}
          invoicefile={invoicefile}
        /> */}
        <AddhalfToken
          showhalfToken={showhalfToken}
          setShowhalfToken={setShowhalfToken}
          tokenAmount={tokenAmount}
          sale={saleId}
          refresh={fetchTasks}
        />
      </div>
    </div>
  );
};

export default Task;
