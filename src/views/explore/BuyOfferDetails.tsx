import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { TradeRequest } from "../../../peach-api/src/private/offer/getTradeRequest";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { CENT, SATSINBTC } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getRandom } from "../../utils/crypto/getRandom";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { PriceInfo } from "./BuyerPriceInfo";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";
import { useOffer } from "./useOffer";
import { useTradeRequest } from "./useTradeRequest";

export function BuyOfferDetails() {
  const { offerId } = useRoute<"buyOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={`offer ${offerIdToHex(offerId)}`}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <BuyOfferDetailsComponent offer={offer} />
      )}
    </Screen>
  );
}

function BuyOfferDetailsComponent({ offer }: { offer: GetOfferResponseBody }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    keys(offer.meansOfPayment).at(0) || "CHF",
  );
  const allPaymentMethods = getPaymentMethods(offer.meansOfPayment);
  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const paymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);
  const { data } = useTradeRequest(offer.id);
  return (
    <View style={tw`items-center justify-between gap-8 grow`}>
      <PeachScrollView contentStyle={tw`gap-8 grow`}>
        <View style={tw`overflow-hidden rounded-2xl`}>
          {!!data?.tradeRequest && <PeachyBackground />}
          <View style={tw`gap-8 m-1 bg-primary-background-light rounded-2xl`}>
            <UserCard user={offer.user} isBuyer />

            <BuyPriceInfo
              selectedCurrency={
                data?.tradeRequest?.currency || selectedCurrency
              }
            />
            {data?.tradeRequest ? (
              <PaidVia paymentMethod={data.tradeRequest.paymentMethod} />
            ) : (
              <PaymentMethodSelector
                meansOfPayment={offer.meansOfPayment}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
              />
            )}
            {!!data?.tradeRequest && (
              <>
                <View style={tw`items-center justify-center pb-6 z-99`}>
                  <Button
                    iconId="minusCircle"
                    textColor={tw.color("error-main")}
                    style={tw`hidden bg-primary-background-light`}
                  >
                    UNDO
                  </Button>
                </View>
                <View
                  style={tw`absolute top-0 left-0 w-full h-full opacity-75 rounded-xl`}
                  pointerEvents="none"
                >
                  <PeachyGradient />
                </View>
              </>
            )}
          </View>
        </View>
      </PeachScrollView>
      {!data?.tradeRequest && (
        <RequestTradeButton
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          offerId={offer.id}
          counterparty={offer.user}
        />
      )}
    </View>
  );
}

function RequestTradeButton({
  selectedCurrency,
  selectedPaymentData,
  offerId,
  counterparty,
}: {
  selectedCurrency: Currency;
  selectedPaymentData: PaymentData | undefined;
  offerId: string;
  counterparty: PublicUser;
}) {
  const { user } = useSelfUser();
  const { amount, premium } = useRoute<"buyOfferDetails">().params;
  const pgpPublicKeys = user?.pgpPublicKeys.map((key) => key.publicKey) ?? [];

  const [refundToPeachWallet, refundAddress] = useSettingsStore(
    (state) => [state.refundToPeachWallet, state.refundAddress],
    shallow,
  );

  const getAddress = async () => {
    if (!peachWallet) throw new Error("Peach wallet not defined");
    const address = refundToPeachWallet
      ? (await peachWallet.getAddress()).address
      : refundAddress;
    if (!address) throw new Error("MISSING_REFUND_ADDRESS");
    return address;
  };

  const { data: priceBook } = useMarketPrices();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    onMutate: async () => {
      const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
      const tradeRequest = {
        amount,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentData?.type,
        fiatPrice: (bitcoinPrice * (1 + premium / CENT) * amount) / SATSINBTC,
      };
      await queryClient.cancelQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
      const previousData = queryClient.getQueryData<{
        tradeRequest: TradeRequest | null;
      }>(offerKeys.tradeRequest(offerId));

      queryClient.setQueryData(offerKeys.tradeRequest(offerId), {
        tradeRequest,
      });

      return { previousData };
    },
    mutationFn: async () => {
      if (!selectedPaymentData) throw new Error("MISSING_VALUES");

      const SYMMETRIC_KEY_BYTES = 32;
      const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString(
        "hex",
      );
      const { encrypted, signature } = await signAndEncrypt(
        symmetricKey,
        [
          ...pgpPublicKeys,
          ...counterparty.pgpPublicKeys.map((pgp) => pgp.publicKey),
        ].join("\n"),
      );

      const encryptedPaymentData = await encryptPaymentData(
        cleanPaymentData(selectedPaymentData),
        symmetricKey,
      );
      if (!encryptedPaymentData)
        throw new Error("PAYMENTDATA_ENCRYPTION_FAILED");
      const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

      const { result, error } =
        await peachAPI.private.offer.requestTradeWithBuyOffer({
          offerId,
          amount,
          premium,
          currency: selectedCurrency,
          paymentMethod: selectedPaymentData.type,
          paymentData: hashedPaymentData,
          refundAddress: await getAddress(),
          symmetricKeyEncrypted: encrypted,
          symmetricKeySignature: signature,
          paymentDataEncrypted: encryptedPaymentData.encrypted,
          paymentDataSignature: encryptedPaymentData.signature,
        });
      if (error) throw new Error(error.error);
      return result;
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          offerKeys.tradeRequest(offerId),
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: offerKeys.tradeRequest(offerId),
      });
    },
  });
  return (
    <Button
      disabled={selectedPaymentData === undefined}
      onPress={() => mutate()}
    >
      request trade
    </Button>
  );
}

function BuyPriceInfo({ selectedCurrency }: { selectedCurrency: Currency }) {
  const { amount, premium, offerId } = useRoute<"buyOfferDetails">().params;
  const { data } = useTradeRequest(offerId);
  const { data: priceBook } = useMarketPrices();

  const amountInBTC = amount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
  const displayPrice = data?.tradeRequest
    ? data.tradeRequest.fiatPrice
    : bitcoinPrice * (1 + premium / CENT) * amountInBTC;

  const premiumOfTradeRequest = data?.tradeRequest
    ? round(
        ((round(data.tradeRequest.fiatPrice / amountInBTC, 2) - bitcoinPrice) /
          bitcoinPrice) *
          CENT,
        2,
      )
    : 0;
  return (
    <PriceInfo
      selectedCurrency={selectedCurrency}
      satsAmount={amount}
      price={displayPrice}
      premium={data?.tradeRequest ? premiumOfTradeRequest : premium}
    />
  );
}
