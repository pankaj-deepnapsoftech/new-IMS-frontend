import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useAddBomMutation
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";
import { useCookies } from "react-cookie";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";

interface AddBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
}

const AddBom: React.FC<AddBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
}) => {
  const [cookies] = useCookies();
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number>(0);
  const [totalPartsCost, setTotalPartsCost] = useState<number>(0);
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [description, setDescription] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const supportingDoc = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<number | undefined>();
  const [unitCost, setUnitCost] = useState<string | undefined>();
  const [processes, setProcesses] = useState<string[]>([""]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [labourCharges, setLabourCharges] = useState<number | undefined>();
  const [machineryCharges, setMachineryCharges] = useState<
    number | undefined
  >();
  const [electricityCharges, setElectricityCharges] = useState<
    number | undefined
  >();
  const [otherCharges, setOtherCharges] = useState<number | undefined>();

  const [addBom] = useAddBomMutation();

  const [rawMaterials, setRawMaterials] = useState<any[]>([
    {
      item_name: "",
      description: "",
      quantity: "",
      uom: "",
      category: "",
      assembly_phase: "",
      supplier: "",
      supporting_doc: "",
      comments: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const [scrapMaterials, setScrapMaterials] = useState<any[]>([
    {
      item_name: "",
      description: "",
      quantity: "",
      uom: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const categoryOptions = [
    { value: "finished goods", label: "Finished Goods" },
    { value: "raw materials", label: "Raw Materials" },
    { value: "semi finished goods", label: "Semi Finished Goods" },
    { value: "consumables", label: "Consumables" },
    { value: "bought out parts", label: "Bought Out Parts" },
    { value: "trading goods", label: "Trading Goods" },
    { value: "service", label: "Service" },
  ];

  const uomOptions = [
    { value: "pcs", label: "pcs" },
    { value: "kgs", label: "kgs" },
    { value: "ltr", label: "ltr" },
    { value: "tonne", label: "tonne" },
    { value: "cm", label: "cm" },
    { value: "inch", label: "inch" },
    { value: "mtr", label: "mtr" },
  ];

  const addBomHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileInput = supportingDoc.current as HTMLInputElement;
    let pdfUrl;
    if (fileInput && fileInput?.files && fileInput.files.length > 0) {
      try {
        const formData = new FormData();

        formData.append("file", fileInput?.files && fileInput.files[0]);

        const uploadedFileResponse = await fetch(
          process.env.REACT_APP_FILE_UPLOAD_URL!,
          {
            method: "POST",
            body: formData as unknown as BodyInit,
          }
        );
        const uploadedFile: any = await uploadedFileResponse.json();
        if (uploadedFile?.error) {
          throw new Error(uploadedFile?.error);
        }

        pdfUrl = uploadedFile[0];
      } catch (err: any) {
        toast.error(err.message || "Something went wrong during file upload");
        return;
      }
    }

    let modifiedRawMaterials = rawMaterials.map((material) => ({
      item: material?.item_name?.value,
      description: material?.description,
      quantity: material?.quantity,
      assembly_phase: material?.assembly_phase?.value,
      supplier: material?.supplier?.value,
      supporting_doc: material?.supporting_doc,
      comments: material?.comments,
      total_part_cost: material?.total_part_cost,
    }));

    let modifiedScrapMaterials =
      scrapMaterials?.[0]?.item_name &&
      scrapMaterials.map((material) => ({
        item: material?.item_name?.value,
        description: material?.description,
        quantity: material?.quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const body = {
      raw_materials: modifiedRawMaterials,
      scrap_materials: modifiedScrapMaterials,
      processes: processes,
      finished_good: {
        item: finishedGood?.value,
        description: description,
        quantity: quantity,
        supporting_doc: pdfUrl,
        comments: comments,
        cost: cost,
      },
      bom_name: bomName,
      parts_count: partsCount,
      total_cost: totalPartsCost,
      other_charges: {
        labour_charges: labourCharges || 0,
        machinery_charges: machineryCharges || 0,
        electricity_charges: electricityCharges || 0,
        other_charges: otherCharges || 0,
      },
    };

    try {
      const response = await addBom(body).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      if (error?.data?.message?.includes('Insufficient stock')) {
        fetchBomsHandler();
        closeDrawerHandler();
      }
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
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
      setProducts(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onFinishedGoodChangeHandler = (d: any) => {
    setFinishedGood(d);
    const product: any = products.filter((prd: any) => prd._id === d.value)[0];
    setCategory(product.category);
    setUom(product.uom);
    setUnitCost(product.price);
    if (quantity) {
      setCost(product.price * +quantity);
    }
  };

  const onFinishedGoodQntyChangeHandler = (qty: number) => {
    setQuantity(qty);
    if (unitCost) {
      setCost(+unitCost * qty);
    }
  };

  useEffect(() => {
    if (
      rawMaterials[rawMaterials.length - 1].unit_cost !== "" &&
      rawMaterials[rawMaterials.length - 1].quantity !== ""
    ) {
      setPartsCount(rawMaterials.length);
      const cost = rawMaterials.reduce(
        (prev, current) => prev + +current?.unit_cost * +current?.quantity,
        0
      );
      setTotalPartsCost(cost);
    }
  }, [rawMaterials]);

  useEffect(() => {
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    const modifiedProducts = products.map((prd) => ({
      value: prd._id,
      label: prd.name,
    }));
    setProductOptions(modifiedProducts);
  }, [products]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
    <div
  className="absolute overflow-auto h-screen w-full sm:w-[90vw] md:w-[450px] bg-[#57657f] right-0 top-0 z-10 py-3"
  style={{
    boxShadow:
      "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
  }}
>
  <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
    <BiX onClick={closeDrawerHandler} size="26px" />
    Bill Of Materials (BOM)
  </h1>

  <div className="mt-8 px-5">
    <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
      Add New BOM
    </h2>

    <form onSubmit={addBomHandler}>
      {/* RawMaterial, Process Components Here */}

      <div>
        <FormLabel fontWeight="bold">Finished Good</FormLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Replace all w-[267px] with w-full */}
          {/* Example Below */}
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Finished Good</FormLabel>
            <Select
              className="rounded mt-2 border border-[#a9a9a9] w-full"
              options={productOptions}
              placeholder="Select"
              value={finishedGood}
              name="assembly_phase"
              onChange={onFinishedGoodChangeHandler}
            />
          </FormControl>

          {/* Repeat the same pattern for other fields */}
        </div>
      </div>

      {/* Same grid responsiveness for ScrapMaterial, Other Charges, and Final Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* BOM Name, Parts Count, Total Cost Fields */}
      </div>

      <Button
        type="submit"
        className="mt-4 w-full sm:w-auto"
        color="white"
        backgroundColor="#1640d6"
      >
        Submit
      </Button>
    </form>
  </div>
</div>

    </Drawer>
  );
};

export default AddBom;
