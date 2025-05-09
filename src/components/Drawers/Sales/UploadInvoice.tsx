// @ts-nocheck
import { X } from "lucide-react";

const UploadInvoice = ({ showinvoice, setShowInvoice }) => {
  return (
    <div
      className={`fixed ${ showinvoice ? "block" : "hidden"} inset-0 h-screen items-center justify-center bg-black bg-opacity-40 z-50`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={() => setShowInvoice(!showinvoice)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          aria-label="Close"
        >
          <X  size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Upload Invoice
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">
            Upload File
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop a file here, or{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                browse
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowInvoice(!showinvoice)}
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
