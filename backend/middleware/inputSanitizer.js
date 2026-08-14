import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const mutateNestedField = (obj, path, transformFn) => {
  const keys = path.split(".");

  const traverse = (current, index) => {
    if (!current || typeof current !== "object") return;

    const key = keys[index];
    if (FORBIDDEN_KEYS.has(key)) return;

    if (index == keys.length - 1) {
      if (typeof current[key] == "string") {
        current[key] = transformFn(current[key]);
      }
      return;
    }

    traverse(current[key], index + 1);
  };
  traverse(obj, 0);
};

export const sanitizeInput = (fieldsToSanitize = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
      fieldsToSanitize.forEach((path) => {
        mutateNestedField(req.body, path, (val) => purify.sanitize(val.trim()));
      });
    }
    return next();
  };
};
