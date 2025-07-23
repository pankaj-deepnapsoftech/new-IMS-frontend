import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
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
  const [processStatuses, setProcessStatuses] = useState<{
    [key: number]: { started: boolean; done: boolean };
  }>({});

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

  const handleProcessStatusChange = (
    processIndex: number,
    statusType: "started" | "done",
    checked: boolean
  ) => {
    setProcessStatuses((prev) => {
      const updated = {
        ...prev,
        [processIndex]: {
          ...prev[processIndex],
          [statusType]: checked,
        },
      };

      // Auto-check "started" when "done" is checked
      if (statusType === "done" && checked) {
        updated[processIndex].started = true;
      }

      // Uncheck "done" when "started" is unchecked
      if (statusType === "started" && !checked) {
        updated[processIndex].done = false;
      }

      return updated;
    });
  };

  const updateProcessHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    let modifiedScrapMaterials =
      scrapMaterials?.[0]?.item_name &&
      scrapMaterials?.map((material) => {
        const materialData: any = {
          item: material?.item_name?.value,
          description: material?.description,
          estimated_quantity: material?.estimated_quantity,
          produced_quantity: material?.produced_quantity,
          total_part_cost: material?.total_part_cost,
        };

        // Only include _id if it exists and is not empty
        if (material?._id && material._id.trim() !== "") {
          materialData._id = material._id;
        }

        return materialData;
      });

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
      // Process Statuses
      process_statuses: processStatuses,
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

      setProcesses(data?.production_process?.bom?.processes);

      // Initialize process statuses for all processes
      const initialStatuses: {
        [key: number]: { started: boolean; done: boolean };
      } = {};
      data?.production_process?.bom?.processes?.forEach(
        (_: any, index: number) => {
          // Load existing statuses if available, otherwise default to false
          const existingStatus =
            data?.production_process?.process_statuses?.[index];
          initialStatuses[index] = {
            started: existingStatus?.started || false,
            done: existingStatus?.done || false,
          };
        }
      );
      setProcessStatuses(initialStatuses);

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
      borderColor: "#d1d5db",
      color: "#374151",
      minHeight: "32px",
      borderRadius: "6px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#dbeafe" : "white",
      color: "#374151",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#bfdbfe",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "6px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#374151",
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
            <h2 className="text-xl font-semibold">Update Production Process</h2>
            <button
              onClick={closeDrawerHandler}
              className="p-1 border rounded transition-colors duration-200"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <form onSubmit={updateProcessHandler}>
              {/* BOM Details Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    BOM Details
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BOM Name
                      </label>
                      <input
                        type="text"
                        value={bomName || ""}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Cost
                      </label>
                      <input
                        type="number"
                        value={totalCost || ""}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created By
                      </label>
                      <input
                        type="text"
                        value={createdBy || ""}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Finished Good Section */}
              <div className="bg-white border-b">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Finished Good
                  </h3>

                  {/* Table Header for Finished Good */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-8 gap-1 px-3 py-2">
                      <div>FINISHED GOODS</div>
                      <div>EST. QTY</div>
                      <div>PROD. QTY</div>
                      <div>UOM</div>
                      <div>CATEGORY</div>
                      <div>COMMENTS</div>
                      <div>UNIT COST</div>
                      <div>COST</div>
                    </div>
                  </div>

                  {/* Finished Good Row */}
                  <div className="border border-t-0 border-gray-300">
                    <div className="grid grid-cols-8 gap-1 px-3 py-2 items-center bg-white">
                      <div>
                        <Select
                          styles={customStyles}
                          className="text-sm"
                          options={productOptions}
                          placeholder="Select"
                          value={finishedGood}
                          onChange={onFinishedGoodChangeHandler}
                          isDisabled
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={finishedGoodQuantity || ""}
                          onChange={(e) =>
                            onFinishedGoodQntyChangeHandler(+e.target.value)
                          }
                          placeholder="Estimated Quantity"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={finishedGoodProducedQuantity || ""}
                          onChange={(e) =>
                            setFinishedGoodProducedQuantity(+e.target.value)
                          }
                          placeholder="Produced Quantity"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={finishedGoodUom || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={finishedGoodCategory || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={finishedGoodComments || ""}
                          onChange={(e) =>
                            setFinishedGoodComments(e.target.value)
                          }
                          placeholder="Comments"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={finishedGoodUnitCost || ""}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={finishedGoodCost || ""}
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
                  </div>

                  {/* Table Header for Raw Materials */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-8 gap-1 px-3 py-2">
                      <div>PRODUCT NAME</div>
                      <div>EST. QTY</div>
                      <div>USED QTY</div>
                      <div>UOM</div>
                      <div>CATEGORY</div>
                      <div>COMMENTS</div>
                      <div>UNIT COST</div>
                      <div>TOTAL COST</div>
                    </div>
                  </div>

                  {/* Raw Materials Rows */}
                  <div className="border border-t-0 border-gray-300">
                    {selectedProducts.map((material, index) => (
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
                            isDisabled
                          />
                        </div>

                        {/* Estimated Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.estimated_quantity || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Used Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.used_quantity || ""}
                            onChange={(e) => {
                              const newMaterials = [...selectedProducts];
                              newMaterials[index].used_quantity =
                                e.target.value;
                              setSelectedProducts(newMaterials);
                            }}
                            placeholder="Used Quantity"
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
                    <div className="text-sm text-gray-600">
                      {
                        Object.values(processStatuses).filter(
                          (status) => status?.done
                        ).length
                      }{" "}
                      of {processes.length} completed
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {processes.map((process, index) => {
                      const status = processStatuses[index];
                      const isStarted = status?.started || false;
                      const isDone = status?.done || false;

                      return (
                        <div key={index} className="mb-4 flex items-end gap-1">
                          <div
                            className={`border p-3 rounded-lg min-w-[300px] ${
                              isDone
                                ? "bg-green-50 border-green-200"
                                : isStarted
                                ? "bg-blue-50 border-blue-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Process {index + 1}
                              </label>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  isDone
                                    ? "bg-green-100 text-green-800"
                                    : isStarted
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {isDone
                                  ? "Completed"
                                  : isStarted
                                  ? "In Progress"
                                  : "Not Started"}
                              </div>
                            </div>
                            <input
                              type="text"
                              value={process}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-white mb-3"
                            />

                            {/* Process Status Checkboxes */}
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isStarted}
                                  onChange={(e) =>
                                    handleProcessStatusChange(
                                      index,
                                      "started",
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Started
                                </span>
                              </label>

                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={(e) =>
                                    handleProcessStatusChange(
                                      index,
                                      "done",
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Done
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                  </div>

                  {/* Table Header for Scrap Materials */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider">
                    <div className="grid grid-cols-7 gap-1 px-3 py-2">
                      <div>PRODUCT NAME</div>
                      <div>COMMENT</div>
                      <div>EST. QTY</div>
                      <div>PROD. QTY</div>
                      <div>UOM</div>
                      <div>UNIT COST</div>
                      <div>TOTAL COST</div>
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
                            isDisabled
                          />
                        </div>

                        {/* Comment */}
                        <div>
                          <input
                            type="text"
                            value={material.description || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Estimated Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.estimated_quantity || ""}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                          />
                        </div>

                        {/* Produced Quantity */}
                        <div>
                          <input
                            type="number"
                            value={material.produced_quantity || ""}
                            onChange={(e) => {
                              const newMaterials = [...scrapMaterials];
                              newMaterials[index].produced_quantity =
                                e.target.value;
                              setScrapMaterials(newMaterials);
                            }}
                            placeholder="Produced Quantity"
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white">
                <div className="px-6 py-4">
                  <div className="flex gap-4">
                    <button
                      disabled={isCompleted || rawMaterialApprovalPending}
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white rounded transition-colors duration-200 disabled:bg-gray-400"
                    >
                      {isUpdating ? "Updating..." : submitBtnText}
                    </button>
                    {submitBtnText === "Update" && (
                      <button
                        disabled={isCompleted || rawMaterialApprovalPending}
                        type="button"
                        onClick={markProcessDoneHandler}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-500 text-white rounded transition-colors duration-200 disabled:bg-gray-400"
                      >
                        {isUpdating ? "Processing..." : "Mark as Done"}
                      </button>
                    )}
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

export default UpdateProcess;
