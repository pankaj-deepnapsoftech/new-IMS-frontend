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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Card,
  CardBody,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
} from '@chakra-ui/react';
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
  Trash2,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

const MachineStatus: React.FC = () => {
  const [cookies] = useCookies();
  const toast = useToast();
  const [machineData, setMachineData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedDesign, setSelectedDesign] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1h');

  // Mock data for demonstration - replace with actual API call
  const mockMachineData = [
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:39', shift: 'Shift-C', design: 'Design456', count: 16518, efficiency: 3.38, error1: 4, error2: 2, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:40', shift: 'Shift-B', design: 'Design789', count: 15407, efficiency: 2.8, error1: 1, error2: 5, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:41', shift: 'Shift-B', design: 'Design789', count: 15345, efficiency: 4.0, error1: 0, error2: 5, status: 'OFF' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:42', shift: 'Shift-A', design: 'Design123', count: 16234, efficiency: 3.2, error1: 2, error2: 3, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:43', shift: 'Shift-A', design: 'Design123', count: 15890, efficiency: 3.8, error1: 1, error2: 4, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:44', shift: 'Shift-C', design: 'Design456', count: 16789, efficiency: 4.1, error1: 0, error2: 1, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:45', shift: 'Shift-B', design: 'Design789', count: 15567, efficiency: 2.9, error1: 3, error2: 2, status: 'OFF' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:46', shift: 'Shift-A', design: 'Design123', count: 16345, efficiency: 3.5, error1: 1, error2: 3, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:47', shift: 'Shift-C', design: 'Design456', count: 16890, efficiency: 4.2, error1: 0, error2: 1, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:48', shift: 'Shift-B', design: 'Design789', count: 15678, efficiency: 3.1, error1: 2, error2: 4, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:49', shift: 'Shift-A', design: 'Design123', count: 16456, efficiency: 3.7, error1: 1, error2: 2, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:50', shift: 'Shift-C', design: 'Design456', count: 16923, efficiency: 4.0, error1: 0, error2: 1, status: 'OFF' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:51', shift: 'Shift-B', design: 'Design789', count: 15789, efficiency: 3.3, error1: 2, error2: 3, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:52', shift: 'Shift-A', design: 'Design123', count: 16567, efficiency: 3.9, error1: 1, error2: 2, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:53', shift: 'Shift-C', design: 'Design456', count: 17012, efficiency: 4.1, error1: 0, error2: 1, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:54', shift: 'Shift-B', design: 'Design789', count: 15890, efficiency: 3.2, error1: 2, error2: 4, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:55', shift: 'Shift-A', design: 'Design123', count: 16678, efficiency: 3.8, error1: 1, error2: 2, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:56', shift: 'Shift-C', design: 'Design456', count: 17089, efficiency: 4.0, error1: 0, error2: 1, status: 'ON' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:57', shift: 'Shift-B', design: 'Design789', count: 15967, efficiency: 3.4, error1: 2, error2: 3, status: 'OFF' },
    { deviceId: 'LOOM1', timestamp: '2025-09-03 15:58', shift: 'Shift-A', design: 'Design123', count: 16789, efficiency: 3.9, error1: 1, error2: 2, status: 'ON' },
  ];

  useEffect(() => {
    // Load mock data initially - replace with actual API call
    setMachineData(mockMachineData);
  }, []);

  const fetchMachineData = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API endpoint
      const response = await fetch('http://localhost:8085/api/dashboard/machine-status', {
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMachineData(result.data);
          toast({
            title: "Success",
            description: "Machine data fetched successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error(result.message || "Failed to fetch machine data");
        }
      } else {
        throw new Error('Failed to fetch machine data');
      }
    } catch (error: any) {
      console.error('Error fetching machine data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch machine data. Using sample data.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      // Keep using mock data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on selections
  const filteredData = machineData.filter(item => {
    if (selectedMachine !== 'all' && item.deviceId !== selectedMachine) return false;
    if (selectedShift !== 'all' && item.shift !== selectedShift) return false;
    if (selectedDesign !== 'all' && item.design !== selectedDesign) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  // Calculate statistics
  const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0);
  const avgEfficiency = filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.efficiency, 0) / filteredData.length).toFixed(2) : 0;
  const totalErrors = filteredData.reduce((sum, item) => sum + item.error1 + item.error2, 0);
  const activeMachines = Array.from(new Set(filteredData.map(item => item.deviceId))).length;
  const machinesOn = filteredData.filter(item => item.status === 'ON').length;
  const machinesOff = filteredData.filter(item => item.status === 'OFF').length;

  // Prepare chart data
  const chartData = filteredData.map(item => ({
    time: item.timestamp.split(' ')[1], // Extract time part
    count: item.count,
    efficiency: item.efficiency,
    errors: item.error1 + item.error2
  }));

  // Get unique values for filters
  const machines = Array.from(new Set(machineData.map(item => item.deviceId)));
  const shifts = Array.from(new Set(machineData.map(item => item.shift)));
  const designs = Array.from(new Set(machineData.map(item => item.design)));

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" color="gray.800" mb={2}>
              Machine Dashboard
            </Heading>
            <Text color="gray.600">
              Monitor real-time machine performance and status
            </Text>
          </Box>
          <Button
            leftIcon={<Activity />}
            colorScheme="blue"
            onClick={fetchMachineData}
            isLoading={isLoading}
          >
            Refresh Data
          </Button>
        </Flex>

        {/* Statistics Cards */}
        <HStack spacing={6} wrap="wrap">
          <Card flex="1" minW="200px">
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">Total Count</StatLabel>
                <StatNumber color="blue.600">{totalCount.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12.5%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card flex="1" minW="200px">
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">Avg Efficiency</StatLabel>
                <StatNumber color="green.600">{avgEfficiency}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8.2%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card flex="1" minW="200px">
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">Total Errors</StatLabel>
                <StatNumber color="red.600">{totalErrors}</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  15.3%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card flex="1" minW="200px">
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">Machines ON</StatLabel>
                <StatNumber color="green.600">{machinesOn}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {filteredData.length > 0 ? ((machinesOn / filteredData.length) * 100).toFixed(1) : 0}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </HStack>

        {/* Filters */}
        <Card>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                  Machine
                </Text>
                <Select
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  size="sm"
                  w="150px"
                >
                  <option value="all">All Machines</option>
                  {machines.map(machine => (
                    <option key={machine} value={machine}>{machine}</option>
                  ))}
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                  Shift
                </Text>
                <Select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  size="sm"
                  w="150px"
                >
                  <option value="all">All Shifts</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                  Design
                </Text>
                <Select
                  value={selectedDesign}
                  onChange={(e) => setSelectedDesign(e.target.value)}
                  size="sm"
                  w="150px"
                >
                  <option value="all">All Designs</option>
                  {designs.map(design => (
                    <option key={design} value={design}>{design}</option>
                  ))}
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                  Status
                </Text>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="sm"
                  w="150px"
                >
                  <option value="all">All Status</option>
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </Select>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                  Time Range
                </Text>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  size="sm"
                  w="150px"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                </Select>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Charts */}
        <HStack spacing={6} align="stretch">
          {/* Count Chart */}
          <Card flex="2">
            <CardBody>
              <Heading size="md" mb={4}>Count Over Time</Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#718096"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#718096"
                      fontSize={12}
                      label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3182CE" 
                      strokeWidth={2}
                      dot={{ fill: '#3182CE', strokeWidth: 2, r: 4 }}
                      name="Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Efficiency Chart */}
          <Card flex="1">
            <CardBody>
              <Heading size="md" mb={4}>Efficiency vs Errors</Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="time" stroke="#718096" fontSize={12} />
                    <YAxis stroke="#718096" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" fill="#38A169" name="Efficiency" />
                    <Bar dataKey="errors" fill="#E53E3E" name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </HStack>

        {/* Machine Performance Data Cards */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Machine Performance Data</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {filteredData.map((item, index) => (
                <Card key={index} variant="outline" size="sm">
                  <CardBody p={4}>
                                         {/* Header with Device ID, Status, and Shift */}
                     <Flex justify="space-between" align="center" mb={3}>
                       <Text fontSize="lg" fontWeight="bold" color="blue.600">
                         {item.deviceId}
                       </Text>
                       <VStack spacing={1} align="end">
                         {/* Machine Status ON/OFF */}
                         <Badge 
                           colorScheme={item.status === 'ON' ? 'green' : 'red'}
                           variant="solid"
                           size="sm"
                           borderRadius="full"
                           px={2}
                         >
                           {item.status}
                         </Badge>
                         {/* Shift Badge */}
                         <Badge 
                           colorScheme={
                             item.shift === 'Shift-A' ? 'green' : 
                             item.shift === 'Shift-B' ? 'blue' : 'purple'
                           }
                           variant="subtle"
                           size="sm"
                         >
                           {item.shift}
                         </Badge>
                       </VStack>
                     </Flex>

                    {/* Timestamp */}
                    <Box mb={3}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Timestamp
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {item.timestamp}
                      </Text>
                    </Box>

                    {/* Design */}
                    <Box mb={3}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Design
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {item.design}
                      </Text>
                    </Box>

                    {/* Performance Metrics */}
                    <SimpleGrid columns={2} spacing={3} mb={3}>
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Count
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          {item.count.toLocaleString()}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Efficiency
                        </Text>
                        <Badge 
                          colorScheme={item.efficiency >= 4 ? 'green' : item.efficiency >= 3 ? 'yellow' : 'red'}
                          variant="subtle"
                          fontSize="sm"
                        >
                          {item.efficiency}
                        </Badge>
                      </Box>
                    </SimpleGrid>

                    {/* Error Metrics */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        Error Status
                      </Text>
                      <HStack spacing={2}>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.500">Error 1</Text>
                          <Badge 
                            colorScheme={item.error1 === 0 ? 'green' : 'red'}
                            variant="solid"
                            size="sm"
                          >
                            {item.error1}
                          </Badge>
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.500">Error 2</Text>
                          <Badge 
                            colorScheme={item.error2 === 0 ? 'green' : 'red'}
                            variant="solid"
                            size="sm"
                          >
                            {item.error2}
                          </Badge>
                        </Box>
                      </HStack>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default MachineStatus;
  