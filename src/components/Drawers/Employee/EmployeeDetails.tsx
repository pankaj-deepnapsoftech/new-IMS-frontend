import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../../ui/Loading";
import Drawer from "../../../ui/Drawer";

interface EmployeeDetailsProps {
  closeDrawerHandler: () => void;
  employeeId: string | undefined;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  closeDrawerHandler,
  employeeId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | undefined>();
  const [lastname, setLastname] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<any | undefined>();
  const [isSuper, setIsSuper] = useState<boolean | undefined>();
  const [isVerified, setIsVerified] = useState<string | undefined>();

  const fetchUserDetailsHandler = async () => {
    try {
      setIsLoadingEmployee(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `auth/user/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          }
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
    } finally{
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    fetchUserDetailsHandler();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[350px] bg-[#4b86a0] right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 ">
          <BiX onClick={closeDrawerHandler} size="26px"  color="white"/>
        
        </h1>

        <div className="mt-8 px-5">
        <h2 className="text-xl text-center  font-semibold py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">
       
            Employee Details
          </h2>

          {isLoadingEmployee && <Loading />}
          {!isLoadingEmployee && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">First Name</p>
                <p className="text-gray-300">{firstname}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Last Name</p>
                <p className="text-gray-300">{lastname}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Email</p>
                <p className="text-gray-300">{email}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Phone</p>
                <p className="text-gray-300">{phone}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Is Verified</p>
                <p className="text-gray-300">{isVerified ? 'Verified' : 'Not Verified'}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Role</p>
                <p className="text-gray-300 ">{(isSuper && 'Super Admin') || role?.role || 'N/A'}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold text-white">Permissions</p>
                {!role?.permissions && <p className="text-gray-300">N/A</p>}
                {role?.permissions && <ul className="pl-5">
                    {role.permissions.map((permission: any) => <li>{permission}</li>)}
                </ul>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default EmployeeDetails;
