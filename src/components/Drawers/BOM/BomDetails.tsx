import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { BiX } from "react-icons/bi";
import Loading from "../../../ui/Loading";

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
    if (!bomId) return;
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
      if (!data.success) throw new Error(data.message);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bomId]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full  bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 text-black flex border items-center justify-between">
            <h2 className="text-xl font-semibold">BOM Details</h2>
            <button
              onClick={closeDrawerHandler}
              className="p-1 border rounded transition-colors duration-200"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {isLoadingBom && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoadingBom && (
              <div>
                {/* Summary */}
                <div className="bg-white border-b">
                  <div className="px-4 py-4 sm:px-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          BOM Name
                        </label>
                        <input
                          type="text"
                          value={bomName || "N/A"}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Parts Count
                        </label>
                        <input
                          type="text"
                          value={partsCount ?? "0"}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total BOM Cost
                        </label>
                        <input
                          type="text"
                          value={totalBomCost ?? "0"}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finished Good Section */}
                {finishedGood && (
                  <div className="bg-white border-b">
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Finished Good
                      </h3>

                      {/* Header (desktop) */}
                      <div className="hidden sm:grid grid-cols-7 gap-1 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider px-3 py-2">
                        <div>Finished Goods</div>
                        <div>Quantity</div>
                        <div>UOM</div>
                        <div>Category</div>
                        <div>Comments</div>
                        <div>Unit Cost</div>
                        <div>Cost</div>
                      </div>

                      {/* Row */}
                      <div className="border border-t-0 border-gray-300">
                        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 px-3 py-4 items-center bg-white">
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Finished Goods
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.item?.name || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Quantity
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.quantity || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              UOM
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.item?.uom || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Category
                            </label>
                            <input
                              type="text"
                              value={
                                finishedGood?.item?.category ||
                                finishedGood?.category ||
                                "N/A"
                              }
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Comments
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.comments || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Unit Cost
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.item?.price || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="sm:hidden text-xs font-semibold text-gray-700">
                              Cost
                            </label>
                            <input
                              type="text"
                              value={finishedGood?.cost || "N/A"}
                              readOnly
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Materials Section */}
                {rawMaterials && rawMaterials.length > 0 && (
                  <div className="bg-white border-b">
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Raw Materials
                      </h3>

                      {/* Header */}
                      <div className="hidden sm:grid grid-cols-7 gap-1 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider px-3 py-2">
                        <div>Product Name</div>
                        <div>Quantity</div>
                        <div>UOM</div>
                        <div>Category</div>
                        <div>Comments</div>
                        <div>Unit Cost</div>
                        <div>Total Part Cost</div>
                      </div>

                      {/* Rows */}
                      <div className="border border-t-0 border-gray-300">
                        {rawMaterials.map((material, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-7 gap-4 px-3 py-4 items-center bg-white border-b border-gray-200 last:border-b-0"
                          >
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Product Name
                              </label>
                              <input
                                type="text"
                                value={material?.item?.name || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Quantity
                              </label>
                              <input
                                type="text"
                                value={material?.quantity || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                UOM
                              </label>
                              <input
                                type="text"
                                value={material?.item?.uom || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Category
                              </label>
                              <input
                                type="text"
                                value={material?.item?.category || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Comments
                              </label>
                              <input
                                type="text"
                                value={material?.comments || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Unit Cost
                              </label>
                              <input
                                type="text"
                                value={material?.unit_cost || "0"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Total Part Cost
                              </label>
                              <input
                                type="text"
                                value={material?.total_part_cost || "0"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Section */}
                {processes && processes.length > 0 && (
                  <div className="bg-white border-b">
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Processes
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {processes.map((process: string, index: number) => (
                          <div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Process {index + 1}
                            </label>
                            <input
                              type="text"
                              value={process}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scrap Materials Section */}
                {scrapMaterials && scrapMaterials.length > 0 && (
                  <div className="bg-white border-b">
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Scrap Materials
                      </h3>

                      {/* Header */}
                      <div className="hidden sm:grid grid-cols-6 gap-1 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-semibold uppercase tracking-wider px-3 py-2">
                        <div>Product Name</div>
                        <div>Comment</div>
                        <div>Estimated Quantity</div>
                        <div>UOM</div>
                        <div>Unit Cost</div>
                        <div>Total Part Cost</div>
                      </div>

                      {/* Rows */}
                      <div className="border border-t-0 border-gray-300">
                        {scrapMaterials.map((material, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-6 gap-4 px-3 py-4 items-center bg-white border-b border-gray-200 last:border-b-0"
                          >
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Product Name
                              </label>
                              <input
                                type="text"
                                value={material?.item?.name || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Comment
                              </label>
                              <input
                                type="text"
                                value={material?.description || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Estimated Quantity
                              </label>
                              <input
                                type="text"
                                value={material?.quantity || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                UOM
                              </label>
                              <input
                                type="text"
                                value={material?.item?.uom || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Unit Cost
                              </label>
                              <input
                                type="text"
                                value={material?.item?.price || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="sm:hidden text-xs font-semibold text-gray-700">
                                Total Part Cost
                              </label>
                              <input
                                type="text"
                                value={material?.total_part_cost || "N/A"}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Charges */}
                {otherCharges && (
                  <div className="bg-white border-b">
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Other Charges
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Labour Charges
                          </label>
                          <input
                            type="text"
                            value={otherCharges.labour_charges || 0}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Machinery Charges
                          </label>
                          <input
                            type="text"
                            value={otherCharges.machinery_charges || 0}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Electricity Charges
                          </label>
                          <input
                            type="text"
                            value={otherCharges.electricity_charges || 0}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Other Charges
                          </label>
                          <input
                            type="text"
                            value={otherCharges.other_charges || 0}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                          />
                        </div>
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
