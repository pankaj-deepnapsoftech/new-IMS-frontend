// ts-@nocheck
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";
import { colors } from "../theme/colors";
import { IoIosDocument, IoMdCart } from "react-icons/io";
import { FaRupeeSign, FaStoreAlt, FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";
import { Button, Input } from "@chakra-ui/react";

const Dashboard: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [cookies] = useCookies();
  const { firstname } = useSelector((state: any) => state.auth);
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Section */}
            <div className="flex-1">
              <h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: colors.text.primary }}
              >
                Welcome back, {firstname || "User"}!
              </h1>
              <p className="text-lg" style={{ color: colors.text.secondary }}>
                Here's what's happening with your business today.
              </p>
            </div>

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
    </div>
  );
};

export default Dashboard;
