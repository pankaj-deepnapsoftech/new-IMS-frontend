import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useAddBomMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
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
  Plus,
} from "lucide-react";

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
      console.log(response);
    } catch (error: any) {
      if (error?.data?.message?.includes("Insufficient stock")) {
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
            <h2 className="text-xl font-semibold">Add New BOM</h2>
            <button
              onClick={closeDrawerHandler}
              className="p-1 border rounded transition-colors duration-200"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <form onSubmit={addBomHandler}>
              {/* Finished Good Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Finished Good
                  </h3>

                  {/* Table Header for Finished Good */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
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
                      className="px-3 py-1 flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white  text-sm rounded transition-colors"
                      onClick={() => {
                        setRawMaterials([
                          ...rawMaterials,
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
                      }}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  {/* Table Header for Raw Materials */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white  text-sm font-semibold uppercase tracking-wider">
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
                              const newMaterials = [...rawMaterials];
                              newMaterials[index].item_name = d;
                              const product = products.find(
                                (p) => p._id === d?.value
                              );
                              if (product) {
                                newMaterials[index].unit_cost = product.price;
                                newMaterials[index].uom = product.uom;
                                newMaterials[index].category = product.category;
                                if (material.quantity) {
                                  newMaterials[index].total_part_cost =
                                    product.price * +material.quantity;
                                }
                              }
                              setRawMaterials(newMaterials);
                            }}
                          />
                        </div>

                        {/* Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.quantity || ""}
                            onChange={(e) => {
                              const newMaterials = [...rawMaterials];
                              newMaterials[index].quantity = e.target.value;
                              if (material.unit_cost && e.target.value) {
                                newMaterials[index].total_part_cost =
                                  +material.unit_cost * +e.target.value;
                              }
                              setRawMaterials(newMaterials);
                            }}
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
                            onChange={(e) => {
                              const newMaterials = [...rawMaterials];
                              newMaterials[index].comments = e.target.value;
                              setRawMaterials(newMaterials);
                            }}
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
                              onClick={() => {
                                const newMaterials = rawMaterials.filter(
                                  (_, i) => i !== index
                                );
                                setRawMaterials(newMaterials);
                              }}
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
              </div>{" "}
              {/* Process Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Processes
                    </h3>
                    <button
                      type="button"
                      className="px-3 py-1 bg-gradient-to-r flex justify-center items-center gap-2 from-blue-500 to-blue-500 text-white  text-sm rounded transition-colors"
                      onClick={() => setProcesses([...processes, ""])}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                  {processes.map((process, index) => (
                    <div key={index} className="mb-4 flex items-end gap-1">
                        <div className="border p-3 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Process {index + 1}
                          </label>
                          <input
                            type="text"
                            value={process}
                            onChange={(e) => {
                              const newProcesses = [...processes];
                              newProcesses[index] = e.target.value;
                              setProcesses(newProcesses);
                            }}
                            placeholder={`Enter Process ${index + 1}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                      </div>
                      {processes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newProcesses = processes.filter(
                              (_, i) => i !== index
                            );
                            setProcesses(newProcesses);
                          }}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors mb-0"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  ))}
                  </div>
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
                      className="px-3 py-1 bg-gradient-to-r flex justify-center items-center gap-2 from-blue-500 to-blue-500 text-white  text-sm rounded transition-colors"
                      onClick={() => {
                        setScrapMaterials([
                          ...scrapMaterials,
                          {
                            item_name: "",
                            description: "",
                            quantity: "",
                            uom: "",
                            unit_cost: "",
                            total_part_cost: "",
                          },
                        ]);
                      }}
                    >
                      <Plus /> Add
                    </button>
                  </div>

                  {/* Table Header for Scrap Materials */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white  text-sm font-semibold uppercase tracking-wider">
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
                              const newMaterials = [...scrapMaterials];
                              newMaterials[index].item_name = d;
                              const product = products.find(
                                (p) => p._id === d?.value
                              );
                              if (product) {
                                newMaterials[index].unit_cost = product.price;
                                newMaterials[index].uom = product.uom;
                                if (material.quantity) {
                                  newMaterials[index].total_part_cost =
                                    product.price * +material.quantity;
                                }
                              }
                              setScrapMaterials(newMaterials);
                            }}
                          />
                        </div>

                        {/* Comment */}
                        <div>
                          <input
                            type="text"
                            value={material.description || ""}
                            onChange={(e) => {
                              const newMaterials = [...scrapMaterials];
                              newMaterials[index].description = e.target.value;
                              setScrapMaterials(newMaterials);
                            }}
                            placeholder="Comment"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* Estimated Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.quantity || ""}
                            onChange={(e) => {
                              const newMaterials = [...scrapMaterials];
                              newMaterials[index].quantity = e.target.value;
                              if (material.unit_cost && e.target.value) {
                                newMaterials[index].total_part_cost =
                                  +material.unit_cost * +e.target.value;
                              }
                              setScrapMaterials(newMaterials);
                            }}
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
                              onClick={() => {
                                const newMaterials = scrapMaterials.filter(
                                  (_, i) => i !== index
                                );
                                setScrapMaterials(newMaterials);
                              }}
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
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white  rounded transition-colors duration-200"
                    >
                      Submit
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

export default AddBom;
