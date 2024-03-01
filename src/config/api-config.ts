import path from "path";
const ApiConfig = {
  JWT_SECRET: "secret",
  JWT_EXPIRE: 365 * 24 * 3600, //second
  FOLDER: {
    PUBLIC: path.join(__dirname, "../../public"),
  },
  MAX_LIMIT: 1000,
};

export default ApiConfig;
