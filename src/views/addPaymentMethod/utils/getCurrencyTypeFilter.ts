import { CurrencyType } from "../../../store/offerPreferenes/types";

const CURRENCY_MAP: Record<CurrencyType, Currency[]> = {
  europe: [
    "EUR",
    "CHF",
    "GBP",
    "SEK",
    "DKK",
    "BGN",
    "CZK",
    "HUF",
    "PLN",
    "RON",
    "ISK",
    "NOK",
    "TRY",
    "DKK",
    "UAH",
  ],
  latinAmerica: [
    "ARS",
    "COP",
    "PEN",
    "MXN",
    "CLP",
    "PEN",
    "COP",
    "CRC",
    "BRL",
    "USD",
    "GTQ",
    "PAB",
    "HNL",
    "DOP",
    "CUP",
    "NIO",
    "PYG",
    "UYU",
    "VES",
    "BOB",
  ],
  africa: [
    "USD",
    "XOF",
    "CDF",
    "NGN",
    "ZAR",
    "KES",
    "GHS",
    "TZS",
    "MAD",
    "RWF",
    "XAF",
    "MGA",
    "GNF",
    "EGP",
  ],
  asia: [
    "TRY",
    "CNY",
    "JPY",
    "INR",
    "IDR",
    "VND",
    "PHP",
    "UZS",
    "RSD",
    "KZT",
    "KWD",
    "ILS",
    "PHP",
    "RUB",
  ],
  other: ["USDT", "SAT", "USD", "NZD", "AUD", "XAU"],
};

export const getCurrencyTypeFilter =
  (type: CurrencyType) => (currency: Currency) =>
    CURRENCY_MAP[type].includes(currency);
