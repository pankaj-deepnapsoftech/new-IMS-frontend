import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  Divider,
  Grid,
  GridItem,
  Card,
  CardBody,
  Badge,
  IconButton,
  useColorModeValue,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BiX,
  BiBuilding,
  BiUser,
  BiPhone,
  BiMapPin,
  BiCreditCard,
  BiCalendar,
  BiPackage,
  BiEdit,
  BiPlus,
  BiCheckCircle,
} from "react-icons/bi";
import {
  Edit3,
  Plus,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  IndianRupee,
} from "lucide-react";
import { colors } from "../../../theme/colors";
import axios from "axios";

interface AddPurchaseOrderProps {
  isOpen: boolean;
  closeDrawerHandler: () => void;
  edittable?: any;
  fetchPurchaseOrderData?: () => void;
}

interface SupplierOption {
  id: string;
  supplierName: string;
  companyName: string;
  supplierEmail?: string;
  supplierShippedTo?: string;
  supplierBillTo?: string;
  supplierShippedGSTIN?: string;
  supplierBillGSTIN?: string;
}

interface SupplierApiResponse {
  success: boolean;
  message?: string;
  suppliers: SupplierOption[];
}

interface RawMaterial {
  _id: string;
  name: string;
}

interface PurchaseOrderFormValues {
  poOrder: string;
  date: string;
  supplierIdentifier: string;
  supplierName: string;
  supplierEmail: string;
  supplierShippedTo: string;
  supplierBillTo: string;
  supplierShippedGSTIN: string;
  supplierBillGSTIN: string;
  GSTApply: string;
  // packagingAndForwarding: string;
  // freightCharges: string;
  modeOfPayment: string;
  // deliveryPeriod: string;
  billingAddress: string;
  paymentTerms: string;
  additionalRemarks: string;
  additionalImportant: string;
  itemName: string;
  quantity: number;
  isSameAddress: boolean;
}

const AddPurchaseOrder: React.FC<AddPurchaseOrderProps> = ({
  isOpen,
  closeDrawerHandler,
  edittable,
  fetchPurchaseOrderData,
}) => {
  const [cookies] = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([]);
  const [nextPONumber, setNextPONumber] = useState("");
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState("");

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const hasError = (fieldName: keyof PurchaseOrderFormValues): boolean => {
    return !!(formik.touched[fieldName] && formik.errors[fieldName]);
  };

  const getErrorMessage = (fieldName: keyof PurchaseOrderFormValues): string => {
    return formik.errors[fieldName] ? String(formik.errors[fieldName]) : "";
  };

  const validationSchema = Yup.object({
    poOrder: Yup.string().required("PO Order is required"),
    date: Yup.string().required("Date is required"),
    supplierIdentifier: Yup.string().required("Supplier name or company name is required"),
    supplierName: Yup.string().required("Supplier name is required"),
    supplierEmail: Yup.string().email("Invalid email"),
    supplierShippedTo: Yup.string().required("Supplier shipped to is required"),
    supplierBillTo: Yup.string().required("Supplier bill to is required"),
    supplierShippedGSTIN: Yup.string().required("Shipped GSTIN is required"),
    supplierBillGSTIN: Yup.string().required("Bill GSTIN is required"),
    GSTApply: Yup.string().required("GST selection is required"),
    // packagingAndForwarding: Yup.string(),
    // freightCharges: Yup.string(),
    modeOfPayment: Yup.string().required("Mode of payment is required"),
    // deliveryPeriod: Yup.string(),
    billingAddress: Yup.string(),
    paymentTerms: Yup.string(),
    itemName: Yup.string().required("Item name is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1")
      .integer("Quantity must be an integer"),
    additionalRemarks: Yup.string(),
    additionalImportant: Yup.string(),
    isSameAddress: Yup.boolean(),
  });

  const formik = useFormik<PurchaseOrderFormValues>({
    initialValues: {
      poOrder: edittable?.poOrder || "",
      date: edittable?.date || new Date().toISOString().split("T")[0],
      supplierIdentifier: edittable?.supplierName || edittable?.companyName || "",
      supplierName: edittable?.supplierName || "",
      supplierEmail: edittable?.supplierEmail || "",
      supplierShippedTo: edittable?.supplierShippedTo || "",
      supplierBillTo: edittable?.supplierBillTo || "",
      supplierShippedGSTIN: edittable?.supplierShippedGSTIN || "",
      supplierBillGSTIN: edittable?.supplierBillGSTIN || "",
      GSTApply: edittable?.GSTApply || "",
      // packagingAndForwarding: edittable?.packagingAndForwarding || "",
      // freightCharges: edittable?.freightCharges || "",
      modeOfPayment: edittable?.modeOfPayment || "",
      // deliveryPeriod: edittable?.deliveryPeriod || "",
      billingAddress: edittable?.billingAddress || "",
      paymentTerms: edittable?.paymentTerms || "",
      additionalRemarks: edittable?.additionalRemarks || "",
      additionalImportant: edittable?.additionalImportant || "",
      itemName: edittable?.itemName || "",
      quantity: edittable?.quantity || 1,
      isSameAddress: edittable?.isSameAddress || false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      // Map supplierIdentifier to supplierName for the backend
      const payload = {
        ...values,
        supplierName: values.supplierIdentifier,
      };

      try {
        if (edittable?._id) {
          const res = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}purchase-order/${edittable._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );
          if (res.data.success) {
            setPopupMessage("Purchase order updated successfully!");
            setPopupType("success");
            onModalOpen();
            if (fetchPurchaseOrderData) {
              fetchPurchaseOrderData();
            }
            setTimeout(() => {
              closeDrawerHandler();
            }, 2000);
          }
        } else {
          const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}purchase-order/`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );

          if (res.data.success) {
            setPopupMessage("Purchase order created successfully!");
            setPopupType("success");
            onModalOpen();
            formik.resetForm();
            if (fetchPurchaseOrderData) {
              fetchPurchaseOrderData();
            }
            setTimeout(() => {
              closeDrawerHandler();
            }, 2000);
          }
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message ||
          "Something went wrong while saving purchase order!";
        setPopupMessage(errorMessage);
        setPopupType("error");
        onModalOpen();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchSuppliersHandler = async (retryCount = 0) => {
    setIsLoadingSuppliers(true);
    try {
      console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
      console.log("Access Token:", cookies.access_token);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}purchase-order/suppliers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const data: SupplierApiResponse = await response.json();
      console.log("Supplier API Response:", data);
      if (!data.success) {
        throw new Error(data.message);
      }

      const suppliers = data.suppliers
        .map((supplier) => ({
          id: supplier.id,
          supplierName: supplier.supplierName || "",
          companyName: supplier.companyName || "",
          supplierEmail: supplier.supplierEmail || "",
          supplierShippedTo: supplier.supplierShippedTo || "",
          supplierBillTo: supplier.supplierBillTo || "",
          supplierShippedGSTIN: supplier.supplierShippedGSTIN || "",
          supplierBillGSTIN: supplier.supplierBillGSTIN || "",
        }))
        .filter((supplier) => supplier.supplierName.trim() || supplier.companyName.trim());
      setSupplierOptions(suppliers);
      console.log("Set Supplier Options:", suppliers);
      if (suppliers.length === 0 && retryCount < 3) {
        console.warn(`Retry attempt ${retryCount + 1} for fetching suppliers`);
        setTimeout(() => fetchSuppliersHandler(retryCount + 1), 1000);
      }
    } catch (error: any) {
      console.error("Error fetching suppliers:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const fetchNextPONumber = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}purchase-order/next-po-number`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setNextPONumber(data.poNumber);
        formik.setFieldValue("poOrder", data.poNumber);
      }
    } catch (error: any) {
      console.error("Error fetching next PO number:", error);
    }
  };

  useEffect(() => {
    fetchSuppliersHandler();
    if (!edittable) {
      fetchNextPONumber();
    }
    axios.get(`${process.env.REACT_APP_BACKEND_URL}product/raw-materials`, {
      headers: { Authorization: `Bearer ${cookies?.access_token}` },
    }).then(res => {
      setRawMaterials(res.data.rawMaterials || []);
    });
  }, []);

  useEffect(() => {
    if (edittable && supplierOptions.length > 0) {
      console.log("Edittable Data:", edittable);
      console.log("Initial Formik supplierIdentifier:", formik.values.supplierIdentifier);
      console.log("Supplier Options:", supplierOptions);
      const isValidSupplier = supplierOptions.some(
        (supplier) => supplier.supplierName === edittable.supplierName || supplier.companyName === edittable.supplierName
      );
      if (!isValidSupplier && edittable.supplierName) {
        toast.warn("Selected supplier is not available. Please choose a new supplier.");
        formik.setFieldValue("supplierIdentifier", "");
        formik.setFieldValue("supplierName", "");
      } else if (!edittable.supplierName && !edittable.companyName) {
        formik.setFieldValue("supplierIdentifier", "");
        formik.setFieldValue("supplierName", "");
      }
    }
  }, [edittable, supplierOptions]);

  useEffect(() => {
    if (formik.values.isSameAddress) {
      formik.setFieldValue("supplierShippedGSTIN", formik.values.supplierShippedTo);
      formik.setFieldValue("supplierBillGSTIN", formik.values.supplierBillTo);
    }
  }, [formik.values.supplierShippedTo, formik.values.supplierBillTo, formik.values.isSameAddress]);

  return (
    <>
      <div
        className="absolute overflow-auto h-[100vh] w-[100vw] bg-white right-0 top-0 z-50 py-3 border-l border-gray-200"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            {edittable ? "Edit Purchase Order" : "Add New Purchase Order"}
          </h1>
          <button
            onClick={closeDrawerHandler}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.gray[100],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
          >
            <BiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Box as="form" onSubmit={formik.handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
              >
                <CardBody p={6}>
                  <Flex align="center" gap={3} mb={6}>
                    <Box p={2} bg="green.50" borderRadius="lg">
                      <BiPackage size={20} color="#38A169" />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      Purchase Order
                    </Heading>
                  </Flex>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={6}
                  >
                    {/* <GridItem>
                      <FormControl isInvalid={hasError("poOrder")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <FileSpreadsheet size={16} />
                          P.O. Number (Auto-generated) *
                        </FormLabel>
                        <Input
                          name="poOrder"
                          value={formik.values.poOrder}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter PO order number"
                          size="lg"
                          borderRadius="lg"
                          isReadOnly
                          bg="gray.50"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("poOrder") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("poOrder")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem> */}

                    <GridItem>
                      <FormControl isInvalid={hasError("date")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiCalendar size={16} />
                          Order Date *
                        </FormLabel>
                        <Input
                          type="date"
                          name="date"
                          value={formik.values.date}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("date") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("date")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("supplierIdentifier")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiUser size={16} />
                          Supplier Name *
                        </FormLabel>
                        <Select
                          placeholder={isLoadingSuppliers ? "Loading suppliers..." : "Select Supplier"}
                          isDisabled={isLoadingSuppliers}
                          name="supplierIdentifier"
                          value={formik.values.supplierIdentifier}
                          onChange={(e) => {
                            const selectedIdentifier = e.target.value;
                            formik.setFieldValue("supplierIdentifier", selectedIdentifier);
                            formik.setFieldValue("supplierName", selectedIdentifier);
                            const matched = supplierOptions.find(
                              (supplier) =>
                                (supplier.supplierName && supplier.supplierName === selectedIdentifier) ||
                                (supplier.companyName && supplier.companyName === selectedIdentifier)
                            );
                            if (matched) {
                              formik.setValues({
                                ...formik.values,
                                supplierIdentifier: matched.supplierName || matched.companyName || "",
                                supplierName: matched.supplierName || matched.companyName || "",
                                supplierEmail: matched.supplierEmail || "",
                                supplierShippedTo: matched.supplierShippedTo || "",
                                supplierBillTo: matched.supplierBillTo || "",
                                supplierShippedGSTIN: matched.supplierShippedGSTIN || "",
                                supplierBillGSTIN: matched.supplierBillGSTIN || "",
                                isSameAddress: false,
                              });
                            }
                          }}
                          size="lg"
                          borderRadius="lg"
                        >
                          {supplierOptions.length > 0 ? (
                            supplierOptions.map((supplier) => {
                              const displayText = supplier.supplierName || supplier.companyName || "Unknown Supplier";
                              const value = supplier.supplierName || supplier.companyName || "";
                              return (
                                <option key={supplier.id} value={value}>
                                  {displayText}
                                  {supplier.supplierName && supplier.companyName && ` (${supplier.companyName})`}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              {isLoadingSuppliers ? "Loading..." : "No suppliers available"}
                            </option>
                          )}
                        </Select>
                        {getErrorMessage("supplierIdentifier") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierIdentifier")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl isInvalid={hasError("itemName")}>
                        <FormLabel>Item Name *</FormLabel>
                        <Select
                          placeholder="Select Item"
                          name="itemName"
                          value={formik.values.itemName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          size="lg"
                          borderRadius="lg"
                        >
                          {rawMaterials.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                        {getErrorMessage("itemName") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("itemName")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("quantity")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiPackage size={16} />
                          Quantity *
                        </FormLabel>
                        <Input
                          type="number"
                          name="quantity"
                          value={formik.values.quantity}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter quantity"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("quantity") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("quantity")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>
                    <br />
                    <GridItem>
                      <FormControl isInvalid={hasError("supplierShippedTo")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <MapPin size={16} />
                          Shipped To *
                        </FormLabel>
                        <Input
                          name="supplierShippedTo"
                          value={formik.values.supplierShippedTo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter shipping address"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("supplierShippedTo") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierShippedTo")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("supplierShippedGSTIN")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <FileSpreadsheet size={16} />
                          Shipped GSTIN *
                        </FormLabel>
                        <Input
                          name="supplierShippedGSTIN"
                          value={formik.values.supplierShippedGSTIN}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter shipped GSTIN"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                          isDisabled={formik.values.isSameAddress}
                        />
                        {getErrorMessage("supplierShippedGSTIN") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierShippedGSTIN")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <Checkbox
                          name="isSameAddress"
                          isChecked={formik.values.isSameAddress}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formik.handleChange(e);
                            if (e.target.checked) {
                              formik.setFieldValue("supplierShippedGSTIN", formik.values.supplierShippedTo);
                              formik.setFieldValue("supplierBillGSTIN", formik.values.supplierBillTo);
                            } else {
                              formik.setFieldValue("supplierShippedGSTIN", edittable?.supplierShippedGSTIN || "");
                              formik.setFieldValue("supplierBillGSTIN", edittable?.supplierBillGSTIN || "");
                            }
                          }}
                          size="lg"
                        >
                          Same as Shipped To and Bill To
                        </Checkbox>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("supplierBillTo")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <MapPin size={16} />
                          Bill To *
                        </FormLabel>
                        <Input
                          name="supplierBillTo"
                          value={formik.values.supplierBillTo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter billing address"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("supplierBillTo") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierBillTo")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("supplierBillGSTIN")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <FileSpreadsheet size={16} />
                          Bill GSTIN *
                        </FormLabel>
                        <Input
                          name="supplierBillGSTIN"
                          value={formik.values.supplierBillGSTIN}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter bill GSTIN"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                          isDisabled={formik.values.isSameAddress}
                        />
                        {getErrorMessage("supplierBillGSTIN") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierBillGSTIN")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={hasError("supplierEmail")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <Mail size={16} />
                          Email
                        </FormLabel>
                        <Input
                          name="supplierEmail"
                          type="email"
                          value={formik.values.supplierEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter supplier email address"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("supplierEmail") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("supplierEmail")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
              >
                <CardBody p={6}>
                  <Flex align="center" gap={3} mb={6}>
                    <Box p={2} bg="purple.50" borderRadius="lg">
                      <FileSpreadsheet size={20} color="#805AD5" />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      Terms and Conditions
                    </Heading>
                  </Flex>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl isInvalid={hasError("GSTApply")}>
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        GST Applicable *
                      </FormLabel>
                      <Select
                        name="GSTApply"
                        value={formik.values.GSTApply}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Select"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px #805AD5",
                        }}
                      >
                        <option value="igst">IGST - 18%</option>
                        <option value="cgst">CGST - 9%, SGST - 9%</option>
                      </Select>
                      {getErrorMessage("GSTApply") && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {getErrorMessage("GSTApply")}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={hasError("modeOfPayment")}>
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Mode of Payment *
                      </FormLabel>
                      <Select
                        name="modeOfPayment"
                        value={formik.values.modeOfPayment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Select"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px #805AD5",
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Credit">Credit</option>
                      </Select>
                      {getErrorMessage("modeOfPayment") && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {getErrorMessage("modeOfPayment")}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={hasError("billingAddress")}>
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Billing Address *
                      </FormLabel>
                      <Input
                        name="billingAddress"
                        value={formik.values.billingAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter billing address"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px #805AD5",
                        }}
                      />
                      {getErrorMessage("billingAddress") && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {getErrorMessage("billingAddress")}
                        </Text>
                      )}
                    </FormControl>
                  </div>
                </CardBody>
              </Card>

              <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
              >
                <CardBody p={6}>
                  <Flex align="center" gap={3} mb={6}>
                    <Box p={2} bg="orange.50" borderRadius="lg">
                      <BiEdit size={20} color="#DD6B20" />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      Remarks
                    </Heading>
                  </Flex>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={4}
                  >
                    <GridItem>
                      <FormControl isInvalid={hasError("additionalImportant")}>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiEdit size={16} />
                          Additional Important Terms
                        </FormLabel>
                        <Textarea
                          name="additionalImportant"
                          value={formik.values.additionalImportant}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter any additional terms"
                          size="md"
                          borderRadius="lg"
                          rows={3}
                          style={{ height: 'calc(3em + 4px)', width: 'calc(100% + 4px)' }}
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {getErrorMessage("additionalImportant") && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {getErrorMessage("additionalImportant")}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              <Box pt={6} borderTop="1px" borderColor={borderColor}>
                <HStack spacing={4} justify="end">
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    onClick={closeDrawerHandler}
                    px={8}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting || !formik.isValid}
                    loadingText={edittable ? "Updating..." : "Creating..."}
                    px={8}
                    bgGradient="linear(to-r, blue.600, blue.700)"
                    _hover={{
                      bgGradient: "linear(to-r, blue.700, blue.800)",
                    }}
                  >
                    {edittable ? "Update Purchase Order" : "Create Purchase Order"}
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={bgColor} borderColor={borderColor}>
          <ModalHeader
            display="flex"
            alignItems="center"
            gap={2}
            color={popupType === "success" ? "green.500" : "red.500"}
            fontSize="lg"
            fontWeight="bold"
          >
            {popupType === "success" ? "Success!" : "Error!"}
            {popupType === "success" ? (
              <Box color="green.500">
                <BiCheckCircle size={24} />
              </Box>
            ) : (
              <Box color="red.500">
                <BiX size={24} />
              </Box>
            )}
          </ModalHeader>
          <ModalBody>
            <Text color={textColor} fontSize="md">
              {popupMessage}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={popupType === "success" ? "green" : "red"}
              onClick={onModalClose}
              size="lg"
              px={8}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPurchaseOrder;