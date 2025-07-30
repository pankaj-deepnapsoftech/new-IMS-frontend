// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import axios from "axios";
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
  // BiDollarSign,
  BiEdit,
  BiPlus,
} from "react-icons/bi";
import {
  Edit3,
  Plus,
  // FileSpreadsheetText,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  FileSp,
  FileSpreadsheetreadsheet,
  FileSpreadsheet,
  IndianRupee,
} from "lucide-react";
import { colors } from "../../../theme/colors";

interface AddPurchaseOrderProps {
  isOpen: boolean;
  closeDrawerHandler: () => void;
  edittable?: any;
  fetchPurchaseOrderData?: () => void;
}

const AddPurchaseOrder = ({
  isOpen,
  closeDrawerHandler,
  edittable,
  fetchPurchaseOrderData,
}: AddPurchaseOrderProps) => {
  const [cookies] = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  // Color scheme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // const validationSchema = Yup.object({
  //   companyName: Yup.string().required("Company name is required"),
  //   companyAddress: Yup.string().required("Company address is required"),
  //   companyPhoneNumber: Yup.string().required("Company phone number is required"),
  //   companyEmail: Yup.string().email("Invalid email").required("Company email is required"),
  //   companyWebsite: Yup.string().required("Company website is required"),
  //   companyGST: Yup.string().required("Company GST is required"),
  //   companyPan: Yup.string().required("Company PAN is required"),

  //   poOrder: Yup.string().required("PO Order is required"),
  //   date: Yup.string().required("Date is required"),

  //   supplierCode: Yup.string().required("Supplier code is required"),
  //   supplierName: Yup.string().required("Supplier name is required"),
  //   supplierPan: Yup.string().required("Supplier PAN is required"),
  //   supplierEmail: Yup.string().email("Invalid email").required("Supplier email is required"),

  //   supplierShippedTo: Yup.string().required("Supplier shipped to is required"),
  //   supplierBillTo: Yup.string().required("Supplier bill to is required"),
  //   supplierShippedGSTIN: Yup.string().required("Shipped GSTIN is required"),
  //   supplierBillGSTIN: Yup.string().required("Bill GSTIN is required"),

  //   GSTApply: Yup.string().required("GST selection is required"),
  //   packagingAndForwarding: Yup.string().required("Packaging and forwarding is required"),
  //   freightCharges: Yup.string(), // optional
  //   modeOfPayment: Yup.string().required("Mode of payment is required"),
  //   deliveryAddress: Yup.string().required("Delivery address is required"),
  //   deliveryPeriod: Yup.string().required("Delivery period is required"),
  //   billingAddress: Yup.string().required("Billing address is required"),
  //   paymentTerms: Yup.string().required("Payment terms are required"),

  //   additionalRemarks: Yup.string(), // optional
  //   additionalImportant: Yup.string(), // optional
  // });


  const formik = useFormik({
    initialValues: {
      companyName: edittable?.companyName || "",
      companyAddress: edittable?.companyAddress || "",
      companyPhoneNumber: edittable?.companyPhoneNumber || "",
      companyEmail: edittable?.companyEmail || "",
      companyWebsite: edittable?.companyWebsite || "",
      companyGST: edittable?.companyGST || "",
      companyPan: edittable?.companyPan || "",

      poOrder: edittable?.poOrder || "",
      date: edittable?.date || new Date().toISOString().split("T")[0],

      supplierCode: edittable?.supplierCode || "",
      supplierName: edittable?.supplierName || "",
      supplierPan: edittable?.supplierPan || "",
      supplierEmail: edittable?.supplierEmail || "",

      supplierShippedTo: edittable?.supplierShippedTo || "",
      supplierBillTo: edittable?.supplierBillTo || "",
      supplierShippedGSTIN: edittable?.supplierShippedGSTIN || "",
      supplierBillGSTIN: edittable?.supplierBillGSTIN || "",

      GSTApply: edittable?.GSTApply || "",

      packagingAndForwarding: edittable?.packagingAndForwarding || "",
      freightCharges: edittable?.freightCharges || "",
      modeOfPayment: edittable?.modeOfPayment || "",
      deliveryAddress: edittable?.deliveryAddress || "",
      deliveryPeriod: edittable?.deliveryPeriod || "",
      billingAddress: edittable?.billingAddress || "",
      paymentTerms: edittable?.paymentTerms || "",

      additionalRemarks: edittable?.additionalRemarks || "",
      additionalImportant: edittable?.additionalImportant || "",
    },

    // validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {

        if (edittable?._id) {
          const res = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}purchase-order/put/${edittable._id}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );
        } else {
          const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}purchase-order/`, values, {
            headers: { Authorization: `Bearer ${cookies?.access_token}` },
          });
    
          toast.success(
            res?.data?.message || "Purchase order saved successfully!"
          );
          console.log(res)
        }

      
        // fetchPurchaseOrderData();
        formik.resetForm();
        setshowData(false);
        setEditTable(null);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const fetchSuppliersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "purchase-order/suppliers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const data = await response.json();
      const suppliers = data.suppliers.map((supplier: any) => ({
        ...supplier,
      }));
      setSupplierOptions(suppliers);

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log("Fetched suppliers:", data.suppliers);


      // setSupplierOptions(data.suppliers); // full array with all fields

    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };



  useEffect(() => {
    fetchSuppliersHandler()
  }, [])
  return (
    <>
      {/* Drawer */}
      <div
        className="absolute overflow-auto h-[100vh] w-[100vw]  bg-white right-0 top-0 z-50 py-3 border-l border-gray-200"
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
            Add New Purchase Order
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

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Box as="form" onSubmit={formik.handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Company Details Section */}
              <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
              >
                <CardBody p={6}>
                  <Flex align="center" gap={3} mb={6}>
                    <Box p={2} bg="blue.50" borderRadius="lg">
                      <BiBuilding size={20} color="#3182CE" />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      Company Details
                    </Heading>
                  </Flex>

                  {/* <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={6}
                  >
                    <GridItem colSpan={{ base: 1, md: 2 }}> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormControl
                      isInvalid={
                        formik.touched.companyName && formik.errors.companyName
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <BiUser size={16} />
                        Company Name *
                      </FormLabel>
                      <Input
                        name="companyName"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company name"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyName &&
                        formik.errors.companyName && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyName}
                          </Text>
                        )}
                    </FormControl>
                    {/* </GridItem> */}

                    {/* <GridItem> */}
                    <FormControl
                      isInvalid={
                        formik.touched.companyWebsite &&
                        formik.errors.companyWebsite
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <FileSpreadsheet size={16} />
                        Company Website *
                      </FormLabel>
                      <Input
                        name="companyWebsite"
                        value={formik.values.companyWebsite}
                        onChange={ formik.handleChange
                        }
                        onBlur={formik.handleBlur}
                        placeholder="Enter companyWebsite URL"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyWebsite &&
                        formik.errors.companyWebsite && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyWebsite}
                          </Text>
                        )}
                    </FormControl>
                    {/* </GridItem> */}

                    <FormControl
                      isInvalid={
                        formik.touched.companyPhoneNumber &&
                        formik.errors.companyPhoneNumber
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <BiUser size={16} />
                        Phone Number *
                      </FormLabel>
                      <Input
                        name="companyPhoneNumber"
                        value={formik.values.companyPhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company name"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyPhoneNumber &&
                        formik.errors.companyPhoneNumber && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyPhoneNumber}
                          </Text>
                        )}
                    </FormControl>
                    {/* </GridItem> */}

                    {/* <GridItem> */}
                    <FormControl
                      isInvalid={
                        formik.touched.companyEmail &&
                        formik.errors.companyEmail
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <FileSpreadsheet size={16} />
                        Company Email *
                      </FormLabel>
                      <Input
                        name="companyEmail"
                        value={formik.values.companyEmail}
                        onChange={
                          formik.handleChange
                        }
                        onBlur={formik.handleBlur}
                        placeholder="Enter companyEmail"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyEmail &&
                        formik.errors.companyEmail && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyEmail}
                          </Text>
                        )}
                    </FormControl>
                    {/* </GridItem> */}

                    {/* <GridItem> */}
                    <FormControl
                      isInvalid={
                        formik.touched.companyAddress &&
                        formik.errors.companyAddress
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <BiMapPin size={16} />
                        Company Address *
                      </FormLabel>
                      <Input
                        name="companyAddress"
                        value={formik.values.companyAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company address"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyAddress &&
                        formik.errors.companyAddress && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyAddress}
                          </Text>
                        )}
                    </FormControl>

                    <FormControl
                      isInvalid={
                        formik.touched.companyGST && formik.errors.companyGST
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <FileSpreadsheet size={16} />
                        Company GST *
                      </FormLabel>
                      <Input
                        name="companyGST"
                        value={formik.values.companyGST}
                        onChange={(e) => {
                          const uppercase = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          formik.setFieldValue(
                            "companyGST",
                            uppercase.slice(0, 15)
                          );
                        }}
                        onBlur={formik.handleBlur}
                        placeholder="Enter GSTIN"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #3182CE",
                        }}
                      />
                      {formik.touched.companyGST &&
                        formik.errors.companyGST && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.companyGST}
                          </Text>
                        )}
                    </FormControl>
                  </div>
                  {/* </GridItem>
                  </Grid> */}
                </CardBody>
              </Card>

              {/* Purchase Order Section */}
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
                    <GridItem>
                      <FormControl
                        isInvalid={
                          formik.touched.poOrder && formik.errors.poOrder
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <FileSpreadsheet size={16} />
                          P.O. Order *
                        </FormLabel>
                        <Input
                          name="poOrder"
                          value={formik.values.poOrder}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter PO order number"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {formik.touched.poOrder && formik.errors.poOrder && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.poOrder}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl
                        isInvalid={formik.touched.date && formik.errors.date}
                      >
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
                        {formik.touched.date && formik.errors.date && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.date}
                          </Text>
                        )}
                      </FormControl>
                    </GridItem>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {/* Supplier Name Dropdown */}
                      <GridItem>
                        <FormControl
                          isInvalid={formik.touched.supplierName && formik.errors.supplierName}
                        >
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
                            placeholder="Select Supplier"
                            name="supplierName"
                            value={formik.values.supplierName}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              formik.setFieldValue("supplierName", selectedName);

                              const matched = supplierOptions.find(
                                (supplier) => supplier.supplierName === selectedName
                              );

                              if (matched) {
                                formik.setValues({
                                  ...formik.values,
                                  ...matched, // this will auto-fill matching fields
                                });
                              }
                            }}
                            size="lg"
                            borderRadius="lg"
                          >
                            {supplierOptions.map((supplier, i) => (
                              <option key={i} value={supplier.supplierName}>
                                {supplier.supplierName}
                              </option>
                            ))}
                          </Select>

                        </FormControl>
                      </GridItem>

                      {/* Supplier Code */}
                      <GridItem>
                        <FormLabel>Supplier Code</FormLabel>
                        <Input
                          name="supplierCode"
                          value={formik.values.supplierCode}
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem>

                      {/* Supplier GST */}
                      <GridItem>
                        <FormLabel> Shipped GSTIN</FormLabel>
                        <Input
                          name="supplierShippedGSTIN"
                          value={formik.values.supplierShippedGSTIN}
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem>
                      <GridItem>
                        <FormLabel> Bill GSTIN</FormLabel>
                        <Input
                          name="supplierBillGSTIN
"
                          value={formik.values.supplierBillGSTIN
                          }
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem>
                      {/* Supplier Address */}



                      <GridItem>
                        <FormLabel> ShippedTo </FormLabel>
                        <Input
                          name="supplierShippedTo"
                          value={formik.values.supplierShippedTo}
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem>
                      <GridItem>
                        <FormLabel> Bill To</FormLabel>
                        <Input
                          name="supplierBillTo
"
                          value={formik.values.supplierBillTo
                          }
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem>
                      {/* Supplier Email */}
                      {/* <GridItem>
                        <FormLabel>Supplier Email</FormLabel>
                        <Input
                          name="supplierEmail"
                          value={formik.values.supplierEmail}
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem> */}

                      {/* Supplier PAN */}
                      {/* <GridItem>
                        <FormLabel>Supplier PAN</FormLabel>
                        <Input
                          name="supplierPan"
                          value={formik.values.supplierPan}
                          onChange={formik.handleChange}
                          size="lg"
                        />
                      </GridItem> */}
                    </Grid>




                    <GridItem>
                      <FormControl
                        isInvalid={
                          formik.touched.supplierPan &&
                          formik.errors.supplierPan
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiCreditCard size={16} />
                          Pan Details *
                        </FormLabel>
                        <Input
                          name="supplierPan"
                          value={formik.values.supplierPan}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter PAN details"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {formik.touched.supplierPan &&
                          formik.errors.supplierPan && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.supplierPan}
                            </Text>
                          )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl
                        isInvalid={
                          formik.touched.supplierEmail &&
                          formik.errors.supplierEmail
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <Mail size={16} />
                          Email *
                        </FormLabel>
                        <Input
                          name="supplierEmail"
                          type="supplierEmail"
                          value={formik.values.supplierEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter supplierEmail address"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {formik.touched.supplierEmail &&
                          formik.errors.supplierEmail && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.supplierEmail}
                            </Text>
                          )}
                      </FormControl>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              {/* Terms and Conditions Section */}
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
                    {/* GST Info */}
                    <FormControl
                      className="col-span-1"
                      isInvalid={
                        formik.touched.GSTApply && formik.errors.GSTApply
                      }
                    >
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
                      {formik.touched.GSTApply && formik.errors.GSTApply && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {formik.errors.GSTApply}
                        </Text>
                      )}
                    </FormControl>

                    {/* Packaging and Forwarding */}
                    <FormControl
                      className="col-span-1"
                      isInvalid={
                        formik.touched.packagingAndForwarding &&
                        formik.errors.packagingAndForwarding
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Packaging and Forwarding *
                      </FormLabel>
                      <Select
                        name="packagingAndForwarding"
                        value={formik.values.packagingAndForwarding}
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
                        <option value="inclusive">Inclusive</option>
                      </Select>
                      {formik.touched.packagingAndForwarding &&
                        formik.errors.packagingAndForwarding && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.packagingAndForwarding}
                          </Text>
                        )}
                    </FormControl>
                  </div>

                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Freight Charges */}
                      <FormControl
                        className="col-span-1"
                        isInvalid={
                          formik.touched.freightCharges &&
                          formik.errors.freightCharges
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          Freight Charges, if any
                        </FormLabel>
                        <Input
                          name="freightCharges"
                          value={formik.values.freightCharges}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter amount"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "purple.500",
                            boxShadow: "0 0 0 1px #805AD5",
                          }}
                        />
                        {formik.touched.freightCharges &&
                          formik.errors.freightCharges && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.freightCharges}
                            </Text>
                          )}
                      </FormControl>

                      {/* Mode of Payment */}
                      <FormControl
                        className="col-span-1"
                        isInvalid={
                          formik.touched.modeOfPayment &&
                          formik.errors.modeOfPayment
                        }
                      >
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
                        {formik.touched.modeOfPayment &&
                          formik.errors.modeOfPayment && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.modeOfPayment}
                            </Text>
                          )}
                      </FormControl>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4">
                    <FormControl
                      className="col-span-1 md:col-span-2"
                      isInvalid={
                        formik.touched.deliveryAddress &&
                        formik.errors.deliveryAddress
                      }
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        color={textColor}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Delivery Address *
                      </FormLabel>
                      <Input
                        name="deliveryAddress"
                        value={formik.values.deliveryAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter delivery address"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 1px #805AD5",
                        }}
                      />
                      {formik.touched.deliveryAddress &&
                        formik.errors.deliveryAddress && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {formik.errors.deliveryAddress}
                          </Text>
                        )}
                    </FormControl>
                  </div>
                </CardBody>
              </Card>

              {/* Remarks Section */}
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
                      <FormControl
                        isInvalid={
                          formik.touched.deliveryPeriod &&
                          formik.errors.deliveryPeriod
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiCalendar size={16} />
                          Delivery Period *
                        </FormLabel>
                        <Input
                          name="deliveryPeriod"
                          value={formik.values.deliveryPeriod}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g., 7-10 days"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {formik.touched.deliveryPeriod &&
                          formik.errors.deliveryPeriod && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.deliveryPeriod}
                            </Text>
                          )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl
                        isInvalid={
                          formik.touched.billingAddress &&
                          formik.errors.billingAddress
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiMapPin size={16} />
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
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                        {formik.touched.billingAddress &&
                          formik.errors.billingAddress && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.billingAddress}
                            </Text>
                          )}
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl
                        isInvalid={
                          formik.touched.paymentTerms &&
                          formik.errors.paymentTerms
                        }
                      >
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <IndianRupee size={16} />
                          Payment Terms *
                        </FormLabel>
                        <Select
                          name="paymentTerms"
                          value={formik.values.paymentTerms}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Select payment terms"
                          size="lg"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        >
                          <option value="Net 30">Net 30</option>
                          <option value="Net 60">Net 60</option>
                          <option value="Net 90">Net 90</option>
                          <option value="Due on Receipt">Due on Receipt</option>
                          <option value="Advance Payment">
                            Advance Payment
                          </option>
                        </Select>
                        {formik.touched.paymentTerms &&
                          formik.errors.paymentTerms && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {formik.errors.paymentTerms}
                            </Text>
                          )}
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={{ base: 1, md: 3 }}>
                      <FormControl>
                        <FormLabel
                          display="flex"
                          alignItems="center"
                          gap={2}
                          color={textColor}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <BiEdit size={16} />
                          Additional Remarks
                        </FormLabel>
                        <Textarea
                          name="additionalRemarks"
                          value={formik.values.additionalRemarks}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter any additional remarks"
                          size="md"
                          borderRadius="lg"
                          rows={3}
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={{ base: 1, md: 3 }}>
                      <FormControl>
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
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182CE",
                          }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              {/* Action Buttons */}
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
                    loadingText={edittable ? "Updating..." : "Creating..."}
                    px={8}
                    bgGradient="linear(to-r, blue.600, blue.700)"
                    _hover={{
                      bgGradient: "linear(to-r, blue.700, blue.800)",
                    }}
                  >
                    {edittable
                      ? "Update Purchase Order"
                      : "Create Purchase Order"}
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </div>
      </div>
    </>
  );
};

export default AddPurchaseOrder;
