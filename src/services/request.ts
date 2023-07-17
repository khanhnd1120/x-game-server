import axios from "axios";
// @ts-ignore
import { requestContext } from "fastify-request-context";

export default () => {
  const customerAuth = requestContext.get("customerAuth");
  if (customerAuth) {
    return axios.create({
      headers: {
        auth: JSON.stringify(customerAuth),
      },
    });
  }
  return axios;
};
