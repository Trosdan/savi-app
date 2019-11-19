import { fetchData } from "../storage";

export const sendEmail = (code, destination) => {
  console.log('email enviado!')
  // return fetch("https://parseapi.back4app.com/functions/email", {
  //   body: `{\"destination\":\"${destination}\", \"verificationCode\":\"${code}\", \"lang\":\"spanish\"}`,
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-Parse-Application-Id": "",
  //     "X-Parse-Rest-Api-Key": ""
  //   },
  //   method: "POST"
  // });
};
