import CommingSoon from "@/components/coming soon/comming-soon";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import React from "react";

const Page = () => {
  return (
    <div>
      <HeaderBasic title="Certificates" nextRoute="/self/portfolio"/>
      <CommingSoon />
    </div>
  );
};

export default Page;
