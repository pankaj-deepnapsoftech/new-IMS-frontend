import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";


const EmptyData = () => {
  return (
    <div className="w-full my-5 rounded-lg  bg-[#ffffff23]  p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {/* Empty state icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          <ExclamationTriangleIcon className="w-[60px] h-[60px] text-blue-500" />
        </div>

        {/* Empty state message */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-[#fbfbfb]">
            No data available
          </h3>
          <p className="max-w-sm text-sm text-gray-100">
            Your table is currently empty. Add your first record to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
