import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { PAYMENTMETHODS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { OverlayContext } from '../../../contexts/overlay'
import Button from '../../Button'
import { MenuItem } from '../../navigation'
import { Headline } from '../../text'
import { PaymentMethodForms } from './paymentForms'
import PeachScrollView from '../../PeachScrollView'

type AddPaymentMethodProps = {
  method?: PaymentMethod,
  onSubmit: (data: PaymentData) => void
}

export const AddPaymentMethod = ({ method, onSubmit }: AddPaymentMethodProps) => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod|null>(method || null)
  const PaymentMethodForm = paymentMethod ? PaymentMethodForms[paymentMethod] : null

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return <View style={tw`h-full w-full flex justify-center`}>
    <View style={tw`h-5/6 w-full flex-col`}>
      <Headline style={tw`h-28 text-white-1 text-3xl leading-5xl`}>
        {i18n(`form.paymentMethod.${!paymentMethod ? 'select' : 'details'}`, i18n(`paymentMethod.${paymentMethod}`))}
      </Headline>
      {!paymentMethod
        ? <PeachScrollView style={tw`h-full flex-shrink my-16`}>
          {PAYMENTMETHODS
            .filter(PAYMENTMETHOD => PaymentMethodForms[PAYMENTMETHOD])
            .map((PAYMENTMETHOD, index) =>
              <MenuItem
                key={PAYMENTMETHOD}
                style={index ? tw`mt-2` : {}}
                text={i18n(`paymentMethod.${PAYMENTMETHOD}`)}
                onPress={() => setPaymentMethod(PAYMENTMETHOD)}
              />
            )
          }
        </PeachScrollView>
        : null
      }
      {PaymentMethodForm
        ? <PaymentMethodForm style={tw`h-full flex-shrink flex-col justify-between`}
          view="new"
          onSubmit={onSubmit}
          onCancel={() => method ? closeOverlay() : setPaymentMethod(null)}
        />
        : <View style={tw`w-full flex items-center`}>
          <Button
            title={i18n('close')}
            secondary={true}
            wide={false}
            onPress={closeOverlay}
          />
        </View>
      }
    </View>
  </View>
}

export default AddPaymentMethod