import { useConfigStore } from '../../../store/configStore/configStore'
import { error } from '../../../utils/log'
import { raiseDispute } from '../../../utils/peachAPI'
import { signAndEncrypt } from '../../../utils/pgp'

type Props = {
  contract: Contract | undefined
  symmetricKey: string | undefined
  reason: DisputeReason
  email?: string
  message?: string
}

export const submitRaiseDispute = async ({
  contract,
  symmetricKey,
  reason,
  email,
  message,
}: Props): Promise<[boolean, APIError | null]> => {
  if (!contract || !symmetricKey) return [false, null]
  const { encrypted: symmetricKeyEncrypted } = await signAndEncrypt(
    symmetricKey,
    useConfigStore.getState().peachPGPPublicKey,
  )
  const [result, err] = await raiseDispute({
    contractId: contract.id,
    email,
    reason,
    message,
    symmetricKeyEncrypted,
  })
  if (result) {
    return [true, null]
  }
  if (err) {
    error('Error', err)
    return [false, err]
  }
  return [false, null]
}
