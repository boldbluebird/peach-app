import { create } from 'react-test-renderer'
import { PeachScrollView } from '../../components'
import { Search } from './Search'

jest.mock('./hooks/useSearchSetup', () => ({
  useSearchSetup: () => ({
    hasMatches: true,
    offer: {},
  }),
}))
jest.mock('../../components/matches', () => ({
  Matches: () => <></>,
}))

jest.mock('../settings/profile/DailyTradingLimit', () => ({
  DailyTradingLimit: () => <></>,
}))

describe('Search', () => {
  it('does not bounce', () => {
    const testInstace = create(<Search />).root
    const scrollView = testInstace.findByType(PeachScrollView)
    expect(scrollView.props.bounces).toBe(false)
  })
})
