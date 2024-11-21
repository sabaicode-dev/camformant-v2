"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";
import { GrFormNextLink } from "react-icons/gr";
import { useParams, useRouter } from "next/navigation";
import Background from "@/components/background/background";
import { BackButton_md } from "@/components/back/BackButton";
import { CardApply } from "@/components/card-detail/card-apply";
import { CardReq } from "@/components/card-detail/card-requirement";
import { CardDescription } from "@/components/card-detail/card-description";
import { CardLocation } from "@/components/card-detail/card-location";
import { JobPublisher } from "@/components/card-detail/card-publisher";
import axios from "axios";
import { BsPersonVcard } from "react-icons/bs";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import { MdMessage } from "react-icons/md";
import { useAuth } from "@/context/auth";

const Page: React.FC = () => {
  const { user } = useAuth();
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [jobData, setJobData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apply, setApply] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [cv, setCV] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const [getIndexCv, setIndexCv] = useState<number>(0);

  // Fetch Job Detail
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}/${id}`);
        if (response.status === 200 && response.data.data) {
          const job = response.data.data;
          console.log("job after fetch:::", job);

          job.createdAt = new Date(job.createdAt);
          setJobData([job]);
          setLoading(false);
        } else {
          setError("Job not found");
          setLoading(false);
        }
      } catch (error) {
        setError("Failed to fetch job data");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const storedCvIndex = localStorage.getItem("selectedCvIndex");
    if (storedCvIndex) {
      setIndexCv(Number(storedCvIndex));
    }
  }, []);

  useEffect(() => {
    async function getUserProfileAndCV() {
      try {
        setNext(true);

        const cv = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/user/cv/`
        );

        setCV(true);
      } catch (error) {
      } finally {
        setNext(false);
      }
    }
    getUserProfileAndCV();
  }, [user]);

  function popUpApply() {
    setApply(true);
    if (!user) {
      router.push("/register");
    } else if (!cv) {
      router.push("/resume");
    }
  }

  async function handleConfirm() {
    if (selected) {
      try {
        // Post data when selected is true
        const data = {
          jobId: id,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/user/apply/?apply=${getIndexCv}`,
          data
        );
        if (response.status === 200) {
          console.log("Application submitted successfully");
          setTimeout(() => {
            router.push("/applied");
          }, 600);
        } else {
          console.log("CV not Found");
          setIndexCv(0);
          localStorage.setItem("selectedCvIndex", "0");
        }
      } catch (error) {
        alert("Application Error ");
      } finally {
        setApply(false);
      }
    }
  }

  function handleSelectCv(e: any) {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent
    setSelected(!selected);
  }

  return (
    <div className="flex flex-col w-full h-full pb-28 ">
      <Link href={"../home"}>
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-5 left-4 " />
      </Link>
      <Background style="bg-mybg-image h-[250px] ">
        <div className=" w-full px-4 mt-[-97px] z-10 ">
          {jobData.map((x) => (
            <CardApply
              key={x?._id}
              name={x?.companyId?.name}
              location={x?.companyId?.location}
              deadline={x?.deadline}
              job_opening={x?.job_opening}
              profile={x?.companyId?.profile}
              createdAt={x?.createdAt}
            />
          ))}
        </div>
      </Background>
      <div className="container pt-4">
        {!loading &&
          !error &&
          jobData.map((x) => (
            <CardDescription
              key={x?._id}
              title={x?.title}
              description={x?.description}
              min_salary={x?.min_salary}
              max_salary={x?.max_salary}
              schedule={x?.schedule}
              benefit={x?.benefit}
            />
          ))}
      </div>
      <div className="container pt-4">
        {jobData.map((x) => (
          <CardReq key={x._id} required_experience={x?.required_experience} />
        ))}
      </div>
      <div
        className={` ${apply ? " pointer-events-none " : ""} container pt-4`}
      >
        {jobData.map((x) => (
          <CardLocation key={x._id} address={x.address} />
        ))}
      </div>
      <div className="container pt-4">
        {jobData.map((x) => (
          <JobPublisher
            key={x._id}
            profile={x?.companyId?.profile}
            name={x?.companyId?.name}
            bio={x?.companyId?.bio}
            phone_number={x?.companyId?.phone_number}
            email={x?.companyId?.email}
          />
        ))}
      </div>

      <div className="fixed bottom-0 z-30 flex items-center justify-center w-full h-20 gap-3 pl-5 pr-5 bg-white ">
        <button
          onClick={popUpApply}
          className={` ${next ? "bg-gray-400 pointer-events-none " : "bg-primaryCam"} p-3 w-full rounded-3xl text-white`}
        >
          Apply Now
        </button>
        <span className="p-3 text-xl bg-white text-primaryCam drop-shadow-2xl rounded-2xl">
          <Link
            href={`/chat/${jobData[0]?.companyId! ? jobData[0].companyId._id : ""}`}
          >
            <MdMessage />
          </Link>
        </span>
      </div>

      <Sheet
        isOpen={apply}
        onClose={() => setApply(false)}
        onCloseEnd={() => setSelected(false)}
        snapPoints={[450, 400, 0]}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="flex flex-col items-center justify-center w-full gap-5 pl-5 pr-5 h-ful ">
              <p className="w-full pl-5 text-gray-400 ">
                Please select for apply{" "}
              </p>
              <div
                onClick={handleSelectCv}
                className={` ${user ? "flex" : " hidden"} h-20 pl-5 w-full flex rounded-3xl
                             items-center
                               drop-shadow-xl ${selected ? "bg-orange-500" : "bg-white"} `}
              >
                <h1 className="flex items-center gap-5">
                  {" "}
                  <span
                    className={`${selected ? "text-black" : "text-primaryCam  "} text-2xl `}
                  >
                    <BsPersonVcard />
                  </span>{" "}
                  Your CV Default {getIndexCv + 1}{" "}
                </h1>
              </div>
              <Link
                href={"/cv"}
                className="flex items-center w-full h-20 pl-5 bg-white rounded-3xl drop-shadow-xl "
              >
                <h1>Attached CV </h1>
              </Link>
              <button
                onClick={() => handleConfirm()}
                className={`p-5 flex rounded-3xl text-white justify-center 
                            gap-5 items-center ${selected ? "bg-orange-500" : "bg-orange-200"}  w-48`}
              >
                Confirm{" "}
                <span className="text-2xl">
                  <GrFormNextLink />
                </span>{" "}
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};

export default Page;
