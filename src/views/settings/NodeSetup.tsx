import { useEffect, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ScanQR } from "../../components/camera/ScanQR";
import { Toggle } from "../../components/inputs/Toggle";
import { URLInput } from "../../components/inputs/URLInput";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../../components/popup/actions/LoadingPopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { useValidatedState } from "../../hooks/useValidatedState";
import { HelpPopup } from "../../popups/HelpPopup";
import { LoadingPopup } from "../../popups/LoadingPopup";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { useNodeConfigState } from "../../utils/wallet/nodeConfigStore";
import { peachWallet } from "../../utils/wallet/setWallet";
import { checkNodeConnection } from "./helpers/checkNodeConnection";
import { useTranslate } from "@tolgee/react";

const urlRules = { required: true, url: true };
export const NodeSetup = () => {
  const { t } = useTranslate("wallet");
  const setPopup = useSetPopup();

  const [node, setCustomNode, enabled, toggleEnabled] = useNodeConfigState(
    (state) => [state, state.setCustomNode, state.enabled, state.toggleEnabled],
    shallow,
  );
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl);
  const [url, setURL, isURLValid, urlErrors] = useValidatedState<string>(
    node.url || "",
    urlRules,
  );
  const canCheckConnection = enabled && isURLValid;
  const [isConnected, setIsConnected] = useState(!!node.url);

  const editConfig = () => setIsConnected(false);
  const save = (blockchainType: BlockChainNames) => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    setCustomNode({ enabled, ssl, url, type: blockchainType });
    setIsConnected(true);
    peachWallet.setBlockchain({ enabled, ssl, url, type: blockchainType });
    peachWallet.initWallet();
  };

  const checkConnection = async () => {
    setPopup(
      <LoadingPopup title={t("wallet.settings.node.checkingConnection")} />,
    );

    const { result: nodeType, error } = await checkNodeConnection(url, ssl);
    if (nodeType) {
      return setPopup(
        <NodeConnectionSuccessPopup url={url} save={() => save(nodeType)} />,
      );
    }
    return setPopup(<NodeConnectionErrorPopup error={error} />);
  };

  useEffect(() => {
    if (!peachWallet) return;
    peachWallet.setBlockchain(node);
  }, [node]);
  const [showQRScanner, toggleShowQRScanner] = useToggleBoolean(false);

  return (
    <Screen header={<NodeSetupHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center gap-3 grow`}
      >
        <Toggle
          style={tw`justify-between px-6`}
          textStyle={tw`text-black-65`}
          {...{ enabled }}
          onPress={toggleEnabled}
        >
          {t("wallet.settings.node.title")}
        </Toggle>
        <Toggle
          style={tw`justify-between px-6`}
          enabled={ssl}
          textStyle={tw`text-black-65`}
          disabled={!enabled || isConnected}
          onPress={toggleSSL}
        >
          {t("wallet.settings.node.ssl")}
        </Toggle>
        <View style={!enabled && tw`opacity-33`}>
          <URLInput
            value={url}
            disabled={!enabled || isConnected}
            label={t("wallet.settings.node.address")}
            placeholder={t("wallet.settings.node.address.placeholder")}
            onChangeText={setURL}
            errorMessage={urlErrors}
            icons={isConnected ? [["edit3", editConfig]] : undefined}
          />
        </View>
      </PeachScrollView>
      {isConnected ? (
        <View style={tw`flex-row items-center justify-center gap-1`}>
          <PeachText style={tw`uppercase button-medium`}>
            {t("wallet.settings.node.connected")}
          </PeachText>
          <Icon id="check" size={16} color={tw.color("success-main")} />
        </View>
      ) : (
        <Button
          disabled={!canCheckConnection}
          style={tw`self-center`}
          iconId="share2"
          onPress={checkConnection}
        >
          {t("wallet.settings.node.checkConnection")}
        </Button>
      )}
      {showQRScanner && (
        <ScanQR
          onRead={({ data }) => setURL(data)}
          onCancel={toggleShowQRScanner}
        />
      )}
    </Screen>
  );
};

function NodeSetupHeader() {
  const { t } = useTranslate("wallet");
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="useYourOwnNode" />);
  return (
    <Header
      title={t("wallet.settings.node.title")}
      icons={[
        {
          ...headerIcons.help,
          accessibilityHint: `${t("help", { ns: "help" })} ${t("wallet.settings.node.title")}`,
          onPress: showHelp,
        },
      ]}
    />
  );
}

type ErrorPopupProps = {
  error: string;
};

function NodeConnectionErrorPopup({ error }: ErrorPopupProps) {
  const { t } = useTranslate("wallet");
  return (
    <WarningPopup
      title={t("wallet.settings.node.error.title")}
      content={
        <PeachText selectable>
          {t("wallet.settings.node.error.text", { error })}
        </PeachText>
      }
      actions={
        <ClosePopupAction
          style={tw`justify-center`}
          textStyle={tw`text-black-100`}
        />
      }
    />
  );
}

type SuccessPopupProps = {
  url: string;
  save: () => void;
};

function NodeConnectionSuccessPopup({ url, save }: SuccessPopupProps) {
  const { t } = useTranslate("wallet");
  return (
    <SuccessPopup
      title={t("wallet.settings.node.success.title")}
      content={t("wallet.settings.node.success.text", { node: url })}
      actions={
        <>
          <ClosePopupAction />
          <SaveAction {...{ save }} />
        </>
      }
    />
  );
}

function SaveAction({ save }: Pick<SuccessPopupProps, "save">) {
  const { t } = useTranslate("wallet");
  const closePopup = useClosePopup();
  const onPress = () => {
    save();
    closePopup();
  };

  return (
    <LoadingPopupAction
      onPress={onPress}
      label={t("wallet.settings.node.success.confirm")}
      iconId={"save"}
      reverseOrder
    />
  );
}
