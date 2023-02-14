import React, { ReactElement } from 'react'
import { enforcePhoneFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const PhoneInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange: onChange
        ? (number: string) => {
          onChange(enforcePhoneFormat(number))
        }
        : undefined,
      onSubmit: onSubmit
        ? (number: string) => {
          onSubmit(enforcePhoneFormat(number))
        }
        : undefined,
    }}
  />
)
