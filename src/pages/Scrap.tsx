import {
  Button
} from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ScrapTable from "../components/Table/ScrapTable";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

const Scrap: React.FC = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingScraps, setIsLoadingScraps] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | undefined>();

  const fetchScrapHandler = async ()=>{
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'scrap/all', {
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setData(data.scraps);
      setFilteredData(data.scraps);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  useEffect(()=>{
    fetchScrapHandler();
  }, [])

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (scrap: any) =>
        scrap.bom.bom_name?.toLowerCase()?.includes(searchTxt) ||
        scrap.item.name?.toLowerCase()?.includes(searchTxt) ||
        scrap.produced_quantity.toString().toLowerCase().includes(searchTxt) ||
        scrap.estimated_quantity.toString().toLowerCase().includes(searchTxt) ||
        (scrap?.createdAt &&
          new Date(scrap?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (scrap?.updatedAt &&
          new Date(scrap?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  return (
    <div className="  rounded-md h-full ">
      <div>
        <h1 className="text-center font-[700] text-white pb-6 text-3xl pt-2">
          Scrap Management
        </h1>

        <div className="mt-2  flex justify-center gap-y-1 it gap-x-2 w-full">
        <FiSearch className="relative left-10 top-5 transform -translate-y-1/2 text-gray-200" />
      <input
        className="pl-10 pr-4 py-2 w-[200px] text-gray-200 text-sm  border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
        placeholder="Search roles..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchScrapHandler}
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
        <ScrapTable scraps={filteredData} isLoadingScraps={isLoadingScraps} openScrapDetailsDrawerHandler={()=>{}} />
      </div>
    </div>
  );
};

export default Scrap;
