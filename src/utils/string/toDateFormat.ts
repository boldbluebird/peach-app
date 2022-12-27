import { MSINADAY } from '../../constants'
import i18n from '../i18n'
import { setDateToMidnight } from '../time'

/**
 * @description Format date as today, yesterday or "nov 28th, 2022"
 */
export const toDateFormat = (date: Date): string => {
  const normalizedDate = setDateToMidnight(date)
  const today = setDateToMidnight(new Date())
  const yesterday = new Date(today.getTime() - MSINADAY)

  if (normalizedDate.getTime() === today.getTime()) return i18n('today')
  if (normalizedDate.getTime() === yesterday.getTime()) return i18n('yesterday')
  return `${i18n(`month.short.${date.getMonth()}`)} ${date.getDate()}, ${date.getFullYear()}`
}
