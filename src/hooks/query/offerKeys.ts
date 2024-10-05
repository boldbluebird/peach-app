export const offerKeys = {
  all: ["offers"] as const,
  single: ["offer"] as const,
  summaries: () => [...offerKeys.all, "summaries"] as const,
  summary: (id: string) => [...offerKeys.summaries(), id] as const,
  offer: (id: string) => [...offerKeys.single, id] as const,
  tradeRequest: (id: string) =>
    [...offerKeys.offer(id), "tradeRequest"] as const,
  details: () => [...offerKeys.all, "details"] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  escrowInfo: (id: string) => [...offerKeys.detail(id), "escrowInfo"] as const,
  fundingStatus: (id: string) =>
    [...offerKeys.detail(id), "fundingStatus"] as const,
};
