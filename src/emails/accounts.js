const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelkomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "keedice@gmail.com",
    subject: "Thanks for joining in",
    text: `Welkome to the app, ${name}`,
  });
};
const sendUpdateEmail = (email, updates) => {
  sgMail.send({
    to: email,
    from: "keedice@gmail.com",
    subject: "Information updated",
    text: `Your ${updates} was updated`,
  });
};

const sendDeleteEmail = (email, user) => {
  sgMail.send({
    to: email,
    from: "keedice@gmail.com",
    subject: "Account deleted",
    text: `${user}, your account was deleted`,
  });
};
module.exports = { sendWelkomeMail, sendUpdateEmail, sendDeleteEmail };
