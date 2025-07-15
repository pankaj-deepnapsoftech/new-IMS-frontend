import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Select from "react-select";
import { useAddRoleMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
// import Select from "react-select";
interface AddUserRoleProps {
  fetchUserRolesHandler: () => void;
  closeDrawerHandler: () => void;
}

const AddUserRole: React.FC<AddUserRoleProps> = ({
  closeDrawerHandler,
  fetchUserRolesHandler,
}) => {
  const [cookies, setCookie] = useCookies();
  const [isAddingRole, setIsAddingRole] = useState<boolean>(false);
  const [role, setRole] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [permissions, setPermissions] = useState<
    { value: string; label: string }[]
  >([]);

  const permissionOptions = [
    { value: "inventory", label: "inventory" },
    { value: "store", label: "store" },
    { value: "approval", label: "approval" },
    { value: "agent", label: "agent" },
    { value: "production", label: "production" },
    { value: "sale & purchase", label: "sale & purchase" },
    { value: "parties", label: "Parties" },
    { value: "sales", label: "Sales" },
    { value: "task", label: "Task" },
  ];

  const [addRole] = useAddRoleMutation();

  const addRoleHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || role.trim().length === 0) {
      toast.error("Please provide all the required fields");
      return;
    }
    if (permissions.length === 0) {
      toast.error("Select atleast 1 permission");
      return;
    }
    const modifiedPermissions = permissions.map(
      (permission: any) => permission.value
    );

    try {
      setIsAddingRole(true);
      const response = await addRole({
        role,
        description,
        permissions: modifiedPermissions,
      }).unwrap();
      toast.success(response.message);
      fetchUserRolesHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsAddingRole(false);
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#d1d5db",
      color: "#374151",
      minHeight: "40px",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
      color: "#374151",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      color: "#374151",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#374151",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3 border-l border-gray-200"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center font-bold text-[22px] text-gray-800 py-3">
          <BiX
            onClick={closeDrawerHandler}
            size="30px"
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
        </h1>

        <div className="mt-8 px-5 ">
          <h2 className="text-xl text-center font-semibold py-3 px-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 mb-6">
            Add New Role
          </h2>

          <form onSubmit={addRoleHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Role
              </FormLabel>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                type="text"
                placeholder="Role"
                bg="white"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" color="gray.700">
                Description
              </FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
                bg="white"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.700">
                Permissions
              </FormLabel>
              <Select
                required
                className="rounded mt-2 border "
                options={permissionOptions}
                placeholder="Select"
                value={permissions}
                name="item_name"
                onChange={(d: any) => {
                  setPermissions(d);
                }}
                isMulti
                styles={customStyles}
              />
            </FormControl>
            <Button
              isLoading={isAddingRole}
              type="submit"
              className="mt-5"
              colorScheme="blue"
              size="md"
              width="full"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddUserRole;
