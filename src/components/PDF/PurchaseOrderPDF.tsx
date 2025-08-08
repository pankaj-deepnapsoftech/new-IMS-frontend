// @ts-nocheck
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ToWords } from "to-words";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  headerSection: {
    border: "1.5px solid #000",
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  companySection: {
    width: "50%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  purchaseOrderSection: {
    width: "25%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  dateSection: {
    width: "25%",
    padding: 8,
    minHeight: 80,
  },
  supplierSection: {
    width: "33.33%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 60,
  },
  gstinSection: {
    width: "33.33%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 60,
  },
  panSection: {
    width: "33.34%",
    padding: 8,
    minHeight: 60,
  },
  emailSection: {
    width: "100%",
    padding: 8,
    borderTop: "1px solid #000",
    minHeight: 40,
  },
  subjectSection: {
    width: "100%",
    padding: 8,
    borderTop: "1px solid #000",
    minHeight: 40,
  },
  termsSection: {
    width: "100%",
    padding: 8,
    borderTop: "1px solid #000",
    minHeight: 50,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionValue: {
    fontSize: 11,
    lineHeight: 1.3,
    color: "#000",
    fontWeight: "normal",
  },
  table: {
    width: "100%",
    border: "1.5px solid #000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontSize: 10,
  },
  colSno: {
    width: "8%",
    padding: 8,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colItem: {
    width: "20%",
    padding: 6,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colItemCode: {
    width: "12%",
    padding: 6,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colHsnCode: {
    width: "12%",
    padding: 6,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colQty: {
    width: "10%",
    padding: 6,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colRate: {
    width: "12%",
    padding: 6,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontSize: 10,
  },
  colAmount: {
    width: "14%",
    padding: 6,
    textAlign: "center",
    fontSize: 10,
  },
  totalSection: {
    backgroundColor: "#f8f8f8",
    fontWeight: "bold",
    fontSize: 11,
  },
  amountInWords: {
    padding: 10,
    border: "1px solid #000",
    minHeight: 50,
    marginTop: 15,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 12,
    lineHeight: 1.4,
    color: "#000",
    fontWeight: "normal",
  },
  termsConditionsSection: {
    marginTop: 15,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textTransform: "uppercase",
  },
  termsList: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 15,
  },
  remarksSection: {
    marginTop: 10,
  },
  remarksTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textTransform: "uppercase",
  },
  remarksText: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 10,
  },
  importantSection: {
    marginTop: 10,
  },
  importantTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textTransform: "uppercase",
  },
  importantText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
});

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

const PurchaseOrderPDF = ({ purchaseOrder }: any) => {
  // Calculate totals based on actual data or use defaults
  const itemRate = 100; // This should come from item data
  const quantity = 10; // This should come from quantity data
  const baseAmount = itemRate * quantity;
  const cgstRate = 9; // 9% CGST
  const sgstRate = 9; // 9% SGST
  const cgst = (baseAmount * cgstRate) / 100;
  const sgst = (baseAmount * sgstRate) / 100;
  const grandTotal = baseAmount + cgst + sgst;

  console.log("Purchase Order Data:", purchaseOrder);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PURCHASE ORDER</Text>

        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* Row 1: Company Details, P.O. No, Date */}
          <View style={styles.headerRow}>
            <View style={styles.companySection}>
              <Text style={styles.sectionLabel}>Company Name</Text>
              <Text style={styles.sectionValue}>
                Deepnap Softech{"\n"}
                123 Business Street{"\n"}
                City, State - 123456{"\n"}
                Phone: +91-9876543210{"\n"}
                Email: info@deepnapsoftech.com{"\n"}
                Website: www.deepnapsoftech.com
              </Text>
            </View>
            <View style={styles.purchaseOrderSection}>
              <Text style={styles.sectionLabel}>P.O. No:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.poOrder || "PO001"}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.sectionLabel}>Date:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.date
                  ? new Date(purchaseOrder.date).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </Text>
              <Text style={styles.sectionLabel}>Our GSTIN:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.supplierShippedGSTIN || "N/A"}
              </Text>
              <Text style={styles.sectionLabel}>Supplier GSTIN:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.supplierBillGSTIN || "N/A"}
              </Text>
              <Text style={styles.sectionLabel}>Our PAN No.:</Text>
              <Text style={styles.sectionValue}>ABCDE1234F</Text>
              <Text style={styles.sectionLabel}>Supplier PAN No.:</Text>
              <Text style={styles.sectionValue}>FGHIJ5678K</Text>
            </View>
          </View>

          {/* Row 2: Supplier Details */}
          <View style={styles.headerRow}>
            <View style={styles.supplierSection}>
              <Text style={styles.sectionLabel}>Supplier Code:</Text>
              <Text style={styles.sectionValue}>SUP001</Text>
            </View>
            <View style={styles.gstinSection}>
              <Text style={styles.sectionLabel}>Supplier Name:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.supplierName || "Supplier Name"}
              </Text>
            </View>
            <View style={styles.panSection}>
              <Text style={styles.sectionLabel}>Supplier Address:</Text>
              <Text style={styles.sectionValue}>
                {purchaseOrder?.supplierShippedTo || "Supplier Address"}
              </Text>
            </View>
          </View>

          {/* Row 3: Email */}
          <View style={styles.emailSection}>
            <Text style={styles.sectionLabel}>Supplier Email:</Text>
            <Text style={styles.sectionValue}>
              {purchaseOrder?.supplierEmail || "supplier@email.com"}
            </Text>
          </View>

          {/* Row 4: Subject */}
          <View style={styles.subjectSection}>
            <Text style={styles.sectionLabel}>Subject:</Text>
            <Text style={styles.sectionValue}>Dear Sir,</Text>
          </View>

          {/* Row 5: Terms */}
          <View style={styles.termsSection}>
            <Text style={styles.sectionValue}>
              We are pleased to place an order for the below mentioned goods as
              per the terms & conditions enclosed.
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colSno}>S. No.</Text>
            <Text style={styles.colItem}>ITEM</Text>
            <Text style={styles.colItemCode}>ITEM CODE</Text>
            <Text style={styles.colHsnCode}>HSN CODE</Text>
            <Text style={styles.colQty}>QTY</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.colSno}>1</Text>
            <Text style={styles.colItem}>
              {purchaseOrder?.itemName || "Sample Item"}
            </Text>
            <Text style={styles.colItemCode}>ITM001</Text>
            <Text style={styles.colHsnCode}>1234</Text>
            <Text style={styles.colQty}>{quantity}</Text>
            <Text style={styles.colRate}>₹{itemRate.toFixed(2)}</Text>
            <Text style={styles.colAmount}>₹{baseAmount.toFixed(2)}</Text>
          </View>

          {/* Empty rows for spacing */}
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colSno}></Text>
              <Text style={styles.colItem}></Text>
              <Text style={styles.colItemCode}></Text>
              <Text style={styles.colHsnCode}></Text>
              <Text style={styles.colQty}></Text>
              <Text style={styles.colRate}></Text>
              <Text style={styles.colAmount}></Text>
            </View>
          ))}

          {/* Total Rows */}
          <View style={[styles.tableRow, styles.totalSection]}>
            <Text style={styles.colSno}></Text>
            <Text style={styles.colItem}></Text>
            <Text style={styles.colItemCode}></Text>
            <Text style={styles.colHsnCode}></Text>
            <Text style={styles.colQty}></Text>
            <Text style={styles.colRate}>TOTAL</Text>
            <Text style={styles.colAmount}>₹{baseAmount.toFixed(2)}</Text>
          </View>

          <View style={[styles.tableRow, styles.totalSection]}>
            <Text style={styles.colSno}></Text>
            <Text style={styles.colItem}></Text>
            <Text style={styles.colItemCode}></Text>
            <Text style={styles.colHsnCode}></Text>
            <Text style={styles.colQty}></Text>
            <Text style={styles.colRate}>CGST @ {cgstRate}%</Text>
            <Text style={styles.colAmount}>₹{cgst.toFixed(2)}</Text>
          </View>

          <View style={[styles.tableRow, styles.totalSection]}>
            <Text style={styles.colSno}></Text>
            <Text style={styles.colItem}></Text>
            <Text style={styles.colItemCode}></Text>
            <Text style={styles.colHsnCode}></Text>
            <Text style={styles.colQty}></Text>
            <Text style={styles.colRate}>SGST @ {sgstRate}%</Text>
            <Text style={styles.colAmount}>₹{sgst.toFixed(2)}</Text>
          </View>

          <View style={[styles.tableRow, styles.totalSection]}>
            <Text style={styles.colSno}></Text>
            <Text style={styles.colItem}></Text>
            <Text style={styles.colItemCode}></Text>
            <Text style={styles.colHsnCode}></Text>
            <Text style={styles.colQty}></Text>
            <Text style={styles.colRate}>GRAND TOTAL</Text>
            <Text style={styles.colAmount}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountInWords}>
          <Text style={styles.amountLabel}>Amount in words:</Text>
          <Text style={styles.amountValue}>
            {toWords.convert(Number(grandTotal), { currency: true })}
          </Text>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsConditionsSection}>
          <Text style={styles.termsTitle}>TERMS & CONDITIONS</Text>
          <Text style={styles.termsList}>
            1) GST @ 9% and SGST @ 9%{"\n"}
            2) Packing and Forwarding{"\n"}
            3) Freight{"\n"}
            4) Mode of Payment: {purchaseOrder?.modeOfPayment || "Net Banking"}
            {"\n"}
            5) Delivery Add{"\n"}
            6) Delivery Period{"\n"}
            7) Billing Address:{" "}
            {purchaseOrder?.billingAddress || "Same as above"}
            {"\n"}
            8) Bill to be Sent{"\n"}
            9) Payment Terms
          </Text>
        </View>

        {/* Remarks */}
        <View style={styles.remarksSection}>
          <Text style={styles.remarksTitle}>REMARK:</Text>
          <Text style={styles.remarksText}>
            1) All the consignment should be accompanied with GST Invoice.{"\n"}
            2) The company reserve the right to reject the material, in case, it
            is found to be sub standard.
          </Text>
        </View>

        {/* Important */}
        <View style={styles.importantSection}>
          <Text style={styles.importantTitle}>IMPORTANT:</Text>
          <Text style={styles.importantText}>
            1) Purchase order reference to be quoted on all Challan and
            Invoices.{"\n"}
            2) Delivery not to exceed order quantity.{"\n"}
            3) Delivery schedule to be adhered strictly.{"\n"}
            4) Laboratory Analysis Report to be forwarded along with dispatch
            documents.{"\n"}
            5) Weight and measurement to be verified carefully before final.
            {"\n"}
            6) Please Deposit CGST/SGST and send us documentary evidence to
            enable us to process your payment.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderPDF;
