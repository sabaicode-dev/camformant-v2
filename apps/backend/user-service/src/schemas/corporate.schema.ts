import Joi from "joi";

const corporateJoiSchema = Joi.object({
  sub: Joi.string().required(),
  name: Joi.string().required(), // Username is a required string
  email: Joi.string().email(), // Email must be a valid email if provided
  role: Joi.string(),
  profile: Joi.string(),
  phone_number: Joi.string(),
}).xor("email"); // Either email or phone_number must be present

export default corporateJoiSchema;
