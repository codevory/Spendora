import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import lusca from "lusca";
import { is_Production } from "../db/getBDConnection.js";

export const csrfProtection = [
  cookieParser(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  lusca.csrf({
    cookie: {
      name: "_csrf",
      httpOnly: is_Production ? true : false,
      path: "/",
    },
  }),
];
