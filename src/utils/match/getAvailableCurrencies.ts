export const getAvailableCurrencies = (
  offer: SellOffer | BuyOffer,
  match: Match,
  paymentMethod: PaymentMethod,
): Currency[] => {
  const offerCurrencies = (Object.keys(offer.meansOfPayment) as Currency[]).filter((currency) =>
    offer.meansOfPayment[currency]?.includes(paymentMethod),
  )
  const matchCurrencies = (Object.keys(offer.meansOfPayment) as Currency[]).filter((currency) =>
    match.meansOfPayment[currency]?.includes(paymentMethod),
  )
  const sharedCurrencies = matchCurrencies.filter(offerCurrencies.includes)
  const availableCurrencies = sharedCurrencies.length ? sharedCurrencies : matchCurrencies
  return availableCurrencies as Currency[]
}
