export interface InterviewEvent {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  jobType:string;
  interviewDate?: Date;
  interviewLocation?: string;
  status?: string;
}

export interface JobApply {
  _id: string;
  candidateName?: string;
  interviewDate?: Date;
  interviewLocation?: string;
  status?: string;
}
