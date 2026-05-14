export async function getOriginKey(country) {
  const keys = {
    india: "IN",
    "United States Of America": "USA",
    "United Kingdom": "UK",
    "United Arab Emirates": "UAE",
    Pakistan: "PAK",
    Bangladesh: "BD",
  };
  if (country) {
    return keys[country];
  }
  return "Unknown";
}
