const SkeletonCard = () => (
  <div className="w-full animate-pulse bg-gray-100 rounded-lg flex flex-col md:flex-row overflow-hidden">
    <div className="md:w-1/3 w-full aspect-[3/2] bg-gray-300"></div>
    <div className="p-6 flex flex-col gap-3 md:w-2/3">
      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
    </div>
  </div>
);

export default SkeletonCard;
