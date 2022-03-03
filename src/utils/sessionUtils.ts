import { error } from './logUtils'
import EncryptedStorage from 'react-native-encrypted-storage'

export let session: Session = {
  initialized: false,
}

/**
 * @description Method to update session with new values
 * @param sess updated session
 * @returns new sessions
 */
export const setSession = async (sess: object): Promise<Session> => {
  session = {
    ...session,
    ...sess,
    initialized: true
  }
  await EncryptedStorage.setItem(
    'session',
    JSON.stringify(session)
  )
  return session
}

/**
 * @description Method to get session
 * @returns session
 */
export const getSession = () => session

/**
 * @description Method to initialise local user session from encrypted storage
 */
export const initSession = async (): Promise<Session> => {
  try {
    const result = await EncryptedStorage.getItem('session') as string

    if (result) {
      await setSession(JSON.parse(result))
      return session
    }
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }
    error('Session could not be retrieved', err)
  }

  return session
}