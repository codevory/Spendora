import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

/**
  Safely traverses and updates a target nested property if it's a string.
 */
const mutateNestedField = (obj, path, transformFn) => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current || typeof current !== "object") return;
    current = current[keys[i]];
  }

  const lastKey = keys[keys.length - 1];
  if (current && typeof current[lastKey] === "string") {
    current[lastKey] = transformFn(current[lastKey]);
  }
};

export const sanitizeInputFields = (fieldsToSanitize = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === "object") {
      fieldsToSanitize.forEach((path) => {
        mutateNestedField(req.body, path, (val) => purify.sanitize(val.trim()));
      });
    }

    return next();
  };
};
