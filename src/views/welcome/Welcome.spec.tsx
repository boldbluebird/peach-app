import { render } from '@testing-library/react-native'
import { headerState, NavigationWrapper, setOptionsMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../store/useSettingsStore'
import Welcome from './Welcome'

describe('Welcome', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  it('should render correctly', () => {
    useSettingsStore.getState().setUsedReferralCode(true)

    const { toJSON } = render(<Welcome />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should set header correctly', () => {
    render(<Welcome />, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
