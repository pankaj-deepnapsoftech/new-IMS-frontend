/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck 

import axios from "axios"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import Pagination from "./Pagination";
import { toast } from "react-toastify";

import { FaCheck, FaCheckCircle, FaCloudUploadAlt, FaDollarSign, FaHourglassHalf, FaMoneyBillWave, FaMoneyCheckAlt, FaShieldAlt, FaTimesCircle, FaUpload } from "react-icons/fa";
import {
  // Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  // Input,
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalCloseButton,
  // ModalBody,
  // ModalFooter,
  // FormControl,
  // FormLabel,
  // useDisclosure,
  // useColorModeValue,
  // Select,
  // Spinner,
  // Img,
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import AddToken from "../components/Drawers/Task/AddToken";
import AddhalfToken from "../components/Drawers/Task/AddhalfToken";
<<<<<<< HEAD

import UploadInvoice from "../components/Drawers/Task/UploadInvoice";
import Loading from "../ui/Loading";
import EmptyData from "../ui/emptyData";
import UploadDesignFile from "../components/Drawers/UploadDesignFile";
=======
import UploadInvoice from "../components/Drawers/Task/UploadInvoice";
import Loading from "../ui/Loading";
import EmptyData from "../ui/emptyData";
import { colors } from "../theme/colors";
import { CheckSquare, Calendar, User, Package, Building } from "lucide-react";
>>>>>>> 219cd9502d3335e4516df6edfbb822efc25a62fd
const Task = () => {
  const [cookies] = useCookies();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [showToken, setShowToken] = useState(false)
  const [showhalfToken, setShowhalfToken] = useState(false)
  const [saleId, setSaleId] = useState("");
  const [tokenAmount, setTokenAmount] = useState();
  const [invoicefile, setInvoiceFile] = useState("")
  const [limit, setlimit] = useState(10)
  const [TotalPage, setTotalPage] = useState(0)
  const [showDesignUpload, setShowDesignUpload] = useState(false);

  const role = cookies?.role;



  const [halfAmountId, sethalfAmountId] = useState("")
  const [halfAmount, sethalfAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTasks = async () => {
    try {
      setIsLoading(true)
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

      console.log(totalPage)
    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  }


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
<<<<<<< HEAD
      half_payment_approve: true
=======
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
>>>>>>> 219cd9502d3335e4516df6edfbb822efc25a62fd
    }
    onViewHalfPaymentssClose()
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}purchase/update/${halfAmountId.sale_id}`, data, {
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      })
      toast.success("Half amount Verify")
    } catch (error) {
      console.log(error)
    }
  }

<<<<<<< HEAD

=======
>>>>>>> 219cd9502d3335e4516df6edfbb822efc25a62fd
  useEffect(() => {
    fetchTasks();

  }, [cookies?.access_token, page, limit]);


  if (isLoading) {
<<<<<<< HEAD
    return <Loading />
  }
  if (!tasks || tasks.length === 0) {
    return <EmptyData />
  }


  return (
    <section>
      <div className="min-h-screen p-6 text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select className=" rounded px-4 py-2 bg-[#646b75] focus:outline-none text-gray-100">
            <option className="text-white">Select Status</option>
            <option className="text-white">Under Processing</option>
            <option className="text-white">Completed</option>
          </select>
          <input type="date" className=" styled-date rounded focus:outline-none px-4 py-2 bg-[#ffffff2a] text-gray-100 placeholder:text-gray-100" />
          <input
            type="text"
            placeholder="Search by Product or Manager"
            className=" focus:outline-none rounded px-4 py-2 flex-grow bg-[#ffffff2a] text-gray-100"
          />
          <button onClick={fetchTasks} className="border border-blue-400 text-blue-400 px-4 py-1.5 rounded hover:bg-blue-400 hover:text-white transition-all duration-300">
            ⟳ Refresh
          </button>
        </div>

        {tasks.map((task: any) => (
          <div key={task?._id} className="rounded-md shadow-md p-6 bg-[#ffffff2a] mb-4">

            <div className="flex flex-wrap gap-2 mt-6">
              {["acc", "account", "accountant", "dispatch", "dis"].includes(role?.toLowerCase()) && (
                <HStack wrap="wrap" spacing={2}>
                  {/* {task?.token_amt && !task?.token_status && (
                    <Badge
                      colorScheme="orange"
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={FaHourglassHalf} />
                      Token: Pending
                    </Badge>
                  )} */}

                  {/* {task?.token_amt && task?.token_status && (
                    <Badge
                      colorScheme="green"
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={FaCheckCircle} />
                      Token: Paid
                    </Badge>
                  )} */}

                  {/* {typeof task?.isTokenVerify === "boolean" && (
                    <Badge
                      colorScheme={task.isTokenVerify ? "green" : "orange"}
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={task.isTokenVerify ? FaShieldAlt : FaHourglassHalf} />
                      Token Verification: {task.isTokenVerify ? "Verified" : "Pending"}
                    </Badge>
                  )} */}

                  {/* {task?.allsale?.half_payment_status && (
                    <Badge
                      colorScheme="green"
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={FaMoneyCheckAlt} />
                      Half Payment: {task.allsale.half_payment_status}
                    </Badge>
                  )} */}

                  {/* {task?.payment_status && (
                    <Badge
                      colorScheme={colorChange(task.payment_status)}
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={FaDollarSign} />
                      Payment: {task.payment_status}
                    </Badge>
                  )} */}

                  {/* {typeof task?.payment_verify === "boolean" && (
                    <Badge
                      colorScheme={colorChange(task.payment_verify)}
                      fontSize="sm"
                      px={3}
                      py={1}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={task.payment_verify ? FaCheckCircle : FaTimesCircle} />
                      Payment Verification: {task.payment_verify ? "Verified" : "Not Verified"}
                    </Badge>
                  )} */}
                </HStack>
              )}
            </div>


            <HStack justify="space-between" spacing={3} mt={3} flexWrap="wrap" align="start" gap={4}>
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                {(role === "Accountant" || role === "Sales" || role === "admin") && (
                  <Text fontSize="sm" ><strong>Product Price:</strong> {task?.productPrice}</Text>
                )}
                <Text fontSize="sm" ><strong>Quantity:</strong> {task?.productQuantity}</Text>
                {["acc", "account", "accountant", "dispatch", "dis"].includes(role?.toLowerCase()) && (
                  <>
                    <Text fontSize="sm" ><strong>Party:</strong> {task?.customer_name}</Text>
                    <Text fontSize="sm" ><strong>Sale By:</strong> {task?.sale_by}</Text>
                    <Text fontSize="sm" ><strong>Assigned By:</strong> {task?.assignedBy}</Text>
                  </>
                )}
              </VStack>

              <VStack align={{ base: "start", md: "end" }} w={{ base: "100%", md: "48%" }}>
                <Text fontSize="sm"><strong>Assigned Process:</strong> {task?.assined_process}</Text>
                {task?.assinedby_comment && (
                  <Text fontSize="sm"><strong>Remarks:</strong> {task.assinedby_comment}</Text>
                )}
                {task?.sample_bom_name && (
                  <Text fontSize="sm" color="gray.200"><strong className="text-white">Sample BOM Name:</strong> {task.sample_bom_name}</Text>
                )}
                {task?.bom_name && (
                  <Text fontSize="sm" color="gray.200"><strong className="text-white">BOM Name:</strong> {task.bom_name}</Text>
                )}
                {/* {task?.token_ss && (
                  <Text
                    className="text-green-500 font-[600]  text-sm underline underline-offset-4 cursor-pointer"
                    onClick={() => handlePayment(task.sale_id, task.token_ss, task.isTokenVerify, task.id, "token")}
                  >
                    View Token Proof
                  </Text>
                )} */}
                {/* {task?.allsale?.half_payment_image && (
                  <Text
                    className="text-blue-500 underline text-sm cursor-pointer"
                    onClick={() => { onViewHalfPaymentssOpen(); sethalfAmountId(task) }}
                  >
                    View Half Payment
                  </Text>
                )} */}
              </VStack>
            </HStack>

            {role?.toLowerCase().includes("prod") ? (
              <HStack className="space-x-3" mt={4}>
                {task?.design_status === "Pending" && (
                  <Button className={`${isSubmitting ? "cursor-not-allowed" : ""}`} colorScheme="teal" size="sm" onClick={() => handleAccept(task.id)} disabled={isSubmitting}>
                    Accept Task
                  </Button>
                )}
                {task?.bom?.length === 2 ? (
                  <Badge colorScheme="green" fontSize="sm"><strong>BOM:</strong> Created</Badge>
                ) : (
                  <Button colorScheme="teal" size="sm" onClick={() => handleBOM(task.sale_id)}>
                    Create BOM
                  </Button>
                )}
                {task?.design_status !== "Completed" && (
                  <Button colorScheme="orange" leftIcon={<FaCheck />} size="sm" onClick={() => handleDone(task.id)}>
                    Task Done
                  </Button>
                )}
                {/* {role === "Production" && task?.sample_image && (
                  <Button colorScheme="teal" size="sm" onClick={() => handleSampleImage(task.sample_image)}>
                    Preview Sample Image
                  </Button>
                )} */}


              </HStack>
            ) : ["accountant", "acc"].includes(role?.toLowerCase()) ? (
              <HStack justify="space-between" mt={3} flexWrap="wrap" align="center" gap={4}>
                {task?.design_status === "Pending" && (
                  <Button colorScheme="teal" size="sm" onClick={() => handleAccept(task.id)} disabled={isSubmitting}>
                    Accept Task
                  </Button>
                )}
                <Button
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<FaUpload />}
                  onClick={() => {
                    setSaleId(task.sale_id);       // set sale ID for upload
                    setShowDesignUpload(true);     // show modal
                  }}
                >
                  Upload Design
                </Button>
                {/* <Button
                  bgGradient="linear(to-r, purple.400, purple.600)"
                  color="white"
                  fontWeight="bold"
                  px="6"
                  py="3"
                  borderRadius="md"
                  boxShadow="lg"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, purple.800)",
                    boxShadow: "xl",
                    transform: "scale(1.02)",
                  }}
                  transition="all 0.3s ease-in-out"
                  onClick={() => {
                    setShowToken(!showToken);
                    setTokenAmount(task.token_amt);
                    setSaleId(task.sale_id);
                  }}
                // onClick={() => handleTokenClick(task.sale_id, task.token_amt)}
                >
                  Add Token Amount
                </Button> */}


                {/* {task?.isTokenVerify && ( */}
                {/* <Button
                  leftIcon={<FaCloudUploadAlt />}
                  bgGradient="linear(to-r, blue.400, blue.600)"
                  color="white"
                  fontWeight="semibold"
                  px="6"
                  py="3"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, blue.700)",
                    boxShadow: "lg",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s ease-in-out"
                  // onClick={() => handleInvoiceUpload(task.sale_id, task.invoice)}
                  onClick={() => {
                    setShowUploadInvoice(!showUploadInvoice);
                    setSaleId(task?.sale_id);
                    setInvoiceFile(task?.invoice);
                  }
                  }
                >
                  Upload Invoice
                </Button> */}

                {/* )} */}
                {/* {task?.isSampleApprove && ( */}
                {/* <Button
                  onClick={() => {
                      setShowhalfToken(!showhalfToken);
                    setTokenAmount(task?.allsale?.half_payment);
                    setSaleId(task.sale_id);
                  }}
                  leftIcon={<FaMoneyBillWave />}
                  bgGradient="linear(to-r, teal.400, teal.600)"
                  color="white"
                  fontWeight="semibold"
                  px="6"
                  py="3"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{
                    bgGradient: "linear(to-r, teal.500, teal.700)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Add Half Payment
                </Button> */}

                <Text fontSize="sm"><strong>Date:</strong> {task.date}</Text>
              </HStack>
            ) : (
              <HStack justify="space-between" mt={3} flexWrap="wrap" align="center" gap={4}>
                <VStack align="start">
                  {task?.design_status === "Pending" && (
                    <Button leftIcon={<FaCheck />} colorScheme="teal" size="sm" onClick={() => handleAccept(task.id)} disabled={isSubmitting}>
                      Accept Task
                    </Button>
                  )}

                </VStack>

                <VStack align="end">
                  <Text fontSize="sm"><strong>Date:</strong> {task.date}</Text>
                </VStack>
              </HStack>
            )}
          </div>
        ))}

      </div>
      <Pagination page={page} setPage={setPage} TotalPage={TotalPage} />
      {/* <AddToken showToken={showToken} setShowToken={setShowToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} />
      <UploadInvoice showUploadInvoice={showUploadInvoice} setShowUploadInvoice={setShowUploadInvoice} sale={saleId} invoicefile={invoicefile} />
      <AddhalfToken showhalfToken={showhalfToken} setShowhalfToken={setShowhalfToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} /> */}
      <UploadDesignFile
        show={showDesignUpload}
        setShow={setShowDesignUpload}
        saleId={saleId}
        refresh={fetchTasks}
      />
=======
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>

            {/* Filters Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="w-48 h-16 bg-gray-200 rounded"></div>
                <div className="w-48 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 min-w-[300px] h-16 bg-gray-200 rounded"></div>
                <div className="w-24 h-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Task Cards Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <div className="w-24 h-8 bg-gray-200 rounded"></div>
                      <div className="w-24 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            </div>
            <p className="text-gray-600">Manage and track task assignments</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Tasks Found
              </h3>
              <p className="text-gray-600 mb-6">
                There are currently no tasks assigned. Tasks will appear here
                once they are created and assigned.
              </p>
              <button
                onClick={fetchTasks}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <MdOutlineRefresh className="h-4 w-4" />
                Refresh Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          </div>
          <p className="text-gray-600">Manage and track task assignments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    tasks.filter((task) => task.design_status === "Pending")
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaHourglassHalf className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    tasks.filter(
                      (task) => task.design_status === "UnderProcessing"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    tasks.filter((task) => task.design_status === "Completed")
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="UnderProcessing">Under Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Process Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Process
              </label>
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Processes</option>
                <option value="Design">Design</option>
                <option value="Production">Production</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Dispatch">Dispatch</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by product, customer, or manager..."
                  value={searchKey || ""}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={fetchTasks}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
              >
                <MdOutlineRefresh className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Task List</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
              {filteredTasks.length !== tasks.length && ` of ${tasks.length}`}
            </span>
          </div>

          {(searchKey || statusFilter || processFilter) && (
            <button
              onClick={() => {
                setSearchKey("");
                setStatusFilter("");
                setProcessFilter("");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Tasks Match Your Filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more
                  tasks.
                </p>
                <button
                  onClick={() => {
                    setSearchKey("");
                    setStatusFilter("");
                    setProcessFilter("");
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredTasks.map((task: any) => (
              <div
                key={task?._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Task Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {task?.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Process: {task?.assined_process}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          task?.design_status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task?.design_status === "UnderProcessing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task?.design_status === "Completed" && (
                          <CheckSquare className="h-3 w-3 mr-1" />
                        )}
                        {task?.design_status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Quantity:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {task?.productQuantity}
                          </span>
                        </div>

                        {(role === "Accountant" ||
                          role === "Sales" ||
                          role === "admin") && (
                          <div className="flex items-center gap-2">
                            <FaDollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Price:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {task?.productPrice}
                            </span>
                          </div>
                        )}
                      </div>

                      {[
                        "acc",
                        "account",
                        "accountant",
                        "dispatch",
                        "dis",
                      ].includes(role?.toLowerCase()) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Customer:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {task?.customer_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Sale By:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {task?.sale_by}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Assigned By:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {task?.assignedBy}
                        </span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {task.date}
                        </span>
                      </div>

                      {task?.assinedby_comment && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Remarks:
                          </span>
                          <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg">
                            {task.assinedby_comment}
                          </p>
                        </div>
                      )}

                      {task?.sample_bom_name && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Sample BOM:
                          </span>
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {task.sample_bom_name}
                          </span>
                        </div>
                      )}

                      {task?.bom_name && (
                        <div>
                          <span className="text-sm text-gray-600">
                            BOM Name:
                          </span>
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {task.bom_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    {role?.toLowerCase().includes("prod") ? (
                      <div className="flex flex-wrap items-center gap-3">
                        {task?.design_status === "Pending" && (
                          <button
                            onClick={() => handleAccept(task.id)}
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 ${
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FaCheck className="h-4 w-4" />
                            Accept Task
                          </button>
                        )}

                        {task?.bom?.length === 2 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckSquare className="h-3 w-3 mr-1" />
                            BOM Created
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBOM(task.sale_id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                          >
                            Create BOM
                          </button>
                        )}

                        {task?.design_status !== "Completed" && (
                          <button
                            onClick={() => handleDone(task.id)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                          >
                            <FaCheck className="h-4 w-4" />
                            Mark Done
                          </button>
                        )}
                      </div>
                    ) : ["accountant", "acc"].includes(role?.toLowerCase()) ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {task?.design_status === "Pending" && (
                            <button
                              onClick={() => handleAccept(task.id)}
                              disabled={isSubmitting}
                              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 ${
                                isSubmitting
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FaCheck className="h-4 w-4" />
                              Accept Task
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          {task?.design_status === "Pending" && (
                            <button
                              onClick={() => handleAccept(task.id)}
                              disabled={isSubmitting}
                              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 ${
                                isSubmitting
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FaCheck className="h-4 w-4" />
                              Accept Task
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredTasks.length > 0 && TotalPage > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <Pagination page={page} setPage={setPage} TotalPage={TotalPage} />
            </div>
          </div>
        )}
      </div>  

      {/* Drawer Components - Commented out for now */}
      {/* <AddToken showToken={showToken} setShowToken={setShowToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} />
      <UploadInvoice showUploadInvoice={showUploadInvoice} setShowUploadInvoice={setShowUploadInvoice} sale={saleId} invoicefile={invoicefile} />
      <AddhalfToken showhalfToken={showhalfToken} setShowhalfToken={setShowhalfToken} tokenAmount={tokenAmount} sale={saleId} refresh={fetchTasks} /> */}
    </div>
  );
};
>>>>>>> 219cd9502d3335e4516df6edfbb822efc25a62fd

    </section>

  )
}

export default Task