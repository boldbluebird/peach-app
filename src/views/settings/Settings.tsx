import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { AppState, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PeachText } from "../../components/text/PeachText";
import { AnalyticsPopup } from "../../popups/AnalyticsPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { keys } from "../../utils/object/keys";
import { checkNotificationStatus } from "../../utils/system/checkNotificationStatus";
import { isProduction } from "../../utils/system/isProduction";
import { toggleNotifications } from "../../utils/system/toggleNotifications";
import { SettingsItem, SettingsItemProps } from "./components/SettingsItem";
import { VersionInfo } from "./components/VersionInfo";

type SettingsItemType = string | SettingsItemProps;
type SettingsItemSection = {
  headline?: string;
  items: SettingsItemType[];
};
type SettingsItemMap = SettingsItemSection[];

const contactUs: SettingsItemType[] = isProduction()
  ? ["contact", "aboutPeach"]
  : ["testView", "contact", "aboutPeach"];

export const Settings = () => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [enableAnalytics, toggleAnalytics, showBackupReminder] =
    useSettingsStore(
      (state) => [
        state.enableAnalytics,
        state.toggleAnalytics,
        state.showBackupReminder,
      ],
      shallow,
    );
  const swaps = useBoltzSwapStore((state) => state.swaps);

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        setNotificationsOn(await checkNotificationStatus());
      };
      const eventListener = AppState.addEventListener(
        "change",
        checkingFunction,
      );

      checkingFunction();

      return () => {
        eventListener.remove();
      };
    }, []),
  );

  const notificationClick = useCallback(() => {
    if (notificationsOn) {
      setPopup(
        <WarningPopup
          title={i18n("settings.notifications.popup.title")}
          content={i18n("settings.notifications.popup")}
          actions={
            <>
              <PopupAction
                label={i18n("settings.notifications.popup.neverMind")}
                textStyle={tw`text-black-100`}
                iconId="arrowLeftCircle"
                onPress={closePopup}
              />
              <PopupAction
                label={i18n("settings.notifications.popup.yes")}
                textStyle={tw`text-black-100`}
                iconId="slash"
                onPress={() => {
                  closePopup();
                  toggleNotifications();
                }}
                reverseOrder
              />
            </>
          }
        />,
      );
    } else {
      toggleNotifications();
    }
  }, [closePopup, notificationsOn, setPopup]);

  const profileSettings: SettingsItemType[] = useMemo(
    () => [
      "myProfile",
      "referrals",
      {
        title: "backups",
        iconId: showBackupReminder ? "alertTriangle" : undefined,
        warning: !!showBackupReminder,
      },
      "networkFees",
      "transactionBatching",
      "paymentMethods",
    ],
    [showBackupReminder],
  );

  const setAnalyticsPopupSeen = useSettingsStore(
    (state) => state.setAnalyticsPopupSeen,
  );
  const onAnalyticsPress = useCallback(() => {
    if (!enableAnalytics) {
      setAnalyticsPopupSeen(true);
      setPopup(<AnalyticsPopup />);
    } else {
      toggleAnalytics();
    }
  }, [enableAnalytics, setAnalyticsPopupSeen, setPopup, toggleAnalytics]);

  const appSettings: SettingsItemType[] = useMemo(
    () => [
      {
        title: "analytics",
        onPress: onAnalyticsPress,
        iconId: enableAnalytics ? "toggleRight" : "toggleLeft",
        enabled: enableAnalytics,
      },
      {
        title: "notifications",
        onPress: notificationClick,
      },
      "nodeSetup",
      "refundAddress",
      "payoutAddress",
      "currency",
      "language",
    ],
    [onAnalyticsPress, enableAnalytics, notificationClick],
  );

  const settings: SettingsItemMap = [
    { items: contactUs },
    { headline: "profileSettings", items: profileSettings },
    { headline: "appSettings", items: appSettings },
  ];

  if (keys(swaps).length)
    settings.push({
      headline: "advanced",
      items: ["swaps"] as SettingsItemType[],
    });

  return (
    <Screen header={<Header title={i18n("settings.title")} hideGoBackButton />}>
      <PeachScrollView>
        {settings.map(({ headline, items }) => (
          <View key={`settings-${headline}`}>
            {headline && (
              <PeachText
                style={tw`mb-3 text-left lowercase h6 text-primary-main mt-9`}
              >
                {i18n(`settings.${headline}`)}
              </PeachText>
            )}
            <View style={tw`gap-6 py-3 px-6px`}>
              {items.map((item, i) => {
                const props =
                  typeof item === "string"
                    ? ({ title: item } as SettingsItemProps)
                    : item;
                return (
                  <SettingsItem
                    key={`${headline}-${typeof item === "string" ? item : item.title}-${i}`}
                    {...props}
                  />
                );
              })}
            </View>
          </View>
        ))}
        <VersionInfo style={tw`mb-10 text-center mt-9`} />
      </PeachScrollView>
    </Screen>
  );
};
