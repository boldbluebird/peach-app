import { View } from "react-native";
import { BTCAmount } from "../components/bitcoin/BTCAmount";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PeachText } from "../components/text/PeachText";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { sum } from "../utils/math/sum";
import { getSellOfferFunding } from "../utils/offer/getSellOfferFunding";
import { thousands } from "../utils/string/thousands";
import { WarningPopup } from "./WarningPopup";

export function FundingAmountDifferentPopup({
  sellOffer,
}: {
  sellOffer: SellOffer;
}) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();

  const funding = getSellOfferFunding(sellOffer);
  const actualAmount = funding.amounts.reduce(sum, 0);
  return (
    <WarningPopup
      title={i18n("warning.fundingAmountDifferent.title")}
      content={
        <View style={tw`gap-4`}>
          <PeachText>
            {i18n("warning.fundingAmountDifferent.description.1")}
          </PeachText>
          <BTCAmount
            chain={sellOffer.escrowType}
            amount={actualAmount}
            size="medium"
          />
          <PeachText>
            {i18n("warning.fundingAmountDifferent.description.2")}
          </PeachText>
          <BTCAmount
            chain={sellOffer.escrowType}
            amount={sellOffer.amount}
            size="medium"
          />
          <PeachText>
            {i18n(
              "warning.fundingAmountDifferent.description.3",
              thousands(actualAmount),
            )}
          </PeachText>
        </View>
      }
      actions={
        <PopupAction
          style={tw`justify-center`}
          label={i18n("goToTrade")}
          iconId="arrowRightCircle"
          textStyle={tw`text-black-100`}
          reverseOrder
          onPress={() => {
            closePopup();
            navigation.navigate("wrongFundingAmount", {
              offerId: sellOffer.id,
            });
          }}
        />
      }
    />
  );
}
