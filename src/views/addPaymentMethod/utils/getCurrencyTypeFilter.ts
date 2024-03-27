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
  ],
  latinAmerica: ["ARS", "COP", "PEN", "MXN", "CLP", "PEN", "COP", "CRC", "BRL"],
  africa: ["USD", "XOF", "CDF", "NGN"],
  asia: ["TRY", "CNY", "JPY", "INR", "IDR", "VND", "PHP"],
  other: ["USDT", "SAT", "USD"],
};

export const getCurrencyTypeFilter =
  (type: CurrencyType) => (currency: Currency) =>
    CURRENCY_MAP[type].includes(currency);
