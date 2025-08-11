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
  sellerSection: {
    width: "50%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  invoiceNoSection: {
    width: "25%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  issueDateSection: {
    width: "25%",
    padding: 8,
    minHeight: 80,
  },
  buyerSection: {
    width: "50%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  documentDateSection: {
    width: "25%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 80,
  },
  salesOrderDateSection: {
    width: "25%",
    padding: 8,
    minHeight: 80,
  },
  storeSection: {
    width: "50%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 60,
  },
  categorySection: {
    width: "25%",
    padding: 8,
    borderRight: "1px solid #000",
    minHeight: 60,
  },
  balanceSection: {
    width: "25%",
    padding: 8,
    minHeight: 60,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2563eb",
  },
  sectionValue: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#374151",
  },
  table: {
    border: "1.5px solid #000",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #000",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 8,
    minHeight: 25,
  },
  tableCol1: {
    width: "8%",
    paddingRight: 4,
  },
  tableCol2: {
    width: "32%",
    paddingRight: 4,
  },
  tableCol3: {
    width: "15%",
    paddingRight: 4,
    textAlign: "center",
  },
  tableCol4: {
    width: "15%",
    paddingRight: 4,
    textAlign: "right",
  },
  tableCol5: {
    width: "15%",
    paddingRight: 4,
    textAlign: "right",
  },
  tableCol6: {
    width: "15%",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
  },
  tableCellText: {
    fontSize: 9,
    color: "#374151",
  },
  totalsSection: {
    border: "1.5px solid #000",
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 8,
    minHeight: 25,
  },
  totalLabel: {
    width: "70%",
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
  },
  totalValue: {
    width: "30%",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    color: "#1f2937",
  },
  amountInWords: {
    border: "1.5px solid #000",
    padding: 10,
    marginBottom: 15,
  },
  amountInWordsLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2563eb",
  },
  amountInWordsText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#374151",
  },
  notesSection: {
    border: "1.5px solid #000",
    padding: 10,
    marginBottom: 15,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2563eb",
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#374151",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBox: {
    width: "45%",
    minHeight: 60,
    border: "1px solid #000",
    padding: 10,
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#1f2937",
  },
  signatureLine: {
    borderBottom: "1px solid #000",
    width: "100%",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    textAlign: "center",
    color: "#6b7280",
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

interface InvoicePDFProps {
  invoice: {
    _id: string;
    invoice_no: string;
    document_date: string;
    sales_order_date: string;
    category: string;
    note?: string;
    subtotal: number;
    total: number;
    balance: number;
    tax: {
      tax_amount: number;
      tax_name: string;
    };
    creator: {
      first_name: string;
      last_name: string;
    };
    buyer?: {
      name: string;
      address?: string;
      gstin?: string;
      cust_id?: string;
    };
    supplier?: {
      name: string;
      address?: string;
      gstin?: string;
      cust_id?: string;
    };
    store: {
      name: string;
      address?: string;
    };
    items: Array<{
      item: {
        name: string;
        description?: string;
        hsn_code?: string;
      };
      quantity: number;
      amount: number;
    }>;
  };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getAmountInWords = (amount: number) => {
    try {
      return toWords.convert(amount);
    } catch (error) {
      return `Rupees ${Math.floor(amount)} only`;
    }
  };

  const calculateTaxAmount = () => {
    return invoice.total - invoice.subtotal;
  };

  const customer = invoice.buyer || invoice.supplier;
  const isSupplier = !!invoice.supplier;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>
          {invoice.category.toUpperCase()} INVOICE
        </Text>

        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* First Row */}
          <View style={styles.headerRow}>
            <View style={styles.sellerSection}>
              <Text style={styles.sectionLabel}>
                {isSupplier ? "Buyer Details:" : "Seller Details:"}
              </Text>
              <Text style={styles.sectionValue}>
                Your Company Name{"\n"}
                Your Company Address{"\n"}
                City, State - Pincode{"\n"}
                GSTIN: Your GSTIN Number
              </Text>
            </View>
            <View style={styles.invoiceNoSection}>
              <Text style={styles.sectionLabel}>Invoice No:</Text>
              <Text style={styles.sectionValue}>{invoice.invoice_no}</Text>
            </View>
            <View style={styles.issueDateSection}>
              <Text style={styles.sectionLabel}>Issue Date:</Text>
              <Text style={styles.sectionValue}>
                {formatDate(invoice.document_date)}
              </Text>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.headerRow}>
            <View style={styles.buyerSection}>
              <Text style={styles.sectionLabel}>
                {isSupplier ? "Supplier Details:" : "Buyer Details:"}
              </Text>
              <Text style={styles.sectionValue}>
                {customer?.name || "N/A"}
                {"\n"}
                {customer?.address || "Address not provided"}
                {"\n"}
                {customer?.gstin ? `GSTIN: ${customer.gstin}` : ""}
                {customer?.cust_id ? `\nCustomer ID: ${customer.cust_id}` : ""}
              </Text>
            </View>
            <View style={styles.documentDateSection}>
              <Text style={styles.sectionLabel}>Document Date:</Text>
              <Text style={styles.sectionValue}>
                {formatDate(invoice.document_date)}
              </Text>
            </View>
            <View style={styles.salesOrderDateSection}>
              <Text style={styles.sectionLabel}>Sales Order Date:</Text>
              <Text style={styles.sectionValue}>
                {formatDate(invoice.sales_order_date)}
              </Text>
            </View>
          </View>

          {/* Third Row */}
          <View style={[styles.headerRow, { borderBottom: "none" }]}>
            <View style={styles.storeSection}>
              <Text style={styles.sectionLabel}>Store:</Text>
              <Text style={styles.sectionValue}>
                {invoice.store.name}
                {invoice.store.address && `\n${invoice.store.address}`}
              </Text>
            </View>
            <View style={styles.categorySection}>
              <Text style={styles.sectionLabel}>Category:</Text>
              <Text style={styles.sectionValue}>
                {invoice.category.charAt(0).toUpperCase() +
                  invoice.category.slice(1)}
              </Text>
            </View>
            <View style={styles.balanceSection}>
              <Text style={styles.sectionLabel}>Balance:</Text>
              <Text style={styles.sectionValue}>
                {formatCurrency(invoice.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableHeaderText}>S.No</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableHeaderText}>HSN Code</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableHeaderText}>Quantity</Text>
            </View>
            <View style={styles.tableCol5}>
              <Text style={styles.tableHeaderText}>Rate</Text>
            </View>
            <View style={styles.tableCol6}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCellText}>{index + 1}</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCellText}>
                  {item.item.name}
                  {item.item.description && `\n${item.item.description}`}
                </Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCellText}>
                  {item.item.hsn_code || "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCellText}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol5}>
                <Text style={styles.tableCellText}>
                  {formatCurrency(item.amount / item.quantity)}
                </Text>
              </View>
              <View style={styles.tableCol6}>
                <Text style={styles.tableCellText}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {invoice.tax.tax_name} (
              {(invoice.tax.tax_amount * 100).toFixed(0)}%):
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(calculateTaxAmount())}
            </Text>
          </View>
          <View
            style={[
              styles.totalRow,
              { borderBottom: "none", backgroundColor: "#f9fafb" },
            ]}
          >
            <Text
              style={[styles.totalLabel, { fontSize: 12, color: "#059669" }]}
            >
              Total Amount:
            </Text>
            <Text
              style={[styles.totalValue, { fontSize: 12, color: "#059669" }]}
            >
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountInWords}>
          <Text style={styles.amountInWordsLabel}>Amount in Words:</Text>
          <Text style={styles.amountInWordsText}>
            {getAmountInWords(invoice.total)}
          </Text>
        </View>

        {/* Notes Section */}
        {invoice.note && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.note}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Prepared By</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              {invoice.creator.first_name} {invoice.creator.last_name}
            </Text>
            <Text style={styles.signatureText}>
              Date: {formatDate(new Date().toISOString())}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Company Seal & Signature</Text>
            <Text style={styles.signatureText}>Date: _______________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
