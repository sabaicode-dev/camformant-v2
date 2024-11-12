import Joi from "joi";


const corporateJoiSchema = Joi.object({
    sub: Joi.string(),
    username: Joi.string().required(), // Username is a required string
    email: Joi.string().email(), // Email must be a valid email if provided
    profile: Joi.string(),
    corporateProfileId: Joi.string(),
    phone_number: Joi.string(),
    role: Joi.string()
}).xor('email'); // Either email or phone_number must be present

export default corporateJoiSchema;
