import React from "react";
import { colors } from "../theme/colors";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddResourceDrawer,
  openAddResourceDrawer,
} from "../redux/reducers/drawersSlice";
import ResourceTable from "../components/Table/ResourceTable";
import AddResource from "../components/Drawers/Resources/AddResource";

const Resources = () => {
  const {
    isAddResourceDrawerOpened,
    // isUpdateResourceDrawerOpened,
    // isResourceDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddResourceDrawerHandler = () => {
    dispatch(openAddResourceDrawer());
  };
  const closeAddResourceDrawerHandler = () => {
    dispatch(closeAddResourceDrawer());
  };
  //   const openUpdateResourceDrawerHandler = (id: string) => {
  //     setResourceId(id);
  //     dispatch(openUpdateResourceDrawer());
  //   };
  //   const closeUpdateResourceDrawerHandler = () => {
  //     dispatch(closeUpdateResourceDrawer());
  //   };
  //   const openResourceDetailsDrawerHandler = (id: string) => {
  //     setResourceId(id);
  //     dispatch(openResourceDetailsDrawer());
  //   };
  //   const closeResourceDetailsDrawerHandler = () => {
  //     dispatch(closeResourceDetailsDrawer());
  //   };

  const fetchResourcesHandler = async () => {
    // try {
    //   setIsLoadingRoles(true);
    //   const response = await fetch(process.env.REACT_APP_BACKEND_URL + "role/");
    //   const data = await response.json();
    //   if (!data.success) {
    //     throw new Error(data.message);
    //   }
    //   setRoles(data.roles);
    //   setFilteredRoles(data.roles);
    // } catch (error: any) {
    //   toast.error(error?.message || "Something went wrong");
    // } finally {
    //   setIsLoadingRoles(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 lg:p-3">
      {isAddResourceDrawerOpened && (
        <AddResource
          fetchResourcesHandler={fetchResourcesHandler}
          closeDrawerHandler={closeAddResourceDrawerHandler}
        />
      )}
      {/* User Role Details */}
      {/* {isRoleDetailsDrawerOpened && (
        <UserRoleDetails
          roleId={roleId}
          closeDrawerHandler={closeRoleDetailsDrawerHandler}
        />
      )} */}
      {/* Update User Role */}
      {/* {isUpdateRoleDrawerOpened && (
        <UpdateUserRole
          roleId={roleId}
          closeDrawerHandler={closeUpdateRoleDrawerHandler}
          fetchUserRolesHandler={fetchRolesHandler}
        />
      )} */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Resource Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage resources and approvals efficiently
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openAddResourceDrawerHandler}
              style={{
                backgroundColor: colors.primary[600],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[700];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[600];
              }}
              className="flex items-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <FiPlus size={16} />
              Add New Resource
            </button>
            <Button
              //   onClick={fetchRolesHandler}
              leftIcon={<MdOutlineRefresh />}
              variant="outline"
              colorScheme="gray"
              size="md"
              className="border-gray-300 hover:border-gray-400 transition-all duration-200"
              _hover={{ bg: "gray.50", transform: "translateY(-1px)" }}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-4 flex justify-center sm:justify-end">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              placeholder="Search roles..."
              //   value={searchKey || ""}
              //   onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ResourceTable
        //   roles={filteredRoles}
        //   isLoadingRoles={isLoadingRoles}
        //   deleteRoleHandler={deleteRoleHandler}
        //   openUpdateRoleDrawerHandler={openUpdateRoleDrawerHandler}
        //   openRoleDetailsDrawerHandler={openRoleDetailsDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Resources;
