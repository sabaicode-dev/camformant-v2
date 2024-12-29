import { JobDetails } from "@/utils/types/job";


export const JobDetailRow: React.FC<JobDetails> = ({ label, value }) => {

  return(

  <div className="flex items-center justify-between py-3 border-b border-gray-200">
    <span className="text-gray-600 dark:text-gray-200">{label}:</span>
    <span className="text-gray-900 dark:text-gray-400">{value}</span>
  </div>
  )
};