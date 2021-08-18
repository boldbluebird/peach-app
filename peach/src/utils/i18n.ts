import en from '../i18n/en/text.json'
import de from '../i18n/de/text.json'
import { ReducerState } from 'react'

interface Properties {
  [key: string]: string
}
interface PropertiesMap {
  [key: string]: Properties
}

const properties: PropertiesMap = {
  en,
  de
}

export let locale: string = 'en'

/**
 * @description Method to get localized string based on current locale
 * it will use the following fallback order
 * de-CH – language-COUNTRY
 * de    – language
 * en    – default locale
 *
 * if no text can be found, it will return the id of the resource
 * @param {string} id the id of the localized text
 * @param {string[]} ...args multiple arguments to replace placeholders
 * @returns {string} localized text or id if no text could be found
 */
export const i18n = (id: string, ...args: string[]): string => {
  let text = properties[locale][id]

  if (!text && locale.indexOf('-') !== -1) {
    const language = locale.split('-')[0]
    text = properties[language][id]
  }
  if (!text) text = properties.en[id]

  if (!text) return id

  args.forEach((arg, index) => {
    const regex = new RegExp(`$${index}`, 'ug')
    text = text.replace(regex, arg)
  })
  return text
}

interface i18nState {
  locale: string
}

/**
 * @description Method to get current locale
 * @returns {string} current locale
 */
i18n.getLocale = (): string => locale

/**
 * @description Method to set current locale
 * If locale is not configured, will fallback to `en`
 * @param {ReducerState} state the state object (can be ignored)
 * @param {i18nState} newState the new state object
 * @returns {i18nState} i18n state
 */
i18n.setLocale = (state: ReducerState<any>, newState: i18nState): i18nState => {
  locale = newState.locale

  if (!properties[locale]) locale = 'en'

  return {
    locale
  }
}

export default i18n