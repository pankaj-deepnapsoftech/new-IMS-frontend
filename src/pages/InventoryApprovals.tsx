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
    if (!searchKey) {
      setFilteredData(data);
      return;
    }

    const searchTxt = searchKey.toLowerCase().trim();

    const results = data.filter((emp: any) => {
      const firstName = emp.first_name?.toString().toLowerCase() || "";
      const lastName = emp.last_name?.toString().toLowerCase() || "";
      const email = emp.email?.toString().toLowerCase() || "";
      const phone = emp.phone?.toString() || "";
      const role = emp?.role?.role?.toString().toLowerCase() || "";
      const createdAt = emp?.createdAt
        ? new Date(emp.createdAt).toISOString().substring(0, 10).split("-").reverse().join("")
        : "";
      const updatedAt = emp?.updatedAt
        ? new Date(emp.updatedAt).toISOString().substring(0, 10).split("-").reverse().join("")
        : "";

      return (
        firstName.includes(searchTxt) ||
        lastName.includes(searchTxt) ||
        email.includes(searchTxt) ||
        phone.includes(searchTxt) ||
        role.includes(searchTxt) ||
        createdAt.includes(searchTxt.replaceAll("/", "")) ||
        updatedAt.includes(searchTxt.replaceAll("/", ""))
      );
    });

    setFilteredData(results);
  }, [searchKey, data]);


  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className="  rounded-md h-full ">
      <div>
        <h1 className="text-center font-bold text-white pb-6 text-3xl pt-2">
          Inventory Approvals
        </h1>

        <div className="mt-2 flex flex-col md:flex-row justify-center gap-3 px-4 w-full">
          {/* Search Box */}
          <div className="relative w-full md:w-[250px]">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-200" />
            <input
              className="pl-10 pr-4 py-2 w-full text-gray-200 text-sm border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
              placeholder="Search roles..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          {/* Refresh Button */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            width={{ base: "100%", md: "120px" }}
            onClick={fetchInventoryHandler}
            leftIcon={<MdOutlineRefresh />}
            color="white"
            borderColor="white"
            variant="outline"
            _hover={{ bg: "white", color: "#2D3748" }}
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
