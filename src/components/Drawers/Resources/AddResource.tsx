import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Select from "react-select";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { colors } from "../../../theme/colors";

interface AddResourceProps {
  closeDrawerHandler: () => void;
  fetchResourcesHandler?: () => void;
}

const machineTypeOptions = [
  { value: "machine", label: "Machine" },
  { value: "assemble_line", label: "Assemble Line" },
];

const AddResource = ({
  fetchResourcesHandler,
  closeDrawerHandler,
}: AddResourceProps) => {
  const [machineType, setMachineType] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [specification, setSpecification] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#d1d5db",
      color: "#374151",
      minHeight: "40px",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
      color: "#374151",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      closeDrawerHandler();
    }, 1000);
  };

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3 border-l border-gray-200"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Add New Resource
          </h1>
          <button
            onClick={closeDrawerHandler}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.gray[100],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
          >
            <BiX size={20} />
          </button>
        </div>

        <div className="mt-8 px-5 ">
          <form onSubmit={handleSubmit}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Machine Type
              </FormLabel>
              <Select
                required
                className="rounded mt-2 border"
                options={machineTypeOptions}
                placeholder="Select Machine Type"
                value={machineType}
                name="machine_type"
                onChange={setMachineType}
                styles={customStyles}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Name
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Name"
                bg="white"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold" color="gray.700">
                Specification
              </FormLabel>
              <Textarea
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                placeholder="Specification"
                bg="white"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
                _placeholder={{ color: "gray.500" }}
                rows={4}
              />
            </FormControl>
            <Button
              isLoading={isSubmitting}
              type="submit"
              className="mt-5"
              colorScheme="blue"
              size="md"
              width="full"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddResource;
