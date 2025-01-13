import nodemailer from "nodemailer";

export async function sendMail(
  subject: string,
  toEmail: string,
  otpText: string
) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: toEmail,
      subject: subject,
      html: otpText,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email Sent:", info.response);
        resolve(info.response);
      }
    });
  });
}
