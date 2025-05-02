import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";
import { toast } from "react-toastify";

interface ProcessRawMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const ProcessRawMaterial: React.FC<ProcessRawMaterialProps> = ({
  inputs,
  setInputs,
  products,
  productOptions,
}) => {
  const [cookies] = useCookies();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [suppliersOptionsList, setSuppliersOptionsList] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any[]>([]);

  const assemblyPhaseOptions = [
    { value: "not started", label: "Not Started" },
    { value: "in production", label: "In Production" },
    { value: "in review", label: "In Review" },
    { value: "complete", label: "Complete" },
  ];

  const onChangeHandler = (name: string, value: string, ind: number) => {
    const inputsArr: any = [...inputs];
    inputsArr[ind][name] = value;

    if (name === "quantity") {
      const unit_cost = inputsArr[ind]["unit_cost"];
      if (unit_cost) {
        inputsArr[ind]["total_part_cost"] = +unit_cost * +value;
      }
    } else if (name === "item_name") {
      const item_id = inputsArr[ind]["item_name"].value;
      const product = products.filter((prd: any) => prd._id === item_id)[0];
      inputsArr[ind]["uom"] = product.uom;
      inputsArr[ind]["unit_cost"] = product.price;
      inputsArr[ind]["category"] = product.category;
    }

    setInputs(inputsArr);
  };

  const fetchSuppliersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
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
      setSuppliers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSuppliersHandler();
  }, []);

  useEffect(() => {
    const supplierOptions = suppliers.map((supp) => ({
      value: supp._id,
      label: supp.name,
    }));
    setSuppliersOptionsList(supplierOptions);
  }, [suppliers]);

  useEffect(() => {
    let prods = [];
    prods = inputs.map((material: any) => ({
      value: material.item_id,
      label: material.item_name,
    }));
    setSelectedProducts(prods);
  }, [inputs]);
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
    <div>
      <FormControl isRequired>
        <FormLabel fontWeight="bold" color="white" paddingBottom="10px">Raw Materials</FormLabel>
        {inputs.map((input, ind) => (
          <div
            className=" border-b-[#a9a9a9] pb-2 mb-2"
            key={ind}
          >
            <FormControl className="mb-5" isRequired>
              <FormLabel fontWeight="bold" color="white">Product Name</FormLabel>
              <Select styles={customStyles}
                isDisabled
                required
                className="rounded mt-2 border border-[#a9a9a9]"
                options={productOptions}
                placeholder="Select"
                value={selectedProducts[ind]?.label}
                name="item_name"
                onChange={(d) => {
                  onChangeHandler("item_name", d, ind);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Description</FormLabel>
              <Input
                isDisabled
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="text"
                name="description"
                value={input.description}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="white">Estimated Quantity</FormLabel>
              <Input
                disabled={true}
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="estimated_quantity"
                value={input.estimated_quantity}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="white">Used Quantity</FormLabel>
              <Input
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="used_quantity"
                value={input.used_quantity}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="white">UOM</FormLabel>
              <Input 
                isDisabled={true}
                border="1px"
                borderColor="#a9a9a9"
                type="text"
                name="uom"
                value={input.uom}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="white">Category</FormLabel>
              <Input className="text-gray-200"
                isDisabled={true}
                border="1px"
                borderColor="#a9a9a9"
                type="text"
                name="uom"
                value={input.category}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Assembly Phase</FormLabel>
              <Select styles={customStyles}
                isDisabled
                className="rounded mt-2 "
                options={assemblyPhaseOptions}
                placeholder="Select"
                value={input.assembly_phase}
                name="assembly_phase"
                onChange={(d: any) => {
                  onChangeHandler("assembly_phase", d, ind);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Supplier</FormLabel>
              <Select  styles={customStyles}
                isDisabled
                className="rounded mt-2 "
                options={suppliersOptionsList}
                placeholder="Select"
                value={input.supplier}
                name="supplier"
                onChange={(d: any) => {
                  onChangeHandler("supplier", d, ind);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Comments</FormLabel>
              <Input className="text-gray-200"
                isDisabled
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="text"
                name="comments"
                value={input.comments}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="white">Unit Cost</FormLabel>
              <Input className="text-gray-200"
                isDisabled={true}
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="unit_cost"
                value={input.unit_cost}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Total Part Cost</FormLabel>
              <input className="text-gray-200"
                disabled={true}
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="total_part_cost"
                value={input.total_part_cost}
                className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed disabled:bg-white"
              ></input>
            </FormControl>
          </div>
        ))}
      </FormControl>
    </div>
  );
};

export default ProcessRawMaterial;
