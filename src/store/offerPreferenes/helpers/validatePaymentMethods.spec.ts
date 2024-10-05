import { PaymentMethodInfo } from "../../../../peach-api/src/@types/payment";
import { setPaymentMethods } from "../../../paymentMethods";
import { useConfigStore } from "../../configStore/configStore";
import { validatePaymentMethods } from "./validatePaymentMethods";

describe("validatePaymentMethods", () => {
  const meansOfPayment: MeansOfPayment = {
    EUR: ["sepa", "revolut", "paypal"],
    CHF: ["revolut"],
  };
  const originalPaymentData: PaymentData[] = [
    {
      id: "sepa-1234",
      iban: "DE89370400440532013000",
      bic: "COBADEFFXXX",
      label: "SEPA",
      type: "sepa",
      currencies: ["EUR"],
    },
    {
      id: "revolut-1234",
      label: "Revolut",
      type: "revolut",
      currencies: ["EUR", "CHF"],
      email: "satoshi@nakamoto.com",
    },
  ];
  beforeAll(() => {
    const paymentMethods: PaymentMethodInfo[] = [
      {
        id: "sepa",
        currencies: ["EUR"],
        anonymous: false,
        fields: { mandatory: [[["iban", "bic"]]], optional: ["reference"] },
      },
      {
        id: "revolut",
        currencies: ["EUR", "CHF"],
        anonymous: false,
        fields: { mandatory: [[["email"]]], optional: [] },
      },
      {
        id: "paypal",
        currencies: ["EUR"],
        anonymous: false,
        fields: { mandatory: [[["email"]]], optional: [] },
      },
    ];
    setPaymentMethods(paymentMethods);
    useConfigStore.getState().setPaymentMethods(paymentMethods);
  });

  it("should return false if no means of payment have been configured", () => {
    expect(
      validatePaymentMethods({ meansOfPayment: {}, originalPaymentData }),
    ).toBe(false);
  });

  it("should return false if some payment data is invalid", () => {
    expect(
      validatePaymentMethods({
        meansOfPayment,
        originalPaymentData: [
          ...originalPaymentData,
          {
            id: "sepa-1234",
            label: "SEPA",
            type: "sepa",
            currencies: ["EUR", "CHF"],
          },
        ],
      }),
    ).toBe(false);
  });

  it("should return true if all payment data is valid", () => {
    expect(
      validatePaymentMethods({ meansOfPayment, originalPaymentData }),
    ).toBe(true);
  });
});
