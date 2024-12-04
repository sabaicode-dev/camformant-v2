import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { JobApplication, StatusDate } from "@/utils/types/job"
import { getStatusVariant } from "@/utils/getStatusVariant"
import { ScrollArea } from "../ui/scroll-area"

interface ViewApplicationProps {
  application: JobApplication
  status?: StatusDate["status"]
}

const cv = {
  contactInfo: {
    name: "Mab Sothea",
    phone: "+855 123 456 789",
    email: "mabsothea@example.com",
    address: "Phnom Penh, Cambodia",
    website: "www.mabsothea.com"
  },
  experience: [
    {
      title: "Web Developer",
      company: "SBK University",
      location: "Phnom Penh, Cambodia",
      duration: "2023 - January 15, 2024",
      responsibilities: [
        "Developed and maintained web applications.",
        "Worked with the team to design and implement new features.",
        "Collaborated with designers for UI/UX improvements."
      ]
    },
    {
      title: "Part-time Teacher in Information Technologies",
      company: "SBK University",
      location: "Phnom Penh, Cambodia",
      duration: "February 1, 2024 - May 25, 2024",
      responsibilities: [
        "Taught C++, ReactJS, Node Express, Java, and Adobe Photoshop.",
        "Created educational materials and assessments.",
        "Provided one-on-one assistance to students."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "SBK University",
      location: "Phnom Penh, Cambodia",
      graduationYear: 2023
    }
  ],
  skills: [
    "Full Stack Development",
    "UI/UX Design",
    "JavaScript, React, Node.js",
    "Python, C++, Java",
    "AWS, MongoDB, SQL"
  ],
  certifications: [
    {
      name: "Full Stack Development Bootcamp",
      institution: "XYZ Bootcamp",
      year: 2023
    }
  ],
  languages: [
    "English (Fluent)",
    "Khmer (Native)"
  ],
  projects: [
    {
      title: "Data Visualization System",
      description: "A project to visualize property data with real-time updates and filters.",
      toolsUsed: ["React", "Django", "MongoDB", "Pandas"]
    }
  ],
  interests: [
    "Football",
    "Tennis",
    "Volleyball"
  ]
};



export function ViewApplication({ application , status }: ViewApplicationProps) {
  const variant = status ? getStatusVariant(status) : "default";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-slate-50 h-full overflow-y-auto ">
        <ScrollArea>

        <DialogHeader >
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            View applicant information and CV
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className={""}>Applicant Info</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="h-full overscroll-y-auto">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Image src={application?.userInfo?.profile || ""} alt={application?.userInfo?.profile || ""} className={"w-20 h-20 rounded-full object-fill"} width={100} height={100}/>
                <div className="flex flex-col">
                  <CardTitle>{application?.userInfo?.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>{application?.jobInfo?.title}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 h-full">
                <div className="grid grid-cols-2 gap-4">
                  <div>
					<div>
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 ml-5">
                      <p className="text-[12px] list-item">Email: <span className="text-gray-500"> {cv.contactInfo.email}</span></p>
                      <p className="text-[12px] list-item">Phone: <span className="text-gray-500"> {cv.contactInfo.phone}</span></p>
                      <p className="text-[12px] list-item">Address: <span className="text-gray-500"> {cv.contactInfo.address}</span></p>
                      <p className="text-[12px] list-item">Website: <span className="text-gray-500"> {cv.contactInfo.website}</span></p>
                    </div>
					</div>
					<div>
                  <h4 className="text-sm font-medium mb-2">Experience</h4>
                  <div className="space-y-2 ml-5">
                        {cv.experience.map((exp, index) => (
                          <div key={index} className="space-y-2">
                            <p className="text-[12px] font-medium">{exp.title}</p>
                            <p className="text-[12px] list-item">{exp.company} ({exp.location})</p>
                            <p className="text-[12px] list-item">{exp.duration}</p>
                            <ul className="list-disc ml-5">
                              {exp.responsibilities.map((resp, index) => (
                                <li key={index} className="text-[12px] list-none"> - {resp}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Education</h4>
                  {/* <p className="text-[12px]">{application?.education}</p> */}
				  <div className="space-y-2 ml-5">
					{cv.education.map((edu, index) => (
					  <div key={index} className="space-y-2">
						<p className="text-[12px] font-medium">{edu.degree}</p>
						<p className="text-[12px] list-item">{edu.institution} ({edu.location})</p>
						<p className="text-[12px] list-item">Graduated: {edu.graduationYear}</p>
					  </div>
					))}
                </div>
                </div>

                  </div>

                  <div>

                    <h4 className="text-sm font-medium mb-2">Application Details</h4>
                    <div className="space-y-2">
                      {/* <p className="text-sm">Applied: {application?.appliedOn}</p> */}
                    <Badge variant={variant}>{status}</Badge>
                    </div>
                  </div>

                </div>

               
				
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cv">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <iframe
                    src={application?.userInfo?.cv || ""}
                    className="w-full h-full"
                    title={`${application?.userInfo?.name}'s CV`}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}