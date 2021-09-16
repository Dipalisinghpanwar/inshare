const nodemailer = require('nodemailer');

async function sendMail ({ from, to, subject, text, html }) {
  
  //nodemailer configuration
  let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
          user: process.env.MAIL_USER,   // generated ethereal user
          pass: process.env.MAIL_PASS    // generated ethereal password
      }
  });

  // mail send
  let info = await transporter.sendMail({
       from: `inShare <${from}>`,   // sender address
       to,                          // list of receivers
       subject,
       text,
       html
  });

  console.log(info)
}



module.exports = sendMail;