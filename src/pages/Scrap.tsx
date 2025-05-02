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

  const fetchScrapHandler = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'scrap/all', {
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setData(data.scraps);
      setFilteredData(data.scraps);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  useEffect(() => {
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
        <h1 className="text-center font-bold text-white pb-6 text-3xl pt-2">
          Scrap Management
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
        <ScrapTable scraps={filteredData} isLoadingScraps={isLoadingScraps} openScrapDetailsDrawerHandler={() => { }} />
      </div>
    </div>
  );
};

export default Scrap;
