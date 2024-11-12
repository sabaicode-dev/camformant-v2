import { Document, Schema, model } from "mongoose";

export interface JobOpening extends Document {
    title: string;
    description: string;
    requirements: string;
    location: {
        city: string;
        country: string;
    };
    company_id: string;
    created_at: Date;
    status: 'open' | 'closed';
}

const jobOpeningSchema = new Schema<JobOpening>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    company_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'open' },
});

export const JobOpeningModel = model<JobOpening>('JobOpening', jobOpeningSchema);