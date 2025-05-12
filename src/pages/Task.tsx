// @ts-nocheck 

import axios from "axios"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import Pagination from "./Pagination";
import { toast } from "react-toastify";

import { FaCheck, FaCloudUploadAlt, FaUpload } from "react-icons/fa";
import {
  // Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
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
const Task = () => {
  const [cookies] = useCookies();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [showToken, setShowToken] = useState(false)
  const role = cookies?.role;

  console.log("user_role =", role)

  const [halfAmountId, sethalfAmountId] = useState("")
  const [halfAmount, sethalfAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}assined/get-assined?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const tasks = response.data.data.map((task:any) => {
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
    } catch (error) {
      console.log(error);

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

  const handleInvoiceUpload = (id: any, file: any) => {
    setSaleId(id);
    setInvoiceFile(file);
    invoiceDisclosure.onOpen();
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

  const handleHalfPayment = async () => {
    const data = {
      half_payment: halfAmount,
      half_payment_status: "pending",
    }
    try {
      half_payment.onClose()
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}purchase/update/${halfAmountId.sale_id}`, data, {
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      })
      toast.success("Half Amount added");


    } catch (error) {
      console.log(error)
    }
  }

  const handleVerifyImage = async () => {
    const data = {
      half_payment_status: "Paid",
      half_payment_approve: true
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


  useEffect(() => {
    fetchTasks();
  }, [cookies?.access_token, page])
  return (
    <section>
      <div className="min-h-screen p-6 text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>


        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select className=" rounded px-4 py-2 bg-[#ffffff2a] text-gray-100">
            <option className="text-black">Select Status</option>
            <option className="text-black">Under Processing</option>
            <option className="text-black">Completed</option>
          </select>
          <input type="date" className=" styled-date rounded px-4 py-2 bg-[#ffffff2a] text-gray-100 placeholder:text-gray-100" />
          <input
            type="text"
            placeholder="Search by Product or Manager"
            className=" rounded px-4 py-2 flex-grow bg-[#ffffff2a] text-gray-100"
          />
          <button onClick={fetchTasks} className="border border-blue-400 text-blue-400 px-4 py-1.5 rounded hover:bg-blue-400 hover:text-white transition-all duration-300">
            ⟳ Refresh
          </button>
        </div>

        {tasks.map((task: any) => (
          <div key={task?._id} className="rounded-md shadow-md p-6 bg-[#ffffff2a]">
            {/* Role-Based Badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["acc", "account", "accountant", "dispatch", "dis"].includes(role?.toLowerCase()) && (
                <>
                  {task?.token_amt && !task?.token_status && (
                    <Badge colorScheme="orange" fontSize="sm">Token Amount: Pending</Badge>
                  )}
                  {task?.token_amt && task?.token_status && (
                    <Badge colorScheme="green" fontSize="sm">Token Amount: Paid</Badge>
                  )}
                  {typeof task?.isTokenVerify === 'boolean' && (
                    <Badge colorScheme={task.isTokenVerify ? "green" : "orange"} fontSize="sm">
                      Token Verification: {task.isTokenVerify ? "Verified" : "Pending"}
                    </Badge>
                  )}
                  {task?.allsale?.half_payment_status && (
                    <Badge colorScheme="green" fontSize="sm">
                      Half Payment Status: {task.allsale.half_payment_status}
                    </Badge>
                  )}
                  {task?.payment_status && (
                    <Badge colorScheme={colorChange(task.payment_status)} fontSize="sm">
                      Payment: {task.payment_status}
                    </Badge>
                  )}
                  {typeof task?.payment_verify === 'boolean' && (
                    <Badge colorScheme={colorChange(task.payment_verify)} fontSize="sm">
                      Payment Verification: {task.payment_verify ? "Verified" : "Not Verified"}
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Detail Columns */}
            <HStack justify="space-between" spacing={3} mt={3} flexWrap="wrap" align="start" gap={4}>
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                {(role === "Accountant" || role === "Sales" || role === "admin") && (
                  <Text fontSize="sm"><strong>Product Price:</strong> {task?.productPrice}</Text>
                )}
                <Text fontSize="sm"><strong>Quantity:</strong> {task?.productQuantity}</Text>
                {["acc", "account", "accountant", "dispatch", "dis"].includes(role?.toLowerCase()) && (
                  <>
                    <Text fontSize="sm"><strong>Customer:</strong> {task?.customer_name}</Text>
                    <Text fontSize="sm"><strong>Sale By:</strong> {task?.sale_by}</Text>
                    <Text fontSize="sm"><strong>Assigned By:</strong> {task?.assignedBy}</Text>
                  </>
                )}
              </VStack>

              <VStack align={{ base: "start", md: "end" }} w={{ base: "100%", md: "48%" }}>
                <Text fontSize="sm"><strong>Assigned Process:</strong> {task?.assined_process}</Text>
                {task?.assinedby_comment && (
                  <Text fontSize="sm"><strong>Remarks:</strong> {task.assinedby_comment}</Text>
                )}
                {task?.sample_bom_name && (
                  <Text fontSize="sm" color="blue"><strong className="text-black">Sample BOM Name:</strong> {task.sample_bom_name}</Text>
                )}
                {task?.bom_name && (
                  <Text fontSize="sm" color="blue"><strong className="text-black">BOM Name:</strong> {task.bom_name}</Text>
                )}
                {task?.token_ss && (
                  <Text
                    className="text-blue-500 underline text-sm cursor-pointer"
                    onClick={() => handlePayment(task.sale_id, task.token_ss, task.isTokenVerify, task.id, "token")}
                  >
                    View Token Proof
                  </Text>
                )}
                {task?.allsale?.half_payment_image && (
                  <Text
                    className="text-blue-500 underline text-sm cursor-pointer"
                    onClick={() => { onViewHalfPaymentssOpen(); sethalfAmountId(task) }}
                  >
                    View Half Payment
                  </Text>
                )}
              </VStack>
            </HStack>

            {role?.toLowerCase().includes("prod") ? (
              <HStack className="space-x-3" mt={4}>
                {task?.design_status === "Pending" && (
                  <Button colorScheme="teal" size="sm" onClick={() => handleAccept(task.id)} disabled={isSubmitting}>
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
                {role === "Production" && task?.sample_image && (
                  <Button colorScheme="teal" size="sm" onClick={() => handleSampleImage(task.sample_image)}>
                    Preview Sample Image
                  </Button>
                )}
              </HStack>
            ) : ["accountant", "acc"].includes(role?.toLowerCase()) ? (
              <HStack justify="space-between" mt={3} flexWrap="wrap" align="center" gap={4}>
                {task?.design_status === "Pending" && (
                  <Button colorScheme="teal" size="sm" onClick={() => handleAccept(task.id)} disabled={isSubmitting}>
                    Accept Task
                  </Button>
                )}
                
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "purple.500" }}
                    className="border border-purple-500 hover:text-white"
                    // onClick={() => handleTokenClick(task.sale_id, task.token_amt)}
                      onClick={()=> setShowToken(!showToken)}
                  >
                    Add Token Amount
                  </Button>
                  
                {task?.isTokenVerify && (
                  <Button
                    bgColor="white"
                    leftIcon={<FaCloudUploadAlt />}
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white"
                    onClick={() => handleInvoiceUpload(task.sale_id, task.invoice)}
                  >
                    Upload Invoice
                  </Button>
                )}
                {task?.isSampleApprove && (
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white"
                    onClick={() => { half_payment.onOpen(); sethalfAmountId(task); }}
                  >
                    Add Half Payment
                  </Button>
                )}
                {task?.customer_pyement_ss && (
                  <Button
                    bgColor="white"
                    leftIcon={<IoEyeSharp />}
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white"
                    onClick={() =>
                      handlePayment(task.sale_id, task.customer_pyement_ss, task.payment_verify, task.id, "payment")
                    }
                  >
                    View Payment
                  </Button>
                )}
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
      <Pagination page={page} setPage={setPage} length={tasks?.length} />
      <AddToken  showToken={showToken} setShowToken={setShowToken}/>
    </section>
  )
}

export default Task