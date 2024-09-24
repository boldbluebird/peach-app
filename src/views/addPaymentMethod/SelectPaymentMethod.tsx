import { useMemo, useState } from "react";

import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { PAYMENTCATEGORIES } from "../../paymentMethods";
import { getApplicablePaymentCategories } from "../../utils/paymentMethod/getApplicablePaymentCategories";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { usePaymentMethodLabel } from "./hooks";
import { getCurrencyTypeFilter } from "./utils";

const NATIONALOPTIONS = {
  EUR: {
    IT: ["satispay", "postePay"],
    PT: ["mbWay"],
    ES: ["bizum", "rebellion"],
    FI: ["mobilePay"],
    HR: ["keksPay"],
    FR: ["paylib", "lydia", "satispay"],
    DE: ["satispay"],
    GR: ["iris"],
  },
  LATAM: {
    BR: ["pix"],
  },
} as const;

const NATIONALOPTIONCOUNTRIES = {
  EUR: ["IT", "PT", "ES", "FI", "HR", "FR", "DE", "GR"],
  LATAM: ["BR"],
} as const;
type NationalOptionsCountry =
  | keyof typeof NATIONALOPTIONS.EUR
  | keyof typeof NATIONALOPTIONS.LATAM;

const mapCountryToDrawerOption =
  (onPress: (country: NationalOptionsCountry) => void) =>
  (country: NationalOptionsCountry) => ({
    title: i18n(`country.${country}`),
    flagID: country,
    onPress: () => onPress(country),
  });

export const SelectPaymentMethod = () => {
  const navigation = useStackNavigation();
  const { selectedCurrency, origin } = useRoute<"selectPaymentMethod">().params;
  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const [selectedPaymentCategory, setSelectedPaymentCategory] =
    useState<PaymentCategory>();
  const paymentCategories = useMemo(
    () =>
      getApplicablePaymentCategories(selectedCurrency).map((c) => ({
        value: c,
        display: i18n(`paymentCategory.${c}`),
      })),
    [selectedCurrency],
  );

  const getPaymentMethodLabel = usePaymentMethodLabel();

  const goToPaymentMethodForm = (paymentMethod: PaymentMethod) => {
    const label = getPaymentMethodLabel(paymentMethod);
    navigation.navigate("paymentMethodForm", {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [selectedCurrency],
      },
      origin,
    });
  };

  const unselectCategory = () => setSelectedPaymentCategory(undefined);

  const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
    unselectCategory();
    updateDrawer({ show: false });

    if (paymentMethod === "giftCard.amazon") {
      navigation.navigate("selectCountry", { selectedCurrency, origin });
    } else {
      goToPaymentMethodForm(paymentMethod);
    }
  };

  const mapMethodToDrawerOption = (method: PaymentMethod) => ({
    title: i18n(`paymentMethod.${method}`),
    logoID: method,
    onPress: () => selectPaymentMethod(method),
  });

  const getDrawerConfig = (category: PaymentCategory) => ({
    title: i18n(`paymentCategory.${category}`),
    show: true,
    onClose: unselectCategory,
  });

  const getNationalOptions = (country: NationalOptionsCountry) =>
    country === "BR" ? NATIONALOPTIONS.LATAM.BR : NATIONALOPTIONS.EUR[country];

  const getNationalOptionCountries = () => {
    if (getCurrencyTypeFilter("europe")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.EUR;
    }
    return NATIONALOPTIONCOUNTRIES.LATAM;
  };

  const selectCountry = (
    country:
      | keyof typeof NATIONALOPTIONS.EUR
      | keyof typeof NATIONALOPTIONS.LATAM,
    category: PaymentCategory,
  ) => {
    const nationalOptions = getNationalOptions(country);
    const nationalOptionCountries = getNationalOptionCountries();
    updateDrawer({
      title: i18n(`country.${country}`),
      options: nationalOptions.map(mapMethodToDrawerOption),
      previousDrawer: {
        options: nationalOptionCountries.map(
          mapCountryToDrawerOption((cntry) => selectCountry(cntry, category)),
        ),
        ...getDrawerConfig(category),
      },
      show: true,
      onClose: unselectCategory,
    });
  };

  const getDrawerOptions = (category: PaymentCategory) =>
    category === "nationalOption"
      ? getNationalOptionCountries().map(
          mapCountryToDrawerOption((country) =>
            selectCountry(country, category),
          ),
        )
      : PAYMENTCATEGORIES[category]
          .filter((method) =>
            paymentMethodAllowedForCurrency(method, selectedCurrency),
          )
          .filter(
            (method) => category !== "giftCard" || method === "giftCard.amazon",
          )
          .map(mapMethodToDrawerOption);

  const showDrawer = (category: PaymentCategory) => {
    updateDrawer({
      options: getDrawerOptions(category),
      ...getDrawerConfig(category),
    });
  };

  const selectPaymentCategory = (category: PaymentCategory) => {
    setSelectedPaymentCategory(category);
    showDrawer(category);
  };

  return (
    <Screen header={i18n("selectPaymentMethod.title")}>
      <PeachScrollView
        contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}
      >
        <RadioButtons
          items={paymentCategories}
          selectedValue={selectedPaymentCategory}
          onButtonPress={selectPaymentCategory}
        />
      </PeachScrollView>
      <Button style={tw`self-center`} disabled={!selectedPaymentCategory}>
        {i18n("next")}
      </Button>
    </Screen>
  );
};
