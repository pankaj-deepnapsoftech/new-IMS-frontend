import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../../ui/Loading";
import { BiX } from "react-icons/bi";
import moment from "moment";
import { colors } from "../../../theme/colors";

interface InvoiceDetailsProps {
  closeDrawerHandler: () => void;
  id: string | undefined;
}

const ProformaInvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  closeDrawerHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<string | undefined>();
  const [supplier, setSupplier] = useState<string | undefined>();
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [store, setStore] = useState<string | undefined>();
  const [tax, setTax] = useState<any | undefined>();
  const [creator, setCreator] = useState<any | undefined>();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];

  const fetchInvoiceDetails = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `invoice/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setInvoiceNo(data.invoice.invoice_no);
      setDocumentDate(data.invoice.document_date);
      setSalesOrderDate(data.invoice.sales_order_date);
      setNote(data.invoice?.note || "Not Available");
      setSubtotal(data.invoice.subtotal);
      setTotal(data.invoice.total);
      setTax(data.invoice.tax);
      setItems(data.invoice.items);
      setStore(data.invoice.store.name);
      setCategory(data.invoice.category);
      setBuyer(data.invoice?.buyer?.name);
      setSupplier(data.invoice?.supplier?.name);
      setCreator(data.invoice.creator);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInvoiceDetails(id || "");
  }, [id]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-screen w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3 border-l border-gray-200"
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
            Proforma Invoice Details
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

        <div className="mt-8 px-5">
          {isLoading && <Loading />}
          {!isLoading && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Created By</h3>
                <p className="text-gray-600">
                  {creator?.first_name + " " + creator?.last_name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Category</h3>
                <p className="text-gray-600">{category?.toUpperCase()}</p>
              </div>

              {buyer && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">Buyer</h3>
                  <p className="text-gray-600">{buyer}</p>
                </div>
              )}

              {supplier && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">Supplier</h3>
                  <p className="text-gray-600">{supplier}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Proforma Invoice No.
                </h3>
                <p className="text-gray-600">{invoiceNo}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Document Date
                </h3>
                <p className="text-gray-600">
                  {documentDate
                    ? new Date(documentDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Sales Order Date
                </h3>
                <p className="text-gray-600">
                  {salesOrderDate
                    ? new Date(salesOrderDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border border-gray-300 rounded-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Item
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Quantity
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.map((item: any, index: number) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-3 py-2 text-sm text-gray-600 border-b">
                            {item.item.name}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600 border-b">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600 border-b">
                            ₹ {item.amount}/-
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Store</h3>
                <p className="text-gray-600">{store}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Note</h3>
                <p className="text-gray-600">{note}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Subtotal</h3>
                <p className="text-gray-600 text-lg font-medium">
                  ₹ {subtotal}/-
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Tax</h3>
                <p className="text-gray-600">{tax?.tax_name}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Total Amount
                </h3>
                <p className="text-blue-600 text-xl font-bold">₹ {total}/-</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ProformaInvoiceDetails;
