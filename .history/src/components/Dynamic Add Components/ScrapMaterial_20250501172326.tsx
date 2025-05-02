import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiMinus } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import Select from "react-select";
import { toast } from "react-toastify";

interface ScrapMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const ScrapMaterial: React.FC<ScrapMaterialProps> = ({
  inputs,
  setInputs,
  products,
  productOptions,
}) => {
  const [cookies] = useCookies();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const onChangeHandler = (name: string, value: string, ind: number) => {
    const inputsArr: any = [...inputs];
    inputsArr[ind][name] = value;

    if (name === "quantity") {
      const unit_cost = inputsArr[ind]["unit_cost"];
      if (unit_cost) {
        inputsArr[ind]["total_part_cost"] = +unit_cost * +value;
      }
    }
     else if (name === "item_name") {
      const item_id = inputsArr[ind]["item_name"].value;
      const product = products.filter((prd: any) => prd._id === item_id)[0];
      inputsArr[ind]["uom"] = product.uom;
      inputsArr[ind]["unit_cost"] = product.price;
    }

    setInputs(inputsArr);
  };

  const addInputHandler = () => {
    setInputs((prev: any) => [
      ...prev,
      {
        item_name: "",
        description: "",
        estimated_quantity: "",
        produced_quantity: "",
        uom: "",
        unit_cost: "",
        total_part_cost: "",
      },
    ]);
  };

  const deleteInputHandler = (ind: number) => {
    const inputsArr = [...inputs];
    inputsArr.splice(ind, 1);
    setInputs(inputsArr);
  };

  useEffect(() => {
    let prods = [];
    prods = inputs?.map((material: any) => ({
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
      <FormControl>
        <FormLabel fontWeight="bold" color="white" fontSize="18px">Scrap Materials</FormLabel>
        {inputs && inputs.map((input, ind) => (
          <div
           
            key={ind}
          >
            <FormControl className="mb-5">
              <FormLabel fontWeight="bold" color="white">Product Name</FormLabel>
              <Select
                required
                sty
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
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Quantity</FormLabel>
              <Input
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="quantity"
                value={input.quantity}
              ></Input>
            </FormControl>
            <FormControl>
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
            <FormControl>
              <FormLabel fontWeight="bold" color="white">Unit Cost</FormLabel>
              <Input
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
              <input
                disabled={true}
                onChange={(e) => {
                  onChangeHandler(e.target.name, e.target.value, ind);
                }}
                type="number"
                name="total_part_cost"
                value={input.total_part_cost}
                className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] text-gray-200 disabled:cursor-not-allowed disabled:bg-transparent"
              ></input>
            </FormControl>
          </div>
        ))}
      </FormControl>
      <div className="text-end mt-1">
        {inputs && inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<BiMinus />}
            variant="outline"
            className="mr-1 bg-[#a9a9a9]"
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoIosAdd />}
          variant="outline"
          className="bg-[#a9a9a9]"
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default ScrapMaterial;
