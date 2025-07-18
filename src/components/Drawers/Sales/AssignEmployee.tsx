// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Text, Badge, Button, useToast, HStack } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useFormik } from "formik";
import { AssignFormValidation } from "../../../Validation/SalesformValidation";
import { colors } from "../../../theme/colors";
import {
  UserPlus,
  Users,
  Briefcase,
  MessageSquare,
  Calendar,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { BiX } from "react-icons/bi";

const AssignEmployee = ({ show, setShow, employeeData = [], saleData, fetchPurchases }) => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        sale_id: saleData?._id,
        assined_to: "",
        assined_process: "",
        assinedby_comment: "",
    });
    console.log(saleData)
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [cookies] = useCookies(["access_token"]);
    const toast = useToast();
    const token = cookies?.access_token;
    const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    setValues,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      sale_id: saleData?._id,
      assined_to: "",
      assined_process: "",
      assinedby_comment: "",
    },
    enableReinitialize: true,
    validationSchema: AssignFormValidation,
    onSubmit: async (value) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        if (!token) throw new Error("Authentication token not found");

        if (isEditMode && editTaskId) {
                  const res =  await axios.patch(
                        `${process.env.REACT_APP_BACKEND_URL}assined/update/${editTaskId}`,
                        value,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    // console.log(res)
                    toast({
                        title: "Task Updated",
                        description: "The task has been successfully updated.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    setIsEditMode(false);
                    setEditTaskId(null);

                } else {
                  const res =  await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}assined/create`,
                        value,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                  console.log(res)
                    toast({
                        title: "Task Created",
                        description: "The task has been successfully assigned.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                fetchPurchases()
                resetForm({
                    sale_id: saleData?._id,
                    assined_to: "",
                    assined_process: "",
                    assinedby_comment: "",
                });

                handleClose();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
      }
    },
  });

  const handleEdit = (id, taskData) => {
    setIsEditMode(true);
    setEditTaskId(id);
    setValues({
      sale_id: saleData?._id,
      assined_to: taskData?.assinedto[0]?._id || "",
      assined_process: taskData?.assined_process || "",
      assinedby_comment: taskData?.assinedby_comment || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}assined/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
      setTasks("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove assigned task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    setIsEditMode(false);
    setEditTaskId(null);
  };

  const colorChange = (color: any) => {
    if (color === "Pending" || color === "UnderProcessing") {
      return "orange";
    } else if (color === "Design Rejected") {
      return "red";
    } else {
      return "green";
    }
  };

  useEffect(() => {
    if (saleData?._id) {
      setFormData((prev) => ({
        ...prev,
        sale_id: saleData._id,
      }));
    }
    if (saleData?.assinedto) {
      setTasks(saleData.assinedto);
    }
  }, [saleData]);

  return (
    <>
      {/* Backdrop Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-transform duration-300">
          {/* Header */}
          <div className=" px-6 py-4 flex items-center justify-between border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg border">
                <UserPlus className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-black">
                Assign Employee
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors border duration-200"
            >
              <BiX size={24} className="text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
            {/* Existing Tasks */}
            {tasks?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  Assigned Tasks ({tasks.length})
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {tasks.map((task) => (
                    <div
                      key={task?._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Date:
                            </span>
                            <span className="text-gray-600">
                              {new Date(task?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Process:
                            </span>
                            <span className="text-gray-600">
                              {task?.assined_process}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Assigned to:
                            </span>
                            <span className="text-gray-600">
                              {task?.assinedto[0]?.first_name} -{" "}
                              {task?.assinedto[0]?.role[0]?.role || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              Status:
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                task?.isCompleted === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : task?.isCompleted === "UnderProcessing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {task?.isCompleted}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex-1"></div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(task._id, task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this task?"
                                )
                              ) {
                                handleDelete(task?._id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                {isEditMode ? "Update Task" : "Assign New Task"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4 text-gray-500" />
                    Select Employee *
                  </label>
                  <select
                    name="assined_to"
                    value={values.assined_to}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    required
                  >
                    <option value="">Select an employee</option>
                    {employeeData.map((emp) => (
                      <option key={emp?._id} value={emp?._id}>
                        {emp?.first_name} - {emp?.role?.role || "No Role"}
                      </option>
                    ))}
                  </select>
                  {touched.assined_to && errors.assined_to && (
                    <p className="text-red-500 text-sm">{errors.assined_to}</p>
                  )}
                </div>

                {/* Process Definition */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    Define Process *
                  </label>
                  <input
                    name="assined_process"
                    value={values.assined_process}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter process name (e.g., Design, Production, Quality Check)"
                    required
                  />
                  {touched.assined_process && errors.assined_process && (
                    <p className="text-red-500 text-sm">
                      {errors.assined_process}
                    </p>
                  )}
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    Remarks (Optional)
                  </label>
                  <textarea
                    name="assinedby_comment"
                    value={values.assinedby_comment}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    placeholder="Add any additional instructions or notes..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? "bg-blue-700 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white shadow-sm hover:shadow-md"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditMode ? "Updating..." : "Assigning..."}
                  </div>
                ) : isEditMode ? (
                  "Update Task"
                ) : (
                  "Assign Task"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignEmployee;
