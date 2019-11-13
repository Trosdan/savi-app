import { fetchData } from "../storage";

export const handleEmail = (verificationCode, destination) => {
  fetch("https://api.sendgrid.com/v3/mail/send", {
    body: JSON.stringify({
      personalizations: [{ to: [{ email: destination }] }],
      from: { email: "no-reply@savi.com" },
      subject: `Seu código de verificação é ${verificationCode}`,
      content: [
        { type: "text/plain", value: "Não compartilhe seu código com ninguém." }
      ]
    }),
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json"
    },
    method: "POST"
  })
    .then(response => {
      console.log(response);
    })
    .catch(console.error);
};

export const sendEmail = (code, destination) => {
  console.log('email enviado!')
  // return fetch("https://parseapi.back4app.com/functions/email", {
  //   body: `{\"destination\":\"${destination}\", \"verificationCode\":\"${code}\", \"lang\":\"spanish\"}`,
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-Parse-Application-Id": "47RAnYvxm7rWLUTUZYHt9SItJjd9FnmWj5ZK5g92",
  //     "X-Parse-Rest-Api-Key": "ZMbHFNcQ1Rvh7bIpoctydiF9yRtZDrnJ81pzhtdF"
  //   },
  //   method: "POST"
  // });
};
