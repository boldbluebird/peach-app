import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { LogoIcons } from "../assets/logo";
import { PeachyGradient } from "../components/PeachyGradient";
import { useSetPopup } from "../components/popup/GlobalPopup";
import { useSetToast } from "../components/toast/Toast";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { requestUserPermissions } from "../init/requestUserPermissions";
import { useInitApp } from "../init/useInitApp";
import { VerifyYouAreAHumanPopup } from "../popups/warning/VerifyYouAreAHumanPopup";
import tw from "../styles/tailwind";
import { useGlobalHandlers } from "../useGlobalHandlers";
import { useAccountStore } from "../utils/account/account";
import { screenTransition } from "../utils/layout/screenTransition";
import { isIOS } from "../utils/system/isIOS";
import { useWSQueryInvalidation } from "./useWSQueryInvalidation";
import { onboardingViews, views } from "./views";
import { useTranslate } from "@tolgee/react";

const RootStack = createStackNavigator<RootStackParamList>();

export function Screens() {
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn);
  useGlobalHandlers();
  useWSQueryInvalidation();

  if (isLoading) return <SplashScreenComponent setIsLoading={setIsLoading} />;
  return (
    <RootStack.Navigator
      screenOptions={{
        gestureEnabled: isIOS(),
        headerShown: false,
        cardStyle: tw`flex-1 bg-primary-background-main`,
      }}
    >
      {(isLoggedIn ? views : onboardingViews).map(
        ({ name, component, animationEnabled }) => (
          <RootStack.Screen
            {...{ name, component }}
            key={name}
            options={{
              animationEnabled,
              transitionSpec: {
                open: screenTransition,
                close: screenTransition,
              },
            }}
          />
        ),
      )}
    </RootStack.Navigator>
  );
}

function SplashScreenComponent({
  setIsLoading,
}: {
  setIsLoading: (isLoading: boolean) => void;
}) {
  const setToast = useSetToast();
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const initApp = useInitApp();
  const { t } = useTranslate();
  useEffect(() => {
    (async () => {
      const statusResponse = await initApp();

      if (!statusResponse || statusResponse.error) {
        if (statusResponse?.error === "HUMAN_VERIFICATION_REQUIRED") {
          setPopup(<VerifyYouAreAHumanPopup />);
        } else {
          setToast({
            msgKey: statusResponse?.error || "NETWORK_ERROR",
            color: "red",
            action: {
              onPress: () => navigation.navigate("contact"),
              label: t("contactUs"),
              iconId: "mail",
            },
          });
        }
      }
      requestUserPermissions();
      setIsLoading(false);
      SplashScreen.hide();
    })();
  }, [initApp, navigation, setIsLoading, setPopup, setToast, t]);

  return (
    <View>
      <PeachyGradient />
      <View style={tw`absolute items-center justify-center w-full h-full`}>
        <LogoIcons.fullLogo />
      </View>
    </View>
  );
}
