// @ts-nocheck

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { GiConsoleController } from "react-icons/gi";
import { useFormik } from "formik";
import { SalesFormValidation } from "../../../Validation/SalesformValidation";
import { IoClose } from "react-icons/io5";
const AddNewSale = ({ show, setShow, refresh }) => {
    const [cookies] = useCookies();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partiesData, setpartiesData] = useState([])
    const [products, setProducts] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagesfile,setImageFile] = useState(null)

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue }
        = useFormik({
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
                if (isSubmitting) return;
                setIsSubmitting(true);
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
                } finally {
                    setIsSubmitting(false);
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
                (product: any) => product?.category == "finished goods"
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
    console.log(partiesData)

    useEffect(() => {
        fetchDropdownData()
    }, [cookies?.access_token, toast])

    // console.log(products)

    return (
        <div
            className={`absolute z-50 top-0 ${show ? "right-1" : "hidden"} w-[30vw] h-full bg-[#57657F] text-white transition-opacity duration-500 flex justify-center`}
        >
            <div className="p-6 w-full max-w-md relative">
                <BiX size="30px" className="absolute top-4 right-4 cursor-pointer" onClick={() => setShow(!show)} />

                <h2 className="text-2xl text-center font-semibold py-3 bg-white/30 rounded-md mb-6">
                    Add a New Sale
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                  
                    <div>
                        <label className="block text-sm font-medium mb-1">Party</label>
                        <select
                            required
                            name="party"
                            value={values.party}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full bg-white/10 border border-white/10 text-white rounded px-3 py-2 focus:outline-none"
                        >
                            <option value="" className="text-black">Select a party</option>
                            {partiesData.map((party: any) => (
                                <option key={party?._id} value={party?._id} className="text-black">
                                    {party?.consignee_name} {party?.company_name ? `- (${party.company_name})` : ""}
                                </option>
                            ))}
                        </select>
                        {touched.party && errors.party && (
                            <p className="text-red-400 text-sm mt-1">{errors.party}</p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <select
                            required
                            name="product_id"
                            value={values.product_id}
                            onChange={(e) => {
                                const selectedProductId = e.target.value;
                                const selectedProduct = products.find(prod => prod._id === selectedProductId);
                                setFieldValue("product_id", selectedProductId);
                                if (selectedProduct?.uom) {
                                    setFieldValue("uom", selectedProduct.uom);
                                } else {
                                    setFieldValue("uom", ""); // fallback if no UOM
                                }
                            }}
                            onBlur={handleBlur}
                            className="w-full bg-white/10 border border-white/10 text-white rounded px-3 py-2 focus:outline-none"
                        >
                            <option value="" className="text-black">Select a product</option>
                            {products.map((product: any) => (
                                <option key={product?._id} value={product?._id} className="text-black">
                                    {product?.name}
                                </option>
                            ))}
                        </select>
                        {touched.product_id && errors.product_id && (
                            <p className="text-red-400 text-sm mt-1">{errors.product_id}</p>
                        )}
                    </div>

                  
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input
                            type="file"
                            name="product_image"
                            accept="image/*"
                            onChange={(e)=>{
                                const file = e.target.files[0]
                              if(file){
                                  const url = URL.createObjectURL(file)
                                  setImagePreview(url)
                                  setImageFile(file)
                                setFieldValue("prodict_image", file)
                              }
                                // console.log(URL.createObjectURL)
                            }}
                            className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none"
                        />
                        {
                            imagePreview && (

                                <div className="mt-3 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-40 rounded-md object-contain border border-white/20 "
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                            setFieldValue("product_image", null);
                                        }}
                                        className="absolute  top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white text-xs px-1.5 rounded-full"
                                    >
                                        <IoClose size={17} />
                                    </button>
                                </div>
                            )
                        }

                    </div>

                 
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit of Measurement (UOM)</label>
                        <input
                            type="text"
                            name="uom"
                            value={values.uom}
                            readOnly
                            className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none cursor-not-allowed"
                            placeholder="Auto-filled from product"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        {touched.price && errors.price && (
                            <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                        )}
                    </div>

                    {/* Product Quantity */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Quantity</label>
                        <input
                            type="number"
                            name="product_qty"
                            value={values.product_qty}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        {touched.product_qty && errors.product_qty && (
                            <p className="text-red-400 text-sm mt-1">{errors.product_qty}</p>
                        )}
                    </div>

                    {/* GST */}
                    <div>
                        <label className="block text-sm font-medium mb-1">GST Type</label>
                        <div className="flex items-center gap-4 mt-2">
                            {[18, 12, 5].map((rate) => (
                                <label key={rate} className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="GST"
                                        value={rate}
                                        checked={values.GST === String(rate)}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <span>{rate}%</span>
                                </label>
                            ))}
                        </div>
                        {touched.GST && errors.GST && (
                            <p className="text-red-400 text-sm mt-1">{errors.GST}</p>
                        )}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Remarks</label>
                        <input
                            type="text"
                            name="comment"
                            value={values.comment}
                            onChange={handleChange}
                            className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none"
                            placeholder="Further details (optional)"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded transition text-white ${isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-white/30 hover:bg-white/50"
                                }`}
                        >
                            Add Sale
                        </button>
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="px-4 py-2 rounded bg-white/30 hover:bg-white/50 text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default AddNewSale