import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Select from "react-select";
import {
  useAddRoleMutation
} from "../../../redux/api/api";
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
  const [permissions, setPermissions] = useState<{ value: string, label: string }[]>([]);

  const permissionOptions = [
    { value: "inventory", label: "inventory" },
    { value: "store", label: "store" },
    { value: "approval", label: "approval" },
    { value: "agent", label: "agent" },
    { value: "production", label: "production" },
    { value: "sale & purchase", label: "sale & purchase" },
  ];

  const [addRole] = useAddRoleMutation();

  const addRoleHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !role ||
      role.trim().length === 0
    ) {
      toast.error("Please provide all the required fields");
      return;
    }
    if (permissions.length === 0) {
      toast.error("Select atleast 1 permission");
      return;
    }
    const modifiedPermissions = permissions.map((permission: any) => permission.value);

    try {
      setIsAddingRole(true);
      const response = await addRole({
        role,
        description,
        permissions: modifiedPermissions
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
      backgroundColor: "transparent",
      borderColor: "#a9a9a9",
      color: "#fff",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#FFF" : "#d3d3d3", // dark gray on focus, light gray default
      color: "#000", // text color
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "#fff",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999, // ensures dropdown doesn't get hidden
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#fff", // light gray placeholder
    }),
   
  };




  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-[#57657f] right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center font-bold text-[22px] text-white py-3">
          <BiX onClick={closeDrawerHandler} size="30px" />

        </h1>

        <div className="mt-8 px-5 ">
          <h2 className="text-xl text-center  font-semibold py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">
            Add New Role
          </h2>

          <form onSubmit={addRoleHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Role</FormLabel>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                type="text"
                placeholder="Role"
                color="white"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" color="white">Description</FormLabel>
              <Input
               border="0.1px solid white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
                color="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Permissions</FormLabel>
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
              color="black"
              backgroundColor="#ffffff8a"
              _hover={{ bg: "#d1d2d5" }}
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
