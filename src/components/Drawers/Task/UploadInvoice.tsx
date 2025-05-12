// @ts-nocheck

import { X } from "lucide-react";
import { useRef, useState } from "react";

import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useToast, Text } from '@chakra-ui/react';
import { InvoiceFormValidation } from "../../../Validation/SalesformValidation";
import { useFormik } from "formik";

const UploadInvoice = ({ showUploadInvoice, setShowUploadInvoice, sale_id, invoicefile, }) => {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(); 

    const toast = useToast();
    const [cookies] = useCookies();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const token = cookies?.access_token;

    const handleFileChange = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            setFieldValue("invoice", file);
            setFileName(file.name);

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }


            e.target.value = '';
        }
    };

    const { values, setFieldValue, errors, touched, handleBlur, handleChange, handleSubmit, resetForm} = useFormik({
        initialValues: {
            invoice: "",
        },
        validationSchema: InvoiceFormValidation,
        onSubmit: async (value) => {
            try {
                const formData = new FormData();
                formData.append("invoice", values.invoice);
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}sale/upload-invoice/${sale}`, formData, {
                    headers: {
                        Authorization: `Bearer ${cookies?.access_token}`,
                    },
                })

                toast({
                title: 'Invoice submitted',
                description: `${response.data?.message}`,
                status: 'success',
                duration: 4000,
                isClosable: true,
                });

                resetForm({
                    invoice: "",
                });

                setShowUploadInvoice(!showUploadInvoice)
                refresh();
            } catch (error) {
                console.error('Error submitting amount:', error);
                toast({
                title: 'Submission failed',
                description: error.response?.data?.message || 'Something went wrong. Please try again.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    })

    

    return (
        <div
            className={`fixed ${showUploadInvoice ? "block" : "hidden"} inset-0 h-screen items-center justify-center bg-[#00000056] bg-opacity-40 z-50 flex`}
        >
            <div className="bg-[#1C3644] rounded-2xl shadow-xl p-6 w-full max-w-md relative text-white">
                <button
                    onClick={() => {
                        setPreview(null);
                        setFileName('');
                        setShowUploadInvoice(false);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {invoicefile ? (
                    <Text fontSize="sm" color="teal.500">
                        <strong className="text-black">You have already uploaded the file : </strong>
                        <a href={invoicefile} target="_blank">
                            Uploaded File
                        </a>
                    </Text>
                ) : (
                    <>
                    
                <h2 className="text-2xl font-semibold mb-4">Upload Invoice</h2>

                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-3">
                        Upload File
                    </label>

                    <div className="group border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all hover:shadow-md hover:border-blue-400 hover:bg-[#142731] relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />

                        <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                            ) : (
                                <svg
                                    className="w-12 h-12 text-gray-400 group-hover:text-blue-400 transition"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m4 4H4a1 1 0 01-1-1v-3h18v3a1 1 0 01-1 1z"
                                    />
                                </svg>
                            )}

                            <p className="text-sm text-gray-400">
                                {fileName
                                    ? `Selected: ${fileName}`
                                    : <>Drag and drop your file here, or{' '}
                                        <span className="text-blue-400 hover:underline">browse</span></>
                                }
                            </p>
                            <p className="text-xs text-gray-400">Supported formats: PDF, DOCX, PNG</p>
                        </div>
                    </div>
                                {touched.invoice && errors.invoice && (
                                    <p className="text-red-400 text-sm mt-1">{errors.invoice}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => {
                            setPreview(null);
                            setFileName('');
                            setShowUploadInvoice(false);
                        }}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                        Upload
                    </button>
                </div>
                </>

                )}
            
            
            </div>
        </div>

    );
};

export default UploadInvoice;
