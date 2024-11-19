"use client";
import ChartComponent from "@/components/chart";
import PieChartComponent from "@/components/pie-chart";
import { Card } from "@/components/ui/card";
import { Table, User } from "lucide-react";
import { RiMailVolumeLine, RiPassValidLine } from "react-icons/ri";
import JobList from "@/components/jobList";

const ChartPage = () => {
  return (
    <>
      <div className="flex gap-[56px] w-full mt-[31px] px-4 ">
        <div className="w-2/3">
          <div className="flex flex-col w-full h-auto gap-[32px]">
            {/*cover three of card */}
            <div className="flex w-full h-[130px] gap-[100px]">
              <Card className="w-full flex flex-col rounded-[5px] bg-green-200 justify-center dark:text-black p-[10px]">
                <User className="w-[23px] h-[23px] text-blue-400" />
                <span className="text-[21px] font-bold">395</span>
                <div className="text-[13px] text-gray-500">Applicant</div>
              </Card>
              <Card className="w-full flex flex-col rounded-[5px] bg-orange-100 justify-center dark:text-black p-[10px]">
                <RiMailVolumeLine className="w-[23px] h-[23px] text-blue-400" />
                <span className="text-[21px] font-bold">395</span>
                <div className="text-[13px] text-gray-500">interview</div>
              </Card>
              <Card className="w-full flex flex-col rounded-[5px] bg-pink-100 justify-center dark:text-black p-[10px]">
                <RiPassValidLine className="w-[23px] h-[23px] text-blue-400" />
                <span className="text-[21px] font-bold">395</span>
                <div className="text-[13px] text-gray-500">Passed</div>
              </Card>
            </div>
            <div className="w-full flex flex-col gap-[32px] ">
              <div className="w-full">
                <ChartComponent />
              </div>
              <div className="w-full ">
                <JobList />
              </div>
            </div>
          </div>
        </div>
        {/* cover chart  and pieChart*/}
        <div className="flex flex-col w-1/3 gap-[32px]">
          <div className="w-full">
            <Card className="flex relative h-[130px] items-center bg-blue-500 px-[17px] rounded-lg overflow-hidden w-full max-w-xl">
              <div className="text-white">
                <h2 className="text-[16px] font-bold">
                  Upcoming <br /> Company Event
                </h2>
                <p className="mt-2 text-[12px ]">enjoy with us</p>
              </div>
              <div className="bg-[rgba(255,174,22,1)] w-[calc(50%-10px)] h-full absolute right-0" style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 30% 100%, 0% 50%)' }}></div>
            </Card>
          </div>
          <div className="w-full">
            <PieChartComponent />
          </div>
        </div>
      </div>
    </>
  );
};
export default ChartPage;
