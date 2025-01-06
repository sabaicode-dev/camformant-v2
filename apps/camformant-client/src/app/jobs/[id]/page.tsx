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
import { BsPersonVcard } from "react-icons/bs";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import { MdMessage } from "react-icons/md";
import { useAuth } from "@/context/auth";
import SkeletonLoader from "@/components/cv-rating-card/router-page/basic/skeleton";
import { useNotification } from "@/hooks/user-notification";

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
  const [cv, setCV] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const { addNotification, NotificationDisplay } = useNotification();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}/${id}`);
        if (response.status === 200 && response.data.data) {
          const job = response.data.data;
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
    async function getUserProfileAndCV() {
      try {
        setNext(true);
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}?category=cv`
        );

        setCV(response.data.data.cv);
      } catch (error) {
      } finally {
        setNext(false);
      }
    }
    getUserProfileAndCV();
  }, [user]);

  function popUpApply() {
    if (!user) {
      router.push("/register");
    }
    setApply(true);
  }

  async function handleConfirm() {
    if (selected) {
      try {
        const data = {
          userId: user?._id,
          jobId: id,
          companyId: jobData[0].companyId,
          userInfo: {
            name: user?.username,
            profile: user?.profile,
            status: "Apply",
            cv: cv,
          },
        };
        const response = await axiosInstance.post(
          API_ENDPOINTS.JOB_APPLY,
          data
        );
        if (response.status === 200) {
          addNotification("You apply successfully", "success");
        }
      } catch (error) {
        console.log("error in apply ", error);
        addNotification("Application error", "error");
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
      <NotificationDisplay />
      <div onClick={() => router.back()}>
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-5 left-4 " />
      </div>
      <Background style="bg-mybg-image h-[250px] ">
        <div className=" w-full px-4 mt-[-97px] z-10 ">
          {jobData.map((x) => (
            <CardApply
              key={x?._id}
              name={x?.company?.name}
              location={x?.company?.address}
              deadline={x?.deadline}
              job_opening={x?.job_opening}
              profile={x?.company?.profile}
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
            profile={x?.company?.profile}
            name={x?.company?.name}
            bio={x?.company?.description}
            phone_number={x?.company?.contact?.phone_number}
            email={x?.company?.email}
          />
        ))}
      </div>

      <div className="fixed bottom-0 z-30 flex items-center justify-center w-full h-20 gap-3 pl-5 pr-5 bg-white ">
        <button
          onClick={popUpApply}
          className={` ${
            next ? "bg-gray-400 pointer-events-none " : "bg-primaryCam"
          } p-3 w-full rounded-3xl text-white`}
        >
          Apply Now
        </button>
        <span className="p-3 text-xl bg-white text-primaryCam drop-shadow-2xl rounded-2xl">
          <Link
            href={`/chat/${jobData[0]?.company ? jobData[0].company._id : ""}`}
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
            <div className="flex flex-col items-center justify-center w-full gap-5 pl-5 pr-5">
              <p className="w-full pl-5 text-gray-400 ">
                Please select for apply{" "}
              </p>
              {next && <SkeletonLoader text="loading..." />}
              {cv && (
                <div
                  onClick={handleSelectCv}
                  className={` ${
                    user ? "flex" : " hidden"
                  } h-20 pl-5 w-full flex rounded-3xl
                             items-center
                               drop-shadow-xl ${
                                 selected ? "bg-orange-500" : "bg-white"
                               } `}
                >
                  <h1 className="flex items-center gap-5">
                    {" "}
                    <span
                      className={`${
                        selected ? "text-black" : "text-primaryCam  "
                      } text-2xl `}
                    >
                      <BsPersonVcard />
                    </span>{" "}
                    Your CV Default
                  </h1>
                </div>
              )}
              <Link
                href={"/cv"}
                className="flex items-center w-full h-20 pl-5 bg-white rounded-3xl drop-shadow-xl "
              >
                <h1>Attached CV </h1>
              </Link>
              <button
                onClick={() => handleConfirm()}
                className={`p-5 flex rounded-3xl text-white justify-center 
                            gap-5 items-center ${
                              selected ? "bg-orange-500" : "bg-orange-200"
                            }  w-48`}
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
