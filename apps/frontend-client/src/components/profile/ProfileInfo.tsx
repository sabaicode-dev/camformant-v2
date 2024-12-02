import React from 'react';
import { Mail, Building2 } from 'lucide-react';
import { ProfileData } from '@/types/profile';
import { LocationInfo } from './LocationInfo';
import { SocialLinks } from './SocialLinks';

interface ProfileInfoProps {
  data?: ProfileData | null;
}

export function ProfileInfo({ data }: ProfileInfoProps) {
  return (
    <div className="mt-5">
      <div className="text-center mb-8">
        <h2 className="text-ellipsis font-bold text-gray-800">About</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          {data?.description || 'No description available'}
        </p>
      </div>

      <div className="py-7 bg-slate-100 w-full px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{data?.email}</span>
            </div>
            {data?.role === 'company' && (
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{data?.employee_count} Employees</span>
              </div>
            )}
            <LocationInfo location={data?.location} />
          </div>
          
          <div className="flex flex-col space-y-4 py-5">
            <div className="flex justify-end">
              <SocialLinks socialLinks={data?.social_links} contact={data?.contact} />
            </div>
            {/* <div className="flex justify-end">
              <div className="text-sm text-gray-500">Job Openings: {data?.job_openings_count}
                <br /> Job Closed: {data?.job_closings_count}
              </div>
            </div> */}
          </div>
        </div>
      </div>

    </div>
  );
}