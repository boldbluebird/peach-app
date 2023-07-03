import { useCallback } from 'react'
import { HeaderConfig } from '../../../components/header/Header'
import { useDeletePaymentMethod } from '../../../components/payment/hooks/useDeletePaymentMethod'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { addPaymentData } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const usePaymentMethodFormSetup = () => {
  const route = useRoute<'paymentMethodForm'>()
  const goToOrigin = useGoToOrigin()
  const { paymentData: data } = route.params
  const { type: paymentMethod, currencies } = data
  const deletePaymentMethod = useDeletePaymentMethod(data.id ?? '')
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)

  const onSubmit = (d: PaymentData) => {
    addPaymentData(d)
    selectPaymentMethod(d.id)
    goToOrigin(route.params.origin)
  }

  const showHelp = useShowHelp('currencies')

  const getHeaderIcons = useCallback(() => {
    const icons: HeaderConfig['icons'] = []
    if (['revolut', 'wise', 'paypal', 'advcash'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showHelp }
    }
    if (data.id) {
      icons[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icons
  }, [data.id, deletePaymentMethod, paymentMethod, showHelp])

  useHeaderSetup({
    title: i18n(
      data.id ? 'paymentMethod.edit.title' : 'paymentMethod.select.title',
      i18n(`paymentMethod.${paymentMethod}`)
    ),
    icons: getHeaderIcons(),
  })

  return { paymentMethod, onSubmit, currencies, data }
}
