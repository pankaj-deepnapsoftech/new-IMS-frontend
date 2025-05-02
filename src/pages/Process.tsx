import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import ProcessTable from "../components/Table/ProcessTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProcessDrawer,
  closeProcessDetailsDrawer,
  closeUpdateProcessDrawer,
  openAddProcessDrawer,
  openProcessDetailsDrawer,
  openUpdateProcessDrawer,
} from "../redux/reducers/drawersSlice";
import AddProcess from "../components/Drawers/Process/AddProcess";
import ProcessDetails from "../components/Drawers/Process/ProcessDetails";
import UpdateProcess from "../components/Drawers/Process/UpdateProcess";
import { useDeleteProcessMutation } from "../redux/api/api";
import { FiSearch } from "react-icons/fi";

const Process: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("production");
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [id, setId] = useState<string | undefined>();

  const fetchProcessHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "production-process/all",
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

      setData(data.production_processes);
      setFilteredData(data.production_processes);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    isAddProcessDrawerOpened,
    isUpdateProcessDrawerOpened,
    isProcessDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProcess] = useDeleteProcessMutation();

  const openAddProcessDrawerHandler = () => {
    dispatch(openAddProcessDrawer());
  };
  const closeAddProcessDrawerHandler = () => {
    dispatch(closeAddProcessDrawer());
  };
  const openProcessDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProcessDetailsDrawer());
  };
  const closeProcessDetailsDrawerHandler = () => {
    dispatch(closeProcessDetailsDrawer());
  };
  const openUpdateProcessDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProcessDrawer());
  };
  const closeUpdateProcessDrawerHandler = () => {
    dispatch(closeUpdateProcessDrawer());
  };

  const deleteProcessHandler = async (id: string) => {
    try {
      const response = await deleteProcess(id).unwrap();
      toast.success(response.message);
      fetchProcessHandler();
    } catch (error: any) {
      console.log(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessHandler();
  }, []);

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (p: any) =>
        p.creator.first_name?.toLowerCase()?.includes(searchText) ||
        p?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        p?.item?.name?.toLowerCase()?.includes(searchText) ||
        p?.status?.toLowerCase()?.includes(searchText) ||
        p?.em_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.fg_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.scrap_store?.name?.toLowerCase()?.includes(searchText) ||
        (p?.createdAt &&
          new Date(p?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (p?.updatedAt &&
          new Date(p?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div className="rounded-md ">
      {isAddProcessDrawerOpened && (
        <AddProcess
          fetchProcessHandler={fetchProcessHandler}
          closeDrawerHandler={closeAddProcessDrawerHandler}
        />
      )}
      {isProcessDetailsDrawerOpened && (
        <ProcessDetails
          id={id}
          closeDrawerHandler={closeProcessDetailsDrawerHandler}
        />
      )}
      {isUpdateProcessDrawerOpened && (
        <UpdateProcess
          id={id}
          closeDrawerHandler={closeUpdateProcessDrawerHandler}
          fetchProcessHandler={fetchProcessHandler}
        />
      )}

      <div>
        <h1 className="text-center font-[700] text-white text-[30px] pb-4">
          Production Process
        </h1>

        <div className="mt-2 flex flex-wrap justify-center md:justify-start w-full gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-[200px]">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200" />
            <input
              className="pl-10 pr-4 py-2 w-full text-sm text-gray-200 border-b bg-[#475569] shadow-sm focus:outline-none placeholder:text-gray-200"
              placeholder="Search roles..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          {/* Add New Production Process Button */}
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "100%", md: 230 }}
            onClick={openAddProcessDrawerHandler}
            color="white"
            backgroundColor="#4b87a0d9"
            _hover={{ bg: "white", color: "black" }}
          >
            Add New Production Process
          </Button>

          {/* Refresh Button */}
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "100%", md: 100 }}
            onClick={fetchProcessHandler}
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
        <ProcessTable
          isLoadingProcess={isLoading}
          process={filteredData}
          deleteProcessHandler={deleteProcessHandler}
          openUpdateProcessDrawerHandler={openUpdateProcessDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Process;
