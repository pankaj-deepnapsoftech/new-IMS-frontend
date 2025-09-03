// // ts-@nocheck
// import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Card from "../components/Dashboard/Card";
// import Loading from "../ui/Loading";
// import { colors } from "../theme/colors";
// import { IoIosDocument, IoMdCart } from "react-icons/io";
// import {
//   FaRupeeSign,
//   FaStoreAlt,
//   FaUser,
//   FaArrowUp,
//   FaArrowDown,
// } from "react-icons/fa";
// import { AiFillProduct } from "react-icons/ai";
// import { IoPeople } from "react-icons/io5";
// import {
//   Button,
//   Input,
//   Box,
//   SimpleGrid,
//   Stat,
//   StatLabel,
//   StatNumber,
//   StatHelpText,
//   StatArrow,
//   Text,
//   Progress,
//   CircularProgress,
//   CircularProgressLabel,
//   Flex,
//   Icon,
//   VStack,
//   HStack,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
// } from "@chakra-ui/react";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { IndianRupee } from "lucide-react";

// const Dashboard: React.FC = () => {
//   const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
//   const isAllowed = isSuper || allowedroutes.includes("dashboard");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [from, setFrom] = useState<string | undefined>();
//   const [to, setTo] = useState<string | undefined>();
//   const [cookies] = useCookies();

//   const [approvalsPending, setApprovalsPending] = useState<
//     | {
//         unapproved_product_count: number;
//         unapproved_store_count: number;
//         unapproved_merchant_count: number;
//         unapproved_bom_count: number;
//       }
//     | undefined
//   >();
//   const [scrap, setScrap] = useState<
//     | {
//         total_product_count: number;
//         total_stock_price: number;
//       }
//     | undefined
//   >();
//   const [inventory, setInventory] = useState<
//     | {
//         total_product_count: number;
//         total_stock_price: number;
//       }
//     | undefined
//   >();
//   const [directInventory, setDirectInventory] = useState<
//     | {
//         total_low_stock: number;
//         total_excess_stock: number;
//         total_product_count: number;
//         total_stock_price: number;
//       }
//     | undefined
//   >();
//   const [indirectInventory, setIndirectInventory] = useState<
//     | {
//         total_low_stock: number;
//         total_excess_stock: number;
//         total_product_count: number;
//         total_stock_price: number;
//       }
//     | undefined
//   >();
//   const [stores, setStores] = useState<
//     | {
//         total_store_count: number;
//       }
//     | undefined
//   >();
//   const [boms, setBoms] = useState<
//     | {
//         total_bom_count: number;
//       }
//     | undefined
//   >();
//   const [merchants, setMerchants] = useState<
//     | {
//         total_supplier_count: number;
//         total_buyer_count: number;
//       }
//     | undefined
//   >();
//   const [employees, setEmployees] = useState<
//     | {
//         _id: string;
//         total_employee_count: number;
//       }[]
//     | undefined
//   >();
//   const [processes, setProcesses] = useState<
//     | {
//         ["raw material approval pending"]?: number;
//         ["raw materials approved"]?: number;
//         completed?: number;
//         "work in progress"?: number;
//       }
//     | undefined
//   >();
//   const [totalProformaInvoices, setTotalProformaInvoices] = useState<number>(0);
//   const [totalInvoices, setTotalInvoices] = useState<number>(0);
//   const [totalPayments, setTotalPayments] = useState<number>(0);

//   const [verifiedEmployeesCount, setVerifiedEmployeesCount] =
//     useState<number>(0);
//   const [totalProductionAmount, setTotalProductionAmount] = useState<number>(0);
//   const [totalSalesAmount, setTotalSalesAmount] = useState<number>(0);
//   const [totalProductBuyPrice, setTotalProductBuyPrice] = useState<number>(0);
//   const [selectedDay, setSelectedDay] = useState<{
//     day: string;
//     tasks: string[];
//   } | null>(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   // Initialize selectedProductionDay with current day after component mounts
//   const [selectedProductionDay, setSelectedProductionDay] = useState<{
//     day: string;
//     tasks: string[];
//   }>({
//     day: "",
//     tasks: [],
//   });
//   const [lastUpdated, setLastUpdated] = useState<string>("");

//   const handleDayClick = (day: { day: string; tasks: string[] }) => {
//     setSelectedDay(day);
//     onOpen();
//   };

//   const handleProductionDayClick = (day: { day: string; tasks: string[] }) => {
//     setSelectedProductionDay(day);
//   };

//   const dashboardCards = [
//     {
//       title: "Verified Employees",
//       value: verifiedEmployeesCount.toLocaleString(),
//       icon: <IoPeople />,
//       color: "blue",
//       prefix: "",
//       suffix: "",
//     },
//     {
//       title: "Total Production",
//       value: totalProductionAmount.toLocaleString(),
//       icon: <AiFillProduct />,
//       color: "green",
//       prefix: "₹",
//       suffix: "",
//     },
//     {
//       title: "Total Sales",
//       value: totalSalesAmount.toLocaleString(),
//       icon: <IoMdCart />,
//       color: "orange",
//       prefix: "₹",
//       suffix: "",
//     },
//     {
//       title: "Product Buy Price",
//       value: totalProductBuyPrice.toLocaleString(),
//       change: -3.2,
//       icon: <IndianRupee />,
//       color: "purple",
//       prefix: "₹",
//       suffix: "",
//     },
//   ];

//   // Dummy chart data
//   const actualVsTargetData = [
//     { time: "4:00", actual: 50, target: 45 },
//     { time: "6:00", actual: 80, target: 70 },
//     { time: "8:00", actual: 120, target: 110 },
//     { time: "10:00", actual: 180, target: 170 },
//     { time: "12:00", actual: 220, target: 200 },
//     { time: "14:00", actual: 250, target: 240 },
//     { time: "16:00", actual: 280, target: 270 },
//     { time: "18:00", actual: 300, target: 290 },
//     { time: "20:00", actual: 280, target: 270 },
//     { time: "22:00", actual: 250, target: 240 },
//     { time: "0:00", actual: 200, target: 190 },
//     { time: "2:00", actual: 150, target: 140 },
//     { time: "4:00", actual: 100, target: 90 },
//   ];

//   const inspectionData = [
//     { name: "Dke", target: 1.2, inspection: 1.0 },
//     { name: "Dmax", target: 1.8, inspection: 1.5 },
//     { name: "Dmin", target: 0.8, inspection: 1.2 },
//     { name: "P1 Dmax", target: 2.0, inspection: 1.8 },
//     { name: "P1 Dmin", target: 1.0, inspection: 0.8 },
//     { name: "P2 Dmax", target: 1.5, inspection: 1.3 },
//     { name: "P2 Dmin", target: 0.5, inspection: 0.7 },
//   ];

//   const statusHistoryData = [
//     { name: "Total Run Time", value: 72, color: "#8884d8" },
//     { name: "Not Run Time", value: 14, color: "#ff7c7c" },
//     { name: "Maintenance", value: 9, color: "#ffc658" },
//     { name: "Break", value: 5, color: "#8dd1e1" },
//   ];

//   const inspectionValuesData = [
//     { name: "Passed", value: 10, color: "#10b981" },
//     { name: "Failed", value: 5, color: "#ef4444" },
//     { name: "Pending", value: 25, color: "#f59e0b" },
//     { name: "In Progress", value: 10, color: "#6366f1" },
//   ];

//   // Generate current week data dynamically
//   const getProductionPlanForCurrentWeek = () => {
//     const today = new Date();
//     const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - currentDayOfWeek);

//     const weekDays = [];
//     const dayNames = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);

//       const dayName = dayNames[i];
//       const formattedDate = `${date.getDate()}/${
//         date.getMonth() + 1
//       }/${date.getFullYear()}`; // dd/m/yyyy

//       // Find matching tasks from backend
//       const dayTasks =
//         backendProductionPlan?.[dayName]?.filter(
//           (task: any) => task.date === formattedDate
//         ) || [];

//       weekDays.push({
//         day: `${dayName.slice(0, 3)} ${String(date.getDate()).padStart(
//           2,
//           "0"
//         )}`,
//         tasks: dayTasks.map((t: any) => t.name),
//         date,
//         isToday: date.toDateString() === today.toDateString(),
//       });
//     }

//     return weekDays;
//   };

//   const [backendProductionPlan, setBackendProductionPlan] = useState<any>({});
//   const fetchProductionPlan = async () => {
//     try {
//       const res = await fetch(
//         process.env.REACT_APP_BACKEND_URL + "bom/weekly",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${cookies?.access_token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         setBackendProductionPlan(data.weekMap);
//       }
//     } catch (err) {
//       console.error("Failed to fetch production plan", err);
//     }
//   };

//   useEffect(() => {
//     fetchProductionPlan();
//   }, []);

//   // Update selected production day when backend production plan data is loaded
//   useEffect(() => {
//     if (Object.keys(backendProductionPlan).length > 0) {
//       const weekData = getProductionPlanForCurrentWeek();
//       const today = weekData.find((day) => day.isToday);
//       if (today) {
//         setSelectedProductionDay(today);
//       } else if (weekData.length > 0) {
//         // If today is not in current week, default to first day
//         setSelectedProductionDay(weekData[0]);
//       }
//     }
//   }, [backendProductionPlan]);

//   const getBackendWeekData = () => {
//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6);

//     const result: {
//       day: string;
//       tasks: string[];
//       date: Date;
//       isToday: boolean;
//     }[] = [];

//     const dayNamesMap: Record<string, number> = {
//       Sunday: 0,
//       Monday: 1,
//       Tuesday: 2,
//       Wednesday: 3,
//       Thursday: 4,
//       Friday: 5,
//       Saturday: 6,
//     };

//     Object.entries(backendProductionPlan).forEach(([day, tasks]) => {
//       const filteredTasks = (tasks as any[]).filter((task) => {
//         const [d, m, y] = task.date.split("/").map(Number);
//         const taskDate = new Date(y, m - 1, d);
//         return taskDate >= startOfWeek && taskDate <= endOfWeek;
//       });

//       if (filteredTasks.length > 0) {
//         const sampleDate = filteredTasks[0].date;
//         const [d, m, y] = sampleDate.split("/").map(Number);
//         const date = new Date(y, m - 1, d);

//         result.push({
//           day: `${day.slice(0, 3)} ${String(d).padStart(2, "0")}`,
//           tasks: filteredTasks.map((t) => t.name),
//           date,
//           isToday: date.toDateString() === today.toDateString(),
//         });
//       }
//     });

//     return result;
//   };

//   // Get current week date range for header
//   const getCurrentWeekRange = () => {
//     const today = new Date();
//     const currentDayOfWeek = today.getDay();
//     const weekStart = new Date(today);
//     weekStart.setDate(today.getDate() - currentDayOfWeek);

//     const weekEnd = new Date(weekStart);
//     weekEnd.setDate(weekStart.getDate() + 6);

//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     const startMonth = monthNames[weekStart.getMonth()];
//     const endMonth = monthNames[weekEnd.getMonth()];
//     const year = weekStart.getFullYear();

//     if (weekStart.getMonth() === weekEnd.getMonth()) {
//       return `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}, ${year}`;
//     } else {
//       return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${year}`;
//     }
//   };

//   const productionPlanData = getProductionPlanForCurrentWeek();

//   const fetchSummaryHandler = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         process.env.REACT_APP_BACKEND_URL + "dashboard",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${cookies?.access_token}`,
//           },
//           body: JSON.stringify({
//             from,
//             to,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (!data.success) {
//         throw new Error(data.message);
//       }
//       setDirectInventory(
//         data.products?.[0]?._id === "direct"
//           ? data.products?.[0]
//           : data.products?.[1]
//       );
//       setIndirectInventory(
//         data.products?.[0]?._id === "indirect"
//           ? data.products?.[0]
//           : data.products?.[1]
//       );
//       setScrap(data.scrap[0]);
//       setInventory(data.wip_inventory[0]);
//       setStores(data.stores);
//       setMerchants(data.merchants);
//       setBoms(data.boms);
//       setApprovalsPending(data.approvals_pending);
//       setEmployees(data.employees);
//       setProcesses(data.processes);
//       setTotalProformaInvoices(data.proforma_invoices);
//       setTotalInvoices(data.invoices);
//       setTotalPayments(data.payments);

//       // Set dashboard card data
//       setVerifiedEmployeesCount(data.verified_employees_count || 0);
//       setTotalProductionAmount(data.total_production_amount || 0);
//       setTotalSalesAmount(data.total_sales_amount || 0);
//       setTotalProductBuyPrice(data.total_product_buy_price || 0);
//     } catch (error: any) {
//       toast.error(error?.message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFilterHandler = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (from && to) {
//       fetchSummaryHandler();
//     }
//   };

//   const resetFilterHandler = (e: React.FormEvent) => {
//     e.preventDefault();

//     setFrom("");
//     setTo("");

//     fetchSummaryHandler();
//   };
//   const dynamicColor = (index: number) => {
//     switch (index) {
//       case 0:
//         return "bg-gradient-to-tl from-purple-400 to-pink-500";
//       case 1:
//         return "bg-gradient-to-tl from-green-300 to-blue-500";
//       case 2:
//         return "bg-gradient-to-tl from-sky-400 to-blue-600";
//       case 3:
//         return "bg-gradient-to-tl from-indigo-400 to-purple-600";
//       case 4:
//         return "bg-gradient-to-tl from-teal-400 to-cyan-500";
//       default:
//         return "bg-gradient-to-tl from-gray-300 to-gray-500"; // fallback
//     }
//   };

//   useEffect(() => {
//     fetchSummaryHandler();
//     setLastUpdated(new Date().toLocaleTimeString());
//   }, []);

//   if (!isAllowed) {
//     return (
//       <div className="text-center text-red-500">
//         You are not allowed to access this route.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div
//         className="bg-white border-b border-gray-200 p-6 md:p-8 shadow-sm"
//         style={{ backgroundColor: colors.background.page }}
//       >
//         <div className="max-w-7xl mx-auto">
//           <div>
//             {/* Welcome Section */}

//             {/* Filter Form */}
//             <div
//               className="bg-white rounded-xl p-6 shadow-sm border"
//               style={{
//                 backgroundColor: colors.background.card,
//                 borderColor: colors.border.light,
//                 boxShadow: colors.shadow.md,
//               }}
//             >
//               <form
//                 onSubmit={applyFilterHandler}
//                 className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
//               >
//                 <div className="min-w-0 flex-1">
//                   <label
//                     htmlFor="from-date"
//                     className="block text-sm font-medium mb-2"
//                     style={{ color: colors.text.primary }}
//                   >
//                     From Date
//                   </label>
//                   <Input
//                     value={from}
//                     onChange={(e) => setFrom(e.target.value)}
//                     id="from-date"
//                     type="date"
//                     className="w-full rounded-lg px-4 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2"
//                     style={{
//                       backgroundColor: colors.input.background,
//                       borderColor: colors.input.border,
//                       color: colors.text.primary,
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = colors.input.borderFocus;
//                       e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = colors.input.border;
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <label
//                     htmlFor="to-date"
//                     className="block text-sm font-medium mb-2"
//                     style={{ color: colors.text.primary }}
//                   >
//                     To Date
//                   </label>
//                   <Input
//                     value={to}
//                     onChange={(e) => setTo(e.target.value)}
//                     id="to-date"
//                     type="date"
//                     className="w-full rounded-lg px-4 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2"
//                     style={{
//                       backgroundColor: colors.input.background,
//                       borderColor: colors.input.border,
//                       color: colors.text.primary,
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = colors.input.borderFocus;
//                       e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = colors.input.border;
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div className="flex gap-3 sm:gap-2">
//                   <Button
//                     type="submit"
//                     className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
//                     style={{
//                       backgroundColor: colors.primary[600],
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor =
//                         colors.primary[700];
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor =
//                         colors.primary[600];
//                     }}
//                   >
//                     <p className="text-white"> Apply Filter</p>
//                   </Button>
//                   <Button
//                     onClick={resetFilterHandler}
//                     type="button"
//                     className="px-6 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
//                     style={{
//                       backgroundColor: colors.background.card,
//                       borderColor: colors.border.medium,
//                       color: colors.text.secondary,
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = colors.gray[50];
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor =
//                         colors.background.card;
//                     }}
//                   >
//                     Reset
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
//         {isLoading && <Loading />}

//         {!isLoading && (
//           <div className="space-y-12">
//             {/* Dashboard Overview Section */}
//             <section className="animate-fade-in">
//               {/* Small Stats Cards */}
//               <SimpleGrid
//                 columns={{ base: 1, md: 2, lg: 4 }}
//                 spacing={6}
//                 mb={8}
//               >
//                 {dashboardCards.map((card, index) => (
//                   <Box
//                     key={index}
//                     bg="white"
//                     p={6}
//                     rounded="xl"
//                     shadow="md"
//                     border="1px"
//                     borderColor="gray.200"
//                     transition="all 0.3s"
//                     _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
//                   >
//                     <Flex justify="space-between" align="center" mb={4}>
//                       <Text fontSize="sm" color="gray.600" fontWeight="medium">
//                         {card.title}
//                       </Text>
//                       <Text fontSize="2xl" color={`${card.color}.500`}>
//                         {card.icon}
//                       </Text>
//                     </Flex>
//                     <VStack align="start" spacing={2}>
//                       <Text fontSize="2xl" fontWeight="bold" color="gray.800">
//                         {card.prefix}
//                         {card.value}
//                         {card.suffix}
//                       </Text>
//                       {/* <HStack spacing={1}>
//                         <Icon
//                           as={card.change > 0 ? FaArrowUp : FaArrowDown}
//                           color={card.change > 0 ? "green.500" : "red.500"}
//                           boxSize={3}
//                         />
//                         <Text
//                           fontSize="sm"
//                           color={card.change > 0 ? "green.500" : "red.500"}
//                           fontWeight="medium"
//                         >
//                           {Math.abs(card.change)}%
//                         </Text>
//                       </HStack> */}
//                     </VStack>
//                   </Box>
//                 ))}
//               </SimpleGrid>

//               {/* Charts Section */}
//               <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
//                 {/* Production Plan Schedule */}
//                 <Box
//                   bg="white"
//                   p={6}
//                   rounded="xl"
//                   shadow="md"
//                   border="1px"
//                   borderColor="gray.200"
//                 >
//                   <HStack justify="space-between" align="center" mb={4}>
//                     <Text fontSize="lg" fontWeight="bold" color="gray.800">
//                       Production Plan - {getCurrentWeekRange()}
//                     </Text>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={async () => {
//                         await fetchProductionPlan();
//                         setLastUpdated(new Date().toLocaleTimeString());
//                       }}
//                       _hover={{ bg: "gray.100" }}
//                     >
//                       <Text fontSize="xs" color="blue.600">
//                         Refresh
//                       </Text>
//                     </Button>
//                   </HStack>
//                   <Box>
//                     <SimpleGrid columns={7} spacing={2} mb={6}>
//                       {productionPlanData.map((day, index) => (
//                         <Box
//                           key={index}
//                           textAlign="center"
//                           cursor="pointer"
//                           onClick={() => handleProductionDayClick(day)}
//                           _hover={{
//                             bg: "gray.50",
//                             transform: "translateY(-2px)",
//                             shadow: "md",
//                           }}
//                           transition="all 0.2s"
//                           p={2}
//                           rounded="md"
//                           bg={
//                             day.isToday
//                               ? "blue.100"
//                               : selectedProductionDay.day === day.day
//                               ? "blue.50"
//                               : "white"
//                           }
//                           border="2px"
//                           borderColor={
//                             day.isToday
//                               ? "blue.500"
//                               : selectedProductionDay.day === day.day
//                               ? "blue.300"
//                               : "transparent"
//                           }
//                         >
//                           <Text fontSize="xs" color="gray.600" mb={1}>
//                             {day.day.split(" ")[0]}
//                             {day.isToday && (
//                               <Box
//                                 as="span"
//                                 ml={1}
//                                 w={1.5}
//                                 h={1.5}
//                                 bg="blue.500"
//                                 rounded="full"
//                                 display="inline-block"
//                               />
//                             )}
//                           </Text>
//                           <Text fontSize="xs" fontWeight="bold" mb={2}>
//                             {day.day.split(" ")[1]}
//                           </Text>
//                           <Box
//                             w={2}
//                             h={2}
//                             rounded="full"
//                             mx="auto"
//                             bg={day.tasks.length > 0 ? "green.400" : "gray.300"}
//                           />
//                         </Box>
//                       ))}
//                     </SimpleGrid>

//                     {/* Task Display Section */}
//                     <Box
//                       bg="gray.50"
//                       p={4}
//                       rounded="lg"
//                       border="1px"
//                       borderColor="gray.200"
//                     >
//                       <HStack spacing={3} mb={3}>
//                         <Text fontSize="sm" fontWeight="bold" color="gray.700">
//                           {selectedProductionDay.day}
//                           {getProductionPlanForCurrentWeek().find(
//                             (day) => day.day === selectedProductionDay.day
//                           )?.isToday && (
//                             <Text
//                               as="span"
//                               fontSize="xs"
//                               color="blue.600"
//                               ml={2}
//                             >
//                               (Today)
//                             </Text>
//                           )}
//                         </Text>
//                         <Box
//                           px={2}
//                           py={1}
//                           bg={
//                             selectedProductionDay.tasks.length > 0
//                               ? "green.100"
//                               : "gray.100"
//                           }
//                           color={
//                             selectedProductionDay.tasks.length > 0
//                               ? "green.700"
//                               : "gray.600"
//                           }
//                           rounded="full"
//                           fontSize="xs"
//                           fontWeight="medium"
//                         >
//                           {selectedProductionDay.tasks.length} task
//                           {selectedProductionDay.tasks.length !== 1 ? "s" : ""}
//                         </Box>
//                       </HStack>

//                       {selectedProductionDay.tasks.length > 0 ? (
//                         <VStack align="start" spacing={2}>
//                           {selectedProductionDay.tasks.map((task, index) => (
//                             <HStack key={index} spacing={3} w="100%">
//                               <Box
//                                 w={3}
//                                 h={3}
//                                 rounded="full"
//                                 bg={
//                                   index % 3 === 0
//                                     ? "purple.400"
//                                     : index % 3 === 1
//                                     ? "blue.400"
//                                     : "green.400"
//                                 }
//                                 flexShrink={0}
//                               />
//                               <Text
//                                 fontSize="sm"
//                                 color="gray.700"
//                                 fontWeight="medium"
//                               >
//                                 {task}
//                               </Text>
//                             </HStack>
//                           ))}
//                         </VStack>
//                       ) : (
//                         <Text fontSize="sm" color="gray.500" fontStyle="italic">
//                           No BOM scheduled for this day
//                         </Text>
//                       )}
//                     </Box>
//                   </Box>
//                   {lastUpdated && (
//                     <Text
//                       fontSize="xs"
//                       color="gray.500"
//                       mt={3}
//                       textAlign="center"
//                     >
//                       Last updated: {lastUpdated}
//                     </Text>
//                   )}
//                 </Box>

//                 {/* Actual vs Target Chart */}
//                 <Box
//                   bg="white"
//                   p={6}
//                   rounded="xl"
//                   shadow="md"
//                   border="1px"
//                   borderColor="gray.200"
//                 >
//                   <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
//                     Actual vs Target (pcs)
//                   </Text>
//                   <Box height="250px">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={actualVsTargetData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="time" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="target"
//                           stroke="#ff7c7c"
//                           strokeWidth={3}
//                           dot={{ fill: "#ff7c7c", strokeWidth: 2, r: 4 }}
//                           activeDot={{ r: 6 }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="actual"
//                           stroke="#8dd1e1"
//                           strokeWidth={3}
//                           dot={{ fill: "#8dd1e1", strokeWidth: 2, r: 4 }}
//                           activeDot={{ r: 6 }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </Box>

//                 {/* Inspection Values Chart */}
//                 <Box
//                   bg="white"
//                   p={6}
//                   rounded="xl"
//                   shadow="md"
//                   border="1px"
//                   borderColor="gray.200"
//                 >
//                   <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
//                     Inspection Values
//                   </Text>
//                   <Flex align="center" justify="space-between">
//                     <Box height="230px" width="260px">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={inspectionValuesData}
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="value"
//                             label={({ value }) => `${value}%`}
//                           >
//                             {inspectionValuesData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </Box>
//                     <VStack align="start" spacing={3} ml={6}>
//                       {inspectionValuesData.map((item, index) => (
//                         <HStack key={index} spacing={3}>
//                           <Box w={3} h={3} bg={item.color} rounded="full" />
//                           <VStack align="start" spacing={0}>
//                             <Text
//                               fontSize="sm"
//                               fontWeight="bold"
//                               color="gray.800"
//                             >
//                               {item.name}
//                             </Text>
//                             <Text fontSize="xs" color="gray.600">
//                               {item.value}%
//                             </Text>
//                           </VStack>
//                         </HStack>
//                       ))}
//                     </VStack>
//                   </Flex>
//                 </Box>

//                 {/* Status History Pie Chart */}
//                 <Box
//                   bg="white"
//                   p={6}
//                   rounded="xl"
//                   shadow="md"
//                   border="1px"
//                   borderColor="gray.200"
//                 >
//                   <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
//                     Status History
//                   </Text>
//                   <Flex align="center" justify="space-between">
//                     <Box height="230px" width="260px">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={statusHistoryData}
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="value"
//                             label={({ value }) => `${value}%`}
//                           >
//                             {statusHistoryData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </Box>
//                     <VStack align="start" spacing={3} ml={6}>
//                       {statusHistoryData.map((item, index) => (
//                         <HStack key={index} spacing={3}>
//                           <Box w={3} h={3} bg={item.color} rounded="full" />
//                           <VStack align="start" spacing={0}>
//                             <Text
//                               fontSize="sm"
//                               fontWeight="bold"
//                               color="gray.800"
//                             >
//                               {item.name}
//                             </Text>
//                             <Text fontSize="xs" color="gray.600">
//                               {item.value}%
//                             </Text>
//                           </VStack>
//                         </HStack>
//                       ))}
//                     </VStack>
//                   </Flex>
//                 </Box>
//               </SimpleGrid>
//             </section>

//             {/* Employee Insights Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.primary[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Employee Insights
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               {employees && employees.length === 0 && (
//                 <div
//                   className="text-center py-12 rounded-xl border border-dashed"
//                   style={{
//                     borderColor: colors.border.light,
//                     color: colors.text.muted,
//                   }}
//                 >
//                   <p className="text-lg">No employee data found.</p>
//                 </div>
//               )}

//               {employees && employees.length > 0 && (
//                 <div
//                   className="p-6 rounded-xl border shadow-sm"
//                   style={{
//                     backgroundColor: colors.background.card,
//                     borderColor: colors.border.light,
//                     boxShadow: colors.shadow.sm,
//                   }}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {employees.map((emp, ind) => (
//                       <Card
//                         key={emp._id}
//                         type="employees"
//                         title={emp?._id}
//                         content={emp?.total_employee_count}
//                         icon={<IoPeople size={28} />}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </section>

//             {/* Sales & Purchase Insights Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.success[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Sales & Purchase Insights
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               {approvalsPending && (
//                 <div
//                   className="p-6 rounded-xl border shadow-sm"
//                   style={{
//                     backgroundColor: colors.background.card,
//                     borderColor: colors.border.light,
//                     boxShadow: colors.shadow.sm,
//                   }}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <Card
//                       type="sales"
//                       title="Proforma Invoices"
//                       content={totalProformaInvoices}
//                       icon={<IoMdCart size={28} />}
//                     />
//                     <Card
//                       type="dispatcher"
//                       title="Invoices"
//                       content={totalInvoices}
//                       icon={<FaStoreAlt size={28} />}
//                     />
//                     <Card
//                       type="employees"
//                       title="Payments"
//                       content={totalPayments}
//                       icon={<FaUser size={28} />}
//                     />
//                   </div>
//                 </div>
//               )}
//             </section>
//             {/* Approvals Pending Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.warning[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Approvals Pending
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               {approvalsPending && (
//                 <div
//                   className="p-6 rounded-xl border shadow-sm"
//                   style={{
//                     backgroundColor: colors.background.card,
//                     borderColor: colors.border.light,
//                     boxShadow: colors.shadow.sm,
//                   }}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <Card
//                       type="inventory"
//                       title="Inventory"
//                       content={approvalsPending?.unapproved_product_count}
//                       icon={<IoMdCart size={28} />}
//                     />
//                     <Card
//                       type="employees"
//                       title="Stores"
//                       content={approvalsPending?.unapproved_store_count}
//                       icon={<FaStoreAlt size={28} />}
//                     />
//                     <Card
//                       type="sales"
//                       title="Merchants"
//                       content={approvalsPending?.unapproved_merchant_count}
//                       icon={<FaUser size={28} />}
//                     />
//                     <Card
//                       type="products"
//                       title="BOMs"
//                       content={approvalsPending?.unapproved_bom_count}
//                       icon={<IoIosDocument size={28} />}
//                     />
//                   </div>
//                 </div>
//               )}
//             </section>
//             {/* Inventory Insights Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.secondary[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Inventory Insights
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               <div className="space-y-6">
//                 {/* Direct Inventory */}
//                 {directInventory && (
//                   <div
//                     className="p-6 rounded-xl border shadow-sm"
//                     style={{
//                       backgroundColor: colors.background.card,
//                       borderColor: colors.border.light,
//                       boxShadow: colors.shadow.sm,
//                     }}
//                   >
//                     <h3
//                       className="text-lg font-semibold mb-4"
//                       style={{ color: colors.text.primary }}
//                     >
//                       Direct Inventory
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                       <Card
//                         type="products"
//                         title="Total Products"
//                         content={directInventory?.total_product_count}
//                         icon={<IoMdCart size={28} />}
//                       />
//                       <Card
//                         type="sales"
//                         title="Stock Value"
//                         content={
//                           "₹ " + directInventory?.total_stock_price + "/-"
//                         }
//                         icon={<FaRupeeSign size={24} />}
//                       />
//                       <Card
//                         type="dispatcher"
//                         title="Excess Stock"
//                         content={directInventory?.total_excess_stock}
//                         icon={<AiFillProduct size={28} />}
//                       />
//                       <Card
//                         type="inventory"
//                         title="Low Stock"
//                         content={directInventory?.total_low_stock}
//                         icon={<AiFillProduct size={28} />}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Indirect Inventory */}
//                 {indirectInventory && (
//                   <div
//                     className="p-6 rounded-xl border shadow-sm"
//                     style={{
//                       backgroundColor: colors.background.card,
//                       borderColor: colors.border.light,
//                       boxShadow: colors.shadow.sm,
//                     }}
//                   >
//                     <h3
//                       className="text-lg font-semibold mb-4"
//                       style={{ color: colors.text.primary }}
//                     >
//                       Indirect Inventory
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                       <Card
//                         type="products"
//                         title="Total Products"
//                         content={indirectInventory?.total_product_count}
//                         icon={<IoMdCart size={28} />}
//                       />
//                       <Card
//                         type="sales"
//                         title="Stock Value"
//                         content={
//                           "₹ " + indirectInventory?.total_stock_price + "/-"
//                         }
//                         icon={<FaRupeeSign size={28} />}
//                       />
//                       <Card
//                         type="dispatcher"
//                         title="Excess Stock"
//                         content={indirectInventory?.total_excess_stock}
//                         icon={<AiFillProduct size={28} />}
//                       />
//                       <Card
//                         type="inventory"
//                         title="Low Stock"
//                         content={indirectInventory?.total_low_stock}
//                         icon={<AiFillProduct size={28} />}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Other Inventory */}
//                 <div
//                   className="p-6 rounded-xl border shadow-sm"
//                   style={{
//                     backgroundColor: colors.background.card,
//                     borderColor: colors.border.light,
//                     boxShadow: colors.shadow.sm,
//                   }}
//                 >
//                   <h3
//                     className="text-lg font-semibold mb-4"
//                     style={{ color: colors.text.primary }}
//                   >
//                     Scrap & WIP Inventory
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <Card
//                       type="dispatcher"
//                       title="Scrap Materials"
//                       content={scrap?.total_product_count?.toString() || ""}
//                       icon={<IoMdCart size={28} />}
//                     />
//                     <Card
//                       type="inventory"
//                       title="Scrap Value"
//                       content={"₹ " + scrap?.total_stock_price + "/-"}
//                       icon={<FaRupeeSign size={24} />}
//                     />
//                     <Card
//                       type="employees"
//                       title="WIP Inventory"
//                       content={inventory?.total_product_count?.toString() || ""}
//                       icon={<IoMdCart size={28} />}
//                     />
//                     <Card
//                       type="sales"
//                       title="WIP Inventory Value"
//                       content={"₹ " + inventory?.total_stock_price + "/-"}
//                       icon={<FaRupeeSign size={24} />}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Store & Merchant Insights Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.primary[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Store & Merchant Insights
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               <div
//                 className="p-6 rounded-xl border shadow-sm"
//                 style={{
//                   backgroundColor: colors.background.card,
//                   borderColor: colors.border.light,
//                   boxShadow: colors.shadow.sm,
//                 }}
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {stores && (
//                     <Card
//                       type="employees"
//                       title="Stores"
//                       content={stores?.total_store_count}
//                       icon={<FaStoreAlt size={24} />}
//                     />
//                   )}
//                   {merchants && (
//                     <Card
//                       type="sales"
//                       title="Buyers"
//                       content={merchants?.total_buyer_count}
//                       icon={<FaUser size={24} />}
//                     />
//                   )}
//                   {merchants && (
//                     <Card
//                       type="dispatcher"
//                       title="Suppliers"
//                       content={merchants?.total_supplier_count}
//                       icon={<FaUser size={24} />}
//                     />
//                   )}
//                 </div>
//               </div>
//             </section>

//             {/* Production Insights Section */}
//             <section className="animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div
//                   className="w-1 h-8 rounded-full transition-all duration-300 hover:w-2"
//                   style={{ backgroundColor: colors.warning[500] }}
//                 />
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: colors.text.primary }}
//                 >
//                   Production Insights
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
//               </div>

//               <div
//                 className="p-6 rounded-xl border shadow-sm"
//                 style={{
//                   backgroundColor: colors.background.card,
//                   borderColor: colors.border.light,
//                   boxShadow: colors.shadow.sm,
//                 }}
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {boms && (
//                     <Card
//                       type="products"
//                       title="BOMs"
//                       content={boms?.total_bom_count}
//                       icon={<IoIosDocument size={28} />}
//                     />
//                   )}
//                   <Card
//                     type="inventory"
//                     title="Inventory Approval Pending"
//                     content={processes?.["raw material approval pending"] || 0}
//                     icon={<FaStoreAlt size={28} />}
//                   />
//                   <Card
//                     type="dispatcher"
//                     title="Inventory Approved"
//                     content={processes?.["raw materials approved"] || 0}
//                     icon={<FaStoreAlt size={28} />}
//                   />
//                   <Card
//                     type="employees"
//                     title="Work In Progress"
//                     content={processes?.["work in progress"] || 0}
//                     icon={<FaStoreAlt size={28} />}
//                   />
//                   <Card
//                     type="sales"
//                     title="Completed"
//                     content={processes?.completed || 0}
//                     icon={<FaStoreAlt size={28} />}
//                   />
//                 </div>
//               </div>
//             </section>
//           </div>
//         )}
//       </div>

//       {/* Production Plan Details Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="lg">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Production Plan - {selectedDay?.day}</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {selectedDay?.tasks && selectedDay.tasks.length > 0 ? (
//               <VStack align="start" spacing={3}>
//                 <Text fontWeight="bold" color="gray.700">
//                   Scheduled Processes:
//                 </Text>
//                 {selectedDay.tasks.map((task, index) => (
//                   <Box
//                     key={index}
//                     w="100%"
//                     p={3}
//                     bg={
//                       index % 3 === 0
//                         ? "purple.50"
//                         : index % 3 === 1
//                         ? "blue.50"
//                         : "green.50"
//                     }
//                     border="1px"
//                     borderColor={
//                       index % 3 === 0
//                         ? "purple.200"
//                         : index % 3 === 1
//                         ? "blue.200"
//                         : "green.200"
//                     }
//                     rounded="lg"
//                   >
//                     <HStack spacing={3}>
//                       <Box
//                         w={4}
//                         h={4}
//                         rounded="full"
//                         bg={
//                           index % 3 === 0
//                             ? "purple.400"
//                             : index % 3 === 1
//                             ? "blue.400"
//                             : "green.400"
//                         }
//                       />
//                       <Text
//                         fontWeight="medium"
//                         color={
//                           index % 3 === 0
//                             ? "purple.700"
//                             : index % 3 === 1
//                             ? "blue.700"
//                             : "green.700"
//                         }
//                       >
//                         {task}
//                       </Text>
//                     </HStack>
//                   </Box>
//                 ))}
//               </VStack>
//             ) : (
//               <Box textAlign="center" py={8}>
//                 <Text color="gray.500" fontSize="lg">
//                   No processes scheduled for this day
//                 </Text>
//                 <Text color="gray.400" fontSize="sm" mt={2}>
//                   This is a free day with no production activities
//                 </Text>
//               </Box>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="blue" onClick={onClose}>
//               Close
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  Select,
  Icon,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  List,
  Check,
  Users,
  ArrowDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import RoleModals from '../components/RoleModals';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [salesPeriod, setSalesPeriod] = useState('Yearly');
  const [salesYear, setSalesYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [apiDispatchData, setApiDispatchData] = useState([]);
  const [isLoadingDispatch, setIsLoadingDispatch] = useState(false);
  const [merchantChartData, setMerchantChartData] = useState<any>(null);
  const [isLoadingMerchant, setIsLoadingMerchant] = useState(false);
  const [productionChartData, setProductionChartData] = useState<any>(null);
  const [isLoadingProduction, setIsLoadingProduction] = useState(false);
  const [inventoryChartData, setInventoryChartData] = useState<any>(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [apiResourcesData, setApiResourcesData] = useState<any[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [apiRolesData, setApiRolesData] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [apiApprovalData, setApiApprovalData] = useState<any[]>([]);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [financeData, setFinanceData] = useState<any>(null);
  const [isLoadingFinance, setIsLoadingFinance] = useState(false);
  const [accountsYear, setAccountsYear] = useState(new Date().getFullYear());
  const [cookies] = useCookies();
  const [inventoryPeriod, setInventoryPeriod] = useState('Weekly');
  const [productionPeriod, setProductionPeriod] = useState('Weekly');
  const [dispatchPeriod, setDispatchPeriod] = useState('Yearly');
  const [accountsPeriod, setAccountsPeriod] = useState('Weekly');
  const [merchantPeriod, setMerchantPeriod] = useState('Weekly');
  const toast = useToast();
  const navigate = useNavigate();

  // Modal states
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Selected role state
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    role: '',
    description: '',
    createdOn: '',
    lastUpdated: ''
  });

  // User Roles Action Handlers
  const handleViewRole = (role: any) => {
    // Format dates for modal display
    const formattedRole = {
      ...role,
      createdOn: role.createdAt ? new Date(role.createdAt).toLocaleDateString('en-GB') : role.createdOn || 'N/A',
      lastUpdated: role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('en-GB') : role.lastUpdated || 'N/A'
    };
    setSelectedRole(formattedRole);
    onViewOpen();
  };

  const handleEditRole = (role: any) => {
    // Format dates for modal display
    const formattedRole = {
      ...role,
      createdOn: role.createdAt ? new Date(role.createdAt).toLocaleDateString('en-GB') : role.createdOn || 'N/A',
      lastUpdated: role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('en-GB') : role.lastUpdated || 'N/A'
    };
    setSelectedRole(formattedRole);
    setEditForm({
      role: role.role,
      description: role.description,
      createdOn: formattedRole.createdOn,
      lastUpdated: formattedRole.lastUpdated
    });
    onEditOpen();
  };

  const handleDeleteRole = (role: any) => {
    setSelectedRole(role);
    onDeleteOpen();
  };

  // Fetch sales data from API
  const fetchSalesData = async () => {
    setIsLoadingSales(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}dashboard/sales?view=${salesPeriod.toLowerCase()}&year=${salesYear}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to chart format
          const transformedData = data.labels.map((label: string, index: number) => ({
            month: label,
            value1: data.datasets[0]?.data[index] || 0,
            value2: data.datasets[1]?.data[index] || 0
          }));
          setSalesData(transformedData);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch sales data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch sales data');
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingSales(false);
    }
  };

  // Fetch sales data when period or year changes
  useEffect(() => {
    fetchSalesData();
  }, [salesPeriod, salesYear]);

  // Fetch dispatch data from API
  const fetchDispatchData = async () => {
    setIsLoadingDispatch(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_URL}dashboard/dispatch?view=${dispatchPeriod.toLowerCase()}&year=${new Date().getFullYear()}`;

      // Add month parameter for monthly view
      if (dispatchPeriod.toLowerCase() === 'monthly') {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        url += `&month=${currentMonth}`;
      }

      console.log('Dispatch API URL:', url); // Debug log

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to chart format
          const transformedData = data.labels.map((label: string, index: number) => ({
            day: label,
            dispatch: data.datasets[0]?.data[index] || 0,
            deliver: data.datasets[1]?.data[index] || 0
          }));
          setApiDispatchData(transformedData);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch dispatch data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch dispatch data');
      }
    } catch (error) {
      console.error('Error fetching dispatch data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dispatch data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingDispatch(false);
    }
  };

  // Fetch dispatch data when period changes
  useEffect(() => {
    console.log('Dispatch period changed to:', dispatchPeriod); // Debug log
    fetchDispatchData();
  }, [dispatchPeriod]);

  // Fetch inventory chart data from API
  const fetchInventoryData = async () => {
    setIsLoadingInventory(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}dashboard?filter=${inventoryPeriod.toLowerCase()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInventoryChartData(data.inventory_chart);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch inventory data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch inventory data');
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Fetch production chart data from API
  const fetchProductionData = async () => {
    setIsLoadingProduction(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}dashboard?filter=${productionPeriod.toLowerCase()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductionChartData(data.production_chart);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch production data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch production data');
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch production data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingProduction(false);
    }
  };

  // Fetch merchant chart data from API
  const fetchMerchantData = async () => {
    setIsLoadingMerchant(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}dashboard?filter=${merchantPeriod.toLowerCase()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMerchantChartData(data.merchant_chart);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch merchant data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch merchant data');
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch merchant data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingMerchant(false);
    }
  };

  // Fetch data when periods change
  useEffect(() => {
    fetchInventoryData();
  }, [inventoryPeriod]);

  useEffect(() => {
    fetchProductionData();
  }, [productionPeriod]);

  useEffect(() => {
    fetchMerchantData();
  }, [merchantPeriod]);

  // Fetch resources data from API
  const fetchResourcesData = async () => {
    setIsLoadingResources(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}resources`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApiResourcesData(data.resources || []);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch resources data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch resources data');
      }
    } catch (error) {
      console.error('Error fetching resources data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Fetch resources data on component mount
  useEffect(() => {
    fetchResourcesData();
  }, []);

  // Fetch roles data from API
  const fetchRolesData = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}role/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApiRolesData(data.roles || []);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch roles data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch roles data');
      }
    } catch (error) {
      console.error('Error fetching roles data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Fetch roles data on component mount
  useEffect(() => {
    fetchRolesData();
  }, []);

  // Fetch approval data from API
  const fetchApprovalData = async () => {
    setIsLoadingApproval(true);
    try {
      // Fetch inventory data (BOM API)
      const inventoryResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}bom/all/inventory/raw-materials`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      // Fetch production data
      const productionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}production-process/all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        }
      );

      let inventoryData = [];
      let productionData = [];

      if (inventoryResponse.ok) {
        const inventoryResult = await inventoryResponse.json();
        if (inventoryResult.success) {
          inventoryData = inventoryResult.unapproved || [];
        }
      }

      if (productionResponse.ok) {
        const productionResult = await productionResponse.json();
        if (productionResult.success) {
          productionData = productionResult.production_processes || [];
        }
      }

      // Combine data: top 1 inventory + top 1 production
      const combinedData = [];

      // Add top 1 inventory data
      if (inventoryData.length > 0) {
        combinedData.push({
          ...inventoryData[0],
          source: 'inventory'
        });
      }

      // Add top 1 production data
      if (productionData.length > 0) {
        combinedData.push({
          ...productionData[0],
          source: 'production'
        });
      }

      setApiApprovalData(combinedData);
    } catch (error) {
      console.error('Error fetching approval data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch approval data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingApproval(false);
    }
  };

  // Fetch approval data on component mount
  useEffect(() => {
    fetchApprovalData();
  }, []);

  // Fetch finance data from API
  const fetchFinanceData = async () => {
    setIsLoadingFinance(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_URL}dashboard/finance?view=${accountsPeriod.toLowerCase()}&year=${accountsYear}`;

      // Add month parameter for monthly view
      if (accountsPeriod.toLowerCase() === 'monthly') {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        url += `&mon=${currentMonth}`;
      }

      console.log('Finance API URL:', url); // Debug log

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFinanceData(data);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch finance data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Failed to fetch finance data');
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch finance data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingFinance(false);
    }
  };

  // Fetch finance data when period or year changes
  useEffect(() => {
    fetchFinanceData();
  }, [accountsPeriod, accountsYear]);

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          _id: selectedRole?._id,
          role: editForm.role,
          description: editForm.description,
          permissions: selectedRole?.permissions || []
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast({
        title: "Role Updated",
        description: `${editForm.role} has been updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh roles data
      fetchRolesData();
      onEditClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}role`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          _id: selectedRole?._id
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast({
        title: "Role Deleted",
        description: `${selectedRole?.role} has been deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh roles data
      fetchRolesData();
      onDeleteClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Sales Overview Data (fallback data)
  const fallbackSalesData = [
    { month: 'Jan', value1: 8, value2: 12 },
    { month: 'Feb', value1: 12, value2: 18 },
    { month: 'Mar', value1: 6, value2: 15 },
    { month: 'Apr', value1: 16, value2: 22 },
    { month: 'May', value1: 14, value2: 20 },
    { month: 'Jun', value1: 10, value2: 28 },
    { month: 'Jul', value1: 18, value2: 25 },
    { month: 'Aug', value1: 22, value2: 30 },
    { month: 'Sep', value1: 20, value2: 28 },
    { month: 'Oct', value1: 24, value2: 32 },
    { month: 'Nov', value1: 26, value2: 35 },
    { month: 'Dec', value1: 28, value2: 38 },
  ];

  // Inventory Data (fallback data)
  const fallbackInventoryData = [
    { name: 'Raw materials', value: 30, color: '#6AC6FF' },
    { name: 'Work in progress', value: 25, color: '#78A5F7' },
    { name: 'Finished goods', value: 20, color: '#FF86E1' },
    { name: 'Indirect inventory', value: 25, color: '#FFC680' },
  ];

  // Transform API inventory data to chart format
  const inventoryData = inventoryChartData ? [
    {
      name: 'Raw materials',
      value: inventoryChartData.raw_materials || 0,
      color: '#6AC6FF'
    },
    {
      name: 'Work in progress',
      value: inventoryChartData.work_in_progress || 0,
      color: '#78A5F7'
    },
    {
      name: 'Finished goods',
      value: inventoryChartData.finished_goods || 0,
      color: '#FF86E1'
    },
    {
      name: 'Indirect inventory',
      value: inventoryChartData.indirect_inventory || 0,
      color: '#FFC680'
    },
  ] : fallbackInventoryData;

  // Console log for debugging
  console.log('Inventory Chart Data:', inventoryChartData);
  console.log('Inventory Data Array:', inventoryData);
  console.log('Inventory Data Length:', inventoryData.length);

  // Production Data (fallback data)
  const fallbackProductionData = [
    { name: 'Completed', value: 124, color: '#51B6F5' },
    { name: 'Progress', value: 85, color: '#F778D7' },
    { name: 'Pre Production', value: 65, color: '#80ADFF' },
  ];

  // Transform API production data to chart format
  const productionData = productionChartData ? [
    {
      name: 'Completed',
      value: productionChartData.completed || 0,
      color: '#51B6F5'
    },
    {
      name: 'Progress',
      value: productionChartData.progress || 0,
      color: '#F778D7'
    },
    {
      name: 'Pre Production',
      value: productionChartData.pre_production || 0,
      color: '#80ADFF'
    },
  ] : fallbackProductionData;

  // Console log for debugging
  console.log('Production Chart Data:', productionChartData);
  console.log('Production Data Array:', productionData);
  console.log('Production Data Length:', productionData.length);

  // Dispatch Data (fallback data)
  const fallbackDispatchData = [
    { day: 'Mon', dispatch: 15, deliver: 12 },
    { day: 'Tue', dispatch: 22, deliver: 18 },
    { day: 'Wed', dispatch: 18, deliver: 15 },
    { day: 'Thu', dispatch: 25, deliver: 22 },
    { day: 'Fri', dispatch: 30, deliver: 28 },
    { day: 'Sat', dispatch: 12, deliver: 10 },
    { day: 'Sun', dispatch: 8, deliver: 6 },
  ];

  // Resources Data (fallback data)
  const fallbackResourcesData = [
    { name: 'CNC', type: 'Machine', color: '#FA4F4F' },
    { name: 'Packing assembl...', type: 'Assembly line', color: '#5D94F5' },
    { name: 'Oil machine', type: 'Machine', color: '#FA4F4F' },
    { name: 'Motor manufact...', type: 'Assembly line', color: '#5D94F5' },
  ];

  // Transform API finance data to chart format
  const accountsData = financeData ? [
    {
      name: 'Proforma Invoice',
      value: financeData.proforma_invoices?.total_count || 0,
      color: '#78A5F7'
    },
    {
      name: 'Tax Invoice',
      value: financeData.invoices?.total_count || 0,
      color: '#FFC680'
    },
    {
      name: 'Payments',
      value: financeData.payments?.total_count || 0,
      color: '#F778D7'
    },
  ] : [
    { name: 'Proforma Invoice', value: 0, color: '#78A5F7' },
    { name: 'Tax Invoice', value: 0, color: '#FFC680' },
    { name: 'Payments', value: 0, color: '#F778D7' },
  ];

  // Merchant Data - Pie Chart (fallback data)
  const fallbackMerchantData = [
    { name: 'Individual', value: 60, color: '#6AC6FF' },
    { name: 'Company', value: 40, color: '#FF86E1' },
  ];

  // Transform API merchant data to chart format
  const merchantData = merchantChartData ? [
    {
      name: 'Individual',
      value: merchantChartData.totals?.total_individual || 0,
      color: '#6AC6FF'
    },
    {
      name: 'Company',
      value: merchantChartData.totals?.total_company || 0,
      color: '#FF86E1'
    },
  ] : fallbackMerchantData;

  // User Roles Data (fallback data)
  const fallbackUserRolesData = [
    { role: 'Inventory', description: 'Manage raw materials s...', createdOn: '14/07/25', lastUpdated: '19/08/25' },
    { role: 'Production', description: 'Overseas manufacturi...', createdOn: '14/07/25', lastUpdated: '19/08/25' },
    { role: 'Accountant', description: 'Overseas manufacturi...', createdOn: '14/06/25', lastUpdated: '19/08/25' },
  ];

  // Approval Data (fallback data)
  const fallbackApprovalData = [
    { bom_name: 'Sample BOM', name: 'Sample Material', status: 'raw material approval pending', createdAt: '30/08/25', source: 'inventory' },
    { bom: { bom_name: 'Test BOM' }, item: { name: 'Test Material' }, status: 'completed', createdAt: '29/08/25', source: 'production' },
  ];

  const kpiCards = [
    {
      title: 'Sales Order',
      value: '24',
      change: '5',
      trend: 'up',
      icon: List,
      bgColor: '#FA4F4F',
      iconColor: 'white'
    },
    {
      title: 'Completed Orders',
      value: '15',
      change: '2',
      trend: 'down',
      icon: Check,
      bgColor: '#7ED185',
      iconColor: 'white'
    },
    {
      title: 'Total BOM',
      value: '3',
      change: '1',
      trend: 'up',
      icon: List,
      bgColor: '#EAA250',
      iconColor: 'white'
    },
    {
      title: 'Verified Employes',
      value: '09',
      change: '0',
      trend: 'up',
      icon: Users,
      bgColor: '#00D6EE',
      iconColor: 'white'
    }
  ];

  return (
    <Box
      p={{ base: 4, md: 6, lg: 8 }}
      bg="gray.50"
      minH="100vh"
      maxW="100vw"
      overflowX="hidden"
    >
      {/* Header */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        mb={6}
        gap={{ base: 4, md: 0 }}
      >
        <VStack align={{ base: 'start', md: 'start' }} spacing={2}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.800">
            Analytics Dashboard
          </Text>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
            Monitor your business performance and insights
          </Text>
        </VStack>
        {/* <HStack spacing={3}>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            size={{ base: 'sm', md: 'md' }}
            bg="white"
            w={{ base: '32', md: '40' }}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </HStack> */}
      </Flex>

      {/* KPI Cards */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 6 }}
        mb={6}
        flexWrap="wrap"
      >
        {kpiCards.map((kpi, index) => (
          <Box
            key={index}
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            flex={{ base: '1', lg: '1' }}
            minW={{ base: '100%', lg: 'auto' }}
            boxShadow="sm"
          >
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              justify="space-between"
              align={{ base: 'start', sm: 'center' }}
              gap={{ base: 3, sm: 0 }}
            >
              <Box flex="1">
                <Text fontSize="sm" color="gray.600" mb={1}>{kpi.title}</Text>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.800" mb={2}>{kpi.value}</Text>
                <Flex align="center" gap={1} flexWrap="wrap">
                  <Text
                    fontSize="sm"
                    color={kpi.trend === 'up' ? 'green.500' : kpi.change === '0' ? 'gray.500' : 'red.500'}
                  >
                    {kpi.change} {kpi.trend === 'up' ? '▲' : '▼'}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                  >
                    v/s last month
                  </Text>
                </Flex>
              </Box>
              <Box
                bg={kpi.bgColor}
                p={3}
                borderRadius={kpi.icon === List ? 'md' : 'full'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon as={kpi.icon} size={20} color={kpi.iconColor} />
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      {/* Middle Row - Sales Overview and Inventory */}
      <Flex
        direction={{ base: 'column', xl: 'row' }}
        gap={{ base: 4, xl: 6 }}
        mb={6}
      >
        {/* Sales Overview */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', xl: '2.5' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Sales Overview</Text>
            <HStack spacing={2} flexWrap="wrap">
              {['Weekly', 'Monthly', 'Yearly'].map((period) => (
                <Box
                  key={period}
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg={period === salesPeriod ? 'blue.500' : 'gray.100'}
                  color={period === salesPeriod ? 'white' : 'gray.600'}
                  fontSize="sm"
                  cursor="pointer"
                  onClick={() => setSalesPeriod(period)}
                  _hover={{
                    bg: period === salesPeriod ? 'blue.600' : 'gray.200'
                  }}
                  transition="all 0.2s"
                  flexShrink={0}
                >
                  {period}
                </Box>
              ))}
              {salesPeriod === 'Yearly' && (
                <Select
                  value={salesYear}
                  onChange={(e) => setSalesYear(Number(e.target.value))}
                  size="sm"
                  bg="white"
                  w="20"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              )}
            </HStack>
          </Flex>
          <Box height={{ base: '250px', md: '300px' }}>
            {isLoadingSales ? (
              <Flex justify="center" align="center" height="100%">
                <Text color="gray.500">Loading sales data...</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.length > 0 ? salesData : fallbackSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="value1" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="value2" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
          {/* Sales Overview Legend */}
          <HStack spacing={4} mt={4} justify="center" flexWrap="wrap">
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#3B82F6" />
              <Text fontSize="sm" color="gray.600">Before  </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#F59E0B" />
              <Text fontSize="sm" color="gray.600">Current </Text>
            </Flex>
          </HStack>
        </Box>

        {/* Inventory */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', xl: '1' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Inventory</Text>
            <HStack spacing={1}>
              <Select
                value={inventoryPeriod}
                onChange={(e) => setInventoryPeriod(e.target.value)}
                size="sm"
                bg="white"
                w={{ base: '28', md: '32' }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
            </HStack>
          </Flex>
          <Box height={{ base: '200px', md: '200px' }}>
            {isLoadingInventory ? (
              <Flex justify="center" align="center" height="100%">
                <Text color="gray.500">Loading inventory data...</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
          <VStack spacing={2} mt={4} align="start">
            {inventoryData.map((item, index) => (
              <Flex key={index} align="center" gap={2}>
                <Box w={3} h={3} borderRadius="full" bg={item.color} />
                <Text fontSize="sm" color="gray.600">{item.name}</Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>

      {/* Bottom Row - Production, Dispatch, and Resources */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 6 }}
        mb={6}
      >
        {/* Production */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '0.8' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Production</Text>
            <HStack spacing={1}>
              <Select
                value={productionPeriod}
                onChange={(e) => setProductionPeriod(e.target.value)}
                size="sm"
                bg="white"
                w={{ base: '28', md: '32' }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
            </HStack>
          </Flex>
          <Box height={{ base: '200px', md: '200px' }}>
            {isLoadingProduction ? (
              <Flex justify="center" align="center" height="100%">
                <Text color="gray.500">Loading production data...</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {productionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
          <Box textAlign="center" mt={2}>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Completed</Text>
            <Text fontSize="sm" color="gray.600">
              {isLoadingProduction ? 'Loading...' : `${productionChartData?.completed || 0} orders`}
            </Text>
          </Box>
          <VStack spacing={2} mt={4} align="start">
            {productionData.map((item, index) => (
              <Flex key={index} align="center" gap={2}>
                <Box w={3} h={3} borderRadius="full" bg={item.color} />
                <Text fontSize="sm" color="gray.600">{item.name}</Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Dispatch */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Dispatch</Text>
            <HStack spacing={1}>
              <Select
                value={dispatchPeriod}
                onChange={(e) => setDispatchPeriod(e.target.value)}
                size="sm"
                bg="white"
                w={{ base: '28', md: '32' }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
            </HStack>
          </Flex>
          <Box height={{ base: '200px', md: '200px' }}>
            {isLoadingDispatch ? (
              <Flex justify="center" align="center" height="100%">
                <Text color="gray.500">Loading dispatch data...</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiDispatchData.length > 0 ? apiDispatchData : fallbackDispatchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="dispatch" fill="#F778D7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deliver" fill="#78A5F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>                     <HStack spacing={4} mt={4} justify="center" flexWrap="wrap">
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#F778D7" />
              <Text fontSize="sm" color="gray.600">Dispatch</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#78A5F7" />
              <Text fontSize="sm" color="gray.600">Deliver</Text>
            </Flex>
          </HStack>
        </Box>

        {/* Resources */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1.2' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Resources</Text>
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate('/resources')}
              _hover={{ color: 'blue.600' }}
              transition="color 0.2s"
            >
              View all
            </Text>
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={4}>
            {isLoadingResources ? 'Loading...' : `${apiResourcesData.length || 0} resources found`}
          </Text>
          <VStack spacing={3} align="stretch">
            {(apiResourcesData.length > 0 ? apiResourcesData : fallbackResourcesData).slice(0, 4).map((resource, index) => (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                p={3}
                bg="gray.50"
                borderRadius="full"
                flexWrap="wrap"
                gap={2}
              >
                <Text fontSize="sm" color="gray.800" fontWeight="normal">{resource.name}</Text>
                <Badge
                  colorScheme={resource.type === 'Machine' ? 'red' : 'blue'}
                  variant="subtle"
                  fontSize="xs"
                  borderRadius="80px"
                  fontWeight="normal"
                >
                  {resource.type}
                </Badge>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>

      {/* Additional Sections - 2x2 Grid */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 6 }}
        mb={6}
        flexWrap="wrap"
      >
        {/* User Roles */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1' }}
          minW={{ base: '100%', lg: 'auto' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">User roles</Text>
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate('/role')}
              _hover={{ color: 'blue.600' }}
              transition="color 0.2s"
            >
              View all
            </Text>
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={4}>
            {isLoadingRoles ? 'Loading...' : `${apiRolesData.length || 0} Roles found`}
          </Text>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="xs">Role</Th>
                  <Th fontSize="xs">Description</Th>
                  <Th fontSize="xs">Created on</Th>
                  <Th fontSize="xs">Last updated</Th>
                  <Th fontSize="xs">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(apiRolesData.length > 0 ? apiRolesData.slice(0, 3) : fallbackUserRolesData.slice(0, 3)).map((role, index) => {
                  // Format dates for API data
                  const createdOn = role.createdAt ? new Date(role.createdAt).toLocaleDateString('en-GB') : role.createdOn || '';
                  const lastUpdated = role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('en-GB') : role.lastUpdated || '';

                  return (
                    <Tr key={index}>
                      <Td fontSize="xs">{role.role}</Td>
                      <Td fontSize="xs">{role.description}</Td>
                      <Td fontSize="xs">{createdOn}</Td>
                      <Td fontSize="xs">{lastUpdated}</Td>
                      <Td>
                        <HStack spacing={1}>
                          <Icon
                            as={Eye}
                            size={14}
                            color="blue.500"
                            cursor="pointer"
                            onClick={() => handleViewRole(role)}
                            _hover={{ color: "blue.600" }}
                          />
                          <Icon
                            as={Edit}
                            size={14}
                            color="green.500"
                            cursor="pointer"
                            onClick={() => handleEditRole(role)}
                            _hover={{ color: "green.600" }}
                          />
                          <Icon
                            as={Trash2}
                            size={14}
                            color="red.500"
                            cursor="pointer"
                            onClick={() => handleDeleteRole(role)}
                            _hover={{ color: "red.600" }}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Accounts */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Accounts</Text>
            <HStack spacing={2}>
              <Select
                value={accountsPeriod}
                onChange={(e) => setAccountsPeriod(e.target.value)}
                size="sm"
                bg="white"
                w={{ base: '28', md: '32' }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
              {accountsPeriod === 'Yearly' && (
                <Select
                  value={accountsYear}
                  onChange={(e) => setAccountsYear(Number(e.target.value))}
                  size="sm"
                  bg="white"
                  w="20"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              )}
            </HStack>
          </Flex>
          <Box textAlign="center" mb={4}>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">
              {isLoadingFinance ? 'Loading...' : `${financeData?.invoices?.total_count || 0} Invoice${financeData?.invoices?.total_count !== 1 ? 's' : ''}`}
            </Text>
          </Box>
          <Box height={{ base: '180px', md: '180px' }}>
            {isLoadingFinance ? (
              <Flex justify="center" align="center" height="100%">
                <Text color="gray.500">Loading finance data...</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accountsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    startAngle={180}
                    endAngle={0}
                    dataKey="value"
                  >
                    {accountsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => {
                      return [name, value];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
          <VStack spacing={2} mt={4} align="start">
            {accountsData.map((item, index) => (
              <Flex key={index} align="center" gap={2}>
                <Box w={3} h={3} borderRadius="full" bg={item.color} />
                <Text fontSize="sm" color="gray.600">{item.name}</Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 6 }}
        mb={6}
      >
        {/* Merchant */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Merchant</Text>
            <HStack spacing={1}>
              <Select
                value={merchantPeriod}
                onChange={(e) => setMerchantPeriod(e.target.value)}
                size="sm"
                bg="white"
                w={{ base: '28', md: '32' }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Select>
            </HStack>
          </Flex>
          <Box textAlign="center" mb={4}>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">
              {isLoadingMerchant ? 'Loading...' : `${merchantChartData?.totals?.total_merchant || 0} Parties`}
            </Text>
          </Box>
          {isLoadingMerchant ? (
            <Flex justify="center" align="center" height="150px">
              <Text color="gray.500">Loading merchant data...</Text>
            </Flex>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={merchantData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                >
                  {merchantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Individual') {
                      const individual = merchantChartData?.individual;
                      return ['Individual', `${individual?.buyer || 0} Buyer, ${individual?.seller || 0} Seller`];
                    }
                    if (name === 'Company') {
                      const company = merchantChartData?.company;
                      return ['Company', `${company?.buyer || 0} Buyer, ${company?.seller || 0} Seller`];
                    }
                    return [name, value];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <VStack spacing={2} mt={4} align="start">
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#6AC6FF" />
              <Text fontSize="sm" color="gray.600">Individual</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg="#FF86E1" />
              <Text fontSize="sm" color="gray.600">Company</Text>
            </Flex>
          </VStack>
        </Box>

        {/* Approval */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          flex={{ base: '1', lg: '1' }}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={4}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="gray.800">Approval</Text>
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate('/inventory/approval')}
              _hover={{ color: 'blue.600' }}
              transition="color 0.2s"
            >
              View all
            </Text>
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={4}>
            {isLoadingApproval ? 'Loading...' : `${apiApprovalData.length || 0} Approval found`}
          </Text>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontSize="xs">Role</Th>
                  <Th fontSize="xs">BOM Name</Th>
                  <Th fontSize="xs">Material</Th>
                  <Th fontSize="xs">Status</Th>
                  <Th fontSize="xs">Created on</Th>
                  {/* <Th fontSize="xs">Actions</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {(apiApprovalData.length > 0 ? apiApprovalData : fallbackApprovalData).map((item, index) => {
                  // Format dates for API data
                  const createdOn = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : item.createdOn || '';

                  // Determine role based on source
                  const getRole = (source: string) => {
                    return source === 'inventory' ? 'Inventory' : 'Production';
                  };

                  // Get BOM name and material name based on source
                  const getBomName = (item: any) => {
                    if (item.source === 'inventory') {
                      return item.bom_name || 'N/A';
                    } else {
                      return item.bom?.bom_name || 'N/A';
                    }
                  };

                  const getMaterialName = (item: any) => {
                    if (item.source === 'inventory') {
                      return item.name || 'N/A';
                    } else {
                      return item.item?.name || 'N/A';
                    }
                  };

                  // Get status based on source
                  const getStatus = (item: any) => {
                    if (item.source === 'inventory') {
                      return item.bom_status || 'N/A';
                    } else {
                      return item.status || 'N/A';
                    }
                  };

                  return (
                    <Tr key={index}>
                      <Td fontSize="xs">{getRole(item.source)}</Td>
                      <Td fontSize="xs">{getBomName(item)}</Td>
                      <Td fontSize="xs">{getMaterialName(item)}</Td>
                      <Td fontSize="xs">
                        <Badge
                          colorScheme={getStatus(item) === 'raw material approval pending' ? 'orange' : getStatus(item) === 'completed' ? 'green' : 'blue'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {getStatus(item) === 'raw material approval pending' ? 'Pending' :
                            getStatus(item) === 'completed' ? 'Completed' :
                              getStatus(item) === 'production in progress' ? 'In Progress' :
                                getStatus(item) === 'Inventory Allocated' ? 'Allocated' : getStatus(item)}
                        </Badge>
                      </Td>
                      <Td fontSize="xs">{createdOn}</Td>
                      {/* <Td>
                         <HStack spacing={1}>
                           <Icon 
                             as={Eye} 
                             size={14} 
                             color="blue.500" 
                             cursor="pointer" 
                             onClick={() => handleViewRole(item)}
                             _hover={{ color: "blue.600" }}
                           />
                           <Icon 
                             as={Edit} 
                             size={14} 
                             color="green.500" 
                             cursor="pointer" 
                             onClick={() => handleEditRole(item)}
                             _hover={{ color: "green.600" }}
                           />
                           <Icon 
                             as={Trash2} 
                             size={14} 
                             color="red.500" 
                             cursor="pointer" 
                             onClick={() => handleDeleteRole(item)}
                             _hover={{ color: "red.600" }}
                           />
                         </HStack>
                       </Td> */}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>

      {/* Role Modals Component */}
      <RoleModals
        isViewOpen={isViewOpen}
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        onViewClose={onViewClose}
        onEditClose={onEditClose}
        onDeleteClose={onDeleteClose}
        selectedRole={selectedRole}
        editForm={editForm}
        setEditForm={setEditForm}
        onSaveEdit={handleSaveEdit}
        onConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default Analytics;
