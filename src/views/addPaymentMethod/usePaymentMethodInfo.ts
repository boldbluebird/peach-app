import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export const systemKeys = {
  all: ["system"] as const,
  paymentMethods: () => [...systemKeys.all, "paymentMethods"] as const,
  news: () => [...systemKeys.all, "news"] as const,
  version: () => [...systemKeys.all, "version"] as const,
  referralRewards: () => [...systemKeys.all, "referralRewards"] as const,
};

export function usePaymentMethodInfo(paymentMethod: PaymentMethod) {
  return useQuery({
    queryKey: systemKeys.paymentMethods(),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.public.system.getPaymentMethodInfo({ paymentMethod });

      if (error) {
        throw error;
      }

      return result;
    },
  });
}
