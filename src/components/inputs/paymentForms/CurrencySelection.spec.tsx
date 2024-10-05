import { fireEvent, render } from "test-utils";
import { PaymentMethodInfo } from "../../../../peach-api/src/@types/payment";
import { setPaymentMethods } from "../../../paymentMethods";
import { useConfigStore } from "../../../store/configStore/configStore";
import { CurrencySelection } from "./CurrencySelection";

describe("CurrencySelection", () => {
  const onToggle = jest.fn();

  const methods: PaymentMethodInfo[] = [
    {
      id: "revolut",
      currencies: [
        "EUR",
        "CHF",
        "GBP",
        "BGN",
        "CZK",
        "DKK",
        "HUF",
        "ISK",
        "NOK",
        "PLN",
        "RON",
        "SEK",
      ],
      anonymous: false,
      fields: {
        mandatory: [[["email"]]],
        optional: [],
      },
    },
  ];
  setPaymentMethods(methods);
  useConfigStore.getState().setPaymentMethods(methods);

  it("should toggle a selection correctly", () => {
    const { getByText } = render(
      <CurrencySelection
        paymentMethod="revolut"
        selectedCurrencies={["EUR", "CHF"]}
        onToggle={onToggle}
      />,
    );
    fireEvent(getByText("GBP"), "onPress");
    expect(onToggle).toHaveBeenCalledWith("GBP");
  });
});
