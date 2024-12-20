import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Jobs } from "@/utils/types/form-type";

interface DescriptionSectionProps {
  formData: Jobs;
  errors: Record<string, string | null>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  formData,
  errors,
  handleChange,
}) => {
  console.log("DescriptionSection -> formData");
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="space-y-2 w-2/4">
          <Label htmlFor="required_experience">Required Experience</Label>
          <Textarea
            id="required_experience"
            name="required_experience"
            value={
              Array.isArray(formData.required_experience)
                ? formData.required_experience.join("\n") // Join array with newlines for display
                : typeof formData.required_experience === "string"
                  ? formData.required_experience // If it's already a string, use it directly
                  : "" // Fallback for null, undefined, or unexpected values
            }
            onChange={handleChange}
            placeholder="Enter required experience"
            className="min-h-[100px] font-medium border focus:border-orange-400 focus:border-none"
          />
          {errors.required_experience && (
            <p className="text-sm text-red-500">{errors.required_experience}</p>
          )}
        </div>
        <div className="space-y-2 w-2/4">
          <Label htmlFor="benefit">Benefits</Label>
          <Textarea
            id="benefit"
            name="benefit"
            value={
              Array.isArray(formData.benefit)
                ? formData.benefit.join("\n") // Join array with newlines for display
                : typeof formData.benefit === "string"
                  ? formData.benefit // If it's already a string, use it directly
                  : "" // Fallback for null, undefined, or unexpected values
            }
            onChange={handleChange}
            placeholder={`Enter each experience on a new line, e.g.:
            3 years of software development
            Familiarity with React and TypeScript
            Experience with REST APIs`}
            className="min-h-[100px] font-medium border focus:border-orange-400 focus:border-none"
          />
          {errors.benefit && (
            <p className="text-sm text-red-500">{errors.benefit}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirement">Requirements</Label>
        <Textarea
          id="requirement"
          name="requirement"
          value={formData.requirement || ""}
          onChange={handleChange}
          placeholder="Enter job requirements"
          className="min-h-[100px] font-medium border focus:border-orange-400 focus:border-none"
        />
        {errors.requirement && (
          <p className="text-sm text-red-500">{errors.requirement}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter job description"
          className="min-h-[100px] border focus:border-orange-400 font-medium "
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;
