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
import { colors } from "../../../theme/colors";
const AddNewSale = ({ show, setShow, refresh, editTable }) => {
  const [cookies] = useCookies();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partiesData, setpartiesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagesfile, setImageFile] = useState(null);

  // console.log(editTable)
  const ImageUploader = async (formData) => {
    // console.log(formData)
    try {
      const res = await axios.post(
        "https://images.deepmart.shop/upload",
        formData
      );
      console.log(res.data?.[0]);
      return res.data?.[0];
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      party: editTable?.party?._id || "",
      product_id: editTable?.product_id[0]?._id || "",
      price: editTable?.price || "",
      product_qty: editTable?.product_qty || "",
      product_type: editTable?.product_type || "finished goods",
      GST: editTable?.GST || "",
      comment: editTable?.comment || "",
      uom: editTable?.uom || "",
      productFile: editTable?.productFile || "",
    },
    enableReinitialize: true,
    validationSchema: SalesFormValidation,
    onSubmit: async (value) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      //    console.log("form Values",value)
      try {
        let designImageUrl = editTable?.productFile || "";

        if (imagesfile) {
          const formData = new FormData();
          formData.append("file", imagesfile);
          const uploadedImage = await ImageUploader(formData);
          if (!uploadedImage) {
            toast({
              title: "Upload failed",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            setIsSubmitting(false);
            return;
          }
          designImageUrl = uploadedImage;
        }

        const payload = {
          ...value,
          productFile: designImageUrl,
        };

        if (editTable?._id) {
          await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}sale/update/${editTable._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );
          resetForm();
        } else {
          // ➕ Create new sale
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}sale/create`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookies?.access_token}`,
              },
            }
          );
          resetForm();
        }

        toast({
          title: `Sale ${editTable?._id ? "updated" : "created"} successfully`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        setImageFile(null);
        setImagePreview(null);
        setShow(false);
        refresh();
      } catch (error) {
        console.error("Error saving sale:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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
      setpartiesData(partiesRes?.data?.data || []);
      setProducts(filteredProducts || []);
    } catch (error) {
      console.log("testing data", error);
      toast({
        title: "Error",
        description: "Failed to fetch data for dropdowns.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  // console.log(partiesData)

  useEffect(() => {
    fetchDropdownData();
  }, [cookies?.access_token, toast]);

  // console.log(products)
  useEffect(() => {
    if (editTable?.productFile) {
      setImagePreview(editTable?.productFile);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  }, [editTable]);

  return (
    <div
      className={`absolute z-50 top-0 ${
        show ? "right-1" : "hidden"
      } w-[30vw] bg-white border-l border-gray-200 transition-opacity duration-500 flex justify-center`}
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <div className="p-6 w-full max-w-md relative">
        <div
          className="flex items-center justify-between mb-6 pb-4 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            {editTable ? "Edit Sales Data" : "Add New Sale"}
          </h2>
          <button
            onClick={() => setShow(!show)}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.gray[100],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
          >
            <BiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Party</label>
            <select
              required
              name="party"
              value={values.party}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-white border text-white rounded px-3 py-2 focus:outline-none"
            >
              <option value="" className="text-black/80">
                Select a party
              </option>
              {partiesData.map((party: any) => (
                <option
                  key={party?._id}
                  value={party?._id}
                  className="text-black"
                >
                  {party?.consignee_name}{" "}
                  {party?.company_name ? `- (${party.company_name})` : ""}
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
                const selectedProduct = products.find(
                  (prod) => prod._id === selectedProductId
                );
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
              <option value="" className="text-black">
                Select a product
              </option>
              {products.map((product: any) => (
                <option
                  key={product?._id}
                  value={product?._id}
                  className="text-black"
                >
                  {product?.name}
                </option>
              ))}
            </select>
            {touched.product_id && errors.product_id && (
              <p className="text-red-400 text-sm mt-1">{errors.product_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Image
            </label>
            <input
              type="file"
              name="productFile"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setImagePreview(url);
                  setImageFile(file);
                  setFieldValue("productFile", file);
                }
                // console.log(URL.createObjectURL)
              }}
              className="w-full bg-white/10 border border-white/10 text-white px-3 py-2 rounded focus:outline-none"
            />
            {imagePreview && (
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
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Unit of Measurement (UOM)
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Product Quantity
            </label>
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
              className={`px-4 py-2 rounded transition text-white ${
                isSubmitting
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
  );
};

export default AddNewSale;
