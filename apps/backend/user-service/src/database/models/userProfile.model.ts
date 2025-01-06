// import mongoose from "mongoose";

import mongoose from "mongoose";

// //Basic schema
const BasicSchema = new mongoose.Schema(
  {
    surname: { type: String },
    lastname: { type: String },
    career: { type: String },
    email: { type: String },
    dob: { type: String },
    address: { type: String },
    phonenumber: { type: String },
    martial: { type: String },
  },
  {
    _id: false,
  }
);

// //Skill schema
const SkillSchema = new mongoose.Schema(
  {
    name: { type: String },
    percent: { type: Number },
  },
  {
    _id: false,
  }
);

// //Expertise schema
const ExpertiseSchema = new mongoose.Schema(
  {
    name: { type: String },
    proficiency: { type: String },
  },
  {
    _id: false,
  }
);

// //Education schema
const EducationSchema = new mongoose.Schema(
  {
    academic: { type: String },
    school: { type: String },
    major: { type: String },
    year: { type: String },
  },
  {
    _id: false,
  }
);

// //Experience schema
const ExperienceSchema = new mongoose.Schema(
  {
    position: { type: String },
    company: { type: String },
    year: { type: String },
    description: { type: String },
  },
  {
    _id: false,
  }
);

// //Language schema
const LanguageSchema = new mongoose.Schema(
  {
    name: { type: String },
    proficiency: { type: String },
  },
  {
    _id: false,
  }
);

// //Reference schema
const ReferenceSchema = new mongoose.Schema(
  {
    name: { type: String },
    career: { type: String },
    company: { type: String },
    email: { type: String },
    phonenumber: { type: String },
  },
  {
    _id: false,
  }
);

// //Description schema (currently empty, customize as needed)
const DescriptionSchema = new mongoose.Schema(
  {
    description: { type: String },
    strength: { type: String },
  },
  {
    _id: false,
  }
);
const Portfoliochema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  {
    _id: false,
  }
);
const CertificateSchema = new mongoose.Schema(
  {
    url: { type: String },
  },
  {
    _id: false,
  }
);

// //IUserProfile schema
const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    basic: { type: BasicSchema },
    skills: { type: [SkillSchema] },
    expertise: { type: [ExpertiseSchema] },
    educations: { type: [EducationSchema] },
    experiences: { type: [ExperienceSchema] },
    languages: { type: [LanguageSchema] },
    references: { type: [ReferenceSchema] },
    descriptions: { type: DescriptionSchema },
    portfolio: { type: [Portfoliochema] },
    certificates: { type: [CertificateSchema] },
    cv: { type: String },
  },
  {
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
      },
    },
  }
);

// //model
const UserProfileDetailModel = mongoose.model(
  "UserProfileDetail",
  UserProfileSchema,
  "UserProfileDetail"
);

export default UserProfileDetailModel;
