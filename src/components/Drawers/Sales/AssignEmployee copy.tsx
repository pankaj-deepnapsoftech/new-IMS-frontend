// @ts-nocheck

import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
    useToast,
} from "@chakra-ui/react";

const AssignEmployee = ({ show, setShow, employeeData, saleData }) => {
    const tasks = saleData?.assinedto;
    console.log("assign", saleData);
    const [formData, setFormData] = useState({
        sale_id: saleData?._id,
        assined_to: "",
        assined_process: "",
        assinedby_comment: "",
    });

    const [isEditMode, setIsEditMode] = useState(false); // Track if it's an edit operation
    const [editTaskId, setEditTaskId] = useState(null); // Track the task being edited


    const [cookies] = useCookies(["access_token"]);
    const toast = useToast();
    const token = cookies?.access_token;

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle task creation or update
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // If it's edit mode, send update request
            if (isEditMode && editTaskId) {
                const response = await axios.patch(
                    `${process.env.REACT_APP_BACKEND_URL}assined/update/${editTaskId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast({
                    title: "Task Updated",
                    description: "The task has been successfully updated.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Reset form after update
                setIsEditMode(false);
                setEditTaskId(null);
            } else {
                // Otherwise, create a new task
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}assined/create`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast({
                    title: "Task Created",
                    description: "The task has been successfully assigned.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }

            // Clear form
            setFormData({
                sale_id: saleData?._id,
                assined_to: "",
                assined_process: "",
                assinedby_comment: "",
            });

            onClose();
        } catch (error) {
            console.log(error);

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
    };

    // Handle edit button click
    const handleEdit = async (id, taskData) => {
        setIsEditMode(true);
        setEditTaskId(id);

        // Pre-fill form with the task data
        setFormData({
            sale_id: saleData?._id,
            assined_to: taskData?.assinedto[0]?._id || "",
            assined_process: taskData?.assined_process || "",
            assinedby_comment: taskData?.assinedby_comment || "",
        });

    };

    // Handle delete
    const handleDelete = async (id) => {
        console.log(id);

        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}assined/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast({
                title: "Task Deleted",
                description: "The task has been successfully deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to remove assigned task.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
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


    return (
        <section>
            <div className={` ${show ? "block" : "hidden"} bg-[#0c0c0c79] fixed h-[100%]  inset-0 w-full flex items-center justify-center z-50`}>
                <div className=" text-white bg-[#1c3644] rounded-2xl w-96 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Assign Employee</h2>
                        <button className="text-gray-400 hover:text-white text-xl transition" onClick={() => setShow(!show)}>✕</button>
                    </div>
                    <div className=" overflow-auto h-[100px] mb-4">
                        <div className="bg-[#ffffff23] p-4 rounded-lg shadow-md text-sm mb-6">
                            <p className="mb-1"><span className="font-semibold text-gray-200">Date:</span> <span className="text-white">5/7/2025</span></p>
                            <p className="mb-1"><span className="font-semibold text-gray-200">Task:</span> <span className="text-white">Make design of label and tag</span></p>
                            <p><span className="font-semibold text-gray-300">Assigned To:</span> <span className="text-white">VISHAKHA - Designer</span></p>
                        </div>
                    </div>
                    <div className="bg-[#ffffff23] shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-teal-400 mb-4">{isEditMode ? "Update Task" : "Assign Task"}</h3>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Select Employee<span className="text-red-500">*</span></label>
                        <select onChange={(e) =>
                            setFormData((prevData) => ({
                                ...prevData,
                                assined_to: e.target.value,
                            }))
                        } className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600  px-3 py-2 rounded-lg mb-4" required>
                            <option value="" className="text-black bg-[#ffffff23] ">Select an employee</option>
                            {employeeData.map((emp: any) => (
                                <option
                                    className="text-black bg-[#ffffff23]"
                                    key={emp?._id}
                                    value={emp?._id}
                                >
                                    {emp?.first_name} - {emp?.role?.role || ""}
                                </option>
                            ))}

                        </select>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Define Process<span className="text-red-500">*</span></label>
                        <input value={formData.assined_process}
                            onChange={handleChange} type="text" className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4" placeholder="Enter process name" required />
                        <label className="block text-sm font-medium mb-1 text-gray-300">Remarks</label>
                        <textarea value={formData.assinedby_comment}
                            onChange={handleChange} className="w-full bg-[#ffffff23] focus:outline-none border border-gray-600 text-white px-3 py-2 rounded-lg mb-4" placeholder="Enter further details (if any)" />
                        <button 
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition"
                            disabled={isSubmitting}
                            onClick={handleFormSubmit}
                        >
                            {isEditMode ? "Update" : "Assign"}
                        </button>
                    </div>
                    <button className="mt-4 w-full border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold" onClick={() => setShow(!show)}>Cancel</button>
                </div>
            </div>

        </section>
    )
}

export default AssignEmployee