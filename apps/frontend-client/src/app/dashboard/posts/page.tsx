"use client";
import React from "react";
// import InputForm from "@/components/input-job";
import JobForm from "@/components/jobs/job-form";


const PostPage = () => {
  return (
    <>
      {/* <InputForm formTitle="post job"/> */}
      <JobForm formTitle="Jobs" typeOfForm="POST"/>
    </>
  );
};

export default PostPage;
