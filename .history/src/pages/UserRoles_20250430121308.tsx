import { background, Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddRoleDrawer,
  closeRoleDetailsDrawer,
  closeUpdateRoleDrawer,
  openAddRoleDrawer,
  openRoleDetailsDrawer,
  openUpdateRoleDrawer,
} from "../redux/reducers/drawersSlice";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import UserRoleTable from "../components/Table/UserRoleTable";
import AddUserRole from "../components/Drawers/User Role/AddUserRole";
import UserRoleDetails from "../components/Drawers/User Role/UserRoleDetails";
import UpdateUserRole from "../components/Drawers/User Role/UpdateUserRole";

const UserRole: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("user role");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [roles, setRoles] = useState<any[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string | undefined>();

  const {
    isAddRoleDrawerOpened,
    isUpdateRoleDrawerOpened,
    isRoleDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddRoleDrawerHandler = () => {
    dispatch(openAddRoleDrawer());
  };
  const closeAddRoleDrawerHandler = () => {
    dispatch(closeAddRoleDrawer());
  };
  const openUpdateRoleDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openUpdateRoleDrawer());
  };
  const closeUpdateRoleDrawerHandler = () => {
    dispatch(closeUpdateRoleDrawer());
  };
  const openRoleDetailsDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openRoleDetailsDrawer());
  };
  const closeRoleDetailsDrawerHandler = () => {
    dispatch(closeRoleDetailsDrawer());
  };

  const fetchRolesHandler = async () => {
    try {
      setIsLoadingRoles(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "role/");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setRoles(data.roles);
      setFilteredRoles(data.roles);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const deleteRoleHandler = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "role/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      fetchRolesHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRolesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = roles.filter(
      (role: any) =>
        role.role?.toLowerCase()?.includes(searchTxt) ||
        role.description?.toLowerCase()?.includes(searchTxt) ||
        (role?.createdAt &&
          new Date(role?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (role?.updatedAt &&
          new Date(role?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredRoles(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div  className="md:pl-3 max-[800px]:pl-0">
      {/* Add User Role */}
      {isAddRoleDrawerOpened && (
        <AddUserRole
          fetchUserRolesHandler={fetchRolesHandler}
          closeDrawerHandler={closeAddRoleDrawerHandler}
        />
      )}
      {/* User Role Details */}
      {isRoleDetailsDrawerOpened && (
        <UserRoleDetails
          roleId={roleId}
          closeDrawerHandler={closeRoleDetailsDrawerHandler}
        />
      )}
      {/* Update User Role */}
      {isUpdateRoleDrawerOpened && (
        <UpdateUserRole
          roleId={roleId}
          closeDrawerHandler={closeUpdateRoleDrawerHandler}
          fetchUserRolesHandler={fetchRolesHandler}
        />
      )}

<div className="flex flex-col  md:justify-between md:items-center gap-y-2">
  {/* Title */}
  <span className="text-2xl md:text-3xl pb-4 text-white  font-bold max-[800px]:text-center">User Roles</span>

  {/* Buttons + Search in one row on mobile */}
  <div className="flex flex-row  gap-2 w-full md:w-auto mt-2 md:mt-0">
    {/* Buttons */}
    <Button
      onClick={openAddRoleDrawerHandler}
      bg="##1d6697b"
      color="white"
      _hover={{ bg: "#4b87a0d9" }}
    >
      Add New Role
    </Button>
    <Button 
     onClick={fetchRolesHandler}
      leftIcon={<MdOutlineRefresh />}
      variant="outline"
      color="white"
      borderColor="gray"
      _hover={{ bg: "gray", color: "white" }}
    >
      Refresh
    </Button>

    {/* Search */}
    <div className="relative flex-1 min-w-[150px]">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
      <input
        className="pl-10 pr-4 py-2 w-full text-sm text-gray-300 rounded-[5px] bg-[#ffffff3b] placeholder:text-gray-300 shadow-sm focus:outline-none"
        placeholder="Search roles..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
    </div>
  </div>
</div>

      <div>
        <UserRoleTable
          roles={filteredRoles}
          isLoadingRoles={isLoadingRoles}
          deleteRoleHandler={deleteRoleHandler}
          openUpdateRoleDrawerHandler={openUpdateRoleDrawerHandler}
          openRoleDetailsDrawerHandler={openRoleDetailsDrawerHandler}
        />
      </div>
    </div>
  );
};

export default UserRole;
