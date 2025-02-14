import { useMemo } from "react";
import { Control, useController } from "react-hook-form";
import { PaymentMethodField } from "../../../peach-api/src/@types/payment";
import { Input, InputProps } from "../../components/inputs/Input";
import i18n from "../../utils/i18n";
import { Formatter, formatters } from "../../utils/validation/formatters";
import { getMessages } from "../../utils/validation/getMessages";
import { getValidators } from "../../utils/validation/validators";
import { FormType } from "./PaymentMethodForm";

type Props = {
  control: Control<FormType>;
  name: PaymentMethodField;
  paymentMethod: PaymentMethod;
  optional?: boolean;
  defaultValue?: string;
} & InputProps;

export function FormInput({
  control,
  name,
  optional = false,
  defaultValue = "",
  paymentMethod,
  ...inputProps
}: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules: {
      required: optional ? false : getMessages().required,
      validate: getValidators(name, optional, paymentMethod),
    },
  });

  const inputFormatter = useMemo(() => {
    const result = Formatter.safeParse(name);
    return result.success ? formatters[result.data] : (val: string) => val;
  }, [name]);

  return (
    <Input
      label={i18n(`form.${name}`)}
      placeholder={i18n(`form.${name}.placeholder`)}
      value={field.value}
      errorMessage={error?.message ? [error.message] : undefined}
      onChangeText={field.onChange}
      keyboardType={
        name === "phone"
          ? "phone-pad"
          : name === "email"
            ? "email-address"
            : undefined
      }
      onEndEditing={(e) => field.onChange(inputFormatter(e.nativeEvent.text))}
      onSubmitEditing={(e) =>
        field.onChange(inputFormatter(e.nativeEvent.text))
      }
      required={!optional}
      {...inputProps}
    />
  );
}
