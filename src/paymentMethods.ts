import { uniqueArray } from "./utils/array/uniqueArray";
import { isCashTrade } from "./utils/paymentMethod/isCashTrade";
import { Currency } from "../peach-api/src/@types/global";
import { PaymentMethod } from "../peach-api/src/@types/payment";

export let CURRENCIES: Currency[] = [
  "SAT",
  "USD",
  "USDT",
  "EUR",
  "CHF",
  "GBP",
  "SEK",
  "PLN",
  "NOK",
  "CZK",
  "DKK",
  "HUF",
  "RON",
  "ISK",
  "TRY",
  "BGN",
  "ARS",
  "COP",
  "PEN",
  "GTQ",
  "MXN",
  "BRL",
  "CLP",
  "CDF",
  "XOF",
  "NGN",
  "CRC",
  "ZAR",
  "KES",
  "GHS",
  "UAH",
  "XAU",
  "RUB",
  "BOB",
  "CUP",
  "DOP",
  "HNL",
  "NIO",
  "PAB",
  "VES",
  "VEF",
  "UYU",
  "PYG",
  "TZS",
  "INR",
  "UZS",
  "RSD",
  "KZT",
  "KWD",
  "ILS",
  "NZD",
  "PHP",
  "EGP",
  "CNY",
  "JPY",
  "AUD",
  "IDR",
  "VND",
  "MAD",
  "RWF",
  "XAF",
  "MGA",
  "GNF",
];

export let GIFTCARDCOUNTRIES: PaymentMethodCountry[] = [
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "UK",
  "SE",
  "FI",
];
export const NATIONALTRANSFERCOUNTRIES = [
  "BG",
  "CZ",
  "DK",
  "HU",
  "NO",
  "PL",
  "RO",
  "CH",
  "IS",
  "SE",
  "TR",
  "NG",
  "BO",
  "CL",
  "GT",
  "KE",
  "MX",
  "NI",
  "PE",
  "PY",
  "SR",
  "VE",
  "ZA",
] as const;

export let PAYMENTMETHODS: PaymentMethod[] = ["sepa"];
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: "sepa",
    currencies: ["EUR"],
    anonymous: false,
  },
];

const bankTransfer: PaymentMethod[] = [
  "alias",
  "bancolombia",
  "cbu",
  "cvu",
  "fasterPayments",
  "instantSepa",
  "sepa",
  "sinpe",
  "straksbetaling",
  "abitab",
  "brou",
  "eft",
  "equityBank",
  "kcbBank",
  "practicaja",
  "ted",
  "sberbank",
  "trFast",
  "westernUnion",
  "westernUnionEU",
  ...NATIONALTRANSFERCOUNTRIES.map(
    (c) => `nationalTransfer${c}` satisfies PaymentMethod,
  ),
];
const onlineWallet: PaymentMethod[] = [
  "accrue",
  "advcash",
  "airtelMoney",
  "bankera",
  "blik",
  "chippercash",
  "eversend",
  "friends24",
  "klasha",
  "mercadoPago",
  "mobilePay",
  "n26",
  "nequi",
  "neteller",
  "orangeMoney",
  "papara",
  "payday",
  "paypal",
  "paysera",
  "rappipay",
  "revolut",
  "sinpeMovil",
  "skrill",
  "swish",
  "twint",
  "vipps",
  "wave",
  "wirepay",
  "wise",
  "boleto",
  "djamo",
  "aPaym",
  "perfectMoney",
  "payeer",
  "yoomoney",
  "stp",
  "spei",
  "daviPlata",
  "tigoPesa",
  "tigoHonduras",
  "tigoBolivia",
  "tigoSalvador",
  "tigoParaguay",
  "tigoGuatemala",
  "upi",
  "paytmWallet",
  "paysend",
  "tinkoff",
];
const giftCard: PaymentMethod[] = [
  // "giftCard.steam",
  "giftCard.amazon",
  ...GIFTCARDCOUNTRIES.map(
    (c) => `giftCard.amazon.${c}` satisfies PaymentMethod,
  ),
];
const nationalOption: PaymentMethod[] = [
  "bizum",
  "iris",
  "keksPay",
  "lydia",
  "mbWay",
  "mobilePay",
  "paylib",
  "pix",
  "postePay",
  "rebellion",
  "satispay",
  "tikkie",
  "twyp",
  "privat24",
  "cbu",
  "cvu",
];
const mobileMoney: PaymentMethod[] = [
  "moov",
  "mtn",
  "m-pesa",
  "mobileAirtime",
  "vodafoneCash",
];
const other: PaymentMethod[] = ["liquid", "lnurl"];
const cash: PaymentMethod[] = [];

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer,
  onlineWallet,
  giftCard,
  nationalOption,
  cash,
  other,
  mobileMoney,
};

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  PAYMENTMETHODINFOS = paymentMethodInfos;
  CURRENCIES = paymentMethodInfos
    .reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
    .filter(uniqueArray);
  GIFTCARDCOUNTRIES = paymentMethodInfos
    .reduce(
      (arr: PaymentMethodCountry[], info) => arr.concat(info.countries || []),
      [],
    )
    .filter(uniqueArray);
  PAYMENTMETHODS = paymentMethodInfos.map((method) => method.id);
  PAYMENTCATEGORIES.cash = [
    ...PAYMENTCATEGORIES.cash,
    ...paymentMethodInfos.map(({ id }) => id).filter(isCashTrade),
  ];
};
