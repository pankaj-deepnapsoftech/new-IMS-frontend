import {
  Button
} from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ScrapTable from "../components/Table/ScrapTable";
import { toast } from "react-toastify";

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
    <div className=" mx-2 rounded-md h-full ">
      <div>
        <h1 className="text-center font-[700] pb-4 text-2xl pt-2">
          Scrap Management
        </h1>

        <div className="mt-2  flex justify-center gap-y-1 it gap-x-2 w-full">
          <textarea
            className="rounded-[10px]  px-2 py-2 md:px-3 md:py-2 text-sm  border resize-none"
            rows={1}
            placeholder="Search"
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
            color="#2D3748"
            borderColor="#2D3748"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
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
