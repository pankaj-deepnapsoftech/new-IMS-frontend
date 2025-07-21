import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  useAddProductMutation,
  useCreateProcessMutation,
  useCreateProformaInvoiceMutation,
  useUpdateProcessMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";
import Process from "../../Dynamic Add Components/ProductionProcess";
import RawMaterial from "../../Dynamic Add Components/ProcessRawMaterial";
import ScrapMaterial from "../../Dynamic Add Components/ScrapMaterial";
import ProcessScrapMaterial from "../../Dynamic Add Components/ProcessScrapMaterial";
import { colors } from "../../../theme/colors";
import {
  Settings,
  FileText,
  Hash,
  Layers,
  DollarSign,
  Package,
  Upload,
  MessageSquare,
  Calculator,
  Edit3,
} from "lucide-react";

interface UpdateProcess {
  closeDrawerHandler: () => void;
  fetchProcessHandler: () => void;
  id: string | undefined;
}

const UpdateProcess: React.FC<UpdateProcess> = ({
  closeDrawerHandler,
  fetchProcessHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [bomName, setBomName] = useState<string | undefined>();
  const [totalCost, setTotalCost] = useState<string | undefined>();
  const [createdBy, setCreatedBy] = useState<string | undefined>();
  const [processes, setProcesses] = useState<string[] | []>([]);

  const [products, setProducts] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([
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
      estimated_quantity: "",
      used_quantity: "",
    },
  ]);

  const [bomId, setBomId] = useState<string | undefined>();
  const [productionProcessId, setProductionProcessId] = useState<
    string | undefined
  >();
  const [finishedGood, setFinishedGood] = useState<
    { value: string; label: string } | undefined
  >();
  const [finishedGoodDescription, setFinishedGoodDescription] = useState<
    string | undefined
  >();
  const [finishedGoodQuantity, setFinishedGoodQuantity] = useState<
    number | undefined
  >();
  const [finishedGoodProducedQuantity, setFinishedGoodProducedQuantity] =
    useState<number | undefined>();
  const [finishedGoodUom, setFinishedGoodUom] = useState<string | undefined>();
  const [finishedGoodCategory, setFinishedGoodCategory] = useState<
    string | undefined
  >();
  const finishedGoodSupportingDoc = useRef<HTMLInputElement | null>(null);
  const [finishedGoodComments, setFinishedGoodComments] = useState<
    string | undefined
  >();
  const [finishedGoodCost, setFinishedGoodCost] = useState<
    number | undefined
  >();
  const [finishedGoodUnitCost, setFinishedGoodUnitCost] = useState<
    string | undefined
  >();
  const [submitBtnText, setSubmitBtnText] = useState<string>("Update");
  const [processStatus, setProcessStatus] = useState<string | undefined>();
  const [rawMaterialApprovalPending, setRawMaterialApprovalPending] =
    useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [scrapMaterials, setScrapMaterials] = useState<any[]>([
    {
      _id: "",
      item_name: "",
      description: "",
      estimated_quantity: "",
      produced_quantity: "",
      uom: "",
      unit_cost: "",
      total_part_cost: "",
    },
  ]);

  const [updateProcess] = useUpdateProcessMutation();

  const onFinishedGoodChangeHandler = (d: any) => {
    setFinishedGood(d);
    const product: any = products.filter((prd: any) => prd._id === d.value)[0];
    setFinishedGoodCategory(product.category);
    setFinishedGoodUom(product.uom);
    setFinishedGoodUnitCost(product.price);
    if (finishedGoodQuantity) {
      setFinishedGoodCost(product.price * +finishedGoodQuantity);
    }
  };

  const onFinishedGoodQntyChangeHandler = (qty: number) => {
    setFinishedGoodQuantity(qty);
    if (finishedGoodUnitCost) {
      setFinishedGoodCost(+finishedGoodUnitCost * qty);
    }
  };

  const updateProcessHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    let modifiedScrapMaterials =
      scrapMaterials?.[0]?.item_name &&
      scrapMaterials?.map((material) => ({
        _id: material?._id,
        item: material?.item_name?.value,
        description: material?.description,
        estimated_quantity: material?.estimated_quantity,
        produced_quantity: material?.produced_quantity,
        total_part_cost: material?.total_part_cost,
      }));

    const data = {
      // BOM
      bom: {
        _id: bomId,
        raw_materials: selectedProducts,
        scrap_materials: modifiedScrapMaterials,
        processes: processes,
        finished_good: {
          item: finishedGood?.value,
          description: finishedGoodDescription,
          estimated_quantity: finishedGoodQuantity,
          produced_quantity: finishedGoodProducedQuantity,
          comments: finishedGoodComments,
          cost: finishedGoodCost,
        },
        bom_name: bomName,
        total_cost: totalCost,
      },
      // Production Process
      status: processStatus,
      _id: productionProcessId,
    };

    try {
      setIsUpdating(true);
      const response = await updateProcess(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const markProcessDoneHandler = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `production-process/done/${productionProcessId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      closeDrawerHandler();
      fetchProcessHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchProcessDetailsHandler = async (id: string) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `production-process/${id}`,
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

      setProductionProcessId(data.production_process._id);
      setBomId(data.production_process.bom._id);
      setBomName(data.production_process.bom.bom_name);
      setTotalCost(data.production_process.bom.total_cost);
      setCreatedBy(
        (data.production_process.bom?.creator?.first_name || "") +
          " " +
          (data.production_process.bom?.creator?.last_name || "")
      );

      const modifiedRawMaterials =
        data.production_process.bom.raw_materials.map((material: any) => {
          const prod = data.production_process.raw_materials.find(
            (p: any) => p.item._id === material.item._id
          );

          return {
            _id: material._id,
            item: material.item._id,
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
            estimated_quantity: prod.estimated_quantity,
            used_quantity: prod.used_quantity,
          };
        });

      setSelectedProducts(modifiedRawMaterials);

      const scrap: any = [];
      data.production_process?.bom?.scrap_materials?.forEach(
        (material: any) => {
          const sc = data.production_process.scrap_materials.find(
            (p: any) => p.item === material.item._id
          );

          scrap.push({
            _id: material._id,
            item_name: { value: material.item._id, label: material.item.name },
            description: material.description,
            estimated_quantity: sc.estimated_quantity,
            produced_quantity: sc.produced_quantity,
            uom: material.item.uom,
            unit_cost: material.item.price,
            total_part_cost: material.total_part_cost,
          });
        }
      );
      setScrapMaterials(scrap);

      setProcesses(data.production_process.processes);

      setFinishedGood({
        value: data.production_process.bom.finished_good.item._id,
        label: data.production_process.bom.finished_good.item.name,
      });
      setFinishedGoodDescription(
        data.production_process.bom.finished_good?.description
      );
      setFinishedGoodQuantity(
        data.production_process.bom.finished_good.quantity
      );
      setFinishedGoodUom(data.production_process.bom.finished_good.item.uom);
      setFinishedGoodUnitCost(
        data.production_process.bom.finished_good.item.price
      );
      setFinishedGoodCost(data.production_process.bom.finished_good.cost);
      setFinishedGoodCategory(
        data.production_process.bom.finished_good.item.category
      );
      setFinishedGoodComments(
        data.production_process.bom.finished_good.comments
      );
      setFinishedGoodProducedQuantity(
        data.production_process.finished_good.produced_quantity
      );

      if (data.production_process.status === "raw materials approved") {
        setSubmitBtnText("Start Production");
        setProcessStatus("work in progress");
      } else if (data.production_process.status === "work in progress") {
        setSubmitBtnText("Update");
        setProcessStatus("work in progress");
      } else if (data.production_process.status === "completed") {
        setIsCompleted(true);
      } else if (
        data.production_process.status === "raw material approval pending"
      ) {
        setRawMaterialApprovalPending(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsHandler = async () => {
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
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessDetailsHandler(id || "");
  }, [id]);

  useEffect(() => {
    const options = products.map((prod) => ({
      value: prod._id,
      label: prod.name,
    }));
    setProductOptions(options);
  }, [products]);

  useEffect(() => {
    fetchProductsHandler();
  }, []);

  useEffect(() => {
    if (
      selectedProducts[selectedProducts.length - 1].unit_cost !== "" &&
      selectedProducts[selectedProducts.length - 1].quantity !== ""
    ) {
      const cost = selectedProducts.reduce(
        (prev, current) => prev + +current.unit_cost * +current.quantity,
        0
      );
      setTotalCost(cost);
    }
  }, [selectedProducts]);
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
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[700px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Edit3 className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-black">
                Update Production Process
              </h2>
            </div>
            <button
              onClick={closeDrawerHandler}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <BiX size={24} className="text-black" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <form onSubmit={updateProcessHandler} className="space-y-6">
              {/* BOM Details Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  BOM Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 text-gray-500" />
                      BOM Name
                    </label>
                    <input
                      type="text"
                      value={bomName || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Total Cost
                    </label>
                    <input
                      type="number"
                      value={totalCost || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Created By
                    </label>
                    <input
                      type="text"
                      value={createdBy || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Raw Materials Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Raw Materials
                </h3>
                <RawMaterial
                  inputs={selectedProducts}
                  setInputs={setSelectedProducts}
                  products={products}
                  productOptions={productOptions}
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
                      isDisabled
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
                      value={finishedGoodDescription || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Estimated Quantity */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Estimated Quantity *
                    </label>
                    <input
                      type="number"
                      value={finishedGoodQuantity || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Produced Quantity */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-500" />
                      Produced Quantity *
                    </label>
                    <input
                      type="number"
                      value={finishedGoodProducedQuantity || ""}
                      onChange={(e) =>
                        setFinishedGoodProducedQuantity(+e.target.value)
                      }
                      placeholder="Enter produced quantity"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
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
                      value={finishedGoodUom || ""}
                      disabled
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
                      value={finishedGoodCategory || ""}
                      disabled
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
                      type="file"
                      accept=".pdf"
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-600"
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
                      value={finishedGoodComments || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
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
                      value={finishedGoodUnitCost || ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Total Cost */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Cost
                    </label>
                    <input
                      type="number"
                      value={finishedGoodCost || ""}
                      disabled
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
                <ProcessScrapMaterial
                  products={products}
                  productOptions={productOptions}
                  inputs={scrapMaterials}
                  setInputs={setScrapMaterials}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={
                    isCompleted || rawMaterialApprovalPending || isUpdating
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    submitBtnText
                  )}
                </button>

                {submitBtnText === "Update" && (
                  <button
                    type="button"
                    disabled={
                      isCompleted || rawMaterialApprovalPending || isUpdating
                    }
                    onClick={markProcessDoneHandler}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              {(isCompleted || rawMaterialApprovalPending) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {isCompleted
                      ? "This process has been completed."
                      : "Raw material approval is pending."}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProcess;
