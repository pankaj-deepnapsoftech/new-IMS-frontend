// ts-@nocheck
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";
import { colors } from "../theme/colors";
import { IoIosDocument, IoMdCart } from "react-icons/io";
import {
  FaRupeeSign,
  FaStoreAlt,
  FaUser,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";
import {
  Button,
  Input,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Icon,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IndianRupee } from "lucide-react";

const Dashboard: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [cookies] = useCookies();

  const [approvalsPending, setApprovalsPending] = useState<
    | {
        unapproved_product_count: number;
        unapproved_store_count: number;
        unapproved_merchant_count: number;
        unapproved_bom_count: number;
      }
    | undefined
  >();
  const [scrap, setScrap] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [inventory, setInventory] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [directInventory, setDirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [indirectInventory, setIndirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [stores, setStores] = useState<
    | {
        total_store_count: number;
      }
    | undefined
  >();
  const [boms, setBoms] = useState<
    | {
        total_bom_count: number;
      }
    | undefined
  >();
  const [merchants, setMerchants] = useState<
    | {
        total_supplier_count: number;
        total_buyer_count: number;
      }
    | undefined
  >();
  const [employees, setEmployees] = useState<
    | {
        _id: string;
        total_employee_count: number;
      }[]
    | undefined
  >();
  const [processes, setProcesses] = useState<
    | {
        ["raw material approval pending"]?: number;
        ["raw materials approved"]?: number;
        completed?: number;
        "work in progress"?: number;
      }
    | undefined
  >();
  const [totalProformaInvoices, setTotalProformaInvoices] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  
  const [verifiedEmployeesCount, setVerifiedEmployeesCount] = useState<number>(0);
  const [totalProductionAmount, setTotalProductionAmount] = useState<number>(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState<number>(0);
  const [totalProductBuyPrice, setTotalProductBuyPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<{day: string, tasks: string[]} | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductionDay, setSelectedProductionDay] = useState<{day: string, tasks: string[]}>(
    { day: "Sun 01", tasks: [] }
  );

  const handleDayClick = (day: {day: string, tasks: string[]}) => {
    setSelectedDay(day);
    onOpen();
  };

  const handleProductionDayClick = (day: {day: string, tasks: string[]}) => {
    setSelectedProductionDay(day);
  };

  const dashboardCards = [
    {
      title: "Verified Employees",
      value: verifiedEmployeesCount.toLocaleString(),
      icon: <IoPeople />,
      color: "blue",
      prefix: "",
      suffix: "",
    },
    {
      title: "Total Production",
      value: totalProductionAmount.toLocaleString(),
      icon: <AiFillProduct />,
      color: "green",
      prefix: "₹",
      suffix: "",
    },
    {
      title: "Total Sales",
      value: totalSalesAmount.toLocaleString(),
      icon: <IoMdCart />,
      color: "orange",
      prefix: "₹",
      suffix: "",
    },
    {
      title: "Product Buy Price",
      value: totalProductBuyPrice.toLocaleString(),
      change: -3.2,
      icon: <IndianRupee />,
      color: "purple",
      prefix: "₹",
      suffix: "",
    },
  ];

  // Dummy chart data
  const actualVsTargetData = [
    { time: "4:00", actual: 50, target: 45 },
    { time: "6:00", actual: 80, target: 70 },
    { time: "8:00", actual: 120, target: 110 },
    { time: "10:00", actual: 180, target: 170 },
    { time: "12:00", actual: 220, target: 200 },
    { time: "14:00", actual: 250, target: 240 },
    { time: "16:00", actual: 280, target: 270 },
    { time: "18:00", actual: 300, target: 290 },
    { time: "20:00", actual: 280, target: 270 },
    { time: "22:00", actual: 250, target: 240 },
    { time: "0:00", actual: 200, target: 190 },
    { time: "2:00", actual: 150, target: 140 },
    { time: "4:00", actual: 100, target: 90 },
  ];

  const inspectionData = [
    { name: "Dke", target: 1.2, inspection: 1.0 },
    { name: "Dmax", target: 1.8, inspection: 1.5 },
    { name: "Dmin", target: 0.8, inspection: 1.2 },
    { name: "P1 Dmax", target: 2.0, inspection: 1.8 },
    { name: "P1 Dmin", target: 1.0, inspection: 0.8 },
    { name: "P2 Dmax", target: 1.5, inspection: 1.3 },
    { name: "P2 Dmin", target: 0.5, inspection: 0.7 },
  ];

  const statusHistoryData = [
    { name: "Total Run Time", value: 72, color: "#8884d8" },
    { name: "Not Run Time", value: 14, color: "#ff7c7c" },
    { name: "Maintenance", value: 9, color: "#ffc658" },
    { name: "Break", value: 5, color: "#8dd1e1" },
  ];

  const inspectionValuesData = [
    { name: "Passed", value: 10, color: "#10b981" },
    { name: "Failed", value: 5, color: "#ef4444" },
    { name: "Pending", value: 25, color: "#f59e0b" },
    { name: "In Progress", value: 10, color: "#6366f1" },
  ];

  const productionPlanData = [
    { day: "Sun 01", tasks: [] },
    { day: "Mon 02", tasks: ["Raw Material Processing", "Quality Check", "Inventory Update"] },
    { day: "Tue 03", tasks: ["Batch Processing", "Machine Operation", "Packaging", "Dispatch Preparation"] },
    { day: "Wed 04", tasks: ["Maintenance Check"] },
    { day: "Thu 05", tasks: ["Order Fulfillment", "Final Quality Inspection"] },
    { day: "Fri 06", tasks: ["Weekly Report Generation", "Equipment Cleaning"] },
    { day: "Sat 07", tasks: [] },
  ];

  const fetchSummaryHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            from,
            to,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setDirectInventory(
        data.products?.[0]?._id === "direct"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setIndirectInventory(
        data.products?.[0]?._id === "indirect"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setScrap(data.scrap[0]);
      setInventory(data.wip_inventory[0]);
      setStores(data.stores);
      setMerchants(data.merchants);
      setBoms(data.boms);
      setApprovalsPending(data.approvals_pending);
      setEmployees(data.employees);
      setProcesses(data.processes);
      setTotalProformaInvoices(data.proforma_invoices);
      setTotalInvoices(data.invoices);
      setTotalPayments(data.payments);
      
      // Set dashboard card data
      setVerifiedEmployeesCount(data.verified_employees_count || 0);
      setTotalProductionAmount(data.total_production_amount || 0);
      setTotalSalesAmount(data.total_sales_amount || 0);
      setTotalProductBuyPrice(data.total_product_buy_price || 0);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (from && to) {
      fetchSummaryHandler();
    }
  };

  const resetFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setFrom("");
    setTo("");

    fetchSummaryHandler();
  };
  const dynamicColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-tl from-purple-400 to-pink-500";
      case 1:
        return "bg-gradient-to-tl from-green-300 to-blue-500";
      case 2:
        return "bg-gradient-to-tl from-sky-400 to-blue-600";
      case 3:
        return "bg-gradient-to-tl from-indigo-400 to-purple-600";
      case 4:
        return "bg-gradient-to-tl from-teal-400 to-cyan-500";
      default:
        return "bg-gradient-to-tl from-gray-300 to-gray-500"; // fallback
    }
  };

  useEffect(() => {
    fetchSummaryHandler();
  }, []);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div
        className="bg-white border-b border-gray-200 p-6 md:p-8 shadow-sm"
        style={{ backgroundColor: colors.background.page }}
      >
        <div className="max-w-7xl mx-auto">
          <div>
            {/* Welcome Section */}
           

            {/* Filter Form */}
            <div
              className="bg-white rounded-xl p-6 shadow-sm border"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.light,
                boxShadow: colors.shadow.md,
              }}
            >
              <form
                onSubmit={applyFilterHandler}
                className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="from-date"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    From Date
                  </label>
                  <Input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    id="from-date"
                    type="date"
                    className="w-full rounded-lg px-4 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colors.input.background,
                      borderColor: colors.input.border,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.input.borderFocus;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.input.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="to-date"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    To Date
                  </label>
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    id="to-date"
                    type="date"
                    className="w-full rounded-lg px-4 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colors.input.background,
                      borderColor: colors.input.border,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.input.borderFocus;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.input.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="flex gap-3 sm:gap-2">
                  <Button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colors.primary[600],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.primary[700];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.primary[600];
                    }}
                  >
                    <p className="text-white"> Apply Filter</p>
                  </Button>
                  <Button
                    onClick={resetFilterHandler}
                    type="button"
                    className="px-6 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.medium,
                      color: colors.text.secondary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.gray[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.card;
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {isLoading && <Loading />}

        {!isLoading && (
          <div className="space-y-12">
            {/* Dashboard Overview Section */}
            <section className="animate-fade-in">
              {/* Small Stats Cards */}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={6}
                mb={8}
              >
                {dashboardCards.map((card, index) => (
                  <Box
                    key={index}
                    bg="white"
                    p={6}
                    rounded="xl"
                    shadow="md"
                    border="1px"
                    borderColor="gray.200"
                    transition="all 0.3s"
                    _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                  >
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {card.title}
                      </Text>
                      <Text fontSize="2xl" color={`${card.color}.500`}>
                        {card.icon}
                      </Text>
                    </Flex>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {card.prefix}
                        {card.value}
                        {card.suffix}
                      </Text>
                      {/* <HStack spacing={1}>
                        <Icon
                          as={card.change > 0 ? FaArrowUp : FaArrowDown}
                          color={card.change > 0 ? "green.500" : "red.500"}
                          boxSize={3}
                        />
                        <Text
                          fontSize="sm"
                          color={card.change > 0 ? "green.500" : "red.500"}
                          fontWeight="medium"
                        >
                          {Math.abs(card.change)}%
                        </Text>
                      </HStack> */}
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Charts Section */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
                {/* Production Plan Schedule */}
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                    Production Plan - December 2024
                  </Text>
                  <Box>
                    <SimpleGrid columns={7} spacing={2} mb={6}>
                      {productionPlanData.map((day, index) => (
                        <Box
                          key={index}
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleProductionDayClick(day)}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateY(-2px)",
                            shadow: "md",
                          }}
                          transition="all 0.2s"
                          p={2}
                          rounded="md"
                          bg={
                            selectedProductionDay.day === day.day
                              ? "blue.50"
                              : "white"
                          }
                          border="2px"
                          borderColor={
                            selectedProductionDay.day === day.day
                              ? "blue.300"
                              : "transparent"
                          }
                        >
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            {day.day.split(" ")[0]}
                          </Text>
                          <Text fontSize="xs" fontWeight="bold" mb={2}>
                            {day.day.split(" ")[1]}
                          </Text>
                          <Box
                            w={2}
                            h={2}
                            rounded="full"
                            mx="auto"
                            bg={day.tasks.length > 0 ? "green.400" : "gray.300"}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>

                    {/* Task Display Section */}
                    <Box
                      bg="gray.50"
                      p={4}
                      rounded="lg"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <HStack spacing={3} mb={3}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                          {selectedProductionDay.day}
                        </Text>
                        <Box
                          px={2}
                          py={1}
                          bg={
                            selectedProductionDay.tasks.length > 0
                              ? "green.100"
                              : "gray.100"
                          }
                          color={
                            selectedProductionDay.tasks.length > 0
                              ? "green.700"
                              : "gray.600"
                          }
                          rounded="full"
                          fontSize="xs"
                          fontWeight="medium"
                        >
                          {selectedProductionDay.tasks.length} task
                          {selectedProductionDay.tasks.length !== 1 ? "s" : ""}
                        </Box>
                      </HStack>

                      {selectedProductionDay.tasks.length > 0 ? (
                        <VStack align="start" spacing={2}>
                          {selectedProductionDay.tasks.map((task, index) => (
                            <HStack key={index} spacing={3} w="100%">
                              <Box
                                w={3}
                                h={3}
                                rounded="full"
                                bg={
                                  index % 3 === 0
                                    ? "purple.400"
                                    : index % 3 === 1
                                    ? "blue.400"
                                    : "green.400"
                                }
                                flexShrink={0}
                              />
                              <Text
                                fontSize="sm"
                                color="gray.700"
                                fontWeight="medium"
                              >
                                {task}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500" fontStyle="italic">
                          No tasks scheduled for this day
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Actual vs Target Chart */}
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                    Actual vs Target (pcs)
                  </Text>
                  <Box height="250px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={actualVsTargetData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#ff7c7c"
                          strokeWidth={3}
                          dot={{ fill: "#ff7c7c", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#8dd1e1"
                          strokeWidth={3}
                          dot={{ fill: "#8dd1e1", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Inspection Values Chart */}
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                    Inspection Values
                  </Text>
                  <Flex align="center" justify="space-between">
                    <Box height="230px" width="260px">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={inspectionValuesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ value }) => `${value}%`}
                          >
                            {inspectionValuesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <VStack align="start" spacing={3} ml={6}>
                      {inspectionValuesData.map((item, index) => (
                        <HStack key={index} spacing={3}>
                          <Box w={3} h={3} bg={item.color} rounded="full" />
                          <VStack align="start" spacing={0}>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.800"
                            >
                              {item.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {item.value}%
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Flex>
                </Box>

                {/* Status History Pie Chart */}
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                    Status History
                  </Text>
                  <Flex align="center" justify="space-between">
                    <Box height="230px" width="260px">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusHistoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ value }) => `${value}%`}
                          >
                            {statusHistoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <VStack align="start" spacing={3} ml={6}>
                      {statusHistoryData.map((item, index) => (
                        <HStack key={index} spacing={3}>
                          <Box w={3} h={3} bg={item.color} rounded="full" />
                          <VStack align="start" spacing={0}>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.800"
                            >
                              {item.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {item.value}%
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Flex>
                </Box>
              </SimpleGrid>
            </section>

            {/* Employee Insights Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.primary[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Employee Insights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              {employees && employees.length === 0 && (
                <div
                  className="text-center py-12 rounded-xl border border-dashed"
                  style={{
                    borderColor: colors.border.light,
                    color: colors.text.muted,
                  }}
                >
                  <p className="text-lg">No employee data found.</p>
                </div>
              )}

              {employees && employees.length > 0 && (
                <div
                  className="p-6 rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.light,
                    boxShadow: colors.shadow.sm,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {employees.map((emp, ind) => (
                      <Card
                        key={emp._id}
                        type="employees"
                        title={emp?._id}
                        content={emp?.total_employee_count}
                        icon={<IoPeople size={28} />}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Sales & Purchase Insights Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.success[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Sales & Purchase Insights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              {approvalsPending && (
                <div
                  className="p-6 rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.light,
                    boxShadow: colors.shadow.sm,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                      type="sales"
                      title="Proforma Invoices"
                      content={totalProformaInvoices}
                      icon={<IoMdCart size={28} />}
                    />
                    <Card
                      type="dispatcher"
                      title="Invoices"
                      content={totalInvoices}
                      icon={<FaStoreAlt size={28} />}
                    />
                    <Card
                      type="employees"
                      title="Payments"
                      content={totalPayments}
                      icon={<FaUser size={28} />}
                    />
                  </div>
                </div>
              )}
            </section>
            {/* Approvals Pending Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.warning[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Approvals Pending
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              {approvalsPending && (
                <div
                  className="p-6 rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.light,
                    boxShadow: colors.shadow.sm,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                      type="inventory"
                      title="Inventory"
                      content={approvalsPending?.unapproved_product_count}
                      icon={<IoMdCart size={28} />}
                    />
                    <Card
                      type="employees"
                      title="Stores"
                      content={approvalsPending?.unapproved_store_count}
                      icon={<FaStoreAlt size={28} />}
                    />
                    <Card
                      type="sales"
                      title="Merchants"
                      content={approvalsPending?.unapproved_merchant_count}
                      icon={<FaUser size={28} />}
                    />
                    <Card
                      type="products"
                      title="BOMs"
                      content={approvalsPending?.unapproved_bom_count}
                      icon={<IoIosDocument size={28} />}
                    />
                  </div>
                </div>
              )}
            </section>
            {/* Inventory Insights Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.secondary[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Inventory Insights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              <div className="space-y-6">
                {/* Direct Inventory */}
                {directInventory && (
                  <div
                    className="p-6 rounded-xl border shadow-sm"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.light,
                      boxShadow: colors.shadow.sm,
                    }}
                  >
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      Direct Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card
                        type="products"
                        title="Total Products"
                        content={directInventory?.total_product_count}
                        icon={<IoMdCart size={28} />}
                      />
                      <Card
                        type="sales"
                        title="Stock Value"
                        content={
                          "₹ " + directInventory?.total_stock_price + "/-"
                        }
                        icon={<FaRupeeSign size={24} />}
                      />
                      <Card
                        type="dispatcher"
                        title="Excess Stock"
                        content={directInventory?.total_excess_stock}
                        icon={<AiFillProduct size={28} />}
                      />
                      <Card
                        type="inventory"
                        title="Low Stock"
                        content={directInventory?.total_low_stock}
                        icon={<AiFillProduct size={28} />}
                      />
                    </div>
                  </div>
                )}

                {/* Indirect Inventory */}
                {indirectInventory && (
                  <div
                    className="p-6 rounded-xl border shadow-sm"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.light,
                      boxShadow: colors.shadow.sm,
                    }}
                  >
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      Indirect Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card
                        type="products"
                        title="Total Products"
                        content={indirectInventory?.total_product_count}
                        icon={<IoMdCart size={28} />}
                      />
                      <Card
                        type="sales"
                        title="Stock Value"
                        content={
                          "₹ " + indirectInventory?.total_stock_price + "/-"
                        }
                        icon={<FaRupeeSign size={28} />}
                      />
                      <Card
                        type="dispatcher"
                        title="Excess Stock"
                        content={indirectInventory?.total_excess_stock}
                        icon={<AiFillProduct size={28} />}
                      />
                      <Card
                        type="inventory"
                        title="Low Stock"
                        content={indirectInventory?.total_low_stock}
                        icon={<AiFillProduct size={28} />}
                      />
                    </div>
                  </div>
                )}

                {/* Other Inventory */}
                <div
                  className="p-6 rounded-xl border shadow-sm"
                  style={{
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.light,
                    boxShadow: colors.shadow.sm,
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    Scrap & WIP Inventory
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                      type="dispatcher"
                      title="Scrap Materials"
                      content={scrap?.total_product_count?.toString() || ""}
                      icon={<IoMdCart size={28} />}
                    />
                    <Card
                      type="inventory"
                      title="Scrap Value"
                      content={"₹ " + scrap?.total_stock_price + "/-"}
                      icon={<FaRupeeSign size={24} />}
                    />
                    <Card
                      type="employees"
                      title="WIP Inventory"
                      content={inventory?.total_product_count?.toString() || ""}
                      icon={<IoMdCart size={28} />}
                    />
                    <Card
                      type="sales"
                      title="WIP Inventory Value"
                      content={"₹ " + inventory?.total_stock_price + "/-"}
                      icon={<FaRupeeSign size={24} />}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Store & Merchant Insights Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.primary[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Store & Merchant Insights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              <div
                className="p-6 rounded-xl border shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.light,
                  boxShadow: colors.shadow.sm,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stores && (
                    <Card
                      type="employees"
                      title="Stores"
                      content={stores?.total_store_count}
                      icon={<FaStoreAlt size={24} />}
                    />
                  )}
                  {merchants && (
                    <Card
                      type="sales"
                      title="Buyers"
                      content={merchants?.total_buyer_count}
                      icon={<FaUser size={24} />}
                    />
                  )}
                  {merchants && (
                    <Card
                      type="dispatcher"
                      title="Suppliers"
                      content={merchants?.total_supplier_count}
                      icon={<FaUser size={24} />}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Production Insights Section */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
                  style={{ backgroundColor: colors.warning[500] }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Production Insights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>

              <div
                className="p-6 rounded-xl border shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.light,
                  boxShadow: colors.shadow.sm,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {boms && (
                    <Card
                      type="products"
                      title="BOMs"
                      content={boms?.total_bom_count}
                      icon={<IoIosDocument size={28} />}
                    />
                  )}
                  <Card
                    type="inventory"
                    title="Inventory Approval Pending"
                    content={processes?.["raw material approval pending"] || 0}
                    icon={<FaStoreAlt size={28} />}
                  />
                  <Card
                    type="dispatcher"
                    title="Inventory Approved"
                    content={processes?.["raw materials approved"] || 0}
                    icon={<FaStoreAlt size={28} />}
                  />
                  <Card
                    type="employees"
                    title="Work In Progress"
                    content={processes?.["work in progress"] || 0}
                    icon={<FaStoreAlt size={28} />}
                  />
                  <Card
                    type="sales"
                    title="Completed"
                    content={processes?.completed || 0}
                    icon={<FaStoreAlt size={28} />}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Production Plan Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Production Plan - {selectedDay?.day}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDay?.tasks && selectedDay.tasks.length > 0 ? (
              <VStack align="start" spacing={3}>
                <Text fontWeight="bold" color="gray.700">
                  Scheduled Processes:
                </Text>
                {selectedDay.tasks.map((task, index) => (
                  <Box
                    key={index}
                    w="100%"
                    p={3}
                    bg={
                      index % 3 === 0
                        ? "purple.50"
                        : index % 3 === 1
                        ? "blue.50"
                        : "green.50"
                    }
                    border="1px"
                    borderColor={
                      index % 3 === 0
                        ? "purple.200"
                        : index % 3 === 1
                        ? "blue.200"
                        : "green.200"
                    }
                    rounded="lg"
                  >
                    <HStack spacing={3}>
                      <Box
                        w={4}
                        h={4}
                        rounded="full"
                        bg={
                          index % 3 === 0
                            ? "purple.400"
                            : index % 3 === 1
                            ? "blue.400"
                            : "green.400"
                        }
                      />
                      <Text
                        fontWeight="medium"
                        color={
                          index % 3 === 0
                            ? "purple.700"
                            : index % 3 === 1
                            ? "blue.700"
                            : "green.700"
                        }
                      >
                        {task}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" fontSize="lg">
                  No processes scheduled for this day
                </Text>
                <Text color="gray.400" fontSize="sm" mt={2}>
                  This is a free day with no production activities
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
