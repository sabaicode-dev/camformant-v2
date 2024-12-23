import { Skeleton } from "../skeleton/skeleton";


const ApproveSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-sm border pb-4 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="z-20 h-35 md:h-65">
        <Skeleton className="h-full w-full" />
        <div className="z-30 rounded-full overflow-hidden -mt-22 w-[150px] h-[150px] ml-10 bg-white/20">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
      </div>

      <div className="py-1 grid gap-5">
        <div className="w-1/2 m-auto grid gap-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/4 mt-2" />
          </div>

          <div className="grid gap-2">
            <div className="flex gap-1 items-center text-gray-700 dark:text-gray-300">
              <Skeleton className="h-6 w-5" />
              <Skeleton className="text-sm w-40" />
            </div>
            <div className="flex gap-1 items-center text-gray-700 dark:text-gray-300">
              <Skeleton className="h-6 w-5" />
              <Skeleton className="text-sm w-28" />
            </div>
          </div>
        </div>

        <div className="w-2/3 grid gap-5 m-auto">
          <div className="w-full grid gap-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveSkeleton;
