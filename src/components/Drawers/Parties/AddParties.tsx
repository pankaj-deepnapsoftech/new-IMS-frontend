// @ts-nocheck 

import { useState } from "react";




const AddParties = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        gstNo: '',
        type: '',
      });
    
      const handleChange = (e) => {
        setFormData({ 
          ...formData, 
          [e.target.name]: e.target.value 
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        // You can send this to backend here
      };
    
      return (
        <form 
          className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700">GST No</label>
            <input 
              type="text" 
              name="gstNo" 
              value={formData.gstNo} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select type</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="partner">Partner</option>
            </select>
          </div>
    
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      )
}

export default AddParties