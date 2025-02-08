import {MailtrapClient} from "mailtrap";
const TOKEN = "b8f1d85aaaa176272881e7bd0b73d05c";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Imad",
};
/*const recipients = [
  {
    email: "imadeddineourak@gmail.com",
  }
];*/
