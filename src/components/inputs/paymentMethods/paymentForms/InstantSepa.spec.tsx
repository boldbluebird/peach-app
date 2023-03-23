import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { InstantSepa } from './InstantSepa'

describe('InstantSepa', () => {
  it('should render correctly', () => {
    const renderer = ShallowRenderer.createRenderer()
    // mock props
    const props = {
      paymentMethod: 'instantSepa' as const,
      forwardRef: {},
      data: {},
      currencies: [],
      onSubmit: () => {},
      setStepValid: () => {},
    }

    const tree = renderer.render(<InstantSepa {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
