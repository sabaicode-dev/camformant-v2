import crypto from "crypto";

export const generateRoomId = (userId: string, companyId: string) => {
  const hash = crypto.createHash("sha256");

  hash.update(userId + companyId);
  return hash.digest("hex");
};
export const TextEnc = (text: string) => {
  //encode
  const encode = Buffer.from(text, "utf-8").toString("base64");

  //decode
  const decode = Buffer.from(encode, "base64").toString("utf-8");

  return {
    encode: encode,
    decode: decode,
  };
};

export const enCodeText = (text: string) => {
  const encode = Buffer.from(text, "utf-8").toString("base64");
  return encode;
};
export const deCodeText = (encode: string) => {
  const decode = Buffer.from(encode, "base64").toString("utf-8");
  return decode;
};
