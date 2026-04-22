import { describe, expect, test } from "@jest/globals";
type CurrencyKey =
  | "IN"
  | "US"
  | "GB"
  | "DE"
  | "JP"
  | "CA"
  | "AU"
  | "SG"
  | "AE"
  | "ZA";
import {
  getCurrencyMeta,
  convertToDisplayAmount,
  convertToBaseAmount,
} from "./currency";

type CurrencyMeta = {
  key: CurrencyKey;
  country: string;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  rateToINR: number;
};

const currencyDirectory: CurrencyMeta[] = [
  {
    key: "IN",
    country: "India",
    currencySymbol: "₹",
    currencyCode: "INR",
    locale: "en-IN",
    rateToINR: 1,
  },
  {
    key: "US",
    country: "United States",
    currencySymbol: "$",
    currencyCode: "USD",
    locale: "en-US",
    rateToINR: 83,
  },
  {
    key: "GB",
    country: "United Kingdom",
    currencySymbol: "£",
    currencyCode: "GBP",
    locale: "en-GB",
    rateToINR: 105,
  },
  {
    key: "DE",
    country: "Germany",
    currencySymbol: "€",
    currencyCode: "EUR",
    locale: "de-DE",
    rateToINR: 90,
  },
  {
    key: "JP",
    country: "Japan",
    currencySymbol: "¥",
    currencyCode: "JPY",
    locale: "ja-JP",
    rateToINR: 0.55,
  },
  {
    key: "CA",
    country: "Canada",
    currencySymbol: "$",
    currencyCode: "CAD",
    locale: "en-CA",
    rateToINR: 61,
  },
  {
    key: "AU",
    country: "Australia",
    currencySymbol: "$",
    currencyCode: "AUD",
    locale: "en-AU",
    rateToINR: 55,
  },
  {
    key: "SG",
    country: "Singapore",
    currencySymbol: "$",
    currencyCode: "SGD",
    locale: "en-SG",
    rateToINR: 62,
  },
  {
    key: "AE",
    country: "United Arab Emirates",
    currencySymbol: "د.إ",
    currencyCode: "AED",
    locale: "ar-AE",
    rateToINR: 22.7,
  },
  {
    key: "ZA",
    country: "South Africa",
    currencySymbol: "R",
    currencyCode: "ZAR",
    locale: "en-ZA",
    rateToINR: 4.5,
  },
];

const key = "US";
let result = currencyDirectory.find((i) => i.key === key);
describe("currency meta", () => {
  test("gives currency meta ", () => {
    expect(getCurrencyMeta(key)).toStrictEqual(result);
  });
});

const amount = 12500;
const displayAmountResult = () => {
  const meta =
    currencyDirectory.find((i) => i.key === key) ?? currencyDirectory[0];
  return amount / meta.rateToINR;
};
describe("converts to display amount", () => {
  test("check if it converts amount to localCurrency key", () => {
    expect(convertToDisplayAmount(amount, key)).toStrictEqual(
      displayAmountResult(),
    );
  });
});

describe("base amount converts to fallback currency ", () => {
  test("returns amount in INR for unknown key", () => {
    const fallback = convertToBaseAmount(0);
    expect(fallback).toBe(0);
  });
});

describe("currency meta fallback", () => {
  test("returns INR metadata for unknown key", () => {
    const fallback = getCurrencyMeta("XX");
    expect(fallback.key).toBe("IN");
    expect(fallback.currencyCode).toBe("INR");
  });
});
