import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import BOMTable from "../components/Table/BOMTable";
import { useDeleteBomMutation, useLazyFetchBomsQuery } from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddBomDrawer,
  closeBomDetailsDrawer,
  closeUpdateBomDrawer,
  openAddBomDrawer,
  openBomDetailsDrawer,
  openUpdateBomDrawer,
} from "../redux/reducers/drawersSlice";
import AddBom from "../components/Drawers/BOM/AddBom";
import BomDetails from "../components/Drawers/BOM/BomDetails";
import UpdateBom from "../components/Drawers/BOM/UpdateBom";
import { FiSearch } from "react-icons/fi";

const BOM: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("Production");
  const [cookies] = useCookies();
  const [bomId, setBomId] = useState<string | undefined>();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [isLoadingBoms, setIsLoadingBoms] = useState<boolean>(false);
  const [boms, setBoms] = useState<any[]>([]);
  const [filteredBoms, setFilteredBoms] = useState<any[]>([]);

  const [deleteBom] = useDeleteBomMutation();

  const {
    isAddBomDrawerOpened,
    isUpdateBomDrawerOpened,
    isBomDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddBomDrawerHandler = () => {
    dispatch(openAddBomDrawer());
  };
  const closeAddBomDrawerHandler = () => {
    dispatch(closeAddBomDrawer());
  };
  const openUpdateBomDrawerHandler = (id: string) => {
    setBomId(id);
    dispatch(openUpdateBomDrawer());
  };
  const closeUpdateBomDrawerHandler = () => {
    dispatch(closeUpdateBomDrawer());
  };
  const openBomDetailsDrawerHandler = (id: string) => {
    setBomId(id);
    dispatch(openBomDetailsDrawer());
  };
  const closeBomDetailsDrawerHandler = () => {
    dispatch(closeBomDetailsDrawer());
  };

  const fetchBomsHandler = async () => {
    try {
      setIsLoadingBoms(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/all",
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
      setBoms(data.boms);
      setFilteredBoms(data.boms);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBoms(false);
    }
  };

  const deleteBomHandler = async (id: string) => {
    try {
      const response = await deleteBom(id).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchBomsHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = boms.filter(
      (bom: any) =>
        bom.bom_name?.toLowerCase()?.includes(searchTxt) ||
        bom.parts_count?.toString()?.toLowerCase()?.includes(searchTxt) ||
        bom.total_cost?.toString()?.toLowerCase()?.includes(searchTxt) ||
        (bom?.approved_by?.first_name + ' ' + bom?.approved_by?.last_name)?.toString()?.toLowerCase()?.includes(searchTxt || '') ||
        (bom?.createdAt &&
          new Date(bom?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (bom?.updatedAt &&
          new Date(bom?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBoms(results);
  }, [searchKey]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div  className="rounded-md ">
      {/* Add BOM */}
      {isAddBomDrawerOpened && (
        <AddBom
          closeDrawerHandler={closeAddBomDrawerHandler}
          fetchBomsHandler={fetchBomsHandler}
        />
      )}
      {/* BOM Details */}
      {isBomDetailsDrawerOpened && (
        <BomDetails
          bomId={bomId}
          closeDrawerHandler={closeBomDetailsDrawerHandler}
        />
      )}
      {/* Update BOM */}
      {isUpdateBomDrawerOpened && (
        <UpdateBom
          bomId={bomId}
          closeDrawerHandler={closeUpdateBomDrawerHandler}
          fetchBomsHandler={fetchBomsHandler}
        />
      )}

      <div>
        <h1 className="text-center text-white font-[700] text-[30px] pb-6">
          Bill Of Materials (BOM)
        </h1>

        <div className="mt-2  flex flex-wrap pb-4  justify-center  w-full gap-4">
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
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddBomDrawerHandler}
            color="white"
            backgroundColor="#4b87a0d9"
            _hover={{ bg: "#fff",textColor:"#000" }}
          >
            Add New BOM
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchBomsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#ffff"
            borderColor="#fff"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <BOMTable
          isLoadingBoms={isLoadingBoms}
          boms={filteredBoms}
          openBomDetailsDrawerHandler={openBomDetailsDrawerHandler}
          openUpdateBomDrawerHandler={openUpdateBomDrawerHandler}
          deleteBomHandler={deleteBomHandler}
        />
      </div>
    </div>
  );
};

export default BOM;
