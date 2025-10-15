const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const nodemailer = require("nodemailer");

  // Tạo transporter (thiết lập Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // email của bạn
      pass: process.env.EMAIL_PASS, // mật khẩu ứng dụng (App Password)
    },
  });

  // Cấu hình nội dung email
  const mailOptions = {
    from: process.env.EMAIL_USER, // người gửi
    to: email, // người nhận
    subject: subject, // tiêu đề
    html: html, // nội dung
  };

  // Gửi email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // làm gì đó sau khi gửi thành công
    }
  });
};
