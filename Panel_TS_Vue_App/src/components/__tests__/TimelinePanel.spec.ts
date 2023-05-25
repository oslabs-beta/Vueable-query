import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TimelinePanel from '../TimelinePanel.vue'

describe('TimelinePanel', () => {
  it('renders properly', () => {
    const wrapper = mount(TimelinePanel, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})