const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEYS);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "bilal.soft000@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcom to the app, ${name}. Let me know how you get along with the app`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "bilal.soft000@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
