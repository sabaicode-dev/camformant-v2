import { Button } from "@/components/ui/button";
import { JobDetailRow } from "./JobDetailRow";
import { JobDetails } from "@/utils/types/job";
import { useRouter } from "next/navigation";


interface JobOverviewProps {
  details: JobDetails[];
}

export const JobOverview: React.FC<JobOverviewProps> = ({ details }) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      {details.map((detail, index) => (
        <JobDetailRow key={index} {...detail} />
      ))}
      <div className="mt-6 space-x-4 flex justify-center ">
        <Button variant="outline"    onClick={() => router.push(`/dashboard/chat`)}>Contact Now</Button>
      </div>
    </div>
  );
};
