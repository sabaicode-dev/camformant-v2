import { IJob } from "@/components/type-data/TypeofData";

export enum StatusMode {
  APPLY = "Apply",
  REVIEW = "Review",
  SHORTLIST = "Shortlist",
  INTERVIEW = "Interview",
  Accept = "Accept",
}
interface ApplyUserInfoParams {
  name: string;
  profile: string;
  status: StatusMode;
}
interface ApplyCompanyResParams {
  interviewDate: Date;
  interviewLocation: string;
  startDate: Date;
}

export interface ApplyParams {
  _id: string;
  jobId: string;
  userId: string;
  companyId:string
  userInfo: ApplyUserInfoParams;
  companyResponse: ApplyCompanyResParams;
  appliedDate: Date;
  statusDate:{ [key in StatusMode]?: Date }
  jobInfo: IJob;
}

export interface StatusLengthParams {
  Apply: number;
  Shortlist: number;
  Interview: number;
  Review:number,
  Accept:number
}
export type StatusType = "Apply" | "Shortlist" | "Interview"|"Review"|"Accept";
