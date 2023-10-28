import crashlytics from '@react-native-firebase/crashlytics'
import { openCrashReportPrompt } from '../analytics'
import { isNetworkError, isProduction } from '../system'

export const error = (...args: any[]) => {
  const message = [new Date(), 'ERROR', ...args].join(' - ')
  if (isProduction()) {
    crashlytics().log(message)
    const errors = args.filter((arg) => arg instanceof Error).filter((arg) => !isNetworkError(arg.message))

    if (errors.length) openCrashReportPrompt(errors)
  } else {
    // eslint-disable-next-line no-alert -- only in dev
    alert(message)
    console.error(message)
  }
}
