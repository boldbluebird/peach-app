import { useTranslate } from "@tolgee/react";
import { useSetGlobalOverlay } from "../../Overlay";
import { OverlayComponent } from "../../components/OverlayComponent";
import { Button } from "../../components/buttons/Button";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";

export const PaymentMade = ({ contractId }: { contractId: string }) => {
  const navigation = useStackNavigation();
  const setOverlay = useSetGlobalOverlay();
  const { t } = useTranslate("contract");

  const close = () => setOverlay(undefined);

  const goToTrade = () => {
    close();
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "yourTrades" } },
        { name: "contract", params: { contractId } },
      ],
    });
  };

  return (
    <OverlayComponent
      title={t("contract.paymentMade.title")}
      text={t("contract.paymentMade.description")}
      iconId="dollarSignCircleInverted"
      buttons={
        <>
          <Button
            style={tw`bg-primary-background-light`}
            textColor={tw.color("primary-main")}
            onPress={goToTrade}
          >
            {t("goToTrade", { ns: "global" })}
          </Button>
          <Button onPress={close} ghost>
            {t("close", { ns: "global" })}
          </Button>
        </>
      }
    />
  );
};
