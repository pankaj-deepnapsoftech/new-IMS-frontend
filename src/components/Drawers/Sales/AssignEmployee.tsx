// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
    Text,
    Badge,
    Button,
    useToast,
    HStack,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



import { useFormik } from "formik";
import { AssignFormValidation } from "../../../Validation/SalesformValidation";

const AssignEmployee = ({ show, setShow, employeeData = [], saleData }) => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        sale_id: saleData?._id,
        assined_to: "",
        assined_process: "",
        assinedby_comment: "",
    });
   
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [cookies] = useCookies(["access_token"]);
    const toast = useToast();
    const token = cookies?.access_token;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { values, setValues, errors, touched, handleBlur, handleChange, handleSubmit, resetForm } = useFormik({
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
            setIsSubmitting(true)
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
        }
    })

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
            setTasks('')
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
    // console.log(employeeData)
    return (
        <section>
            <div className={`${show ? "block" : "hidden"} bg-[#0c0c0c79] fixed inset-0 h-full w-full flex items-center justify-center z-50`}>
                <div className="text-white bg-[#1c3644] rounded-2xl w-96 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Assign Employee</h2>
                        <button className="text-gray-400 hover:text-white text-xl" onClick={handleClose}>✕</button>
                    </div>
                    {tasks?.length > 0 && (
                        <div className="overflow-auto h-[100px] mb-4">
                            {/* Replace with dynamic data if needed */}
                            {tasks.map((task) => (
                                <div key={task?._id} className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                                    <p><span className="font-semibold text-gray-200">Date:</span> {new Date(task?.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-semibold text-gray-200">Task:</span> {task?.assined_process}</p>
                                    <p><span className="font-semibold text-gray-300">Assigned To:</span> {" "}
                                        {task?.assinedto[0]?.first_name} -{" "}
                                        {task?.assinedto[0]?.role[0]?.role || ""}
                                    </p>

                                    <Text>
                                        <strong>Status:</strong>{" "}
                                        <Badge colorScheme={colorChange(task?.isCompleted)}>
                                            {task?.isCompleted}
                                        </Badge>
                                    </Text>
                                    <HStack>
                                        <Button
                                            size={"sm"}
                                            bgColor="blue.500"
                                            _hover="blue.400"
                                            onClick={() => handleEdit(task._id, task)}
                                        >
                                            <FaEdit className="text-white" />
                                        </Button>
                                        <Button
                                            size={"sm"}
                                            bgColor="red.500"
                                            _hover="red.400"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete?")) {
                                                    handleDelete(task?._id);
                                                }
                                            }}
                                        >
                                            <MdDelete className="text-white" />
                                        </Button>
                                    </HStack>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-[#ffffff23] shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-teal-400 mb-4">{isEditMode ? "Update Task" : "Assign Task"}</h3>

                        <label className="block text-sm font-medium mb-1 text-gray-300">Select Employee<span className="text-red-500">*</span></label>
                        <select
                            name="assined_to"
                            value={values.assined_to} onChange={handleChange} onBlur={handleBlur}
                            className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600  px-3 py-2 rounded-lg mb-4"
                            required
                        >
                            <option value="" className="text-black bg-[#ffffff23]">Select an employee</option>
                            {
                                // employeeData
                                //     .filter(emp => {
                                //         const role = emp?.role?.role?.toLowerCase() || "";
                                //         return (
                                //             role.includes("production") ||
                                //             role.includes("dispatcher") ||
                                //             role.includes("inventory")
                                //         );
                                //     })
                                
                                    employeeData.map(emp => (
                                        <option
                                            className="text-black bg-[#ffffff23]"
                                            key={emp?._id}
                                            value={emp?._id}
                                        >
                                            {emp?.first_name} - {emp?.role?.role || "No Role"}
                                        </option>
                                    ))
                                }


                        </select>
                        {touched.assined_to && errors.assined_to && (
                            <p className="text-red-400 text-sm mt-1">{errors.assined_to}</p>
                        )}

                        <label className="block text-sm font-medium mb-1 text-gray-300">Define Process<span className="text-red-500">*</span></label>
                        <input
                            name="assined_process"
                            value={values.assined_process}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4"
                            placeholder="Enter process name"
                            required
                        />

                        {touched.assined_process && errors.assined_process && (
                            <p className="text-red-400 text-sm mt-1">{errors.assined_process}</p>
                        )}

                        <label className="block text-sm font-medium mb-1 text-gray-300">Remarks</label>
                        <textarea
                            name="assinedby_comment"
                            value={values.assinedby_comment}
                            onChange={handleChange}
                            className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4"
                            placeholder="Enter further details (if any)"
                        />

                        <button
                            className={` ${isSubmitting ? "cursor-not-allowed" : ''}  w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition`}
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isEditMode ? "Update" : "Assign"}
                        </button>
                    </div>

                    <button
                        className="mt-4 w-full border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AssignEmployee;
