import { useCallback } from "react";
import { useClosePopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import {
  PopupComponent,
  PopupComponentProps,
} from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useNavigation } from "../hooks/useNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

export function InfoPopup(
  props: Pick<PopupComponentProps, "title" | "content">,
) {
  return (
    <PopupComponent
      {...props}
      actions={
        <>
          <HelpPopupAction title={props.title} />
          <ClosePopupAction reverseOrder />
        </>
      }
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
    />
  );
}

function HelpPopupAction({ title }: { title?: string }) {
  const navigation = useNavigation();
  const closePopup = useClosePopup();
  const goToHelp = useCallback(() => {
    closePopup();
    navigation.navigate("report", { topic: title, reason: "other" });
  }, [closePopup, navigation, title]);
  return <PopupAction label={i18n("help")} iconId="info" onPress={goToHelp} />;
}
