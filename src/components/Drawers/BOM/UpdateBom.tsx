import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useUpdateBOMMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import RawMaterial from "../../Dynamic Add Components/RawMaterial";
import Process from "../../Dynamic Add Components/Process";
import { useCookies } from "react-cookie";
import FormData from "form-data";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";
import { colors } from "../../../theme/colors";
import {
  Package,
  FileText,
  Hash,
  Layers,
  DollarSign,
  Settings,
  Upload,
  MessageSquare,
  Calculator,
  Edit,
} from "lucide-react";

interface UpdateBomProps {
  closeDrawerHandler: () => void;
  fetchBomsHandler: () => void;
  bomId: string | undefined;
}

const UpdateBom: React.FC<UpdateBomProps> = ({
  closeDrawerHandler,
  fetchBomsHandler,
  bomId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingBom, setIsLoadingBom] = useState<boolean>(false);
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number>(0);
  const [totalPartsCost, setTotalPartsCost] = useState<number>(0);
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [unitCost, setUnitCost] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const supportingDoc = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<string | undefined>();
  const [cost, setCost] = useState<number | undefined>();

  const [processes, setProcesses] = useState<string[]>([""]);
  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [updateBom] = useUpdateBOMMutation();
  const [labourCharges, setLabourCharges] = useState<number | undefined>();
  const [machineryCharges, setMachineryCharges] = useState<
    number | undefined
  >();
  const [electricityCharges, setElectricityCharges] = useState<
    number | undefined
  >();
  const [otherCharges, setOtherCharges] = useState<number | undefined>();

  const [rawMaterials, setRawMaterials] = useState<any[]>([
    {
      _id: "",
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
      _id: "",
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

  const updateBomHandler = async (e: React.FormEvent) => {
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
      _id: material?._id,
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
      scrapMaterials?.map((material) => ({
        _id: material?._id,
        item: material?.item_name?.value,
        description: material?.description,
        quantity: material?.quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const body = {
      _id: bomId,
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
      const response = await updateBom(body).unwrap();
      toast.success(response?.message);
      fetchBomsHandler();
      closeDrawerHandler();
    } catch (error: any) {
      if (error?.data?.message?.includes("Insufficient stock")) {
        fetchBomsHandler();
        closeDrawerHandler();
      }
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const fetchBomDetails = async () => {
    try {
      setIsLoadingBom(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `bom/${bomId}`,
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

      setBomName(data.bom.bom_name);
      setPartsCount(data.bom.parts_count);
      setTotalPartsCost(data.bom.total_cost);
      setFinishedGood({
        value: data.bom.finished_good.item._id,
        label: data.bom.finished_good.item.name,
      });
      setDescription(data.bom.finished_good.description);
      setQuantity(data.bom.finished_good.quantity);
      setCost(data.bom.finished_good.cost);
      setUnitCost(data.bom.finished_good.item.price);
      setUom(data.bom.finished_good.item.uom);
      setCategory(data.bom.finished_good.item.category);
      setComments(data.bom.finished_good.comments);

      setProcesses(data.bom.processes);

      const inputs: any = [];
      data.bom.raw_materials.forEach((material: any) => {
        inputs.push({
          _id: material._id,
          item_name: { value: material.item._id, label: material.item.name },
          description: material.description,
          quantity: material.quantity,
          uom: material.item.uom,
          category: material.item.category,
          assembly_phase: {
            value: material?.assembly_phase,
            label: material?.assembly_phase,
          },
          supplier: {
            value: material?.supplier?._id,
            label: material?.supplier?.name,
          },
          supporting_doc: "",
          comments: material?.comments,
          unit_cost: material.item.price,
          total_part_cost: material.total_part_cost,
        });
      });
      setRawMaterials(inputs);

      const scrap: any = [];
      data.bom?.scrap_materials?.forEach((material: any) => {
        scrap.push({
          _id: material._id,
          item_name: { value: material.item._id, label: material.item.name },
          description: material.description,
          quantity: material.quantity,
          uom: material.item.uom,
          unit_cost: material.item.price,
          total_part_cost: material.total_part_cost,
        });
      });
      setScrapMaterials(scrap);

      setLabourCharges(data.bom?.other_charges?.labour_charges);
      setMachineryCharges(data.bom?.other_charges?.machinery_charges);
      setElectricityCharges(data.bom?.other_charges?.electricity_charges);
      setOtherCharges(data.bom?.other_charges?.other_charges);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBom(false);
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
    fetchBomDetails();
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    const modifiedProducts = products.map((prd) => ({
      value: prd._id,
      label: prd.name,
    }));
    setProductOptions(modifiedProducts);
  }, [products]);

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
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: colors.gray[300],
      color: colors.gray[900],
      minHeight: "42px",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: colors.primary[500],
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? colors.primary[50] : "white",
      color: colors.gray[900],
      cursor: "pointer",
      "&:hover": {
        backgroundColor: colors.primary[100],
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: colors.primary[100],
      color: colors.primary[800],
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: colors.gray[500],
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: colors.gray[900],
    }),
  };
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Update BOM</h2>
            </div>
            <button
              onClick={closeDrawerHandler}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <BiX size={24} className="text-white" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <form onSubmit={updateBomHandler} className="space-y-6">
              {/* Raw Materials Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Raw Materials
                </h3>
                <RawMaterial
                  products={products}
                  productOptions={productOptions}
                  inputs={rawMaterials}
                  setInputs={setRawMaterials}
                />
              </div>

              {/* Process Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Process
                </h3>
                <Process inputs={processes} setInputs={setProcesses} />
              </div>

              {/* Finished Good Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Finished Good
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Finished Good Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 text-gray-500" />
                      Finished Good *
                    </label>
                    <Select
                      styles={customStyles}
                      className="text-sm"
                      options={productOptions}
                      placeholder="Select Finished Good"
                      value={finishedGood}
                      name="assembly_phase"
                      onChange={onFinishedGoodChangeHandler}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="h-4 w-4 text-gray-500" />
                      Description
                    </label>
                    <input
                      type="text"
                      value={description || ""}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={quantity || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onFinishedGoodQntyChangeHandler(+e.target.value)
                      }
                      placeholder="Enter quantity"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      required
                    />
                  </div>

                  {/* UOM */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calculator className="h-4 w-4 text-gray-500" />
                      Unit of Measurement
                    </label>
                    <input
                      type="text"
                      value={uom || ""}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Layers className="h-4 w-4 text-gray-500" />
                      Category
                    </label>
                    <input
                      type="text"
                      value={category || ""}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Supporting Doc */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Upload className="h-4 w-4 text-gray-500" />
                      Supporting Document
                    </label>
                    <input
                      ref={supportingDoc}
                      type="file"
                      accept=".pdf"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      Comments
                    </label>
                    <input
                      type="text"
                      value={comments || ""}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter comments"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Unit Cost
                    </label>
                    <input
                      type="number"
                      value={unitCost || ""}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Total Cost */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Total Cost
                    </label>
                    <input
                      type="number"
                      value={cost || ""}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Scrap Material Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-600" />
                  Scrap Materials
                </h3>
                <ScrapMaterial
                  products={products}
                  productOptions={productOptions}
                  inputs={scrapMaterials}
                  setInputs={setScrapMaterials}
                />
              </div>

              {/* Other Charges Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Other Charges
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Labour Charges
                    </label>
                    <input
                      type="number"
                      value={labourCharges || ""}
                      onChange={(e) => setLabourCharges(+e.target.value)}
                      placeholder="Enter labour charges"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Settings className="h-4 w-4 text-gray-500" />
                      Machinery Charges
                    </label>
                    <input
                      type="number"
                      value={machineryCharges || ""}
                      onChange={(e) => setMachineryCharges(+e.target.value)}
                      placeholder="Enter machinery charges"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Electricity Charges
                    </label>
                    <input
                      type="number"
                      value={electricityCharges || ""}
                      onChange={(e) => setElectricityCharges(+e.target.value)}
                      placeholder="Enter electricity charges"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Other Charges
                    </label>
                    <input
                      type="number"
                      value={otherCharges || ""}
                      onChange={(e) => setOtherCharges(+e.target.value)}
                      placeholder="Enter other charges"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* BOM Summary Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  BOM Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="h-4 w-4 text-gray-500" />
                      BOM Name *
                    </label>
                    <input
                      type="text"
                      value={bomName || ""}
                      onChange={(e) => setBomName(e.target.value)}
                      placeholder="Enter BOM name"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Parts Count
                    </label>
                    <input
                      type="number"
                      value={partsCount}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Total Parts Cost
                    </label>
                    <input
                      type="number"
                      value={totalPartsCost}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white border-t p-6 -mx-6 -mb-6">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateBom;
