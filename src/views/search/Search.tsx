import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList } from "react-native";
import { TradeRequestForSellOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForSellOffer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import {
  CENT,
  SATSINBTC,
  fullScreenTabNavigationScreenOptions,
} from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { OfferSummaryCard } from "../explore/OfferSummaryCard";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ExpressSell } from "../offerPreferences/ExpressSell";
import { useUser } from "../publicProfile/useUser";
import { useOfferMatches } from "../search/hooks/useOfferMatches";
import { NoMatchesYet } from "./NoMatchesYet";

const OfferTab = createMaterialTopTabNavigator();

export function Search() {
  const { offerId } = useRoute<"explore">().params;
  return (
    <Screen style={tw`px-0`} header={<ExploreHeader />}>
      <OfferTab.Navigator
        initialRouteName="acceptTrade"
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        <OfferTab.Screen
          name="acceptTrade"
          options={{
            title: "accept trade",
          }}
          children={() => <AcceptTrade offerId={offerId} />}
        />
        <OfferTab.Screen
          name="requestTrade"
          options={{
            title: "request trade",
          }}
          children={() => <RequestTrade />}
        />
      </OfferTab.Navigator>
    </Screen>
  );
}

function RequestTrade() {
  return <ExpressSell />;
}

function AcceptTrade({ offerId }: { offerId: string }) {
  const {
    allMatches: matches,
    isPending,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useOfferMatches(offerId);
  const { data } = useQuery({
    queryKey: ["tradeRequests", offerId],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestsForSellOffer({
          offerId,
        });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch trade requests");
      }
      return result;
    },
  });

  const tradeRequests = data?.tradeRequests || [];
  const hasMatches = matches.length > 0 || tradeRequests.length > 0;
  const navigation = useStackNavigation();
  if (isPending) return <LoadingScreen />;

  if (hasMatches) {
    return (
      <>
        <FlatList
          data={matches}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => (
            <OfferSummaryCard
              user={item.user}
              amount={item.amount}
              // @ts-ignore
              price={item.prices[item.selectedCurrency || "EUR"]}
              currency={item.selectedCurrency || "EUR"}
              premium={item.premium}
              instantTrade={item.instantTrade}
              tradeRequested={item.matched}
              onPress={() => {
                navigation.navigate("tradeRequestForSellOffer", {
                  userId: item.user.id,
                  offerId,
                  amount: item.amount,
                  // @ts-ignore
                  fiatPrice: item.prices[item.selectedCurrency || "EUR"],
                  currency: item.selectedCurrency || "EUR",
                  // @ts-ignore
                  paymentMethod: item.selectedPaymentMethod,
                  symmetricKeyEncrypted: item.symmetricKeyEncrypted,
                  isMatch: true,
                  matchingOfferId: item.offerId,
                });
              }}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchNextPage()}
          contentContainerStyle={tw`gap-10px`}
        />
        <FlatList
          data={tradeRequests}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          keyExtractor={({ userId, currency, paymentMethod }) =>
            `${userId}-${currency}-${paymentMethod}`
          }
          renderItem={({ item }) => (
            <TradeRequestSummaryCard tradeRequest={item} offerId={offerId} />
          )}
          contentContainerStyle={tw`gap-10px`}
        />
      </>
    );
  }
  return <NoMatchesYet />;
}

function TradeRequestSummaryCard({
  tradeRequest,
  offerId,
}: {
  tradeRequest: TradeRequestForSellOffer;
  offerId: string;
}) {
  const { currency, userId, fiatPrice, paymentMethod, symmetricKeyEncrypted } =
    tradeRequest;
  const { user } = useUser(userId);
  const { offer } = useOfferDetail(offerId);
  const { data: marketPrices } = useMarketPrices();
  const navigation = useStackNavigation();
  if (!user || !offer || typeof offer.amount !== "number" || !marketPrices) {
    return <ActivityIndicator />;
  }
  const onPress = () =>
    navigation.navigate("tradeRequestForSellOffer", {
      userId,
      offerId,
      amount: offer?.amount as number,
      fiatPrice,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
    });
  const bitcoinPrice = marketPrices[currency];
  if (!bitcoinPrice) return <ActivityIndicator />;

  const bitcoinPriceOfOffer = fiatPrice / (offer.amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <OfferSummaryCard
      user={user}
      amount={offer?.amount}
      price={fiatPrice}
      currency={currency}
      premium={premium}
      instantTrade={false}
      tradeRequested={false}
      onPress={onPress}
    />
  );
}

function ExploreHeader() {
  const { offerId } = useRoute<"explore">().params;
  const setPopup = useSetPopup();

  const cancelOffer = () => setPopup(<CancelOfferPopup offerId={offerId} />);

  return (
    <Header
      icons={[{ ...headerIcons.cancel, onPress: cancelOffer }]}
      title={`offer ${offerIdToHex(offerId)}`}
    />
  );
}
