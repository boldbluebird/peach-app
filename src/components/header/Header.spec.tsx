import { render } from '@testing-library/react-native'
import { NavigationWrapper, canGoBackMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { Header, HeaderConfig } from './Header'

describe('Header', () => {
  const title = 'title'
  const icons: HeaderConfig['icons'] = [
    { id: 'mail', onPress: jest.fn() },
    { id: 'globe', onPress: jest.fn() },
  ]
  it('should render correctly for default state', () => {
    const { toJSON } = render(<Header />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title and icons', () => {
    canGoBackMock.mockReturnValueOnce(true)
    const { toJSON } = render(<Header {...{ title, icons }} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
