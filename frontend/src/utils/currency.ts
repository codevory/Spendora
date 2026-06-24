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

type CurrencyMeta = {
  key: CurrencyKey;
  country: string;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  rateToINR: number;
};

const currencyDirectory: CurrencyMeta[] = getUserOriginList();

const fallbackCurrency = currencyDirectory[0];

export function getCurrencyMeta(key?: string) {
  return currencyDirectory.find((item) => item.key === key) ?? fallbackCurrency;
}

export function convertToDisplayAmount(amount: number, currencyKey?: string) {
  const meta = getCurrencyMeta(currencyKey);
  return amount / meta.rateToINR;
}

export function convertToBaseAmount(amount: number, currencyKey?: string) {
  const meta = getCurrencyMeta(currencyKey);
  return amount * meta.rateToINR;
}

export function formatCurrency(amount: number, currencyKey?: string) {
  const meta = getCurrencyMeta(currencyKey);
  const displayAmount = convertToDisplayAmount(amount, currencyKey);

  const formatted = new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  }).format(displayAmount);
  return formatted;
}

export function getUserOriginList() {
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
  return currencyDirectory;
}
