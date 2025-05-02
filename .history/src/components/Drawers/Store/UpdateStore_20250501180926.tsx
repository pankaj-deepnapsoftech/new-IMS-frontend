import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import {
  useUpdateStoreMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface UpdateStoreProps {
  storeId: string | undefined;
  fetchStoresHandler: () => void;
  closeDrawerHandler: () => void;
}

const UpdateStore: React.FC<UpdateStoreProps> = ({
  closeDrawerHandler,
  fetchStoresHandler,
  storeId,
}) => {
  const [cookies, setCookie] = useCookies();
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>();
  const [gst, setGst] = useState<string | undefined>();
  const [addressLine1, setAddressLine1] = useState<string | undefined>();
  const [addressLine2, setAddressLine2] = useState<string | undefined>();
  const [pincode, setPincode] = useState<number | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [state, setState] = useState<string | undefined>();

  const [updateStore] = useUpdateStoreMutation();

  const updateStoreHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !addressLine1 ||
      !city ||
      !state ||
      name.trim().length === 0 ||
      addressLine1.trim().length === 0 ||
      city.trim().length === 0 ||
      state.trim().length === 0
    ) {
      toast.error("Please provide all the required fields");
      return;
    }
    try {
      setIsUpdatingStore(true);
      const response = await updateStore({
        _id: storeId,
        name: name,
        gst_number: gst,
        address_line1: addressLine1,
        address_line2: addressLine2,
        pincode: pincode,
        city: city,
        state: state,
      }).unwrap();
      toast.success(response.message);
      fetchStoresHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdatingStore(false);
    }
  };

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
      setGst(data.store?.gst_number);
      setAddressLine1(data.store.address_line1);
      setAddressLine2(data.store?.address_line2);
      setPincode(data.store?.pincode);
      setCity(data.store.city);
      setState(data.store.state);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingStore(false);
    }
  };

  useEffect(() => {
    fetchStoreDetailsHandler();
  }, []);
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: "#a9a9a9",
      color: "#fff",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#fff" : "#d3d3d3", // darker on hover
      color: "black",
      cursor: "pointer",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#808080",
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
    singleValue: (provided: any) => ({
      ...provided,
      color: "#fff", // ensures selected value is white
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
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 ">
          <BiX onClick={closeDrawerHandler} size="26px" color="white" />
         
        </h1>

        <div className="mt-8 px-5">
        <h2 className="text-xl text-center  font-semi600 py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">     
         Update Store
          </h2>

          {isLoadingStore && <Loading />}
          {!isLoadingStore && <form onSubmit={updateStoreHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Store Name</FormLabel>
              <Input className="text-gray-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Product Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">GST Number</FormLabel>
              <Input className="text-gray-200"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                type="text"
                placeholder="GST Number"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Address Line 1</FormLabel>
              <Input className="text-gray-200"
                value={addressLine1}
                className="no-scrollbar"
                onChange={(e) => setAddressLine1(e.target.value)}
                type="text"
                placeholder="Address Line 1"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Address Line 2</FormLabel>
              <Input className="text-gray-200"
                value={addressLine2}
                className="no-scrollbar"
                onChange={(e) => setAddressLine2(e.target.value)}
                type="text"
                placeholder="Address Line 2"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Pincode</FormLabel>
              <Input
                className="no-scrollbar"
                value={pincode}
                onChange={(e) => setPincode(+e.target.value)}
                type="number"
                placeholder="Pincode"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">City</FormLabel>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="City"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">State</FormLabel>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                type="text"
                placeholder="State"
              />
            </FormControl>
            <Button
              isLoading={isUpdatingStore}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateStore;
