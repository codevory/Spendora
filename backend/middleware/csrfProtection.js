import lusca from "lusca";
import { is_Production } from "../db/getBDConnection.js";

export const csrfProtection = lusca.csrf({
  key: "_csrf",
  secret: "_csrfSecret",
  cookie: {
    name: "_csrf",
    options: {
      httpOnly: true,
      secure: is_Production,
      sameSite: is_Production ? "none" : "lax", // Must be lowercase "none" when secure: true
    },
  },
});
