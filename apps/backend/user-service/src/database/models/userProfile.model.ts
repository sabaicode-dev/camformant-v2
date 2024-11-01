import mongoose from "mongoose";

//Basic schema
const BasicSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  lastname: { type: String, required: true },
  career: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  phonenumber: { type: String, required: true },
  martial: { type: String }, // Optional field
},
{
  _id:false
});

//Skill schema
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percent: { type: Number, required: true },
},
{
  _id:false
});

//Expertise schema
const ExpertiseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
},
{
  _id:false
});

//Education schema
const EducationSchema = new mongoose.Schema({
  academic: { type: String, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  year: { type: String }, // Optional field
},
{
  _id:false
});

//Experience schema
const ExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  year: { type: String }, // Optional field
  description: { type: String }, // Optional field
},
{
  _id:false
});

//Language schema
const LanguageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
}
,
{
  _id:false
});

//Reference schema
const ReferenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  career: { type: String, required: true },
  company:{type: String},
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
},
{
  _id:false
});

//Description schema (currently empty, customize as needed)
const DescriptionSchema = new mongoose.Schema({
  description: { type: String },
  strength: { type: String },
},
{
  _id:false
}
);
const Portfoliochema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
},
{
  _id:false
}
);
const CertificateSchema = new mongoose.Schema(
  {
    url:{type:String}
  },
  {
    _id:false
  }
)

//IUserProfile schema
const UserProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    basic: { type: BasicSchema, required: false },
    skills: { type: [SkillSchema]},
    expertise: { type: [ExpertiseSchema]},
    educations: { type: [EducationSchema]},
    experiences: { type: [ExperienceSchema]},
    languages: { type: [LanguageSchema] },
    references: { type: [ReferenceSchema]},
    descriptions: { type: DescriptionSchema, required: false },
    portfolio: { type: [Portfoliochema]},
    certificates:{type:[CertificateSchema], required: false}
  },
  {
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      },
    },
  }
);

//model
const UserProfileDetailModel = mongoose.model(
  "UserProfileDetail",
  UserProfileSchema,
  "UserProfileDetail"
);

export default UserProfileDetailModel;
