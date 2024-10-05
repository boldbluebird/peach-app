import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { round } from "../../utils/math/round";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { useUser } from "../publicProfile/useUser";
import { PriceInfo } from "./BuyerPriceInfo";
import { useMaxMiningFee } from "./MatchDetails";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";

export function TradeRequestForBuyOffer() {
  const { userId, amount, fiatPrice, currency, paymentMethod } =
    useRoute<"tradeRequestForBuyOffer">().params;
  const { user } = useUser(userId);
  const { data: marketPrices } = useMarketPrices();
  if (!user || !marketPrices) {
    return <ActivityIndicator />;
  }
  const bitcoinPrice = marketPrices[currency];
  if (!bitcoinPrice) return <ActivityIndicator />;

  const bitcoinPriceOfOffer = fiatPrice / (amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <Screen header={<Header title="trade request" />}>
      <PeachScrollView
        contentStyle={tw`items-center justify-center gap-8 grow`}
      >
        <MiningFeeWarning amount={amount} />
        <UserCard user={user} isBuyer={false} />

        <PriceInfo
          satsAmount={amount}
          selectedCurrency={currency}
          premium={premium}
          price={fiatPrice}
        />
        <PaidVia paymentMethod={paymentMethod} />
      </PeachScrollView>
      <View style={tw`flex-row items-center justify-center gap-8px`}>
        {/* <Button style={tw`flex-1 py-3 bg-error-main`}>Decline</Button> */}
        <AcceptButton />
      </View>
    </Screen>
  );
}

function AcceptButton() {
  const mutation = useAcceptTradeRequest();
  return (
    <Button
      style={tw`flex-1 py-3 bg-success-main`}
      onPress={() => mutation.mutate()}
    >
      Accept
    </Button>
  );
}

function useAcceptTradeRequest() {
  const {
    userId,
    offerId,
    amount,
    symmetricKeyEncrypted,
    currency,
    paymentMethod,
  } = useRoute<"tradeRequestForBuyOffer">().params;
  const navigation = useStackNavigation();
  const paymentData = usePaymentDataStore((s) =>
    s.getAllPaymentDataByType(paymentMethod),
  );
  const { maxMiningFeeRate } = useMaxMiningFee(amount);
  return useMutation({
    onMutate: async () => {
      // cancel queries related to the sell offer
    },
    mutationFn: async () => {
      const symmetricKey = await decryptSymmetricKey(symmetricKeyEncrypted);
      if (!symmetricKey) throw new Error("SYMMETRIC_KEY_DECRYPTION_FAILED");

      // TODO: the user should actually choose here and not just randomly pick the first one
      const selectedPaymentData = paymentData.find((pd) =>
        pd.currencies.includes(currency),
      );
      if (!selectedPaymentData) throw new Error("PAYMENTDATA_NOT_FOUND");

      const encryptedData = await encryptPaymentData(
        cleanPaymentData(selectedPaymentData),
        symmetricKey,
      );
      if (!encryptedData) throw new Error("PAYMENTDATA_ENCRYPTION_FAILED");

      const { result, error } =
        await peachAPI.private.offer.acceptTradeRequestForBuyOffer({
          userId,
          offerId,
          paymentData: getHashedPaymentData([selectedPaymentData]),
          paymentDataEncrypted: encryptedData.encrypted,
          paymentDataSignature: encryptedData.signature,
          maxMiningFeeRate,
        });
      if (error) {
        throw new Error(error.error);
      }
      return result;
    },
    onSuccess: (response) => {
      if (!response || "error" in response) return;
      // TODO: for some fukcnig reason we used to return a refundPSBT after a match here
      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "yourTrades" } },
          { name: "contract", params: { contractId: response.contractId } },
        ],
      });
    },
    onSettled: () => {
      // invalidate queries related to the sell offer
    },
  });
}
