import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiMinus } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import { toast } from "react-toastify";
import Select from 'react-select';

interface AddItemsProps{
    inputs: { item: { value: string, label: string }, quantity: number, price: number }[] | [],
    setInputs: (input: any)=> void
}

const AddItems: React.FC<AddItemsProps> = ({inputs, setInputs}) => {
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
      const products = results.products.map((product: any) => ({
        value: product._id,
        label: product.name,
      }));
      setProductOptions(products);
      setProducts(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const onChangeHandler = (ind: number, name: string, value: any)=>{
    const inputsArr = [...inputs];
    
    if(name === 'quantity' && inputsArr[ind].item){
        const product = products.find(prod => prod._id === inputsArr[ind].item.value);
        inputsArr[ind]["price"] = (+value || 0) * (+product.price || 0);
        inputsArr[ind]["quantity"] = +value;
    }
    else if(name === 'price'){
        inputsArr[ind]["price"] = +value;
    }
    else{
        inputsArr[ind]["item"] = value;
    }

    setInputs(inputsArr);
  }

  useEffect(()=>{
    fetchItemsHandler();
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
      backgroundColor: state.isFocused ? "#FFF" : "#d3d3d3", // dark gray on focus, light gray default
      color: "#000", // text color
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
    <div>
      <div>
        {inputs.map((input, ind) => (
          <div key={ind} className="grid grid-cols-3 gap-x-1 gap-y-2">
            <FormControl>
              <FormLabel color="black">Product</FormLabel>
              <Select  styles={customStyles} onChange={(d: any)=>onChangeHandler(ind, "item", d)} value={input.item} options={productOptions} />
            </FormControl>
            <FormControl>
              <FormLabel color="black">Quantity</FormLabel>
              <Input className="text-gray-400" value={input.quantity} onChange={(e)=>onChangeHandler(ind, "quantity", e.target.value)} type="number" />
            </FormControl>
            <FormControl>
              <FormLabel color="black">Price</FormLabel>
              <Input className="text-gray-400" value={input.price} onChange={(e)=>onChangeHandler(ind, "price", e.target.value)} type="number" />
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
          leftIcon={<IoIosAdd className=" hover:text-black" />}
          variant="outline"
          color="gray.400"
          _hover={{color:"black" ,bg:"white"}}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddItems;
