import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useCreateProcessMutation
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

interface AddProcess {
  closeDrawerHandler: () => void;
  fetchProcessHandler: () => void;
}

const AddProcess: React.FC<AddProcess> = ({
  closeDrawerHandler,
  fetchProcessHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string | undefined>();
  const [itemName, setItemName] = useState<{ value: string, label: string } | undefined>();
  const [bom, setBom] = useState<{ value: string, label: string } | undefined>();
  const [currentStock, setCurrentStock] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<number | undefined>();
  const [fgStore, setFgStore] = useState<{ value: string, label: string } | undefined>();
  const [rmStore, setRmStore] = useState<{ value: string, label: string } | undefined>();
  const [scrapStore, setScrapStore] = useState<{ value: string, label: string } | undefined>();

  const [itemNameOptions, setItemNameOptions] = useState<{ value: string, label: string }[] | []>();
  const [bomOptions, setBomOptions] = useState<{ value: string, label: string }[] | []>();
  const [fgStoreOptions, setFgStoreOptions] = useState<{ value: string, label: string }[] | []>();
  const [rmStoreOptions, setRmStoreOptions] = useState<{ value: string, label: string }[] | []>();
  const [scrapStoreOptions, setScrapStoreOptions] = useState<{ value: string, label: string }[] | []>();

  const [items, setItems] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  const [addProcess] = useCreateProcessMutation();

  const addProcessHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      item: itemName?.value,
      bom: bom?.value,
      quantity: quantity,
      rm_store: rmStore?.value,
      fg_store: fgStore?.value,
      scrap_store: scrapStore?.value,
    };

    try {
      setIsAdding(true);
      const response = await addProcess(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const fetchItemsHandler = async ()=>{
    try{
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'product/all', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setItems(data.products);
    }
    catch(err: any){
      toast.error(err.message || 'Something went wrong');
    }
  }

  const fetchBomsHandler = async ()=>{
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`bom/bom/${itemName?.value}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setBoms(data.boms);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  const fetchStoresHandler = async ()=>{
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'store/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setStores(data.stores);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  useEffect(()=>{
    const results = items.map((item: any) => ({value: item._id, label: item.name}));
    setItemNameOptions(results);
  }, [items])

  useEffect(()=>{
    const item = items.find((item: any) => (item._id === itemName?.value));
    setItemId(item?.product_id || '');
    setCurrentStock(item?.current_stock);
    setUom(item?.uom);
  }, [itemName])

  useEffect(()=>{
    if(itemName?.value){
      fetchBomsHandler();
    }
  }, [itemName])

  useEffect(()=>{
    const results = boms.map((bom: any) => ({value: bom._id, label: bom.bom_name}));
    setBomOptions(results);
  }, [boms])

  useEffect(()=>{
    if(bom){
      const result = boms.find((b: any)=> (b._id === bom?.value));
      setQuantity(result?.finished_good?.quantity);
    }
  }, [bom])

  useEffect(()=>{
    const results = stores.map((store: any) => ({value: store._id, label: store.name}));
    setRmStoreOptions(results);
    setScrapStoreOptions(results);
    setFgStoreOptions(results);
  }, [stores])

  useEffect(()=>{
    fetchItemsHandler();
    fetchStoresHandler();
  }, [])
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
         Add New Production Process
          </h2>

          <form onSubmit={addProcessHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Item Id</FormLabel>
              <Input 
                value={itemId}
                className="no-scrollbar text-gray-200"
                disabled
                type="text"
                placeholder="Item Id"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Item Name</FormLabel>
              <Select styles={customStyles}  value={itemName} options={itemNameOptions} onChange={(d: any) => setItemName(d)} required />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">BOM</FormLabel>
              <Select  styles={customStyles} value={bom} options={bomOptions} onChange={(d: any) => setBom(d)} required />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Current Stock</FormLabel>
              <Input
                value={currentStock}
                className="no-scrollbar  text-gray-200"
                onChange={(e) => setCurrentStock(+e.target.value)}
                type="number"
                placeholder="Current Stock"
                disabled
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Quantity</FormLabel>
              <Input 
                value={quantity}
                className="no-scrollbar text-gray-200"
                onChange={(e) => setQuantity(+e.target.value)}
                type="number"
                placeholder="Quantity"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">UOM</FormLabel>
              <Input
                value={uom}
                className="no-scrollbar  text-gray-200"
                onChange={(e) => setUom(+e.target.value)}
                type="text"
                placeholder="UOM"
                disabled
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">FG Store</FormLabel>
              <Select styles={customStyles} value={fgStore} options={fgStoreOptions} onChange={(d: any) => setFgStore(d)} required />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">RM Store</FormLabel>
              <Select styles={customStyles} value={rmStore} options={rmStoreOptions} onChange={(d: any) => setRmStore(d)} required />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Scrap Store</FormLabel>
              <Select styles={customStyles} value={scrapStore} options={scrapStoreOptions} onChange={(d: any) => setScrapStore(d)} required />
            </FormControl>
            <Button
              isLoading={isAdding}
              type="submit"
              className="mt-1"
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

export default AddProcess;
