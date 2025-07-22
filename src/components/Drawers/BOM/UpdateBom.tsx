import { BiX, BiPlus, BiTrash } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useUpdateBOMMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import FormData from "form-data";
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
  Plus,
  Trash2,
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

  // Add/Remove handlers for Raw Materials
  const addRawMaterial = () => {
    setRawMaterials([
      ...rawMaterials,
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
  };

  const removeRawMaterial = (index: number) => {
    if (rawMaterials.length > 1) {
      setRawMaterials(rawMaterials.filter((_, i) => i !== index));
    }
  };

  const updateRawMaterial = (index: number, field: string, value: any) => {
    const updatedMaterials = [...rawMaterials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };

    // Auto-calculate costs when quantity or unit_cost changes
    if (field === "quantity" || field === "unit_cost") {
      const quantity = parseFloat(updatedMaterials[index].quantity) || 0;
      const unitCost = parseFloat(updatedMaterials[index].unit_cost) || 0;
      updatedMaterials[index].total_part_cost = (
        quantity * unitCost
      ).toString();
    }

    setRawMaterials(updatedMaterials);
  };

  // Add/Remove handlers for Processes
  const addProcess = () => {
    setProcesses([...processes, ""]);
  };

  const removeProcess = (index: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((_, i) => i !== index));
    }
  };

  const updateProcess = (index: number, value: string) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index] = value;
    setProcesses(updatedProcesses);
  };

  // Add/Remove handlers for Scrap Materials
  const addScrapMaterial = () => {
    setScrapMaterials([
      ...scrapMaterials,
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
  };

  const removeScrapMaterial = (index: number) => {
    if (scrapMaterials.length > 1) {
      setScrapMaterials(scrapMaterials.filter((_, i) => i !== index));
    }
  };

  const updateScrapMaterial = (index: number, field: string, value: any) => {
    const updatedMaterials = [...scrapMaterials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };

    // Auto-calculate costs when quantity or unit_cost changes
    if (field === "quantity" || field === "unit_cost") {
      const quantity = parseFloat(updatedMaterials[index].quantity) || 0;
      const unitCost = parseFloat(updatedMaterials[index].unit_cost) || 0;
      updatedMaterials[index].total_part_cost = (
        quantity * unitCost
      ).toString();
    }

    setScrapMaterials(updatedMaterials);
  };

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
      console.log(body);
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
      <div className="fixed inset-y-0 right-0 z-50 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 text-black flex border items-center justify-between">
            <h2 className="text-xl font-semibold">Update BOM</h2>
            <button
              onClick={closeDrawerHandler}
              className="p-1 border rounded transition-colors duration-200"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <form onSubmit={updateBomHandler}>
              {/* Finished Good Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Finished Good
                  </h3>

                  {/* Table Header for Finished Good */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-7 gap-1 px-3 py-2">
                      <div>FINISHED GOODS</div>
                      <div>QUANTITY</div>
                      <div>UOM</div>
                      <div>CATEGORY</div>
                      <div>COMMENTS</div>
                      <div>UNIT COST</div>
                      <div>COST</div>
                    </div>
                  </div>

                  {/* Finished Good Row */}
                  <div className="border border-t-0 border-gray-300">
                    <div className="grid grid-cols-7 gap-1 px-3 py-2 items-center bg-white">
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          options={productOptions}
                          placeholder="Select"
                          value={finishedGood}
                          onChange={onFinishedGoodChangeHandler}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={quantity || ""}
                          onChange={(e) =>
                            onFinishedGoodQntyChangeHandler(+e.target.value)
                          }
                          placeholder="Quantity"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={uom || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={category || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={comments || ""}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Comments"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={unitCost || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={cost || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Raw Materials Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Raw Materials
                    </h3>
                    <button
                      type="button"
                      className="px-3 py-1 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white  text-sm rounded transition-colors"
                      onClick={addRawMaterial}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  {/* Table Header for Raw Materials */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white  text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-8 gap-1 px-3 py-2">
                      <div>PRODUCT NAME</div>
                      <div>QUANTITY</div>
                      <div>UOM</div>
                      <div>CATEGORY</div>
                      <div>COMMENTS</div>
                      <div>UNIT COST</div>
                      <div>TOTAL PART COST</div>
                      <div>ACTION</div>
                    </div>
                  </div>

                  {/* Raw Materials Rows */}
                  <div className="border border-t-0 border-gray-300">
                    {rawMaterials.map((material, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-8 gap-1 px-3 py-2 items-center bg-white border-b border-gray-200 last:border-b-0"
                      >
                        {/* Product Name */}
                        <div>
                          <Select
                            styles={customStyles}
                            className="text-sm"
                            options={productOptions}
                            placeholder="Select"
                            value={material.item_name}
                            onChange={(d) => {
                              updateRawMaterial(index, "item_name", d);
                              if (d) {
                                const product = products.find(
                                  (p) => p._id === d?.value
                                );
                                if (product) {
                                  updateRawMaterial(
                                    index,
                                    "unit_cost",
                                    product.price
                                  );
                                  updateRawMaterial(index, "uom", product.uom);
                                  updateRawMaterial(
                                    index,
                                    "category",
                                    product.category
                                  );
                                  if (material.quantity) {
                                    updateRawMaterial(
                                      index,
                                      "total_part_cost",
                                      product.price * +material.quantity
                                    );
                                  }
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.quantity || ""}
                            onChange={(e) =>
                              updateRawMaterial(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* UOM */}
                        <div>
                          <input
                            type="text"
                            value={material.uom || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <input
                            type="text"
                            value={material.category || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Comments */}
                        <div>
                          <input
                            type="text"
                            value={material.comments || ""}
                            onChange={(e) =>
                              updateRawMaterial(
                                index,
                                "comments",
                                e.target.value
                              )
                            }
                            placeholder="Comments"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* Unit Cost */}
                        <div>
                          <input
                            type="number"
                            value={material.unit_cost || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Total Part Cost */}
                        <div>
                          <input
                            type="number"
                            value={material.total_part_cost || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Action - Remove Button */}
                        <div className="flex justify-center">
                          {rawMaterials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRawMaterial(index)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Process Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Processes
                    </h3>
                    <button
                      type="button"
                      className="px-3 py-1 bg-gradient-to-r flex justify-center items-center gap-2 from-blue-600 to-blue-700 text-white  text-sm rounded transition-colors"
                      onClick={addProcess}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  {processes.map((process, index) => (
                    <div key={index} className="mb-4 flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Process {index + 1}
                        </label>
                        <input
                          type="text"
                          value={process}
                          onChange={(e) => updateProcess(index, e.target.value)}
                          placeholder={`Enter Process ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      {processes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProcess(index)}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors mb-0"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Scrap Materials Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Scrap Materials
                    </h3>
                    <button
                      type="button"
                      className="px-3 py-1 bg-gradient-to-r flex justify-center items-center gap-2 from-blue-600 to-blue-700 text-white  text-sm rounded transition-colors"
                      onClick={addScrapMaterial}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  {/* Table Header for Scrap Materials */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white  text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-7 gap-1 px-3 py-2">
                      <div>PRODUCT NAME</div>
                      <div>COMMENT</div>
                      <div>ESTIMATED QUANTITY</div>
                      <div>UOM</div>
                      <div>UNIT COST</div>
                      <div>TOTAL PART COST</div>
                      <div>ACTION</div>
                    </div>
                  </div>

                  {/* Scrap Materials Rows */}
                  <div className="border border-t-0 border-gray-300">
                    {scrapMaterials.map((material, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-7 gap-1 px-3 py-2 items-center bg-white border-b border-gray-200 last:border-b-0"
                      >
                        {/* Product Name */}
                        <div>
                          <Select
                            styles={customStyles}
                            className="text-sm"
                            options={productOptions}
                            placeholder="Select"
                            value={material.item_name}
                            onChange={(d) => {
                              updateScrapMaterial(index, "item_name", d);
                              if (d) {
                                const product = products.find(
                                  (p) => p._id === d?.value
                                );
                                if (product) {
                                  updateScrapMaterial(
                                    index,
                                    "unit_cost",
                                    product.price
                                  );
                                  updateScrapMaterial(
                                    index,
                                    "uom",
                                    product.uom
                                  );
                                  if (material.quantity) {
                                    updateScrapMaterial(
                                      index,
                                      "total_part_cost",
                                      product.price * +material.quantity
                                    );
                                  }
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Comment */}
                        <div>
                          <input
                            type="text"
                            value={material.description || ""}
                            onChange={(e) =>
                              updateScrapMaterial(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Comment"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* Estimated Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.quantity || ""}
                            onChange={(e) =>
                              updateScrapMaterial(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* UOM */}
                        <div>
                          <input
                            type="text"
                            value={material.uom || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Unit Cost */}
                        <div>
                          <input
                            type="number"
                            value={material.unit_cost || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Total Part Cost */}
                        <div>
                          <input
                            type="number"
                            value={material.total_part_cost || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Action - Remove Button */}
                        <div className="flex justify-center">
                          {scrapMaterials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeScrapMaterial(index)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Charges Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Charges
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Labour Charges
                      </label>
                      <input
                        type="number"
                        value={labourCharges || ""}
                        onChange={(e) => setLabourCharges(+e.target.value)}
                        placeholder="Labour Charges"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Machinery Charges
                      </label>
                      <input
                        type="number"
                        value={machineryCharges || ""}
                        onChange={(e) => setMachineryCharges(+e.target.value)}
                        placeholder="Machinery Charges"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Electricity Charges
                      </label>
                      <input
                        type="number"
                        value={electricityCharges || ""}
                        onChange={(e) => setElectricityCharges(+e.target.value)}
                        placeholder="Electricity Charges"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Charges
                      </label>
                      <input
                        type="number"
                        value={otherCharges || ""}
                        onChange={(e) => setOtherCharges(+e.target.value)}
                        placeholder="Other Charges"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* BOM Summary Section */}
              <div className="bg-white">
                <div className="px-6 py-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BOM Name *
                      </label>
                      <input
                        type="text"
                        value={bomName || ""}
                        onChange={(e) => setBomName(e.target.value)}
                        placeholder="Enter BOM Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parts Count *
                      </label>
                      <input
                        type="number"
                        value={partsCount}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Parts Cost *
                      </label>
                      <input
                        type="number"
                        value={totalPartsCost}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white  rounded transition-colors duration-200"
                    >
                      Update BOM
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateBom;
