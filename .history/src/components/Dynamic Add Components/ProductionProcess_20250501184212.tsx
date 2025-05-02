import {
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

interface ProductionProcessProps {
  inputs: any[];
  setInputs: (input: any) => void;
}

const ProductionProcess: React.FC<ProductionProcessProps> = ({
  inputs,
  setInputs,
}) => {
  const onChangeHandler = (isChecked: boolean, ind: number) => {
    const inputsArr = [...inputs];
    inputsArr[ind].done = isChecked;
    setInputs(inputsArr);
  };

  return (
    <div>
      <FormLabel fontWeight="bold" color>Processes</FormLabel>
      <div className="flex flex-col gap-3  w-[200px]">
        {inputs.map((input, ind) => (
          <>
            <FormControl className="flex gap-1 items-center" key={ind}>
              <Input className="text-gray-200"
                isDisabled
                border="1px"
                borderColor="white"
                type="text"
                name="process"
                value={input.process}
              ></Input>
              <input type="checkbox"  className="h-[30px] w-[30px]" checked={input.done} onChange={(e)=>onChangeHandler(e.target.checked, ind)} />
            </FormControl>
          </>
        ))}
      </div>
    </div>
  );
};

export default ProductionProcess;
