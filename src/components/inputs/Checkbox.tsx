import { TouchableOpacity } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = TouchableOpacity["props"] & {
  checked: boolean;
  onPress: () => void;
  green?: boolean;
};
export const Checkbox = ({
  checked,
  green,
  style,
  children,
  ...wrapperProps
}: Props) => (
  <TouchableOpacity
    {...wrapperProps}
    style={[style, tw`flex-row items-center gap-1`]}
  >
    <Icon
      id={checked ? "checkboxMark" : "square"}
      color={
        checked
          ? tw.color(green ? "success-main" : "primary-main")
          : tw.color("black-50")
      }
    />
    {!!children && (
      <PeachText style={[tw`subtitle-1 shrink`, !checked && tw`text-black-25`]}>
        {children}
      </PeachText>
    )}
  </TouchableOpacity>
);
