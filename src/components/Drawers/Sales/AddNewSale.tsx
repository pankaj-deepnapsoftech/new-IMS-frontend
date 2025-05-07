// @ts-nocheck

import { useState } from "react";
import { BiX } from "react-icons/bi";



const AddNewSale = ({show,setShow}) => {
    const [formData, setFormData] = useState({
        customer: "",
        product: "",
        price: "",
        quantity: "",
        gst: "",
        remarks: "",
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
    };
    
    return (
        <div className={`absolute  top-0 ${show ? "-right-8" : "-right-[35vw]"}  w-[30vw] transition-all duration-500 h-full bg-[#57657F] text-white   justify-center`}>
            <div className=" p-6 rounded-lg w-full max-w-md relative">
            <BiX size="30px" onClick={()=>setShow(!show)}   />
                <h2 className="text-xl text-center mt-4 font-semibold py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">Add a new Sale</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-md font-medium mb-2">Party </label>
                        <select name="Party" onChange={handleChange} className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2">
                            <option value="" className="text-black bg-[#ffffff41]">Select a customer</option>
                            <option value="Customer1" className="text-black bg-[#ffffff41]">Customer 1</option>
                            <option value="Customer2" className="text-black bg-[#ffffff41]">Customer 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-md font-medium">Product</label>
                        <select name="product" onChange={handleChange} className="w-full border border-gray-50 bg-[#47556913] focus:outline-none  text-gray-200 rounded px-2  py-2">
                            <option value="" className="text-black bg-[#ffffff41]">Select a product</option>
                            <option value="Product1" className="text-black bg-[#ffffff41]">Product 1</option>
                            <option value="Product2" className="text-black bg-[#ffffff41]">Product 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-md font-medium">Price </label>
                        <input
                            type="number"
                            name="price"
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Product Quantity </label>
                        <input
                            type="number"
                            name="quantity"
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">GST Type</label>
                        <div className="flex space-x-4 mt-1">
                            <label><input type="radio" name="gst" value="18%" onChange={handleChange} /> GST (18%)</label>
                            <label><input type="radio" name="gst" value="12%" onChange={handleChange} /> GST (12%)</label>
                            <label><input type="radio" name="gst" value="5%" onChange={handleChange} /> GST (5%)</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Remarks</label>
                        <input
                            type="text"
                            name="remarks"
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 bg-[#47556913] focus:outline-none"
                            placeholder="Further Details (if any)"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="bg-[#ffffff41] text-white px-4 py-2 rounded hover:">Add Sale</button>
                        <button type="button" onClick={()=>setShow(!show)}  className=" bg-[#ffffff41] px-4 py-2 rounded  hover:text-gray-200">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewSale