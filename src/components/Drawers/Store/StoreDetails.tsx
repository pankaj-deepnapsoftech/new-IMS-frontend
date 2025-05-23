import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../../ui/Loading";
import Drawer from "../../../ui/Drawer";

interface StoreDetailsProps {
  closeDrawerHandler: () => void;
  storeId: string | undefined;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({
  closeDrawerHandler,
  storeId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>();
  const [gst, setGst] = useState<string | undefined>();
  const [addressLine1, setAddressLine1] = useState<string | undefined>();
  const [addressLine2, setAddressLine2] = useState<string | undefined>();
  const [pincode, setPincode] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [state, setState] = useState<string | undefined>();

  const fetchStoreDetailsHandler = async () => {
    try {
      setIsLoadingStore(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `store/${storeId}`,
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
      setName(data.store.name);
      setGst(data.store?.gst_number || "N/A");
      setAddressLine1(data.store.address_line1);
      setAddressLine2(data.store?.address_line2 || "N/A");
      setPincode(data.store?.pincode || "N/A");
      setCity(data.store.city);
      setState(data.store.state);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally{
      setIsLoadingStore(false);
    }
  };

  useEffect(() => {
    fetchStoreDetailsHandler();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-[#57657f] right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 ">
          <BiX onClick={closeDrawerHandler} size="26px"  color="white"/>
         
        </h1>

        <div className="mt-8 px-5">
        <h2 className="text-xl text-center  font-semi600 py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">     
        Store Details
          </h2>

          {isLoadingStore && <Loading />}
          {!isLoadingStore && (
            <div className="text-white">
              <div className="mt-3 mb-5">
                <p className="font-semibold">Store Name</p>
                <p className="text-gray-200">{name}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">GST Number</p>
                <p className="text-gray-200">{gst}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Address Line 1</p>
                <p className="text-gray-200">{addressLine1}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Address Line 2</p>
                <p className="text-gray-200">{addressLine2}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Pincode</p>
                <p className="text-gray-200">{pincode}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">City</p>
                <p className="text-gray-200">{city}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">State</p>
                <p className="text-gray-200">{state}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default StoreDetails;
