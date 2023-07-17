import { Dispatch, ReducerState, createContext, useContext } from 'react'
import en from '../../i18n/en.json'
import es from '../../i18n/es.json'
import fr from '../../i18n/fr.json'
import it from '../../i18n/it.json'

const localeMapping: Record<string, Record<string, string>> = {
  en,
  es,
  fr,
  it,
}
export type Locale = keyof typeof localeMapping

type LanguageState = {
  locale: Locale
}
export const languageState: LanguageState = {
  locale: 'en',
}
export const locales = ['en', 'es', 'fr', 'it']
export const setLocaleQuiet = (lcl: Locale) => {
  if (!localeMapping[lcl]) lcl = 'en'
  languageState.locale = lcl
}

const i18n = (id: string, ...args: string[]): string => {
  const locale = languageState.locale.replace('_', '-')
  let text = localeMapping[locale]?.[id]

  if (!text && locale.includes('-')) {
    const language = locale.split('-')[0]
    text = localeMapping[language]?.[id]
  }
  if (!text) text = localeMapping.en[id]

  if (!text) return id

  args.forEach((arg, index) => {
    const regex = new RegExp(`\\$${index}`, 'ug')
    text = text.replace(regex, arg)
  })

  return (text.match(/ /gu) || []).length >= 4 ? text.replace(/ (?=[^ ]*$)/u, ' ') : text
}

i18n.getState = (): LanguageState => languageState
i18n.getLocale = (): string => languageState.locale
i18n.getLocales = (): string[] => locales

i18n.setLocale = (prev: ReducerState<any>, newState: LanguageState): LanguageState => {
  if (!localeMapping[newState.locale]) newState.locale = 'en'

  languageState.locale = newState.locale
  return newState
}
const dispatch: Dispatch<LanguageState> = () => {}

export const LanguageContext = createContext([i18n.getState(), dispatch] as const)
export const useLanguageContext = () => useContext(LanguageContext)

export default i18n
