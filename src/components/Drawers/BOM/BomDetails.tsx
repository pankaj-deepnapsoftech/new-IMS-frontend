import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import Loading from "../../../ui/Loading";
import { colors } from "../../../theme/colors";
import {
  Package,
  FileText,
  Hash,
  Layers,
  DollarSign,
  Settings,
  Eye,
  List,
} from "lucide-react";

interface BomDetailsProps {
  bomId: string | undefined;
  closeDrawerHandler: () => void;
}

const BomDetails: React.FC<BomDetailsProps> = ({
  bomId,
  closeDrawerHandler,
}) => {
  const [cookies] = useCookies();
  const [isLoadingBom, setIsLoadingBom] = useState<boolean>(false);
  const [rawMaterials, setRawMaterials] = useState<any[] | []>([]);
  const [scrapMaterials, setScrapMaterials] = useState<any[] | []>([]);
  const [finishedGood, setFinishedGood] = useState<any | undefined>();
  const [processes, setProcesses] = useState<any | undefined>();
  const [bomName, setBomName] = useState<string | undefined>();
  const [partsCount, setPartsCount] = useState<number | undefined>();
  const [totalBomCost, setTotalBomCost] = useState<number | undefined>();
  const [otherCharges, setOtherCharges] = useState<any>();

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
      setFinishedGood(data.bom.finished_good);
      setRawMaterials(data.bom.raw_materials);
      setBomName(data.bom.bom_name);
      setTotalBomCost(data.bom.total_cost);
      setPartsCount(data.bom.parts_count);
      setProcesses(data.bom.processes);
      setScrapMaterials(data.bom?.scrap_materials);
      setOtherCharges(data.bom?.other_charges);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBom(false);
    }
  };

  useEffect(() => {
    fetchBomDetails();
  }, []);
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg border">
                <Eye className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-black">BOM Details</h2>
            </div>
            <button
              onClick={closeDrawerHandler}
              className="p-2 hover:bg-white/20 border rounded-lg transition-colors duration-200"
            >
              <BiX size={24} className="text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {isLoadingBom && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoadingBom && (
              <div className="space-y-6">
                {/* BOM Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    BOM Summary
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          BOM Name
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {bomName}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Parts Count
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {partsCount}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Total Cost
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹ {totalBomCost}/-
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raw Materials */}
                {rawMaterials && rawMaterials.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-orange-600" />
                      Raw Materials
                    </h3>

                    <div className="space-y-4">
                      {rawMaterials.map((material, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Item ID:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.product_id || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Item Name:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Quantity:
                              </span>
                              <p className="text-gray-900">
                                {material?.quantity || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                UOM:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.uom || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Unit Cost:
                              </span>
                              <p className="text-gray-900">
                                ₹ {material?.unit_cost || 0}/-
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Total Cost:
                              </span>
                              <p className="text-gray-900 font-semibold">
                                ₹ {material?.total_part_cost || 0}/-
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processes */}
                {processes && processes.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Processes
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processes.map((process: string, index: number) => (
                        <div
                          key={index}
                          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-2">
                            <List className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              Process {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">{process}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finished Good */}
                {finishedGood && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Finished Good
                    </h3>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Item ID:
                          </span>
                          <p className="text-gray-900">
                            {finishedGood?.item?.product_id || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Item Name:
                          </span>
                          <p className="text-gray-900">
                            {finishedGood?.item?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Quantity:
                          </span>
                          <p className="text-gray-900">
                            {finishedGood?.quantity || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            UOM:
                          </span>
                          <p className="text-gray-900">
                            {finishedGood?.item?.uom || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Category:
                          </span>
                          <p className="text-gray-900">
                            {finishedGood?.item?.category ||
                              finishedGood?.category ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Cost:
                          </span>
                          <p className="text-gray-900 font-semibold">
                            ₹ {finishedGood?.cost || 0}/-
                          </p>
                        </div>
                      </div>

                      {finishedGood?.supporting_doc && (
                        <div className="mt-4 pt-4 border-t border-green-200">
                          <span className="text-sm font-medium text-gray-600">
                            Supporting Document:
                          </span>
                          <a
                            href={finishedGood.supporting_doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Scrap Materials */}
                {scrapMaterials && scrapMaterials.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Package className="h-5 w-5 text-red-600" />
                      Scrap Materials
                    </h3>

                    <div className="space-y-4">
                      {scrapMaterials.map((material, index) => (
                        <div
                          key={index}
                          className="bg-red-50 rounded-lg p-4 border border-red-200"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Item ID:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.product_id || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Item Name:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                Quantity:
                              </span>
                              <p className="text-gray-900">
                                {material?.quantity || "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">
                                UOM:
                              </span>
                              <p className="text-gray-900">
                                {material?.item?.uom || "N/A"}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-sm font-medium text-gray-600">
                                Total Part Cost:
                              </span>
                              <p className="text-gray-900 font-semibold">
                                ₹ {material?.total_part_cost || 0}/-
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Charges */}
                {otherCharges && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      Other Charges
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <span className="text-sm font-medium text-gray-600">
                          Labour Charges:
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹ {otherCharges?.labour_charges || 0}/-
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <span className="text-sm font-medium text-gray-600">
                          Machinery Charges:
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹ {otherCharges?.machinery_charges || 0}/-
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <span className="text-sm font-medium text-gray-600">
                          Electricity Charges:
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹ {otherCharges?.electricity_charges || 0}/-
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <span className="text-sm font-medium text-gray-600">
                          Other Charges:
                        </span>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹ {otherCharges?.other_charges || 0}/-
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BomDetails;
