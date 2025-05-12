// @ts-nocheck
import { X } from "lucide-react";
import { useState } from "react";

const UploadInvoice = ({ showinvoice, setShowInvoice }) => {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
        }
    };
    return (
        <div
            className={`fixed ${showinvoice ? "block" : "hidden"} inset-0 h-screen items-center justify-center bg-[#00000034] bg-opacity-40 z-50 flex`}
        >
            <div className="bg-[#1C3644] rounded-2xl shadow-xl p-6 w-full max-w-md relative text-white">
                <button
                    onClick={() => setShowInvoice(!showinvoice)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Upload Invoice</h2>

                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-3">
                        Upload File
                    </label>

                    <div className="group border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all hover:shadow-md hover:border-blue-400 hover:bg-[#142731] relative">
                        <input
                            type="file"
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
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => {
                            setPreview(null);    
                            setFileName('');        
                            setShowInvoice(false);
                        }}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                        Upload
                    </button>
                </div>
            </div>
        </div>

    );
};

export default UploadInvoice;
