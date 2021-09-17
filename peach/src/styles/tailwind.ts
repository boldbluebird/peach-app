import { create, Style } from 'tailwind-react-native-classnames'
import styles from './styles.json'
import * as fontStyles from './font-styles.json'
import GetWindowDimensions from '../hooks/GetWindowDimensions'

interface Tailwind {
  (classes: TemplateStringsArray): Style,
  md: (classes: TemplateStringsArray) => Style,
  lg: (classes: TemplateStringsArray) => Style
}
const tailwind = create({
  ...styles,
  ...fontStyles
})

/**
 * @example [tw`mt-2 text-lg`, tw.md`mt-4 text-xl`, tw.lg`mt-5 text-2xl`]
 */
const tw: Tailwind = cls => tailwind(cls)
tw.md = cls => (GetWindowDimensions().width || 0) >= 600 ? tailwind(cls) : {}
tw.lg = cls => (GetWindowDimensions().width || 0) >= 1200 ? tailwind(cls) : {}

export default tw