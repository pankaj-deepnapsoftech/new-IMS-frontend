import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiMinus } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import { toast } from "react-toastify";
import Select from 'react-select';

interface AddItemsProps {
  inputs: { item: { value: string, label: string }, quantity: number, price: number }[] | [];
  setInputs: (input: any) => void;
}

const AddItems: React.FC<AddItemsProps> = ({ inputs, setInputs }) => {
  const [cookies] = useCookies();
  const [products, setProducts] = useState<any[] | []>([]);
  const [productOptions, setProductOptions] = useState<any[] | []>([]);

  const addInputHandler = () => {
    setInputs((prev: any) => [
      ...prev,
      { item: { value: "", label: "" }, quantity: 0, price: 0 },
    ]);
  };

  const deleteInputHandler = () => {
    const inputsArr = [...inputs];
    inputsArr.splice(inputs.length - 1);
    setInputs(inputsArr);
  };

  const fetchItemsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      const results = await response.json();

      if (!results.success) {
        throw new Error(results?.message);
      }

      const finishedGoods = results.products.filter(
        (product: any) => product.category?.toLowerCase() === "finished goods"
      );

      const productOptions = finishedGoods.map((product: any) => ({
        value: product._id,
        label: product.name,
      }));

      setProductOptions(productOptions);
      setProducts(finishedGoods);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const onChangeHandler = (ind: number, name: string, value: any) => {
    const inputsArr = [...inputs];

    if (name === 'quantity' && inputsArr[ind].item) {
      const product = products.find(prod => prod._id === inputsArr[ind].item.value);
      inputsArr[ind]["price"] = (+value || 0) * (+product.price || 0);
      inputsArr[ind]["quantity"] = +value || 0; // Ensure quantity is a number, default to 0 if empty
    } else if (name === 'price') {
      inputsArr[ind]["price"] = +value || 0; // Ensure price is a number, default to 0 if empty
    } else {
      inputsArr[ind]["item"] = value;
    }

    setInputs(inputsArr);
  };

  useEffect(() => {
    fetchItemsHandler();
  }, []);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: "#a9a9a9",
      color: "#000",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#d3d3d3" : "#FFF",
      color: "#000",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#808080",
      color: "#000",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#000",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#000",
    }),
  };

  return (
    <div>
      <div>
        {inputs.map((input, ind) => (
          <div key={ind} className="grid grid-cols-3 gap-x-1 gap-y-2">
            <FormControl>
              <FormLabel color="black">Product</FormLabel>
              <Select
                styles={customStyles}
                onChange={(d: any) => onChangeHandler(ind, "item", d)}
                value={input.item}
                options={productOptions}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="black">Quantity</FormLabel>
              <Input
                className="text-gray-600"
                value={input.quantity === 0 ? "" : input.quantity} 
                onChange={(e) => onChangeHandler(ind, "quantity", e.target.value)}
                type="number"
                isDisabled={!input.item?.value}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="black">Price</FormLabel>
              <Input
                className="text-gray-600"
                value={input.price === 0 ? "" : input.price} 
                onChange={(e) => onChangeHandler(ind, "price", e.target.value)}
                type="number"
                isDisabled={!input.item?.value}
              />
            </FormControl>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        {inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler()}
            leftIcon={<BiMinus />}
            variant="outline"
            className="mr-1"
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoIosAdd className="hover:text-black" />}
          variant="outline"
          color="gray.400"
          _hover={{ color: "black", bg: "white" }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddItems;