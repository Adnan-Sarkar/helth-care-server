import nodemailer from "nodemailer";
import config from "../config";

const emailSender = async (userMail: string, forgotPassLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "adnansarkar111@gmail.com",
      pass: config.APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: '"Helath Care" <adnansarkar111@gmail.com>', // sender address
    to: userMail, // list of receivers
    subject: "Reset Password Link", // Subject line
    text: "This is from Health-Care", // plain text body
    html: forgotPassLink, // html body
  });
};

export default emailSender;
