type EuPaymentMethods =
  | "advcash"
  | "applePay"
  | "bankera"
  | "bizum"
  | "blik"
  | "fasterPayments"
  | "friends24"
  | "instantSepa"
  | "iris"
  | "keksPay"
  | "lydia"
  | "mbWay"
  | "mobilePay"
  | "n26"
  | "nationalTransferBG"
  | "nationalTransferCZ"
  | "nationalTransferDK"
  | "nationalTransferHU"
  | "nationalTransferNO"
  | "nationalTransferPL"
  | "nationalTransferRO"
  | "nationalTransferTR"
  | "nationalTransferCH"
  | "nationalTransferIS"
  | "nationalTransferSE"
  | "neteller"
  | "papara"
  | "paylib"
  | "paypal"
  | "paysera"
  | "postePay"
  | "rebellion"
  | "revolut"
  | "satispay"
  | "sepa"
  | "skrill"
  | "straksbetaling"
  | "strike"
  | "swish"
  | "twint"
  | "vipps"
  | "wise";
type LatAmPaymentMethods =
  | "alias"
  | "bancolombia"
  | "cbu"
  | "cvu"
  | "mercadoPago"
  | "nequi"
  | "pix"
  | "rappipay"
  | "sinpe"
  | "sinpeMovil";
type AfricaPaymentMethods =
  | "accrue"
  | "airtelMoney"
  | "chippercash"
  | "eversend"
  | "klasha"
  | "m-pesa"
  | "moov"
  | "mtn"
  | "nationalTransferNG"
  | "orangeMoney"
  | "payday"
  | "wave"
  | "wirepay"
  | "flutterwave"
  | "mobileAirtime";

type BitcoinPaymentMethods = "liquid" | "lnurl";
type InternationalPaymentMethds =
  | "giftCard.amazon"
  | `giftCard.amazon.${PaymentMethodCountry}`;
type CashPaymentMethds = `cash.${string}`;

type PaymentMethod =
  | EuPaymentMethods
  | LatAmPaymentMethods
  | AfricaPaymentMethods
  | InternationalPaymentMethds
  | BitcoinPaymentMethods
  | CashPaymentMethds;
