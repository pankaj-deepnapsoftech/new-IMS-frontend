// @ts-nocheck

import { get } from "http";
import { useEffect, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import axios from "axios";
import {useToast} from "@chakra-ui/react";
import { GiConsoleController } from "react-icons/gi";
import { useFormik } from "formik";
import { SalesFormValidation } from "../../../Validation/SalesformValidation";
const AddNewSale = ({ show, setShow, refresh }) => {
    const [cookies] = useCookies();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partiesData, setpartiesData] = useState([])
    const [products, setProducts] = useState([]);
    

    const {values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm} = useFormik({
            initialValues: {
                party: "",
                product_id: "",
                price: "",
                product_qty: "",
                product_type: "finished goods",
                GST: "",
                comment: "",
            },
        validationSchema: SalesFormValidation,
            onSubmit: async (value) => {
                try {
                    const res = await fetch(process.env.REACT_APP_BACKEND_URL + "sale/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${cookies?.access_token}`,
                        },
                        body: JSON.stringify(value)
                    });
    
                    const data = await res.json();
    
                    if (res.ok) {
                        toast({
                            title: "Sale Created",
                            description: "The sale has been created successfully.",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                        resetForm({
                            party: "",
                            product_id: "",
                            price: "",
                            product_qty: "",
                            product_type: "finished goods",
                            GST: "",
                            comment: "",
                        });
                        setShow(!show)
                        await refresh();
                    } else {
                        toast.error(data?.message || "Failed to save Sale.");
                    }

                } catch (error) {
                    console.error("Error saving sale:", error);
                    toast.error("Something went wrong. Please try again.");
                }
            }
        })

    const fetchDropdownData = async () => {
        try {
            const [partiesRes, productRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URL}parties/get`, {
                    headers: { Authorization: `Bearer ${cookies.access_token}` },
                }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}product/all`, {
                    headers: { Authorization: `Bearer ${cookies.access_token}` },
                }),
            ]);

            const filteredProducts = (productRes.data.products || []).filter(
                (product: any) => product.category == "finished goods"
            );
            setpartiesData(partiesRes.data.data || []);
            setProducts(filteredProducts || []);

        } catch (error) {
            console.log('testing data', error)
            toast({
                title: "Error",
                description: "Failed to fetch data for dropdowns.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({ ...prevData, [name]: value }));
    // };

    useEffect(() => {
        fetchDropdownData()
    }, [cookies.access_token, toast])
    return (
        <div className={`absolute z-50 top-0 ${show ? "right-1" : "hidden"}  w-[30vw] transition-opacity duration-500 h-full bg-[#57657F] text-white   justify-center`}>
            <div className=" p-6 rounded-lg w-full max-w-md relative">
                <BiX size="30px" onClick={() => setShow(!show)} />
                <h2 className="text-xl text-center mt-4 font-semibold py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">Add a new Sale</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-md font-medium mb-2">Party </label>
                        <select required name="party" value={values.party} onChange={handleChange} onBlur={handleBlur} className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2">
                            <option value="" className="text-black bg-[#ffffff41]">Select a party</option>
                            {partiesData.map((parties: any) => (
                                <option className="text-black bg-[#ffffff41]" key={parties?._id} value={parties?._id}>
                                    {parties?.full_name} {parties?.company_name ? ` - ${parties?.company_name}` : null}
                                </option>
                            ))}
                            
                        </select>
                        {touched.party && errors.party && (
                            <p className="text-red-400 text-sm mt-1">{errors.party}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-md font-medium">Product</label>
                        <select required name="product_id" value={values.product_id}
                            onChange={handleChange}
                            onBlur={handleBlur} className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2">
                            <option value="" className="text-black bg-[#ffffff41]">Select a product</option>
                            {products.map((product: any) => (
                                <option className="text-black bg-[#ffffff41]" key={product?._id} value={product?._id}>
                                    {product?.name}
                                </option>
                            ))}
                        </select>
                        {touched.product_id && errors.product_id && (
                            <p className="text-red-400 text-sm mt-1">{errors.product_id}</p>
                        )}

                    </div>

                    <div>
                        <label className="block text-md font-medium">Price </label>
                        <input
                            type="number"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            required
                        />
                        {touched.price && errors.price && (
                            <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Product Quantity </label>
                        <input
                            type="number"
                            name="product_qty"
                            value={values.product_qty}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            required
                        />
                        {touched.product_qty && errors.product_qty && (
                            <p className="text-red-400 text-sm mt-1">{errors.product_qty}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">GST Type</label>
                        <div className="flex space-x-4 mt-1">
                            <label>
                                <input
                                    type="radio"
                                    name="GST"
                                    value="18"
                                    checked={values.GST === '18'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                /> GST (18%)
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="GST"
                                    value="12"
                                    checked={values.GST === '12'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                /> GST (12%)
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="GST"
                                    value="5"
                                    checked={values.GST === '5'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                /> GST (5%)
                            </label>

                            {touched.GST && errors.GST && (
                                <p className="text-red-400 text-sm mt-1">{errors.GST}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Remarks</label>
                        <input
                            type="text"
                            name="remarks"
                            value={values.comment}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            placeholder="Further Details (if any)"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="bg-[#ffffff41] text-white px-4 py-2 rounded hover:">Add Sale</button>
                        <button type="button" onClick={() => setShow(!show)} className=" bg-[#ffffff41] px-4 py-2 rounded  hover:text-gray-200">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewSale