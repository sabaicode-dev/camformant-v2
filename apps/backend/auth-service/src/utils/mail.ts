import configs from "../config";

import nodemailer, { SentMessageInfo } from "nodemailer";
export const sendMail = (userEmail: string) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: configs.gmailUser, // Your Gmail email address
      pass: configs.gmailAppPassowrd, // The App Password you generated
    },
  });
  // Email data
  let mailOptions = {
    from: {
      name: "Camformant-Admin",
      address: configs.gmailUser,
    },
    to: userEmail,
    subject: "Camfomant-Account Verification",
    text: "Thank you! You can login now",
    html: `<p>Thank you! You can login now</p>`,
  };

  // Send the email
  transporter.sendMail(
    mailOptions,
    (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Email sent: %s", info.messageId);
    }
  );
};
