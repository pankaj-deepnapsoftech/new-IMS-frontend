import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import BOMRawMaterialTable from "../components/Table/BOMRawMaterialTable";
import { FiSearch } from "react-icons/fi";

const InventoryApprovals: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);

  const fetchInventoryHandler = async () => {
    try {
      setIsLoadingInventory(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/unapproved/inventory/raw-materials",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setData(results.unapproved);
      setFilteredData(results.unapproved);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const approveRmHandler = async (id: string) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'bom/approve/inventory/raw-materials', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`,
          'content-type': `application/json`
        },
        body: JSON.stringify({
          _id: id
        })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      fetchInventoryHandler();
      toast.success(data.message);
    }
    catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    fetchInventoryHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase().includes(searchTxt) ||
        emp.email.toLowerCase()?.includes(searchTxt) ||
        emp.phone.toLowerCase().toString().includes(searchTxt) ||
        emp?.role?.role?.toLowerCase()?.includes(searchTxt) ||
        (emp?.createdAt &&
          new Date(emp?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (emp?.updatedAt &&
          new Date(emp?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className="  rounded-md h-full ">
      <div>
        <h1 className="text-center font-[700] text-white pb-6 text-3xl pt-2">
          Inventory Approvals
        </h1>

        <div className="mt-2  flex justify-center gap-y-1 it gap-x-2 w-full">
        <FiSearch className="relative left-10 top-5 transform -translate-y-1/2 text-gray-200" />
          <input
            className="pl-10 pr-4 py-2 w-[200px] text-sm  border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
            placeholder="Search roles..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchInventoryHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#fff"
            borderColor="#fff"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <BOMRawMaterialTable products={filteredData} isLoadingProducts={isLoadingInventory} approveProductHandler={approveRmHandler} />
      </div>
    </div>
  );
};

export default InventoryApprovals;
