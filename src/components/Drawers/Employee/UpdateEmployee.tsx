import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useUpdateEmployeeMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface UpdateEmployeeProps {
  employeeId: string | undefined;
  fetchEmployeesHandler: () => void;
  closeDrawerHandler: () => void;
}

const UpdateEmployee: React.FC<UpdateEmployeeProps> = ({
  closeDrawerHandler,
  fetchEmployeesHandler,
  employeeId,
}) => {
  const [cookies, setCookie] = useCookies();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);
  const [isUpdatingEmployee, setIsUpdatingEmployee] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | undefined>();
  const [lastname, setLastname] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<any | undefined>();
  const [isSuper, setIsSuper] = useState<boolean | undefined>();
  const [isVerified, setIsVerified] = useState<string | undefined>();

  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[] | []
  >([]);

  const [updateEmployee] = useUpdateEmployeeMutation();

  const updateEmployeeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !role?.value) {
      toast.error("Please provide all the required fields");
      return;
    }
    try {
      setIsUpdatingEmployee(true);
      const response = await updateEmployee({
        _id: employeeId,
        role: role.value,
      }).unwrap();
      toast.success(response.message);
      fetchEmployeesHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsUpdatingEmployee(false);
    }
  };

  const fetchUserDetailsHandler = async () => {
    try {
      setIsLoadingEmployee(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `auth/user/${employeeId}`,
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
      setFirstname(data.user.first_name);
      setLastname(data.user?.last_name);
      setEmail(data.user.email);
      setPhone(data.user.phone);
      setRole(data.user?.role);
      setIsVerified(data.user.isVerified);
      setIsSuper(data.user.isSuper);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  const fetchRolesHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `role/`,
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
      const roles = data.roles;
      const modifiedRoles = roles.map((role: any) => ({
        value: role._id,
        label: role.role,
      }));
      setRoleOptions(modifiedRoles);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    fetchUserDetailsHandler();
    fetchRolesHandler();
  }, []);

  
  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent', // Light gray background for the placeholder
      color : "#fff"
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#fff', // Gray text for placeholder
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#fff" : "#d3d3d3", // darker on hover
      color: "black",
      cursor: "pointer",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#fff',
    }),
  };
  
  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-[#4b86a0] right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 ">
          <BiX onClick={closeDrawerHandler} size="26px" color="white" />

        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-xl text-center  font-semibold py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">
            Update Employee
          </h2>

          {isLoadingEmployee && <Loading />}
          {!isLoadingEmployee && (
            <form onSubmit={updateEmployeeHandler}>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="500" color="white">First Name</FormLabel>
                <p className="text-gray-300">{firstname}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="500" color="white">Last Name</FormLabel>
                <p className="text-gray-300">{lastname}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="500" color="white">Email</FormLabel>
                <p className="text-gray-300">{email}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="500" color="white">Phone</FormLabel>
                <p className="text-gray-300">{phone}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="500" color="white">Is Verified</FormLabel>
                <p className="text-gray-300">{isVerified ? 'Verified' : 'Not Verified'}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="500" color="white">Role</FormLabel>

                <Select
                  required
                  value={role}
                  options={roleOptions}
                  onChange={(e: any) => setRole(e)}
                  styles={customStyles}
                />
              </FormControl>
              <Button
                isLoading={isUpdatingEmployee}
                type="submit"
                className="mt-1"
                color="white"
                backgroundColor="#ffffff8a"
                _hover={{ bg: "#d1d2d5" }}
              >
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateEmployee;
