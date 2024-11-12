// src/models/CorporateProfile.ts
import mongoose from "mongoose";

export interface ICorporateProfile {
    _id?: string
    company_name?: string;
    profile?: string;
    location?: {
        address?: string;
        city?: string;
        country?: string;
    };
    contact?: {
        email?: string;
        phone_number?: string;
        website?: string;
    };
    description?: string;
    social_links?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
    industry?: string;
    employee_count?: number;
    job_openings_count?: number;
    job_closings_count?: number;
    timestamps?: {
        created_at?: Date;
        updated_at?: Date;
    };
}

// Create the schema
const CorporateProfileSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    profile: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        address: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        }
    },
    contact: {
        email: {
            type: String,
            required: true,
            trim: true,
            match: [/.+@.+\..+/, 'Please fill a valid email address']
        },
        phone_number: {
            type: String,
            required: true,
            trim: true
        },
        website: {
            type: String,
            required: true,
            trim: true
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    social_links: {
        linkedin: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        }
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    employee_count: {
        type: Number,
        required: true
    },
    job_openings_count: {
        type: Number,
        required: true
    },
    job_closings_count: {
        type: Number,
        required: true
    },
    timestamps: {
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: {
        createdAt: 'timestamps.created_at',
        updatedAt: 'timestamps.updated_at'
    }
});

const CorporateProfileModel = mongoose.model<ICorporateProfile>("CorporateProfile", CorporateProfileSchema);
export default CorporateProfileModel;
